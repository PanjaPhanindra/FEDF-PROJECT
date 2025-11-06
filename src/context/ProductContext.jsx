import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

/**
 * ============================================================================
 * ProductContext.jsx - Complete Product Management (700+ Lines)
 * ============================================================================
 * 
 * Central state management for marketplace products
 * 
 * Features:
 * - Product CRUD operations
 * - Category filtering & search
 * - Stock management
 * - Review & rating system
 * - Seller product management
 * - Price range filtering
 * - Top sellers & best selling products
 * - Product recommendations
 * - LocalStorage persistence
 * - Sample products for testing
 * 
 * Storage: localStorage with key "fc_products_v3"
 * 
 * ============================================================================
 */

// ============================================================================
// CONSTANTS
// ============================================================================

const LS_PRODUCTS = "fc_products_v3";

// ============================================================================
// SAMPLE PRODUCTS - FOR TESTING
// ============================================================================

const SAMPLE_PRODUCTS = [
  {
    id: "1",
    name: "Fresh Tomatoes",
    description: "Organic red tomatoes from local farm",
    price: 45,
    category: "vegetables",
    image: "https://images.unsplash.com/photo-1592841494240-7222f8d87b53?w=500&h=500&fit=crop",
    sellerName: "Farm Fresh Valley",
    sellerEmail: "farm@fresh.com",
    rating: 4.8,
    stock: 150,
    reviews: [],
    createdAt: new Date().toISOString(),
    soldCount: 250,
    totalRatings: 0
  },
  {
    id: "2",
    name: "Organic Bananas",
    description: "Fresh yellow bananas from tropical farms",
    price: 30,
    category: "fruits",
    image: "https://images.unsplash.com/photo-1571207175713-e891435a628d?w=500&h=500&fit=crop",
    sellerName: "Fruit Paradise",
    sellerEmail: "fruit@paradise.com",
    rating: 4.9,
    stock: 200,
    reviews: [],
    createdAt: new Date().toISOString(),
    soldCount: 320,
    totalRatings: 0
  },
  {
    id: "3",
    name: "Brown Rice",
    description: "Organic brown rice, high in fiber",
    price: 120,
    category: "grains",
    image: "https://images.unsplash.com/photo-1623428868210-bcc8797eaa7d?w=500&h=500&fit=crop",
    sellerName: "Grain Supplier Co",
    sellerEmail: "grains@supplier.com",
    rating: 4.7,
    stock: 80,
    reviews: [],
    createdAt: new Date().toISOString(),
    soldCount: 180,
    totalRatings: 0
  },
  {
    id: "4",
    name: "Fresh Carrots",
    description: "Crunchy orange carrots, rich in vitamins",
    price: 35,
    category: "vegetables",
    image: "https://images.unsplash.com/photo-1590080876099-cd6e8639e78e?w=500&h=500&fit=crop",
    sellerName: "Farm Fresh Valley",
    sellerEmail: "farm@fresh.com",
    rating: 4.6,
    stock: 120,
    reviews: [],
    createdAt: new Date().toISOString(),
    soldCount: 190,
    totalRatings: 0
  },
  {
    id: "5",
    name: "Red Apples",
    description: "Sweet and juicy red apples",
    price: 60,
    category: "fruits",
    image: "https://images.unsplash.com/photo-1560806e614371-e0951f6f0495?w=500&h=500&fit=crop",
    sellerName: "Fruit Paradise",
    sellerEmail: "fruit@paradise.com",
    rating: 4.8,
    stock: 100,
    reviews: [],
    createdAt: new Date().toISOString(),
    soldCount: 210,
    totalRatings: 0
  },
  {
    id: "6",
    name: "Organic Milk",
    description: "Fresh organic cow milk, daily supply",
    price: 50,
    category: "dairy",
    image: "https://images.unsplash.com/photo-1550583724-b2692b25a968?w=500&h=500&fit=crop",
    sellerName: "Dairy Fresh Farms",
    sellerEmail: "dairy@fresh.com",
    rating: 4.9,
    stock: 200,
    reviews: [],
    createdAt: new Date().toISOString(),
    soldCount: 450,
    totalRatings: 0
  },
  {
    id: "7",
    name: "Spinach",
    description: "Fresh green spinach, high in iron",
    price: 25,
    category: "vegetables",
    image: "https://images.unsplash.com/photo-1589926986597-92cf4c0a7fb1?w=500&h=500&fit=crop",
    sellerName: "Farm Fresh Valley",
    sellerEmail: "farm@fresh.com",
    rating: 4.7,
    stock: 90,
    reviews: [],
    createdAt: new Date().toISOString(),
    soldCount: 140,
    totalRatings: 0
  },
  {
    id: "8",
    name: "Turmeric Powder",
    description: "Pure turmeric powder with healing properties",
    price: 85,
    category: "spices",
    image: "https://images.unsplash.com/photo-1596040708022-4be05f8f9cd4?w=500&h=500&fit=crop",
    sellerName: "Spice Master",
    sellerEmail: "spices@master.com",
    rating: 4.6,
    stock: 60,
    reviews: [],
    createdAt: new Date().toISOString(),
    soldCount: 95,
    totalRatings: 0
  },
  {
    id: "9",
    name: "Honey",
    description: "Pure raw honey from local bees",
    price: 180,
    category: "organic",
    image: "https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?w=500&h=500&fit=crop",
    sellerName: "Bee Keepers",
    sellerEmail: "honey@beekeepers.com",
    rating: 4.9,
    stock: 45,
    reviews: [],
    createdAt: new Date().toISOString(),
    soldCount: 230,
    totalRatings: 0
  },
  {
    id: "10",
    name: "Broccoli",
    description: "Fresh green broccoli, super healthy",
    price: 50,
    category: "vegetables",
    image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=500&h=500&fit=crop",
    sellerName: "Farm Fresh Valley",
    sellerEmail: "farm@fresh.com",
    rating: 4.8,
    stock: 70,
    reviews: [],
    createdAt: new Date().toISOString(),
    soldCount: 160,
    totalRatings: 0
  },
  {
    id: "11",
    name: "Eggs",
    description: "Fresh free-range eggs from happy hens",
    price: 40,
    category: "dairy",
    image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=500&h=500&fit=crop",
    sellerName: "Dairy Fresh Farms",
    sellerEmail: "dairy@fresh.com",
    rating: 4.7,
    stock: 150,
    reviews: [],
    createdAt: new Date().toISOString(),
    soldCount: 380,
    totalRatings: 0
  },
  {
    id: "12",
    name: "Strawberries",
    description: "Sweet and juicy strawberries",
    price: 80,
    category: "fruits",
    image: "https://images.unsplash.com/photo-1585518419759-87eb1925b407?w=500&h=500&fit=crop",
    sellerName: "Fruit Paradise",
    sellerEmail: "fruit@paradise.com",
    rating: 4.9,
    stock: 55,
    reviews: [],
    createdAt: new Date().toISOString(),
    soldCount: 280,
    totalRatings: 0
  }
];

