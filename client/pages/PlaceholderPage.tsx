import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PlaceholderPageProps {
  title?: string;
  description?: string;
}

export default function PlaceholderPage({ 
  title = "Coming Soon", 
  description = "This page is not yet implemented. Continue prompting to fill in this page content!"
}: PlaceholderPageProps) {
  const location = useLocation();
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white px-6 py-4 shadow-sm">
        <div className="flex items-center">
          <Link to="/products" className="mr-4">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </Link>
          <h1 className="text-xl font-bold text-gray-800">{title}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 bg-coral-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">🚧</span>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-3">{title}</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">{description}</p>
          <p className="text-sm text-gray-500 mb-6">
            Current path: <code className="bg-gray-100 px-2 py-1 rounded">{location.pathname}</code>
          </p>
          <div className="space-y-3">
            <Link to="/products" className="block">
              <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
