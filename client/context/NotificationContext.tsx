import { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
  actions?: {
    label: string;
    action: () => void;
  }[];
  icon?: ReactNode;
  persistent?: boolean;
}

interface NotificationState {
  notifications: Notification[];
}

type NotificationAction =
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'CLEAR_ALL' };

const initialState: NotificationState = {
  notifications: [],
};

function notificationReducer(state: NotificationState, action: NotificationAction): NotificationState {
  switch (action.type) {
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };
    
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(notification => notification.id !== action.payload),
      };
    
    case 'CLEAR_ALL':
      return {
        ...state,
        notifications: [],
      };
    
    default:
      return state;
  }
}

const NotificationContext = createContext<{
  state: NotificationState;
  dispatch: React.Dispatch<NotificationAction>;
} | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  return (
    <NotificationContext.Provider value={{ state, dispatch }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }

  const { state, dispatch } = context;

  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const fullNotification: Notification = {
      id,
      duration: 5000, // Default 5 seconds
      ...notification,
    };

    dispatch({ type: 'ADD_NOTIFICATION', payload: fullNotification });

    // Auto-remove notification after duration (unless persistent)
    if (!fullNotification.persistent && fullNotification.duration) {
      setTimeout(() => {
        dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
      }, fullNotification.duration);
    }

    return id;
  }, [dispatch]);

  const removeNotification = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  }, [dispatch]);

  const clearAllNotifications = useCallback(() => {
    dispatch({ type: 'CLEAR_ALL' });
  }, [dispatch]);

  // Convenience methods for different notification types
  const showSuccess = useCallback((title: string, message?: string, options?: Partial<Notification>) => {
    return addNotification({ type: 'success', title, message, ...options });
  }, [addNotification]);

  const showError = useCallback((title: string, message?: string, options?: Partial<Notification>) => {
    return addNotification({ type: 'error', title, message, persistent: true, ...options });
  }, [addNotification]);

  const showWarning = useCallback((title: string, message?: string, options?: Partial<Notification>) => {
    return addNotification({ type: 'warning', title, message, ...options });
  }, [addNotification]);

  const showInfo = useCallback((title: string, message?: string, options?: Partial<Notification>) => {
    return addNotification({ type: 'info', title, message, ...options });
  }, [addNotification]);

  return {
    notifications: state.notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
}

// Pre-defined notification templates for common scenarios
export const NotificationTemplates = {
  addedToCart: (productName: string) => ({
    type: 'success' as const,
    title: 'Added to cart!',
    message: `${productName} has been added to your cart`,
    duration: 3000,
  }),

  removedFromCart: (productName: string) => ({
    type: 'info' as const,
    title: 'Removed from cart',
    message: `${productName} has been removed from your cart`,
    duration: 3000,
  }),

  addedToWishlist: (productName: string) => ({
    type: 'success' as const,
    title: 'Added to wishlist!',
    message: `${productName} has been saved to your wishlist`,
    duration: 3000,
  }),

  orderPlaced: (orderNumber: string) => ({
    type: 'success' as const,
    title: 'Order placed successfully!',
    message: `Your order #${orderNumber} has been confirmed`,
    duration: 5000,
  }),

  networkError: () => ({
    type: 'error' as const,
    title: 'Network Error',
    message: 'Please check your internet connection and try again',
    persistent: true,
  }),

  loginSuccess: (userName: string) => ({
    type: 'success' as const,
    title: 'Welcome back!',
    message: `Hi ${userName}, you're now signed in`,
    duration: 3000,
  }),

  logoutSuccess: () => ({
    type: 'info' as const,
    title: 'Signed out',
    message: 'You have been successfully signed out',
    duration: 3000,
  }),

  priceAlert: (productName: string, newPrice: string) => ({
    type: 'info' as const,
    title: 'Price Alert!',
    message: `${productName} is now available for ${newPrice}`,
    duration: 8000,
  }),

  stockAlert: (productName: string) => ({
    type: 'warning' as const,
    title: 'Low Stock Alert',
    message: `Only a few ${productName} left in stock!`,
    duration: 6000,
  }),

  paymentSuccess: () => ({
    type: 'success' as const,
    title: 'Payment Successful!',
    message: 'Your payment has been processed successfully',
    duration: 4000,
  }),

  paymentFailed: () => ({
    type: 'error' as const,
    title: 'Payment Failed',
    message: 'There was an issue processing your payment. Please try again.',
    persistent: true,
  }),
};
