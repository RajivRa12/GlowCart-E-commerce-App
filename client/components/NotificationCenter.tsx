import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNotifications, NotificationType } from "@/context/NotificationContext";
import { motion, AnimatePresence } from "framer-motion";

const notificationConfig = {
  success: {
    icon: CheckCircle,
    bgColor: "bg-green-50 dark:bg-green-900/20",
    borderColor: "border-green-200 dark:border-green-800",
    iconColor: "text-green-500",
    titleColor: "text-green-800 dark:text-green-200",
    messageColor: "text-green-700 dark:text-green-300",
  },
  error: {
    icon: AlertCircle,
    bgColor: "bg-red-50 dark:bg-red-900/20",
    borderColor: "border-red-200 dark:border-red-800",
    iconColor: "text-red-500",
    titleColor: "text-red-800 dark:text-red-200",
    messageColor: "text-red-700 dark:text-red-300",
  },
  warning: {
    icon: AlertTriangle,
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    borderColor: "border-yellow-200 dark:border-yellow-800",
    iconColor: "text-yellow-500",
    titleColor: "text-yellow-800 dark:text-yellow-200",
    messageColor: "text-yellow-700 dark:text-yellow-300",
  },
  info: {
    icon: Info,
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    borderColor: "border-blue-200 dark:border-blue-800",
    iconColor: "text-blue-500",
    titleColor: "text-blue-800 dark:text-blue-200",
    messageColor: "text-blue-700 dark:text-blue-300",
  },
};

export default function NotificationCenter() {
  const { notifications, removeNotification } = useNotifications();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm w-full">
      <AnimatePresence>
        {notifications.map((notification) => {
          const config = notificationConfig[notification.type];
          const Icon = notification.icon ? () => notification.icon : config.icon;

          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 100, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className={`
                ${config.bgColor} ${config.borderColor}
                border rounded-2xl p-4 shadow-lg backdrop-blur-sm
              `}
            >
              <div className="flex items-start space-x-3">
                <Icon className={`w-5 h-5 ${config.iconColor} flex-shrink-0 mt-0.5`} />
                
                <div className="flex-1 min-w-0">
                  <h4 className={`font-semibold ${config.titleColor} text-sm`}>
                    {notification.title}
                  </h4>
                  {notification.message && (
                    <p className={`${config.messageColor} text-sm mt-1`}>
                      {notification.message}
                    </p>
                  )}
                  
                  {/* Action Buttons */}
                  {notification.actions && notification.actions.length > 0 && (
                    <div className="flex space-x-2 mt-3">
                      {notification.actions.map((action, index) => (
                        <Button
                          key={index}
                          size="sm"
                          variant="outline"
                          onClick={action.action}
                          className="text-xs"
                        >
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeNotification(notification.id)}
                  className={`${config.iconColor} hover:bg-gray-100 dark:hover:bg-gray-800 p-1 h-auto w-auto`}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Progress bar for timed notifications */}
              {!notification.persistent && notification.duration && (
                <motion.div
                  className="absolute bottom-0 left-0 h-1 bg-gray-200 dark:bg-gray-700 rounded-b-2xl overflow-hidden"
                  style={{ width: "100%" }}
                >
                  <motion.div
                    initial={{ width: "100%" }}
                    animate={{ width: "0%" }}
                    transition={{ duration: notification.duration / 1000, ease: "linear" }}
                    className={`h-full ${config.iconColor.replace('text-', 'bg-')}`}
                  />
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

// Notification Hook for easy usage
export function useNotificationActions() {
  const { showSuccess, showError, showWarning, showInfo } = useNotifications();

  const notifyCartAction = (action: 'add' | 'remove', productName: string) => {
    if (action === 'add') {
      showSuccess('Added to cart!', `${productName} has been added to your cart`);
    } else {
      showInfo('Removed from cart', `${productName} has been removed from your cart`);
    }
  };

  const notifyWishlistAction = (action: 'add' | 'remove', productName: string) => {
    if (action === 'add') {
      showSuccess('Added to wishlist!', `${productName} has been saved to your wishlist`);
    } else {
      showInfo('Removed from wishlist', `${productName} has been removed from your wishlist`);
    }
  };

  const notifyOrderUpdate = (status: string, orderNumber: string) => {
    switch (status) {
      case 'placed':
        showSuccess('Order placed!', `Your order #${orderNumber} has been confirmed`);
        break;
      case 'shipped':
        showInfo('Order shipped!', `Your order #${orderNumber} is on its way`);
        break;
      case 'delivered':
        showSuccess('Order delivered!', `Your order #${orderNumber} has been delivered`);
        break;
      default:
        showInfo('Order updated', `Your order #${orderNumber} status has been updated`);
    }
  };

  const notifyNetworkError = () => {
    showError('Network Error', 'Please check your internet connection and try again');
  };

  const notifyAuthAction = (action: 'login' | 'logout', userName?: string) => {
    if (action === 'login' && userName) {
      showSuccess('Welcome back!', `Hi ${userName}, you're now signed in`);
    } else if (action === 'logout') {
      showInfo('Signed out', 'You have been successfully signed out');
    }
  };

  return {
    notifyCartAction,
    notifyWishlistAction,
    notifyOrderUpdate,
    notifyNetworkError,
    notifyAuthAction,
  };
}
