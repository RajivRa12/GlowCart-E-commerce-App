import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Minus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/AppContext";
import { formatPriceWithDiscount } from "@/lib/utils";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartItemCount } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white px-6 py-4 shadow-sm">
          <div className="flex items-center">
            <Link to="/products" className="mr-4">
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </Link>
            <h1 className="text-xl font-bold text-gray-800">Shopping Bag</h1>
          </div>
        </div>

        {/* Empty State */}
        <div className="flex-1 flex items-center justify-center px-6 py-20">
          <div className="text-center max-w-sm">
            <div className="w-20 h-20 bg-coral-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🛍️</span>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-3">Your bag is empty</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Looks like you haven't added any items to your bag yet. Start shopping to fill it up!
            </p>
            <Link to="/products">
              <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-2xl">
                Start Shopping
              </Button>
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
            <h1 className="text-xl font-bold text-gray-800">Shopping Bag</h1>
          </div>
          <span className="text-sm text-gray-600">{cartItemCount} items</span>
        </div>
      </div>

      {/* Cart Items */}
      <div className="px-6 py-6">
        <div className="space-y-4 mb-6">
          {cart.map((item) => {
            const { discountedPrice, originalPrice } = formatPriceWithDiscount(item.price, item.discountPercentage);
            
            return (
              <div key={item.id} className="bg-white rounded-3xl p-4 shadow-sm">
                <div className="flex items-start space-x-4">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded-2xl"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2">
                      {item.title}
                    </h3>
                    <div className="flex items-center mb-2">
                      <span className="font-bold text-gray-800">{discountedPrice}</span>
                      {item.discountPercentage && item.discountPercentage > 0 && (
                        <span className="text-sm text-gray-400 line-through ml-2">
                          {originalPrice}
                        </span>
                      )}
                    </div>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-gray-200 rounded-2xl">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-2 hover:bg-gray-50 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-3 py-1 text-sm font-semibold">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 hover:bg-gray-50 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-3xl p-6 shadow-sm mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal ({cartItemCount} items)</span>
              <span className="font-semibold">₹{cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="font-semibold text-green-600">Free</span>
            </div>
            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between">
                <span className="text-lg font-bold text-gray-800">Total</span>
                <span className="text-lg font-bold text-gray-800">₹{cartTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Checkout Button */}
        <Link to="/checkout">
          <Button className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-2xl text-lg font-semibold">
            Proceed to Checkout
          </Button>
        </Link>
      </div>
    </div>
  );
}
