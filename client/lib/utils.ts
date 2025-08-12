import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return `₹${price.toFixed(2)}`;
}

export function calculateDiscountedPrice(price: number, discountPercentage: number): number {
  return price - (price * discountPercentage / 100);
}

export function formatPriceWithDiscount(price: number, discountPercentage?: number): {
  originalPrice: string;
  discountedPrice: string;
  savings: string;
} {
  const original = formatPrice(price);
  
  if (discountPercentage && discountPercentage > 0) {
    const discounted = calculateDiscountedPrice(price, discountPercentage);
    const savings = formatPrice(price - discounted);
    
    return {
      originalPrice: original,
      discountedPrice: formatPrice(discounted),
      savings,
    };
  }
  
  return {
    originalPrice: original,
    discountedPrice: original,
    savings: formatPrice(0),
  };
}
