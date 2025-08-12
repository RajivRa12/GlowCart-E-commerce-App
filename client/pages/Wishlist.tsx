import { Link } from "react-router-dom";
import { ArrowLeft, Heart, ShoppingBag, Star, Home, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlist, useCart } from "@/context/AppContext";
import { formatPriceWithDiscount } from "@/lib/utils";

export default function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (product: any) => {
    addToCart(product);
    // Optionally remove from wishlist after adding to cart
    // removeFromWishlist(product.id);
  };

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white px-6 py-4 shadow-sm">
          <div className="flex items-center">
            <Link to="/products" className="mr-4">
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </Link>
            <h1 className="text-xl font-bold text-gray-800">Wishlist</h1>
          </div>
        </div>

        {/* Empty State */}
        <div className="flex-1 flex items-center justify-center px-6 py-20">
          <div className="text-center max-w-sm">
            <div className="w-20 h-20 bg-coral-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-8 h-8 text-coral-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-3">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Save items you love by tapping the heart icon. They'll appear here for easy shopping later!
            </p>
            <Link to="/products">
              <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-2xl">
                Start Shopping
              </Button>
            </Link>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3">
          <div className="flex items-center justify-around">
            <Link to="/products" className="flex flex-col items-center space-y-1">
              <Home className="w-6 h-6 text-gray-400" />
              <span className="text-xs text-gray-400">Home</span>
            </Link>
            <Link to="/search" className="flex flex-col items-center space-y-1">
              <Search className="w-6 h-6 text-gray-400" />
              <span className="text-xs text-gray-400">Search</span>
            </Link>
            <Link to="/wishlist" className="flex flex-col items-center space-y-1">
              <Heart className="w-6 h-6 text-coral-500" />
              <span className="text-xs text-coral-500 font-medium">Wishlist</span>
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/products" className="mr-4">
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </Link>
            <h1 className="text-xl font-bold text-gray-800">Wishlist</h1>
          </div>
          <span className="text-sm text-gray-600">{wishlist.length} items</span>
        </div>
      </div>

      {/* Wishlist Items */}
      <div className="px-6 py-6 mb-20">
        <div className="grid grid-cols-2 gap-4">
          {wishlist.map((product) => {
            const { discountedPrice, originalPrice } = formatPriceWithDiscount(product.price, product.discountPercentage);
            
            return (
              <div key={product.id} className="bg-white rounded-3xl p-4 shadow-sm">
                <div className="relative mb-3">
                  <Link to={`/product/${product.id}`}>
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="w-full h-32 object-cover rounded-2xl"
                    />
                  </Link>
                  <button 
                    onClick={() => removeFromWishlist(product.id)}
                    className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-coral-50 transition-colors"
                  >
                    <Heart className="w-4 h-4 text-coral-500 fill-current" />
                  </button>
                </div>
                
                <Link to={`/product/${product.id}`}>
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
                  <div className="flex flex-col mb-3">
                    <span className="font-bold text-gray-800">{discountedPrice}</span>
                    {product.discountPercentage && product.discountPercentage > 0 && (
                      <span className="text-xs text-gray-400 line-through">{originalPrice}</span>
                    )}
                  </div>
                </Link>
                
                <Button 
                  onClick={() => handleAddToCart(product)}
                  className="w-full bg-primary hover:bg-primary/90 text-white py-2 rounded-2xl text-sm font-semibold"
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Add to Bag
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3">
        <div className="flex items-center justify-around">
          <Link to="/products" className="flex flex-col items-center space-y-1">
            <Home className="w-6 h-6 text-gray-400" />
            <span className="text-xs text-gray-400">Home</span>
          </Link>
          <Link to="/search" className="flex flex-col items-center space-y-1">
            <Search className="w-6 h-6 text-gray-400" />
            <span className="text-xs text-gray-400">Search</span>
          </Link>
          <Link to="/wishlist" className="flex flex-col items-center space-y-1">
            <Heart className="w-6 h-6 text-coral-500" />
            <span className="text-xs text-coral-500 font-medium">Wishlist</span>
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
