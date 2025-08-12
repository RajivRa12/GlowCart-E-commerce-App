import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AppContext";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async () => {
    setError("");

    if (!fullName || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Use auth context to login
      login({
        email,
        name: fullName
      });
      navigate("/products");
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-coral-50 to-pink-100 px-6 py-8">
      <div className="max-w-sm mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link to="/login">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </Link>
        </div>

        {/* Welcome Message */}
        <div className="bg-white rounded-3xl p-6 mb-8 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Join The Glow!</h1>
        </div>

        {/* Registration Form */}
        <div className="space-y-4 mb-6">
          <div>
            <Input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-white border-gray-200 rounded-2xl py-4 px-4 text-gray-800 placeholder-gray-400"
            />
          </div>
          
          <div>
            <Input
              type="email"
              placeholder="Email Address"
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
          
          <div>
            <Input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-white border-gray-200 rounded-2xl py-4 px-4 text-gray-800 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Create Account Button */}
        <Button
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white py-4 rounded-2xl text-lg font-semibold mb-6"
        >
          {loading ? "Creating Account..." : "Create Account"}
        </Button>

        {/* Login Link */}
        <div className="text-center">
          <span className="text-gray-600">Already a User? </span>
          <Link to="/login" className="text-coral-500 font-semibold hover:text-coral-600">
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}
