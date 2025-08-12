# 🌟 GlowCart - Beauty E-Commerce App

A modern, feature-rich beauty e-commerce application built with React, TypeScript, and TailwindCSS. Experience the future of online beauty shopping with advanced features like voice search, AI-powered recommendations, and seamless checkout.


## ✨ Features

### 🛒 **Core E-Commerce Features**
- **Product Catalog**: Browse beauty products with advanced filtering
- **Shopping Cart**: Add, remove, and modify cart items with real-time updates
- **Wishlist**: Save favorite products for later
- **Search**: Powerful search with voice recognition support
- **Checkout**: Complete payment flow with multiple payment methods
- **Order Management**: Track orders and view order history

### 🎨 **User Experience**
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Dark/Light Theme**: Automatic theme switching with system preference detection
- **Animations**: Smooth micro-interactions powered by Framer Motion
- **Indian Localization**: Pricing in Indian Rupees (₹) with local payment methods

### 🔐 **Authentication & Security**
- **Social Login**: Google, Apple, and Facebook authentication
- **Secure Checkout**: SSL encryption and secure payment processing
- **User Profiles**: Manage addresses, preferences, and account settings

### 🚀 **Advanced Features**
- **Voice Search**: Search products using speech recognition
- **Smart Notifications**: Real-time toast notifications for user actions
- **Mini Cart**: Quick cart preview with slide-out interface
- **Advanced Filtering**: Filter by price, brand, category, and ratings
- **Quick Add to Cart**: One-click product additions
- **Progressive Web App**: Installable on mobile devices

## 🛠️ Tech Stack

### **Frontend**
- **React 18** - Modern React with Hooks and Suspense
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **TailwindCSS** - Utility-first CSS framework
- **Framer Motion** - Advanced animations and transitions

### **UI Components**
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful SVG icons
- **Custom Component Library** - Reusable UI components

### **State Management**
- **React Context API** - Global state management
- **React Query** - Server state management and caching
- **LocalStorage** - Persistent cart and wishlist

### **Development Tools**
- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing
- **Git** - Version control

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd glowcart
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Start the development server**
```bash
npm run dev
# or
yarn dev
```

4. **Open your browser**
Navigate to `http://localhost:5173` to see the application.

### Build for Production

```bash
npm run build
# or
yarn build
```

## 📱 Features Walkthrough

### **🏠 Home Page**
- Hero section with featured products
- Category navigation
- Trending products showcase
- Search functionality

### **🛍️ Product Catalog**
- Grid/list view toggle
- Advanced filtering sidebar
- Voice search capability
- Quick add to cart buttons
- Product image gallery

### **🛒 Shopping Cart**
- Real-time cart updates
- Quantity adjustment
- Price calculations with discounts
- Shipping information
- Checkout integration

### **💳 Checkout Process**
- Guest and registered user checkout
- Multiple payment methods:
  - Credit/Debit Cards
  - UPI (Unified Payments Interface)
  - Net Banking
  - Cash on Delivery
- Address management
- Order confirmation

### **👤 User Profile**
- Account information
- Order history
- Address book
- Notification preferences
- Theme settings

## 🏗️ Project Structure

```
glowcart/
├── client/                 # Frontend application
│   ├── components/         # Reusable UI components
│   │   ├── ui/            # Base UI components
│   │   ├── Animations.tsx
│   │   ├── MiniCart.tsx
│   │   ├── NotificationCenter.tsx
│   │   └── ...
│   ├── context/           # React Context providers
│   │   ├── AppContext.tsx
│   │   ├── ThemeContext.tsx
│   │   └── NotificationContext.tsx
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions
│   ├── pages/             # Page components
│   │   ├── profile/       # Profile sub-pages
│   │   ├── Cart.tsx
│   │   ├── Checkout.tsx
│   │   ├── Products.tsx
│   │   └── ...
│   └── App.tsx            # Main application component
├── server/                # Backend API (optional)
├── public/                # Static assets
├── package.json
├── tailwind.config.ts     # TailwindCSS configuration
├── tsconfig.json          # TypeScript configuration
└── vite.config.ts         # Vite configuration
```


## 🌐 Deployment

### **Netlify** (Recommended)
```bash
# Build the project
npm run build

# Deploy to Netlify
npm run deploy
```

### **Vercel**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### **Manual Deployment**
1. Run `npm run build`
2. Upload the `dist` folder to your hosting provider
3. Configure your server to serve the `index.html` file for all routes

## 🔧 Configuration

### **Environment Variables**
Create a `.env` file in the root directory:

```env
VITE_API_URL=your_api_url
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_FACEBOOK_APP_ID=your_facebook_app_id
VITE_PAYMENT_GATEWAY_KEY=your_payment_key
```

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### **Getting Help**
- **Documentation**: Check the docs folder for detailed guides
- **Issues**: Report bugs on GitHub Issues
- **Discussions**: Join our community discussions

### **Contact**
- **Email**: support@glowcart.com
- **Website**: https://glowcart.com
- **Social**: [@GlowCartApp](https://twitter.com/glowcartapp)

## 🙏 Acknowledgments

- **Builder.io** - For the amazing starter template
- **React Team** - For the incredible React ecosystem
- **Tailwind CSS** - For the utility-first CSS framework
- **Figma Community** - For design inspiration
- **Open Source Community** - For the tools and libraries

-
<img width="1468" height="837" alt="Screenshot 2025-08-12 at 11 30 36 PM" src="https://github.com/user-attachments/assets/e9e41211-e3ba-4ec5-acbd-d941144e5ba4" />
<img width="1470" height="833" alt="Screenshot 2025-08-12 at 11 30 44 PM" src="https://github.com/user-attachments/assets/d6d24260-8218-46e7-8607-6273eba54335" />



