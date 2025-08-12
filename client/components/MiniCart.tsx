import { useState } from "react";
import { Link } from "react-router-dom";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/AppContext";
import { formatPriceWithDiscount } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface MiniCartProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MiniCart({ isOpen, onClose }: MiniCartProps) {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartItemCount } = useCart();
  const [removingItems, setRemovingItems] = useState<Set<number>>(new Set());

  const handleRemoveItem = async (productId: number) => {
    setRemovingItems(prev => new Set(prev).add(productId));
    
    // Animate out then remove
    setTimeout(() => {
      removeFromCart(productId);
      setRemovingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }, 300);
  };

  const updateItemQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />

          {/* Mini Cart Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-96 bg-white dark:bg-gray-900 shadow-xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Shopping Bag
                </h2>
                {cartItemCount > 0 && (
                  <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                    {cartItemCount}
                  </span>
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Your bag is empty
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Add some products to get started!
                  </p>
                  <Button
                    onClick={onClose}
                    className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-2xl"
                  >
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence>
                    {cart.map((item) => {
                      const { discountedPrice, originalPrice } = formatPriceWithDiscount(
                        item.price,
                        item.discountPercentage
                      );
                      const isRemoving = removingItems.has(item.id);

                      return (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 1, scale: 1, height: "auto" }}
                          animate={{ 
                            opacity: isRemoving ? 0 : 1, 
                            scale: isRemoving ? 0.8 : 1,
                            height: isRemoving ? 0 : "auto"
                          }}
                          exit={{ opacity: 0, scale: 0.8, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4"
                        >
                          <div className="flex items-start space-x-3">
                            <img
                              src={item.thumbnail}
                              alt={item.title}
                              className="w-16 h-16 object-cover rounded-xl"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-800 dark:text-gray-200 text-sm line-clamp-2 mb-1">
                                {item.title}
                              </h4>
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="font-semibold text-gray-800 dark:text-gray-200">
                                  {discountedPrice}
                                </span>
                                {item.discountPercentage && item.discountPercentage > 0 && (
                                  <span className="text-xs text-gray-400 line-through">
                                    {originalPrice}
                                  </span>
                                )}
                              </div>
                              
                              {/* Quantity Controls */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded-xl">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                                    className="w-8 h-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </Button>
                                  <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
                                    {item.quantity}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                                    className="w-8 h-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </Button>
                                </div>
                                
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveItem(item.id)}
                                  className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 p-2"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer with Checkout */}
            {cart.length > 0 && (
              <div className="border-t dark:border-gray-700 p-6">
                {/* Subtotal */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    Subtotal
                  </span>
                  <span className="text-lg font-bold text-gray-800 dark:text-gray-200">
                    ₹{cartTotal.toFixed(2)}
                  </span>
                </div>

                {/* Free Shipping Notice */}
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-3 mb-4">
                  <p className="text-sm text-green-700 dark:text-green-300 text-center">
                    🎉 Congratulations! You qualify for free shipping
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Link to="/cart" onClick={onClose}>
                    <Button
                      variant="outline"
                      className="w-full py-3 rounded-2xl border-gray-300 dark:border-gray-600"
                    >
                      View Full Cart
                    </Button>
                  </Link>
                  <Link to="/checkout" onClick={onClose}>
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-2xl">
                      <span>Checkout</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Hook to manage mini cart state
export function useMiniCart() {
  const [isOpen, setIsOpen] = useState(false);

  const openMiniCart = () => setIsOpen(true);
  const closeMiniCart = () => setIsOpen(false);
  const toggleMiniCart = () => setIsOpen(!isOpen);

  return {
    isOpen,
    openMiniCart,
    closeMiniCart,
    toggleMiniCart,
  };
}
