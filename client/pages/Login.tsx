import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AppContext";
import { socialAuthProviders, getSocialAuthProvider } from "@/lib/socialAuth";
import { ThemeToggleSimple } from "@/components/ThemeToggle";

const DEMO_ACCOUNT = {
  email: "demo@glowcart.com",
  password: "demo123"
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setLoading(true);
    setError("");

    // Simulate API call
    setTimeout(() => {
      if (email === DEMO_ACCOUNT.email && password === DEMO_ACCOUNT.password) {
        // Use auth context to login
        login({
          email: DEMO_ACCOUNT.email,
          name: "Demo User"
        });
        navigate("/products");
      } else {
        setError("Invalid email or password. Use demo account: demo@glowcart.com / demo123");
      }
      setLoading(false);
    }, 800);
  };

  const fillDemoAccount = () => {
    setEmail(DEMO_ACCOUNT.email);
    setPassword(DEMO_ACCOUNT.password);
    setError("");
  };

  const handleSocialLogin = async (providerId: string) => {
    const provider = getSocialAuthProvider(providerId);
    if (!provider) return;

    setSocialLoading(providerId);
    setError("");

    try {
      const user = await provider.login();
      login(user);
      navigate("/products");
    } catch (error) {
      console.error(`${provider.name} login failed:`, error);
      setError(`${provider.name} login was cancelled or failed`);
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-coral-50 to-pink-100 px-6 py-8">
      <div className="max-w-sm mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/onboarding">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </Link>
          <ThemeToggleSimple />
        </div>

        {/* Welcome Message */}
        <div className="bg-white rounded-3xl p-6 mb-8 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Hello Again!</h1>
          <p className="text-gray-600">Welcome back you've been missed.</p>
        </div>

        {/* Demo Account Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-800">Try Demo Account</p>
              <p className="text-xs text-blue-600">demo@glowcart.com / demo123</p>
            </div>
            <Button
              onClick={fillDemoAccount}
              variant="outline"
              size="sm"
              className="text-blue-600 border-blue-300 hover:bg-blue-100"
            >
              Use Demo
            </Button>
          </div>
        </div>

        {/* Login Form */}
        <div className="space-y-4 mb-6">
          <div>
            <Input
              type="email"
              placeholder="Enter your email or"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border-gray-200 rounded-2xl py-4 px-4 text-gray-800 placeholder-gray-400"
            />
          </div>
          
          <div>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white border-gray-200 rounded-2xl py-4 px-4 text-gray-800 placeholder-gray-400"
            />
          </div>

          <div className="text-right">
            <Link to="/forgot-password" className="text-sm text-coral-500 hover:text-coral-600">
              Forgot password?
            </Link>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Login Button */}
        <Button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white py-4 rounded-2xl text-lg font-semibold mb-6"
        >
          {loading ? "Logging in..." : "Log In"}
        </Button>

        {/* Social Login */}
        <div className="mb-6">
          <p className="text-center text-gray-500 mb-4 text-sm">Or Continue With</p>
          <div className="flex justify-center space-x-4">
            {/* Google */}
            <button
              onClick={() => handleSocialLogin('google')}
              disabled={socialLoading === 'google'}
              className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-sm flex items-center justify-center hover:shadow-md transition-all duration-200 disabled:opacity-50"
            >
              {socialLoading === 'google' ? (
                <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
            </button>

            {/* Apple */}
            <button
              onClick={() => handleSocialLogin('apple')}
              disabled={socialLoading === 'apple'}
              className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-sm flex items-center justify-center hover:shadow-md transition-all duration-200 disabled:opacity-50"
            >
              {socialLoading === 'apple' ? (
                <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5 fill-current text-gray-900 dark:text-gray-100" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
              )}
            </button>

            {/* Facebook */}
            <button
              onClick={() => handleSocialLogin('facebook')}
              disabled={socialLoading === 'facebook'}
              className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-sm flex items-center justify-center hover:shadow-md transition-all duration-200 disabled:opacity-50"
            >
              {socialLoading === 'facebook' ? (
                <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Register Link */}
        <div className="text-center">
          <span className="text-gray-600">Not a Member? </span>
          <Link to="/register" className="text-coral-500 font-semibold hover:text-coral-600">
            Register Now
          </Link>
        </div>
      </div>
    </div>
  );
}
