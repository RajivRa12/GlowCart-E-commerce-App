import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Filter, Star, ShoppingBag, Heart, Home, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCart, useWishlist, useAuth, useApp, Product } from "@/context/AppContext";
import { formatPriceWithDiscount } from "@/lib/utils";
import { FadeInContainer, StaggerContainer, ListItem, ScaleButton } from "@/components/Animations";
import { ThemeToggleSimple } from "@/components/ThemeToggle";

export default function Products() {
  const { state, dispatch } = useApp();
  const { cartItemCount } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://dummyjson.com/products?limit=100");
        const data = await response.json();

        // Enhanced product filtering with more beauty/cosmetic categories
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
          price: Math.round(product.price * 83) // Convert to approximate INR
        }));

        dispatch({ type: 'SET_PRODUCTS', payload: beautyProducts });
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [dispatch]);

  const filteredProducts = state.products.filter(product =>
    product.title.toLowerCase().includes(state.searchQuery.toLowerCase())
  );

  const handleSearch = (query: string) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
  };

  const toggleWishlist = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const ProductCard = ({ product, index }: { product: Product; index: number }) => {
    const { discountedPrice, originalPrice } = formatPriceWithDiscount(product.price, product.discountPercentage);
    const inWishlist = isInWishlist(product.id);

    return (
      <ListItem>
        <Link to={`/product/${product.id}`} className="block">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-4 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
          <div className="relative mb-3">
            <img
              src={product.thumbnail}
              alt={product.title}
              className="w-full h-32 object-cover rounded-2xl"
            />
            <ScaleButton>
              <button
                onClick={(e) => toggleWishlist(product, e)}
                className="absolute top-2 right-2 w-8 h-8 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center shadow-sm hover:bg-coral-50 dark:hover:bg-coral-900 transition-colors"
              >
                <Heart className={`w-4 h-4 transition-colors ${
                  inWishlist ? 'text-coral-500 fill-current' : 'text-gray-400 dark:text-gray-300'
                }`} />
              </button>
            </ScaleButton>
          </div>
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
          </div>
        </Link>
      </ListItem>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <FadeInContainer>
        <div className="bg-white dark:bg-gray-900 px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">Aroma</h1>
            <div className="flex items-center space-x-3">
              <ThemeToggleSimple />
              <ScaleButton>
                <Link to="/cart" className="relative">
                  <ShoppingBag className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-coral-500 rounded-full text-xs text-white flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
              </ScaleButton>
            </div>
          </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search products..."
            value={state.searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full bg-gray-50 border-0 rounded-2xl py-3 pl-10 pr-4 text-gray-800 placeholder-gray-400"
          />
          <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Filter className="w-5 h-5 text-gray-400" />
          </button>
        </div>

          {/* Categories */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Best Products</h2>
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
          <StaggerContainer className="grid grid-cols-2 gap-4 mb-20">
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </StaggerContainer>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3">
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
    </div>
  );
}
