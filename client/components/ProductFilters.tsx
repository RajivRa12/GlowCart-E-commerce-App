import { useState } from "react";
import { X, SlidersHorizontal, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { motion, AnimatePresence } from "framer-motion";

export interface ProductFilters {
  priceRange: [number, number];
  categories: string[];
  minRating: number;
  inStock: boolean;
  onSale: boolean;
}

interface ProductFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  onClearAll: () => void;
}

const categories = [
  { id: "beauty", name: "Beauty", count: 25 },
  { id: "fragrances", name: "Fragrances", count: 18 },
  { id: "skin-care", name: "Skin Care", count: 32 },
  { id: "makeup", name: "Makeup", count: 45 },
  { id: "hair-care", name: "Hair Care", count: 15 },
];

const ratings = [
  { value: 4, label: "4+ Stars", count: 42 },
  { value: 3, label: "3+ Stars", count: 28 },
  { value: 2, label: "2+ Stars", count: 15 },
  { value: 1, label: "1+ Stars", count: 8 },
];

export default function ProductFilters({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  onClearAll,
}: ProductFiltersProps) {
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    category: true,
    rating: true,
    other: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const updateFilters = (updates: Partial<ProductFilters>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const updatedCategories = checked
      ? [...filters.categories, categoryId]
      : filters.categories.filter(id => id !== categoryId);
    updateFilters({ categories: updatedCategories });
  };

  const activeFiltersCount = 
    (filters.categories.length > 0 ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 5000 ? 1 : 0) +
    (filters.inStock ? 1 : 0) +
    (filters.onSale ? 1 : 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />

          {/* Filter Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-80 bg-white dark:bg-gray-900 shadow-xl z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <SlidersHorizontal className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Filters
                </h2>
                {activeFiltersCount > 0 && (
                  <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearAll}
                  className="text-coral-500 hover:text-coral-600"
                >
                  Clear All
                </Button>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Price Range */}
              <div>
                <button
                  onClick={() => toggleSection('price')}
                  className="flex items-center justify-between w-full mb-4"
                >
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200">Price Range</h3>
                  {expandedSections.price ? (
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  )}
                </button>
                
                <AnimatePresence>
                  {expandedSections.price && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="space-y-4">
                        <Slider
                          value={filters.priceRange}
                          onValueChange={(value) => updateFilters({ priceRange: value as [number, number] })}
                          max={5000}
                          min={0}
                          step={50}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                          <span>₹{filters.priceRange[0]}</span>
                          <span>₹{filters.priceRange[1]}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Categories */}
              <div>
                <button
                  onClick={() => toggleSection('category')}
                  className="flex items-center justify-between w-full mb-4"
                >
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200">Categories</h3>
                  {expandedSections.category ? (
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  )}
                </button>
                
                <AnimatePresence>
                  {expandedSections.category && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="space-y-3">
                        {categories.map((category) => (
                          <div key={category.id} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Checkbox
                                id={category.id}
                                checked={filters.categories.includes(category.id)}
                                onCheckedChange={(checked) => 
                                  handleCategoryChange(category.id, checked as boolean)
                                }
                              />
                              <label
                                htmlFor={category.id}
                                className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                              >
                                {category.name}
                              </label>
                            </div>
                            <span className="text-xs text-gray-400">({category.count})</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Rating */}
              <div>
                <button
                  onClick={() => toggleSection('rating')}
                  className="flex items-center justify-between w-full mb-4"
                >
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200">Minimum Rating</h3>
                  {expandedSections.rating ? (
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  )}
                </button>
                
                <AnimatePresence>
                  {expandedSections.rating && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="space-y-3">
                        {ratings.map((rating) => (
                          <div key={rating.value} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Checkbox
                                id={`rating-${rating.value}`}
                                checked={filters.minRating === rating.value}
                                onCheckedChange={(checked) => 
                                  updateFilters({ minRating: checked ? rating.value : 0 })
                                }
                              />
                              <label
                                htmlFor={`rating-${rating.value}`}
                                className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                              >
                                {rating.label}
                              </label>
                            </div>
                            <span className="text-xs text-gray-400">({rating.count})</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Other Options */}
              <div>
                <button
                  onClick={() => toggleSection('other')}
                  className="flex items-center justify-between w-full mb-4"
                >
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200">Other Options</h3>
                  {expandedSections.other ? (
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  )}
                </button>
                
                <AnimatePresence>
                  {expandedSections.other && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            id="in-stock"
                            checked={filters.inStock}
                            onCheckedChange={(checked) => updateFilters({ inStock: checked as boolean })}
                          />
                          <label
                            htmlFor="in-stock"
                            className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                          >
                            In Stock Only
                          </label>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            id="on-sale"
                            checked={filters.onSale}
                            onCheckedChange={(checked) => updateFilters({ onSale: checked as boolean })}
                          />
                          <label
                            htmlFor="on-sale"
                            className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                          >
                            On Sale
                          </label>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Apply Button */}
            <div className="border-t dark:border-gray-700 p-6">
              <Button
                onClick={onClose}
                className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-2xl"
              >
                Apply Filters ({activeFiltersCount} active)
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
