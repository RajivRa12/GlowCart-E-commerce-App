import { useState } from "react";
import { ShoppingBag, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart, Product } from "@/context/AppContext";
import { motion, AnimatePresence } from "framer-motion";

interface QuickAddToCartProps {
  product: Product;
  className?: string;
}

export default function QuickAddToCart({ product, className = "" }: QuickAddToCartProps) {
  const { addToCart, cart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const isInCart = cart.some(item => item.id === product.id);

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to product details
    e.stopPropagation();

    if (isInCart) return;

    setIsAdding(true);
    
    // Add to cart
    addToCart(product);
    
    // Show success animation
    setTimeout(() => {
      setIsAdding(false);
      setShowSuccess(true);
      
      // Hide success after 2 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
    }, 500);
  };

  return (
    <motion.div
      className={`relative ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        onClick={handleQuickAdd}
        disabled={isAdding || isInCart}
        className={`
          w-8 h-8 rounded-full shadow-lg transition-all duration-200
          ${isInCart 
            ? 'bg-green-500 hover:bg-green-600 text-white' 
            : 'bg-white dark:bg-gray-700 hover:bg-coral-500 hover:text-white text-gray-600 dark:text-gray-300'
          }
          ${isAdding ? 'cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <AnimatePresence mode="wait">
          {isAdding ? (
            <motion.div
              key="loading"
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-3 h-3 border-2 border-gray-300 border-t-coral-500 rounded-full animate-spin" />
            </motion.div>
          ) : showSuccess ? (
            <motion.div
              key="success"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Check className="w-4 h-4" />
            </motion.div>
          ) : isInCart ? (
            <motion.div
              key="in-cart"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Check className="w-4 h-4" />
            </motion.div>
          ) : (
            <motion.div
              key="add"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <Plus className="w-4 h-4" />
            </motion.div>
          )}
        </AnimatePresence>
      </Button>

      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.8 }}
            className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap shadow-lg z-10"
          >
            Added to cart!
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Alternative quick add button for larger areas
export function QuickAddButton({ product, size = "sm" }: { product: Product; size?: "sm" | "md" | "lg" }) {
  const { addToCart, cart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const isInCart = cart.some(item => item.id === product.id);

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isInCart) return;

    setIsAdding(true);
    addToCart(product);
    
    setTimeout(() => {
      setIsAdding(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }, 500);
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };

  return (
    <motion.div whileTap={{ scale: 0.95 }}>
      <Button
        onClick={handleQuickAdd}
        disabled={isAdding || isInCart}
        className={`
          ${sizeClasses[size]} rounded-2xl font-semibold transition-all duration-200
          ${isInCart 
            ? 'bg-green-500 hover:bg-green-600 text-white' 
            : 'bg-primary hover:bg-primary/90 text-white'
          }
        `}
      >
        <AnimatePresence mode="wait">
          {isAdding ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center space-x-2"
            >
              <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Adding...</span>
            </motion.div>
          ) : showSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center space-x-2"
            >
              <Check className="w-4 h-4" />
              <span>Added!</span>
            </motion.div>
          ) : isInCart ? (
            <motion.div
              key="in-cart"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center space-x-2"
            >
              <Check className="w-4 h-4" />
              <span>In Cart</span>
            </motion.div>
          ) : (
            <motion.div
              key="add"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center space-x-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Quick Add</span>
            </motion.div>
          )}
        </AnimatePresence>
      </Button>
    </motion.div>
  );
}
