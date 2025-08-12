import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, CreditCard, Truck, MapPin, Phone, User, Mail, Shield, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApp } from "@/context/AppContext";
import { useNotifications } from "@/context/NotificationContext";
import { formatPrice } from "@/lib/utils";

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
}

const paymentMethods: PaymentMethod[] = [
  { id: "card", name: "Credit/Debit Card", icon: <CreditCard className="w-5 h-5" /> },
  { id: "upi", name: "UPI", icon: <Phone className="w-5 h-5" /> },
  { id: "netbanking", name: "Net Banking", icon: <CreditCard className="w-5 h-5" /> },
  { id: "cod", name: "Cash on Delivery", icon: <Truck className="w-5 h-5" /> },
];

const Checkout = () => {
  const navigate = useNavigate();
  const { state, clearCart, addOrder, dispatch } = useApp();
  const { showSuccess, showError } = useNotifications();
  const [selectedPayment, setSelectedPayment] = useState<string>("card");
  const [isProcessing, setIsProcessing] = useState(false);

  // Add demo products if cart is empty
  useEffect(() => {
    if (state.cart.length === 0) {
      const demoProducts = [
        {
          id: 1,
          title: "Lakme Absolute Skin Gloss",
          price: 899,
          thumbnail: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&h=200&fit=crop",
          rating: 4.5,
          discountPercentage: 20,
          description: "Long-lasting foundation with SPF",
          brand: "Lakme",
          category: "makeup"
        },
        {
          id: 2,
          title: "Nykaa Matte Lipstick",
          price: 549,
          thumbnail: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=200&h=200&fit=crop",
          rating: 4.3,
          discountPercentage: 15,
          description: "Highly pigmented matte lipstick",
          brand: "Nykaa",
          category: "makeup"
        },
        {
          id: 3,
          title: "The Face Shop Face Mask",
          price: 299,
          thumbnail: "https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=200&h=200&fit=crop",
          rating: 4.2,
          description: "Hydrating sheet mask with natural ingredients",
          brand: "The Face Shop",
          category: "skincare"
        }
      ];

      demoProducts.forEach(product => {
        dispatch({ type: 'ADD_TO_CART', payload: product });
      });

      showSuccess("Demo products added!", "Demo products added to cart for checkout demo");
    }
  }, [state.cart.length, dispatch, showSuccess]);

  const [shippingInfo, setShippingInfo] = useState({
    fullName: "Krishna Kumar",
    email: "krishna@example.com",
    phone: "+91 98765 43210",
    address: "123 Beauty Street, Cosmetic Colony",
    city: "Mumbai",
    state: "maharashtra",
    pincode: "400001",
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "4111 1111 1111 1111",
    expiryDate: "12/27",
    cvv: "123",
    nameOnCard: "Krishna Kumar",
    upiId: "krishna@paytm",
  });

  const subtotal = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 49;
  const tax = Math.round(subtotal * 0.18); // 18% GST
  const total = subtotal + shipping + tax;

  const handleInputChange = (section: 'shipping' | 'payment', field: string, value: string) => {
    if (section === 'shipping') {
      setShippingInfo(prev => ({ ...prev, [field]: value }));
    } else {
      setPaymentInfo(prev => ({ ...prev, [field]: value }));
    }
  };

  const validateForm = () => {
    const { fullName, email, phone, address, city, state: userState, pincode } = shippingInfo;
    
    if (!fullName || !email || !phone || !address || !city || !userState || !pincode) {
      showError("Missing shipping details", "Please fill in all shipping details");
      return false;
    }

    if (!selectedPayment) {
      showError("Payment method required", "Please select a payment method");
      return false;
    }

    if (selectedPayment === "card") {
      const { cardNumber, expiryDate, cvv, nameOnCard } = paymentInfo;
      if (!cardNumber || !expiryDate || !cvv || !nameOnCard) {
        showError("Card details incomplete", "Please fill in all card details");
        return false;
      }
    } else if (selectedPayment === "upi" && !paymentInfo.upiId) {
      showError("UPI ID required", "Please enter UPI ID");
      return false;
    }

    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create order
      const order = {
        id: Date.now().toString(),
        items: state.cart,
        total,
        subtotal,
        shipping,
        tax,
        shippingInfo,
        paymentMethod: selectedPayment,
        status: "confirmed",
        date: new Date().toISOString(),
      };

      addOrder(order);
      clearCart();

      showSuccess("Order placed successfully!", "Your order has been confirmed and will be processed shortly");
      navigate("/profile/orders");
    } catch (error) {
      showError("Payment failed", "Please try again or contact support");
    } finally {
      setIsProcessing(false);
    }
  };

  if (state.cart.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-muted-foreground mb-6">Add some items to your cart to proceed with checkout</p>
            <Link to="/products">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">Checkout</h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Forms */}
          <div className="space-y-6">
            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName" className="text-sm font-medium">Full Name *</Label>
                    <div className="relative">
                      <Input
                        id="fullName"
                        value={shippingInfo.fullName}
                        onChange={(e) => handleInputChange('shipping', 'fullName', e.target.value)}
                        placeholder="Enter full name"
                        className="pl-10 h-12"
                      />
                      <User className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium">Phone *</Label>
                    <div className="relative">
                      <Input
                        id="phone"
                        type="tel"
                        value={shippingInfo.phone}
                        onChange={(e) => handleInputChange('shipping', 'phone', e.target.value)}
                        placeholder="+91 XXXXX XXXXX"
                        className="pl-10 h-12"
                      />
                      <Phone className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email" className="text-sm font-medium">Email *</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      value={shippingInfo.email}
                      onChange={(e) => handleInputChange('shipping', 'email', e.target.value)}
                      placeholder="Enter email address"
                      className="pl-10 h-12"
                    />
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address" className="text-sm font-medium">Address *</Label>
                  <div className="relative">
                    <Input
                      id="address"
                      value={shippingInfo.address}
                      onChange={(e) => handleInputChange('shipping', 'address', e.target.value)}
                      placeholder="House no, Building, Street, Area"
                      className="pl-10 h-12"
                    />
                    <MapPin className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city" className="text-sm font-medium">City *</Label>
                    <Input
                      id="city"
                      value={shippingInfo.city}
                      onChange={(e) => handleInputChange('shipping', 'city', e.target.value)}
                      placeholder="City"
                      className="h-12"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state" className="text-sm font-medium">State *</Label>
                    <Select onValueChange={(value) => handleInputChange('shipping', 'state', value)} defaultValue="maharashtra">
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="State" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="maharashtra">Maharashtra</SelectItem>
                        <SelectItem value="delhi">Delhi</SelectItem>
                        <SelectItem value="karnataka">Karnataka</SelectItem>
                        <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                        <SelectItem value="west-bengal">West Bengal</SelectItem>
                        <SelectItem value="gujarat">Gujarat</SelectItem>
                        <SelectItem value="rajasthan">Rajasthan</SelectItem>
                        <SelectItem value="uttar-pradesh">Uttar Pradesh</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="pincode" className="text-sm font-medium">Pincode *</Label>
                    <Input
                      id="pincode"
                      value={shippingInfo.pincode}
                      onChange={(e) => handleInputChange('shipping', 'pincode', e.target.value)}
                      placeholder="400001"
                      className="h-12"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {paymentMethods.map((method) => (
                    <Button
                      key={method.id}
                      variant={selectedPayment === method.id ? "default" : "outline"}
                      className={`flex items-center gap-2 h-14 transition-all duration-200 ${
                        selectedPayment === method.id
                          ? "bg-primary text-white shadow-md scale-105"
                          : "hover:shadow-md hover:border-primary/50"
                      }`}
                      onClick={() => setSelectedPayment(method.id)}
                    >
                      <div className={`p-1 rounded ${selectedPayment === method.id ? "bg-white/20" : ""}`}>
                        {method.icon}
                      </div>
                      <span className="text-sm font-medium">{method.name}</span>
                      {selectedPayment === method.id && (
                        <CheckCircle className="w-4 h-4 ml-auto" />
                      )}
                    </Button>
                  ))}
                </div>

                {/* Security Badge */}
                <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg mt-4">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-green-700 dark:text-green-400">
                    Your payment information is secured with 256-bit SSL encryption
                  </span>
                </div>

                {/* Payment Details */}
                {selectedPayment === "card" && (
                  <div className="space-y-4 mt-6">
                    <div>
                      <Label htmlFor="cardNumber" className="text-sm font-medium">Card Number *</Label>
                      <div className="relative">
                        <Input
                          id="cardNumber"
                          value={paymentInfo.cardNumber}
                          onChange={(e) => handleInputChange('payment', 'cardNumber', e.target.value)}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          className="pl-12 h-12 text-lg tracking-widest"
                        />
                        <CreditCard className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="nameOnCard" className="text-sm font-medium">Name on Card *</Label>
                      <Input
                        id="nameOnCard"
                        value={paymentInfo.nameOnCard}
                        onChange={(e) => handleInputChange('payment', 'nameOnCard', e.target.value)}
                        placeholder="Full name as on card"
                        className="h-12"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiryDate" className="text-sm font-medium">Expiry Date *</Label>
                        <Input
                          id="expiryDate"
                          value={paymentInfo.expiryDate}
                          onChange={(e) => handleInputChange('payment', 'expiryDate', e.target.value)}
                          placeholder="MM/YY"
                          maxLength={5}
                          className="h-12 text-center tracking-wider"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv" className="text-sm font-medium">CVV *</Label>
                        <Input
                          id="cvv"
                          type="password"
                          value={paymentInfo.cvv}
                          onChange={(e) => handleInputChange('payment', 'cvv', e.target.value)}
                          placeholder="123"
                          maxLength={3}
                          className="h-12 text-center tracking-widest"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {selectedPayment === "upi" && (
                  <div className="mt-6">
                    <Label htmlFor="upiId" className="text-sm font-medium">UPI ID *</Label>
                    <div className="relative">
                      <Input
                        id="upiId"
                        value={paymentInfo.upiId}
                        onChange={(e) => handleInputChange('payment', 'upiId', e.target.value)}
                        placeholder="username@paytm"
                        className="pl-12 h-12"
                      />
                      <Phone className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Enter your UPI ID (e.g., yourname@paytm, yourname@googlepay)
                    </p>
                  </div>
                )}

                {selectedPayment === "netbanking" && (
                  <div className="mt-6">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-sm text-blue-700 dark:text-blue-400">
                        You will be redirected to your bank's secure website to complete the payment.
                      </p>
                    </div>
                  </div>
                )}

                {selectedPayment === "cod" && (
                  <div className="mt-6">
                    <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <p className="text-sm text-orange-700 dark:text-orange-400">
                        Pay ₹{(total + 50).toFixed(2)} when your order is delivered. (₹50 COD charges apply)
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div>
            <Card className="sticky top-6 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items */}
                <div className="space-y-3">
                  {state.cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.title}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{formatPrice(shipping)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (GST 18%)</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Promotional Section */}
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-700 dark:text-green-400">
                        Free shipping on orders above ₹500
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
                        Express delivery in 1-2 days
                      </span>
                    </div>
                  </div>
                </div>

                {/* Place Order Button */}
                <Button
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-200"
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing Payment...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Secure Payment {formatPrice(total)}
                    </div>
                  )}
                </Button>

                <div className="text-center space-y-2">
                  <p className="text-xs text-muted-foreground">
                    By placing this order, you agree to our Terms & Conditions
                  </p>
                  <div className="flex items-center justify-center gap-1 text-xs text-green-600">
                    <Shield className="w-3 h-3" />
                    <span>SSL Secured • Money Back Guarantee</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
