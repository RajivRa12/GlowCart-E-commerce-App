import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Share2, Star, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart, useWishlist, Product } from "@/context/AppContext";
import { formatPriceWithDiscount } from "@/lib/utils";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`https://dummyjson.com/products/${id}`);
        const data = await response.json();
        // Convert price to INR
        const productWithINR = {
          ...data,
          price: Math.round(data.price * 83)
        };
        setProduct(productWithINR);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coral-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Product not found</p>
          <Button onClick={() => navigate("/products")}>Back to Products</Button>
        </div>
      </div>
    );
  }

  const { discountedPrice, originalPrice } = formatPriceWithDiscount(product.price, product.discountPercentage);
  const inWishlist = isInWishlist(product.id);

  const getCartQuantity = () => {
    const cartItem = cart.find(item => item.id === product.id);
    return cartItem ? cartItem.quantity : 0;
  };

  const handleAddToCart = async () => {
    setAddingToCart(true);

    // Add specified quantity to cart
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }

    // Show success feedback
    setTimeout(() => {
      setAddingToCart(false);
      setQuantity(1);
    }, 500);
  };

  const toggleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4">
        <Link to="/products">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </Link>
        <div className="flex items-center space-x-3">
          <button onClick={toggleWishlist} className="hover:bg-gray-100 p-2 rounded-full transition-colors">
            <Heart className={`w-6 h-6 ${
              inWishlist ? 'text-coral-500 fill-current' : 'text-gray-600'
            }`} />
          </button>
          <button>
            <Share2 className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Product Image */}
      <div className="px-6 mb-6">
        <div className="bg-coral-50 rounded-3xl p-8 mb-4">
          <img
            src={product.images[selectedImageIndex] || product.thumbnail}
            alt={product.title}
            className="w-full h-64 object-contain rounded-2xl"
          />
        </div>
        
        {/* Image Thumbnails */}
        {product.images.length > 1 && (
          <div className="flex space-x-2 overflow-x-auto">
            {product.images.slice(0, 4).map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 ${
                  selectedImageIndex === index ? "border-coral-500" : "border-gray-200"
                }`}
              >
                <img src={image} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="px-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{product.title}</h1>
        
        {/* Rating */}
        <div className="flex items-center mb-4">
          <div className="flex items-center mr-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">{product.rating}</span>
        </div>

        {/* Price */}
        <div className="flex items-center mb-6">
          <span className="text-3xl font-bold text-gray-800">
            {discountedPrice}
          </span>
          {product.discountPercentage && product.discountPercentage > 0 && (
            <>
              <span className="text-lg text-gray-400 line-through ml-2">
                {originalPrice}
              </span>
              <span className="bg-coral-500 text-white text-xs px-2 py-1 rounded-full ml-2">
                {Math.round(product.discountPercentage)}% OFF
              </span>
            </>
          )}
        </div>

        {/* Quantity Selector */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-semibold text-gray-800">Quantity</span>
          <div className="flex items-center border border-gray-200 rounded-2xl">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-3 hover:bg-gray-50 transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-4 py-2 text-lg font-semibold">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-3 hover:bg-gray-50 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Cart Status */}
        {getCartQuantity() > 0 && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-2xl">
            <p className="text-sm text-green-700">
              {getCartQuantity()} item(s) already in cart
            </p>
          </div>
        )}

        {/* Add to Bag Button */}
        <Button
          onClick={handleAddToCart}
          disabled={addingToCart}
          className="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white py-4 rounded-2xl text-lg font-semibold mb-6"
        >
          {addingToCart ? 'Adding to Bag...' : `Add ${quantity} to Bag`}
        </Button>

        {/* Highlights */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Highlights</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="bg-coral-50 rounded-2xl p-4 mb-2">
                <span className="text-2xl">📏</span>
              </div>
              <p className="text-xs text-gray-600">Dimensions</p>
              <p className="text-sm font-medium text-gray-800">
                {product.dimensions ? 
                  `${product.dimensions.width}"×${product.dimensions.height}"` : 
                  "Standard"
                }
              </p>
            </div>
            <div className="text-center">
              <div className="bg-coral-50 rounded-2xl p-4 mb-2">
                <span className="text-2xl">🛡️</span>
              </div>
              <p className="text-xs text-gray-600">Warranty</p>
              <p className="text-sm font-medium text-gray-800">
                {product.warrantyInformation || "1 Year"}
              </p>
            </div>
            <div className="text-center">
              <div className="bg-coral-50 rounded-2xl p-4 mb-2">
                <span className="text-2xl">🚚</span>
              </div>
              <p className="text-xs text-gray-600">Shipping</p>
              <p className="text-sm font-medium text-gray-800">
                {product.shippingInformation || "Free Shipping"}
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Description</h3>
          <p className="text-gray-600 leading-relaxed">{product.description}</p>
        </div>

        {/* Reviews Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Ratings & Reviews</h3>
          
          {/* Mock Reviews */}
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-2xl p-4">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-coral-200 rounded-full flex items-center justify-center mr-3">
                  <span className="text-sm font-semibold text-coral-700">S</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Sarah Collins</p>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm">Would not recommend</p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-coral-200 rounded-full flex items-center justify-center mr-3">
                  <span className="text-sm font-semibold text-coral-700">L</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Luna Andrews</p>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm">Very satisfied</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
