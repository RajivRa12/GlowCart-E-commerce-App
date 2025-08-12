import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Filter, Star, ShoppingBag, Heart, Home, User, Mic, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCart, useWishlist, useAuth, useApp, Product } from "@/context/AppContext";
import { formatPriceWithDiscount } from "@/lib/utils";
import { FadeInContainer, StaggerContainer, ListItem, ScaleButton } from "@/components/Animations";
import { ThemeToggleSimple } from "@/components/ThemeToggle";
import QuickAddToCart from "@/components/QuickAddToCart";
import MiniCart, { useMiniCart } from "@/components/MiniCart";
import ProductFilters, { ProductFilters as FilterType } from "@/components/ProductFilters";
import VoiceSearch, { useVoiceSearch } from "@/components/VoiceSearch";
import { useNotificationActions } from "@/components/NotificationCenter";

export default function EnhancedProducts() {
  const { state, dispatch } = useApp();
  const { cartItemCount } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const productsPerPage = 10;

  // Feature hooks
  const { isOpen: isMiniCartOpen, openMiniCart, closeMiniCart } = useMiniCart();
  const { isOpen: isVoiceSearchOpen, openVoiceSearch, closeVoiceSearch } = useVoiceSearch();
  const { notifyWishlistAction } = useNotificationActions();

  // Filter state
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterType>({
    priceRange: [0, 5000],
    categories: [],
    minRating: 0,
    inStock: false,
    onSale: false,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://dummyjson.com/products?limit=100");
        const data = await response.json();
        
        const beautyProducts = data.products.filter((product: any) => 
          product.title.toLowerCase().includes('mascara') ||
          product.title.toLowerCase().includes('perfume') ||
          product.title.toLowerCase().includes('powder') ||
          product.title.toLowerCase().includes('cream') ||
          product.title.toLowerCase().includes('essence') ||
          product.title.toLowerCase().includes('lipstick') ||
          product.title.toLowerCase().includes('foundation') ||
          product.title.toLowerCase().includes('serum') ||
          product.title.toLowerCase().includes('moisturizer') ||
          product.title.toLowerCase().includes('cleanser') ||
          product.category === 'beauty' ||
          product.category === 'fragrances' ||
          product.category === 'skin-care'
        ).map((product: any) => ({
          ...product,
          price: Math.round(product.price * 83) // Convert to INR
        }));
        
        dispatch({ type: 'SET_PRODUCTS', payload: beautyProducts });
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    if (state.products.length === 0) {
      fetchProducts();
    } else {
      setLoading(false);
    }
  }, [dispatch, state.products.length]);

  // Apply filters
  const filteredProducts = state.products.filter(product => {
    // Search query filter
    const matchesSearch = product.title.toLowerCase().includes(state.searchQuery.toLowerCase());
    
    // Price filter
    const productPrice = product.discountPercentage 
      ? product.price - (product.price * product.discountPercentage / 100)
      : product.price;
    const matchesPrice = productPrice >= filters.priceRange[0] && productPrice <= filters.priceRange[1];
    
    // Category filter
    const matchesCategory = filters.categories.length === 0 || 
      filters.categories.some(cat => product.category?.includes(cat) || product.title.toLowerCase().includes(cat));
    
    // Rating filter
    const matchesRating = filters.minRating === 0 || product.rating >= filters.minRating;
    
    // On sale filter
    const matchesOnSale = !filters.onSale || (product.discountPercentage && product.discountPercentage > 0);
    
    return matchesSearch && matchesPrice && matchesCategory && matchesRating && matchesOnSale;
  });

  const paginatedProducts = filteredProducts.slice(0, currentPage * productsPerPage);
  const hasMore = filteredProducts.length > paginatedProducts.length;

  const handleSearch = (query: string) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
    setCurrentPage(1); // Reset pagination on search
  };

  const handleVoiceSearchResult = (query: string) => {
    handleSearch(query);
    closeVoiceSearch();
  };

  const toggleWishlist = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      notifyWishlistAction('remove', product.title);
    } else {
      addToWishlist(product);
      notifyWishlistAction('add', product.title);
    }
  };

  const loadMoreProducts = () => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    setTimeout(() => {
      setCurrentPage(prev => prev + 1);
      setLoadingMore(false);
    }, 500);
  };

  const clearFilters = () => {
    setFilters({
      priceRange: [0, 5000],
      categories: [],
      minRating: 0,
      inStock: false,
      onSale: false,
    });
  };

  const ProductCard = ({ product, index }: { product: Product; index: number }) => {
    const { discountedPrice, originalPrice } = formatPriceWithDiscount(product.price, product.discountPercentage);
    const inWishlist = isInWishlist(product.id);
    
    return (
      <ListItem>
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-4 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 relative group">
          <Link to={`/product/${product.id}`} className="block">
            <div className="relative mb-3">
              <img
                src={product.thumbnail}
                alt={product.title}
                className="w-full h-32 object-cover rounded-2xl"
              />
              
              {/* Quick Add Button */}
              <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <QuickAddToCart product={product} />
              </div>
            </div>
          </Link>

          {/* Wishlist Button */}
          <div className="absolute top-6 right-6">
            <ScaleButton>
              <button 
                onClick={(e) => toggleWishlist(product, e)}
                className="w-8 h-8 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center shadow-sm hover:bg-coral-50 dark:hover:bg-coral-900 transition-colors"
              >
                <Heart className={`w-4 h-4 transition-colors ${
                  inWishlist ? 'text-coral-500 fill-current' : 'text-gray-400 dark:text-gray-300'
                }`} />
              </button>
            </ScaleButton>
          </div>

          <Link to={`/product/${product.id}`}>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm mb-1 line-clamp-2">{product.title}</h3>
            <div className="flex items-center mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500 ml-1">({product.rating})</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-bold text-gray-800 dark:text-gray-200">{discountedPrice}</span>
                {product.discountPercentage && product.discountPercentage > 0 && (
                  <span className="text-xs text-gray-400 dark:text-gray-500 line-through">{originalPrice}</span>
                )}
              </div>
              {product.discountPercentage && product.discountPercentage > 0 && (
                <span className="text-xs text-coral-500 bg-coral-50 px-2 py-1 rounded-full">
                  {Math.round(product.discountPercentage)}% off
                </span>
              )}
            </div>
          </Link>
        </div>
      </ListItem>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <FadeInContainer>
        <div className="bg-white dark:bg-gray-900 px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">Aroma</h1>
            <div className="flex items-center space-x-3">
              <ThemeToggleSimple />
              <ScaleButton>
                <button onClick={openMiniCart} className="relative">
                  <ShoppingBag className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-coral-500 rounded-full text-xs text-white flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </button>
              </ScaleButton>
            </div>
          </div>

          {/* Enhanced Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search products..."
              value={state.searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-800 border-0 rounded-2xl py-3 pl-10 pr-20 text-gray-800 dark:text-gray-200 placeholder-gray-400"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex space-x-2">
              <ScaleButton>
                <button
                  onClick={openVoiceSearch}
                  className="p-1.5 text-gray-400 hover:text-coral-500 transition-colors"
                >
                  <Mic className="w-4 h-4" />
                </button>
              </ScaleButton>
              <ScaleButton>
                <button
                  onClick={() => setIsFilterOpen(true)}
                  className="p-1.5 text-gray-400 hover:text-coral-500 transition-colors"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </button>
              </ScaleButton>
            </div>
          </div>

          {/* Active Filters Display */}
          {(filters.categories.length > 0 || filters.minRating > 0 || filters.onSale || filters.priceRange[0] > 0 || filters.priceRange[1] < 5000) && (
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">Filters:</span>
              {filters.categories.map(category => (
                <span key={category} className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                  {category}
                </span>
              ))}
              {filters.minRating > 0 && (
                <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                  {filters.minRating}+ stars
                </span>
              )}
              {filters.onSale && (
                <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                  On Sale
                </span>
              )}
              <Button
                onClick={clearFilters}
                variant="ghost"
                size="sm"
                className="text-coral-500 hover:text-coral-600 text-xs"
              >
                Clear All
              </Button>
            </div>
          )}

          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Best Products ({filteredProducts.length})
            </h2>
            <Link to="/products/all" className="text-sm text-coral-500 font-medium hover:text-coral-600 transition-colors">
              View All
            </Link>
          </div>
        </div>
      </FadeInContainer>

      {/* Products Grid */}
      <div className="px-6 py-6">
        {loading ? (
          <FadeInContainer>
            <div className="grid grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-3xl p-4 animate-pulse">
                  <div className="bg-gray-200 dark:bg-gray-700 h-32 rounded-2xl mb-3"></div>
                  <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded mb-2"></div>
                  <div className="bg-gray-200 dark:bg-gray-700 h-3 rounded mb-2"></div>
                  <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </FadeInContainer>
        ) : (
          <StaggerContainer className="grid grid-cols-2 gap-4 mb-6">
            {paginatedProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </StaggerContainer>
        )}
        
        {/* Load More or No Results */}
        {!loading && (
          <FadeInContainer className="text-center mb-20">
            {filteredProducts.length === 0 ? (
              <div className="py-12">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">No products found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
                <Button
                  onClick={clearFilters}
                  className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-2xl"
                >
                  Clear Filters
                </Button>
              </div>
            ) : hasMore ? (
              <ScaleButton>
                <Button
                  onClick={loadMoreProducts}
                  disabled={loadingMore}
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-2xl disabled:opacity-50"
                >
                  {loadingMore ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Loading more...</span>
                    </div>
                  ) : (
                    `Load More Products (${filteredProducts.length - paginatedProducts.length} remaining)`
                  )}
                </Button>
              </ScaleButton>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                You've seen all products! 🎉
              </p>
            )}
          </FadeInContainer>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-6 py-3">
        <div className="flex items-center justify-around">
          <Link to="/products" className="flex flex-col items-center space-y-1">
            <Home className="w-6 h-6 text-coral-500" />
            <span className="text-xs text-coral-500 font-medium">Home</span>
          </Link>
          <Link to="/search" className="flex flex-col items-center space-y-1">
            <Search className="w-6 h-6 text-gray-400" />
            <span className="text-xs text-gray-400">Search</span>
          </Link>
          <Link to="/wishlist" className="flex flex-col items-center space-y-1">
            <Heart className="w-6 h-6 text-gray-400" />
            <span className="text-xs text-gray-400">Wishlist</span>
          </Link>
          <Link to="/profile" className="flex flex-col items-center space-y-1">
            <User className="w-6 h-6 text-gray-400" />
            <span className="text-xs text-gray-400">Profile</span>
          </Link>
        </div>
      </div>

      {/* Feature Components */}
      <MiniCart isOpen={isMiniCartOpen} onClose={closeMiniCart} />
      <ProductFilters
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onFiltersChange={setFilters}
        onClearAll={clearFilters}
      />
      <VoiceSearch
        isOpen={isVoiceSearchOpen}
        onClose={closeVoiceSearch}
        onSearchResult={handleVoiceSearchResult}
      />
    </div>
  );
}