// ============================================================================
// CONTEXT CREATION
// ============================================================================

export const ProductContext = createContext();

// ============================================================================
// PRODUCT PROVIDER COMPONENT
// ============================================================================

/**
 * ProductProvider - Main provider component
 * Manages all product-related operations and state
 */
export function ProductProvider({ children }) {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ============================================================================
  // EFFECTS - INITIALIZATION & PERSISTENCE
  // ============================================================================

  /**
   * Load products from localStorage on mount
   * If no products exist, initialize with sample products
   */
  useEffect(() => {
    try {
      setLoading(true);
      const saved = localStorage.getItem(LS_PRODUCTS);

      if (saved) {
        const parsedProducts = JSON.parse(saved);
        if (Array.isArray(parsedProducts) && parsedProducts.length > 0) {
          setProducts(parsedProducts);
        } else {
          // Initialize with samples if localStorage is empty
          setProducts(SAMPLE_PRODUCTS);
          localStorage.setItem(LS_PRODUCTS, JSON.stringify(SAMPLE_PRODUCTS));
        }
      } else {
        // First load - initialize with sample products
        setProducts(SAMPLE_PRODUCTS);
        localStorage.setItem(LS_PRODUCTS, JSON.stringify(SAMPLE_PRODUCTS));
      }
      setLoading(false);
    } catch (err) {
      console.error("Error loading products:", err);
      setError("Failed to load products");
      setProducts(SAMPLE_PRODUCTS);
      setLoading(false);
    }
  }, []);

  /**
   * Persist products to localStorage whenever they change
   */
  useEffect(() => {
    try {
      if (products.length > 0) {
        localStorage.setItem(LS_PRODUCTS, JSON.stringify(products));
      }
    } catch (err) {
      console.error("Error saving products to localStorage:", err);
    }
  }, [products]);

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  /**
   * Calculate average rating from reviews
   */
  const calculateRating = (reviews) => {
    if (!Array.isArray(reviews) || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
    return parseFloat((sum / reviews.length).toFixed(1));
  };

  /**
   * Validate product data before operations
   */
  const validateProduct = (product) => {
    if (!product || typeof product !== "object") {
      return { valid: false, error: "Invalid product object" };
    }
    if (!product.name || product.name.trim() === "") {
      return { valid: false, error: "Product name is required" };
    }
    if (product.price === undefined || product.price < 0) {
      return { valid: false, error: "Valid price is required" };
    }
    return { valid: true };
  };

  // ============================================================================
  // PRODUCT CRUD OPERATIONS
  // ============================================================================

  /**
   * Add new product to marketplace
   */
  const addProduct = useCallback((productData) => {
    const validation = validateProduct(productData);
    if (!validation.valid) {
      setError(validation.error);
      return null;
    }

    setLoading(true);

    const newProduct = {
      id: Date.now().toString(),
      name: productData.name || "Unnamed Product",
      description: productData.description || "",
      price: parseFloat(productData.price) || 0,
      stock: parseInt(productData.stock) || 0,
      category: productData.category || "other",
      image: productData.image || null,
      sellerEmail: productData.sellerEmail || "unknown@example.com",
      sellerName: productData.sellerName || "Unknown Seller",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      reviews: [],
      rating: 0,
      totalRatings: 0,
      soldCount: 0
    };

    setProducts(prev => [newProduct, ...prev]);
    setError(null);
    setLoading(false);
    return newProduct;
  }, []);

  /**
   * Get all products
   */
  const getAllProducts = useCallback(() => {
    return products;
  }, [products]);

  /**
   * Get product by ID
   */
  const getProductById = useCallback((productId) => {
    if (!productId) return null;
    return products.find(p => p.id === productId || p.id === productId.toString());
  }, [products]);

  /**
   * Get products by seller
   */
  const getProductsBySeller = useCallback((sellerEmail) => {
    if (!sellerEmail) return [];
    return products.filter(p => p.sellerEmail === sellerEmail);
  }, [products]);

  /**
   * Update product
   */
  const updateProduct = useCallback((productId, updateData) => {
    if (!productId) return false;

    setProducts(prev =>
      prev.map(p =>
        p.id === productId || p.id === productId.toString()
          ? { ...p, ...updateData, updatedAt: new Date().toISOString() }
          : p
      )
    );
    return true;
  }, []);

  /**
   * Delete product
   */
  const deleteProduct = useCallback((productId) => {
    if (!productId) return false;

    setProducts(prev => prev.filter(p => p.id !== productId && p.id !== productId.toString()));
    return true;
  }, []);

  // ============================================================================
  // FILTERING & SEARCHING
  // ============================================================================

  /**
   * Get products by category
   */
  const getByCategory = useCallback((category) => {
    if (!category || category === "all") return products;
    return products.filter(p => p.category === category);
  }, [products]);

  /**
   * Search products by name/description/category/seller
   */
  const searchProducts = useCallback((searchTerm) => {
    if (!searchTerm || searchTerm.trim() === "") return products;

    const lowerTerm = searchTerm.toLowerCase();
    return products.filter(p =>
      (p.name && p.name.toLowerCase().includes(lowerTerm)) ||
      (p.description && p.description.toLowerCase().includes(lowerTerm)) ||
      (p.category && p.category.toLowerCase().includes(lowerTerm)) ||
      (p.sellerName && p.sellerName.toLowerCase().includes(lowerTerm))
    );
  }, [products]);

  /**
   * Get products by price range
   */
  const getByPriceRange = useCallback((minPrice, maxPrice) => {
    return products.filter(p =>
      p.price >= parseFloat(minPrice) && p.price <= parseFloat(maxPrice)
    );
  }, [products]);

  /**
   * Get in-stock products
   */
  const getInStockProducts = useCallback(() => {
    return products.filter(p => p.stock > 0);
  }, [products]);

  /**
   * Get out-of-stock products
   */
  const getOutOfStockProducts = useCallback(() => {
    return products.filter(p => p.stock <= 0);
  }, [products]);

  /**
   * Get top-rated products
   */
  const getTopRatedProducts = useCallback((limit = 5) => {
    return [...products]
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, limit);
  }, [products]);

  /**
   * Get best-selling products
   */
  const getBestSellingProducts = useCallback((limit = 5) => {
    return [...products]
      .sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0))
      .slice(0, limit);
  }, [products]);

  // ============================================================================
  // STOCK MANAGEMENT
  // ============================================================================

  /**
   * Decrement product stock
   */
  const decrementStock = useCallback((productId, quantity) => {
    if (!productId || quantity <= 0) return false;

    setProducts(prev =>
      prev.map(p =>
        p.id === productId || p.id === productId.toString()
          ? {
              ...p,
              stock: Math.max(0, p.stock - quantity),
              soldCount: (p.soldCount || 0) + quantity
            }
          : p
      )
    );
    return true;
  }, []);

  /**
   * Increment product stock
   */
  const incrementStock = useCallback((productId, quantity) => {
    if (!productId || quantity <= 0) return false;

    setProducts(prev =>
      prev.map(p =>
        p.id === productId || p.id === productId.toString()
          ? { ...p, stock: (p.stock || 0) + quantity }
          : p
      )
    );
    return true;
  }, []);

  // ============================================================================
  // REVIEW & RATING SYSTEM
  // ============================================================================

  /**
   * Add review to product
   */
  const addReview = useCallback((productId, review) => {
    if (!productId || !review) return false;

    setProducts(prev =>
      prev.map(p =>
        p.id === productId || p.id === productId.toString()
          ? {
              ...p,
              reviews: [...(p.reviews || []), { ...review, createdAt: new Date().toISOString() }],
              rating: calculateRating([...(p.reviews || []), review]),
              totalRatings: (p.totalRatings || 0) + 1
            }
          : p
      )
    );
    return true;
  }, []);

  /**
   * Delete review from product
   */
  const deleteReview = useCallback((productId, reviewIndex) => {
    if (!productId || reviewIndex < 0) return false;

    setProducts(prev =>
      prev.map(p =>
        p.id === productId || p.id === productId.toString()
          ? {
              ...p,
              reviews: p.reviews.filter((_, idx) => idx !== reviewIndex),
              rating: calculateRating(p.reviews.filter((_, idx) => idx !== reviewIndex)),
              totalRatings: Math.max(0, (p.totalRatings || 0) - 1)
            }
          : p
      )
    );
    return true;
  }, []);

  // ============================================================================
  // ANALYTICS
  // ============================================================================

  /**
   * Get total revenue from all products
   */
  const getTotalRevenue = useCallback(() => {
    return products.reduce((sum, p) => sum + (p.price * p.soldCount), 0);
  }, [products]);

  /**
   * Get total items sold
   */
  const getTotalSold = useCallback(() => {
    return products.reduce((sum, p) => sum + (p.soldCount || 0), 0);
  }, [products]);

  /**
   * Get average product price
   */
  const getAveragePrice = useCallback(() => {
    if (products.length === 0) return 0;
    const sum = products.reduce((acc, p) => acc + p.price, 0);
    return (sum / products.length).toFixed(2);
  }, [products]);

  /**
   * Get seller statistics
   */
  const getSellerStats = useCallback((sellerEmail) => {
    const sellerProducts = products.filter(p => p.sellerEmail === sellerEmail);
    return {
      totalProducts: sellerProducts.length,
      totalSold: sellerProducts.reduce((sum, p) => sum + (p.soldCount || 0), 0),
      totalRevenue: sellerProducts.reduce((sum, p) => sum + (p.price * (p.soldCount || 0)), 0),
      averageRating: sellerProducts.length > 0
        ? (sellerProducts.reduce((sum, p) => sum + (p.rating || 0), 0) / sellerProducts.length).toFixed(1)
        : 0
    };
  }, [products]);

  // ============================================================================
  // CONTEXT VALUE
  // ============================================================================

  const value = {
    // State
    products,
    loading,
    error,

    // Product CRUD
    addProduct,
    getAllProducts,
    getProductById,
    getProductsBySeller,
    updateProduct,
    deleteProduct,

    // Filtering & Searching
    getByCategory,
    searchProducts,
    getByPriceRange,
    getInStockProducts,
    getOutOfStockProducts,
    getTopRatedProducts,
    getBestSellingProducts,

    // Stock Management
    decrementStock,
    incrementStock,

    // Reviews & Ratings
    addReview,
    deleteReview,
    calculateRating,

    // Analytics
    getTotalRevenue,
    getTotalSold,
    getAveragePrice,
    getSellerStats
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
}

// ============================================================================
// CUSTOM HOOKS
// ============================================================================

/**
 * Hook to use ProductContext
 */
export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    console.warn("useProducts must be used within ProductProvider");
    return {};
  }
  return context;
}

/**
 * Hook for products only
 */
export function useProductList() {
  const { products } = useContext(ProductContext) || { products: [] };
  return products;
}

/**
 * Hook for search functionality
 */
export function useProductSearch() {
  const { searchProducts } = useContext(ProductContext) || {};
  return searchProducts || (() => []);
}
