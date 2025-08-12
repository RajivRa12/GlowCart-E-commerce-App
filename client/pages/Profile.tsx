import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  MapPin,
  Clock,
  Globe,
  Bell,
  MessageCircle,
  HelpCircle,
  Shield,
  FileText,
  LogOut,
  Edit,
  Home,
  Search,
  Heart,
  User,
  MoreVertical,
  Settings,
  Share2,
  Download
} from "lucide-react";
import { useAuth } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useNotifications } from "@/context/NotificationContext";

export default function Profile() {
  const { user } = useAuth();
  const { showSuccess, showInfo } = useNotifications();
  const [isEditing, setIsEditing] = useState(false);

  const handleEditProfile = () => {
    showInfo("Edit Profile", "Profile editing feature coming soon!");
    // TODO: Navigate to edit profile page or open edit modal
  };

  const handleShareProfile = () => {
    if (navigator.share) {
      navigator.share({
        title: `${user?.name}'s Profile - GlowCart`,
        text: `Check out ${user?.name}'s profile on GlowCart`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showSuccess("Link Copied", "Profile link copied to clipboard");
    }
  };

  const handleExportData = () => {
    showInfo("Export Data", "Data export feature coming soon!");
    // TODO: Implement data export functionality
  };

  const handleSettings = () => {
    showInfo("Settings", "Advanced settings coming soon!");
    // TODO: Navigate to settings page
  };

  const menuItems = [
    { icon: MapPin, label: "Address", href: "/profile/address" },
    { icon: Clock, label: "Order History", href: "/profile/orders" },
    { icon: Globe, label: "Language", href: "/profile/language" },
    { icon: Bell, label: "Notifications", href: "/profile/notifications" },
    { icon: MessageCircle, label: "Contact Us", href: "/profile/contact" },
    { icon: HelpCircle, label: "Get Help", href: "/profile/help" },
    { icon: Shield, label: "Privacy Policy", href: "/profile/privacy" },
    { icon: FileText, label: "Terms and Conditions", href: "/profile/terms" },
    { icon: LogOut, label: "Log Out", href: "/logout", danger: true },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">Profile</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleSettings}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleShareProfile}>
                <Share2 className="mr-2 h-4 w-4" />
                Share Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportData}>
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Profile Info */}
      <div className="bg-white mx-6 mt-6 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center">
          <div className="w-16 h-16 bg-coral-200 rounded-full flex items-center justify-center mr-4">
            <span className="text-xl font-bold text-coral-700">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-gray-800">{user?.name || 'User'}</h2>
            <p className="text-gray-600">{user?.email || 'user@example.com'}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-8 h-8 bg-gray-100 rounded-full p-0 hover:bg-gray-200"
            onClick={handleEditProfile}
          >
            <Edit className="w-4 h-4 text-gray-600" />
          </Button>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-6 mt-6">
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
          {menuItems.map((item, index) => (
            <Link
              key={item.label}
              to={item.href}
              className={`flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors ${
                index !== menuItems.length - 1 ? "border-b border-gray-100" : ""
              } ${item.danger ? "text-coral-500" : "text-gray-800"}`}
            >
              <div className="flex items-center">
                <item.icon 
                  className={`w-5 h-5 mr-4 ${item.danger ? "text-coral-500" : "text-gray-400"}`} 
                />
                <span className="font-medium">{item.label}</span>
              </div>
              <ChevronRight 
                className={`w-5 h-5 ${item.danger ? "text-coral-500" : "text-gray-400"}`} 
              />
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3">
        <div className="flex items-center justify-around">
          <Link to="/products" className="flex flex-col items-center space-y-1">
            <Home className="w-6 h-6 text-gray-400" />
            <span className="text-xs text-gray-400">Home</span>
          </Link>
          <Link to="/search" className="flex flex-col items-center space-y-1">
            <Search className="w-6 h-6 text-gray-400" />
            <span className="text-xs text-gray-400">Search</span>
          </Link>
          <Link to="/wishlist" className="flex flex-col items-center space-y-1">
            <Heart className="w-6 h-6 text-gray-400" />
            <span className="text-xs text-gray-400">Wishlist</span>
          </Link>
          <Link to="/profile" className="flex flex-col items-center space-y-1">
            <User className="w-6 h-6 text-coral-500" />
            <span className="text-xs text-coral-500 font-medium">Profile</span>
          </Link>
        </div>
      </div>

      <div className="h-20"></div>
    </div>
  );
}
