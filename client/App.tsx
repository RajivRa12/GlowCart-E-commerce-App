import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { ThemeProvider } from "./context/ThemeContext";
import { NotificationProvider } from "./context/NotificationContext";
import NotificationCenter from "./components/NotificationCenter";
import Onboarding from "./pages/Onboarding";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import EnhancedProducts from "./pages/EnhancedProducts";
import ProductDetails from "./pages/ProductDetails";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Search from "./pages/Search";
import Address from "./pages/profile/Address";
import OrderHistory from "./pages/profile/OrderHistory";
import Logout from "./pages/profile/Logout";
import Checkout from "./pages/Checkout";
import PlaceholderPage from "./pages/PlaceholderPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <NotificationProvider>
        <AppProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <NotificationCenter />
            <BrowserRouter>
        <Routes>
          {/* Redirect root to onboarding */}
          <Route path="/" element={<Navigate to="/onboarding" replace />} />

          {/* Auth Flow */}
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Main App */}
          <Route path="/products" element={<EnhancedProducts />} />
          <Route path="/products/basic" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/search" element={<Search />} />
          <Route path="/products/all" element={<PlaceholderPage title="All Products" description="View all products page coming soon! Continue prompting to implement this feature." />} />
          <Route path="/forgot-password" element={<PlaceholderPage title="Forgot Password" description="Password reset functionality coming soon! Continue prompting to implement this feature." />} />
          <Route path="/logout" element={<Logout />} />

          {/* Profile sub-pages */}
          <Route path="/profile/address" element={<Address />} />
          <Route path="/profile/orders" element={<OrderHistory />} />
          <Route path="/profile/language" element={<PlaceholderPage title="Language" description="Language settings coming soon! Continue prompting to implement this feature." />} />
          <Route path="/profile/notifications" element={<PlaceholderPage title="Notifications" description="Notification settings coming soon! Continue prompting to implement this feature." />} />
          <Route path="/profile/contact" element={<PlaceholderPage title="Contact Us" description="Contact form coming soon! Continue prompting to implement this feature." />} />
          <Route path="/profile/help" element={<PlaceholderPage title="Get Help" description="Help center coming soon! Continue prompting to implement this feature." />} />
          <Route path="/profile/privacy" element={<PlaceholderPage title="Privacy Policy" description="Privacy policy page coming soon! Continue prompting to implement this feature." />} />
          <Route path="/profile/terms" element={<PlaceholderPage title="Terms and Conditions" description="Terms and conditions page coming soon! Continue prompting to implement this feature." />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AppProvider>
      </NotificationProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
