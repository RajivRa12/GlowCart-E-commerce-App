import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Search as SearchIcon, Filter, Star, Heart, Home, User, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useApp, useWishlist, Product } from "@/context/AppContext";
import { formatPriceWithDiscount } from "@/lib/utils";

export default function Search() {
  const { state, dispatch } = useApp();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [localSearchQuery, setLocalSearchQuery] = useState(state.searchQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (error) {
        console.error("Error loading recent searches:", error);
      }
    }
  }, []);

  const categories = [
    { id: "all", name: "All" },
    { id: "beauty", name: "Beauty" },
    { id: "fragrances", name: "Fragrances" },
    { id: "skin-care", name: "Skin Care" },
  ];

  const handleSearch = (query: string) => {
    setLocalSearchQuery(query);
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
    
    if (query.trim() && !recentSearches.includes(query.trim())) {
      const newRecentSearches = [query.trim(), ...recentSearches.slice(0, 4)];
      setRecentSearches(newRecentSearches);
      localStorage.setItem("recentSearches", JSON.stringify(newRecentSearches));
    }
  };

  const clearSearch = () => {
    setLocalSearchQuery("");
    dispatch({ type: 'SET_SEARCH_QUERY', payload: "" });
  };

  const removeRecentSearch = (search: string) => {
    const newRecentSearches = recentSearches.filter(s => s !== search);
    setRecentSearches(newRecentSearches);
    localStorage.setItem("recentSearches", JSON.stringify(newRecentSearches));
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

  const filteredProducts = state.products.filter(product => {
    const matchesQuery = product.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
                        product.description?.toLowerCase().includes(state.searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesQuery && matchesCategory;
  });

  const ProductCard = ({ product }: { product: Product }) => {
    const { discountedPrice, originalPrice } = formatPriceWithDiscount(product.price, product.discountPercentage);
    const inWishlist = isInWishlist(product.id);
    
    return (
      <Link to={`/product/${product.id}`} className="block">
        <div className="bg-white rounded-3xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="relative mb-3">
            <img
              src={product.thumbnail}
              alt={product.title}
              className="w-full h-32 object-cover rounded-2xl"
            />
            <button 
              onClick={(e) => toggleWishlist(product, e)}
              className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-coral-50 transition-colors"
            >
              <Heart className={`w-4 h-4 ${
                inWishlist ? 'text-coral-500 fill-current' : 'text-gray-400'
              }`} />
            </button>
          </div>
          <h3 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-2">{product.title}</h3>
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
              <span className="font-bold text-gray-800">{discountedPrice}</span>
              {product.discountPercentage && product.discountPercentage > 0 && (
                <span className="text-xs text-gray-400 line-through">{originalPrice}</span>
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
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-6 py-4 shadow-sm">
        <div className="flex items-center mb-4">
          <Link to="/products" className="mr-4">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </Link>
          <h1 className="text-xl font-bold text-gray-800">Search</h1>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search for beauty products..."
            value={localSearchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full bg-gray-50 border-0 rounded-2xl py-3 pl-10 pr-12 text-gray-800 placeholder-gray-400"
          />
          {localSearchQuery && (
            <button 
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>

        {/* Category Filter */}
        <div className="flex space-x-2 overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-2xl text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category.id
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 mb-20">
        {!state.searchQuery ? (
          /* Recent Searches */
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Searches</h2>
            {recentSearches.length > 0 ? (
              <div className="space-y-2">
                {recentSearches.map((search, index) => (
                  <div key={index} className="flex items-center justify-between bg-white rounded-2xl p-4 shadow-sm">
                    <button 
                      onClick={() => handleSearch(search)}
                      className="flex-1 text-left text-gray-800 hover:text-coral-500 transition-colors"
                    >
                      {search}
                    </button>
                    <button 
                      onClick={() => removeRecentSearch(search)}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <SearchIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No recent searches</p>
              </div>
            )}
          </div>
        ) : (
          /* Search Results */
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Results for "{state.searchQuery}"
              </h2>
              <span className="text-sm text-gray-600">
                {filteredProducts.length} products
              </span>
            </div>
            
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <SearchIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No results found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
                <button 
                  onClick={clearSearch}
                  className="text-coral-500 hover:text-coral-600 font-medium"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3">
        <div className="flex items-center justify-around">
          <Link to="/products" className="flex flex-col items-center space-y-1">
            <Home className="w-6 h-6 text-gray-400" />
            <span className="text-xs text-gray-400">Home</span>
          </Link>
          <Link to="/search" className="flex flex-col items-center space-y-1">
            <SearchIcon className="w-6 h-6 text-coral-500" />
            <span className="text-xs text-coral-500 font-medium">Search</span>
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
