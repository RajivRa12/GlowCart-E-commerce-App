import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AppContext";

export default function Logout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Perform logout
    logout();

    // Redirect to onboarding after a short delay
    const timer = setTimeout(() => {
      navigate("/onboarding");
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigate]); // Remove logout from dependencies to prevent infinite loop

  return (
    <div className="min-h-screen bg-gradient-to-b from-coral-50 to-pink-100 flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <div className="w-20 h-20 bg-coral-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-2xl">👋</span>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Logging you out...</h2>
        <p className="text-gray-600">Thank you for using GlowCart!</p>
        
        {/* Loading spinner */}
        <div className="mt-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coral-500 mx-auto"></div>
        </div>
      </div>
    </div>
  );
}
