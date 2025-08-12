import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Package, Truck, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Order {
  id: string;
  date: string;
  status: "processing" | "shipped" | "delivered" | "cancelled";
  total: number;
  items: {
    id: number;
    name: string;
    image: string;
    quantity: number;
    price: number;
  }[];
}

export default function OrderHistory() {
  const [orders] = useState<Order[]>([
    {
      id: "ORD001",
      date: "2024-01-15",
      status: "delivered",
      total: 2499,
      items: [
        {
          id: 1,
          name: "Essence Mascara Lash Princess",
          image: "https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/1.png",
          quantity: 1,
          price: 829,
        },
        {
          id: 2,
          name: "Eyeshadow Palette with Mirror",
          image: "https://cdn.dummyjson.com/products/images/beauty/Eyeshadow%20Palette%20with%20Mirror/1.png",
          quantity: 1,
          price: 1670,
        },
      ],
    },
    {
      id: "ORD002",
      date: "2024-01-10",
      status: "shipped",
      total: 1245,
      items: [
        {
          id: 3,
          name: "Powder Canister",
          image: "https://cdn.dummyjson.com/products/images/beauty/Powder%20Canister/1.png",
          quantity: 1,
          price: 1245,
        },
      ],
    },
    {
      id: "ORD003",
      date: "2024-01-05",
      status: "processing",
      total: 3320,
      items: [
        {
          id: 4,
          name: "Red Lipstick",
          image: "https://cdn.dummyjson.com/products/images/beauty/Red%20Lipstick/1.png",
          quantity: 2,
          price: 1660,
        },
      ],
    },
  ]);

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "processing":
        return <Clock className="w-5 h-5 text-orange-500" />;
      case "shipped":
        return <Truck className="w-5 h-5 text-blue-500" />;
      case "delivered":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "cancelled":
        return <Package className="w-5 h-5 text-red-500" />;
      default:
        return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: Order["status"]) => {
    switch (status) {
      case "processing":
        return "Processing";
      case "shipped":
        return "Shipped";
      case "delivered":
        return "Delivered";
      case "cancelled":
        return "Cancelled";
      default:
        return "Unknown";
    }
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "processing":
        return "text-orange-600 bg-orange-50";
      case "shipped":
        return "text-blue-600 bg-blue-50";
      case "delivered":
        return "text-green-600 bg-green-50";
      case "cancelled":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-6 py-4 shadow-sm">
        <div className="flex items-center">
          <Link to="/profile" className="mr-4">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </Link>
          <h1 className="text-xl font-bold text-gray-800">Order History</h1>
        </div>
      </div>

      {/* Orders List */}
      <div className="px-6 py-6 space-y-4">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div key={order.id} className="bg-white rounded-3xl p-6 shadow-sm">
              {/* Order Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-800">Order #{order.id}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(order.date).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span className="ml-2">{getStatusText(order.status)}</span>
                  </div>
                  <p className="text-lg font-bold text-gray-800 mt-1">₹{order.total.toFixed(2)}</p>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-3 mb-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-xl"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800 text-sm">{item.name}</h4>
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity} × ₹{item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Actions */}
              <div className="flex space-x-3">
                <Button variant="outline" size="sm" className="flex-1 rounded-2xl">
                  Track Order
                </Button>
                <Button variant="outline" size="sm" className="flex-1 rounded-2xl">
                  View Details
                </Button>
                {order.status === "delivered" && (
                  <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90 text-white rounded-2xl">
                    Reorder
                  </Button>
                )}
              </div>
            </div>
          ))
        ) : (
          /* Empty State */
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No orders yet</h3>
            <p className="text-gray-600 mb-6">
              When you place your first order, it will appear here.
            </p>
            <Link to="/products">
              <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-2xl">
                Start Shopping
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
