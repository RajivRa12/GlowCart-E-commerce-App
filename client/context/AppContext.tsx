import { createContext, useContext, useReducer, useEffect, useCallback, ReactNode } from 'react';

export interface Product {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  rating: number;
  discountPercentage?: number;
  description?: string;
  images?: string[];
  brand?: string;
  category?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  email: string;
  name: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  subtotal: number;
  shipping: number;
  tax: number;
  shippingInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentMethod: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
}

interface AppState {
  user: User | null;
  cart: CartItem[];
  wishlist: Product[];
  products: Product[];
  orders: Order[];
  searchQuery: string;
}

type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'ADD_TO_CART'; payload: Product }
  | { type: 'REMOVE_FROM_CART'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'ADD_TO_WISHLIST'; payload: Product }
  | { type: 'REMOVE_FROM_WISHLIST'; payload: number }
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'SET_ORDERS'; payload: Order[] }
  | { type: 'SET_SEARCH_QUERY'; payload: string };

const initialState: AppState = {
  user: null,
  cart: [],
  wishlist: [],
  products: [],
  orders: [],
  searchQuery: '',
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    
    case 'ADD_TO_CART':
      const existingItem = state.cart.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        ...state,
        cart: [...state.cart, { ...action.payload, quantity: 1 }],
      };
    
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== action.payload),
      };
    
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ).filter(item => item.quantity > 0),
      };
    
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    
    case 'ADD_TO_WISHLIST':
      if (state.wishlist.find(item => item.id === action.payload.id)) {
        return state;
      }
      return {
        ...state,
        wishlist: [...state.wishlist, action.payload],
      };
    
    case 'REMOVE_FROM_WISHLIST':
      return {
        ...state,
        wishlist: state.wishlist.filter(item => item.id !== action.payload),
      };
    
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };

    case 'ADD_ORDER':
      return {
        ...state,
        orders: [action.payload, ...state.orders],
      };

    case 'SET_ORDERS':
      return { ...state, orders: action.payload };

    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load user from localStorage on app start
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        dispatch({ type: 'SET_USER', payload: user });
      } catch (error) {
        console.error('Error parsing saved user:', error);
      }
    }

    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const cart = JSON.parse(savedCart);
        cart.forEach((item: CartItem) => {
          for (let i = 0; i < item.quantity; i++) {
            dispatch({ type: 'ADD_TO_CART', payload: item });
          }
        });
      } catch (error) {
        console.error('Error parsing saved cart:', error);
      }
    }

    // Load wishlist from localStorage
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      try {
        const wishlist = JSON.parse(savedWishlist);
        wishlist.forEach((item: Product) => {
          dispatch({ type: 'ADD_TO_WISHLIST', payload: item });
        });
      } catch (error) {
        console.error('Error parsing saved wishlist:', error);
      }
    }

    // Load orders from localStorage
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      try {
        const orders = JSON.parse(savedOrders);
        dispatch({ type: 'SET_ORDERS', payload: orders });
      } catch (error) {
        console.error('Error parsing saved orders:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.cart));
  }, [state.cart]);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(state.wishlist));
  }, [state.wishlist]);

  // Save orders to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(state.orders));
  }, [state.orders]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }

  const { state, dispatch } = context;

  const addOrder = useCallback((order: Order) => {
    dispatch({ type: 'ADD_ORDER', payload: order });
  }, [dispatch]);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, [dispatch]);

  return {
    state,
    dispatch,
    addOrder,
    clearCart,
  };
}

// Helper hooks
export function useCart() {
  const { state, dispatch } = useApp();

  const addToCart = useCallback((product: Product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
  }, [dispatch]);

  const removeFromCart = useCallback((productId: number) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  }, [dispatch]);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });
  }, [dispatch]);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, [dispatch]);
  
  const cartTotal = state.cart.reduce((total, item) => {
    const price = item.discountPercentage 
      ? item.price - (item.price * item.discountPercentage / 100)
      : item.price;
    return total + (price * item.quantity);
  }, 0);
  
  const cartItemCount = state.cart.reduce((total, item) => total + item.quantity, 0);
  
  return {
    cart: state.cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    cartItemCount,
  };
}

export function useWishlist() {
  const { state, dispatch } = useApp();

  const addToWishlist = useCallback((product: Product) => {
    dispatch({ type: 'ADD_TO_WISHLIST', payload: product });
  }, [dispatch]);

  const removeFromWishlist = useCallback((productId: number) => {
    dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: productId });
  }, [dispatch]);

  const isInWishlist = useCallback((productId: number) => {
    return state.wishlist.some(item => item.id === productId);
  }, [state.wishlist]);
  
  return {
    wishlist: state.wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  };
}

export function useAuth() {
  const { state, dispatch } = useApp();

  const login = useCallback((user: User) => {
    localStorage.setItem('user', JSON.stringify(user));
    dispatch({ type: 'SET_USER', payload: user });
  }, [dispatch]);

  const logout = useCallback(() => {
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    localStorage.removeItem('wishlist');
    dispatch({ type: 'SET_USER', payload: null });
    dispatch({ type: 'CLEAR_CART' });
    dispatch({ type: 'SET_SEARCH_QUERY', payload: '' });
  }, [dispatch]);

  return {
    user: state.user,
    login,
    logout,
    isAuthenticated: !!state.user,
  };
}
