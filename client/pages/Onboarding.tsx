import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Onboarding() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-coral-50 to-pink-100 flex flex-col items-center justify-center px-6">
      <div className="flex-1 flex flex-col items-center justify-center max-w-sm mx-auto">
        {/* Logo/Image Section */}
        <div className="mb-8 relative">
          <div className="w-64 h-64 bg-gradient-to-br from-coral-200 to-pink-200 rounded-3xl flex items-center justify-center shadow-lg">
            <div className="w-48 h-48 bg-white rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div className="flex space-x-2">
                  <div className="w-8 h-16 bg-coral-300 rounded-full"></div>
                  <div className="w-8 h-12 bg-pink-300 rounded-full"></div>
                  <div className="w-8 h-14 bg-coral-400 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Brand Name */}
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Aroma</h1>
        
        {/* Tagline */}
        <p className="text-lg text-gray-600 mb-12 text-center">
          Your Beauty, Delivered
        </p>

        {/* Get Started Button */}
        <Link to="/login" className="w-full">
          <Button className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-2xl text-lg font-semibold shadow-lg">
            Get Started
          </Button>
        </Link>
      </div>

      {/* Bottom Indicator */}
      <div className="flex space-x-2 pb-8">
        <div className="w-8 h-2 bg-primary rounded-full"></div>
        <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
        <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
      </div>
    </div>
  );
}
