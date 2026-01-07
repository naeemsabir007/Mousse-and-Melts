import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, AppSettings, Stats, Coupon } from '../types';
import { getProducts, getSettings, getStats, getCoupons, incrementVisit, incrementLeads, INITIAL_SETTINGS } from '../services/mockData';

interface StateContextType {
  cart: CartItem[];
  isCartOpen: boolean;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  toggleCart: (open?: boolean) => void;
  products: Product[];
  settings: AppSettings;
  coupons: Coupon[];
  stats: Stats;
  refreshData: () => Promise<void>;
  isAdmin: boolean;
  loginAdmin: () => void;
  logoutAdmin: () => void;
  isLoading: boolean;
  recordCheckout: () => void;
  currentPath: string;
  navigate: (path: string) => void;
  lastAddedItem: Product | null;
  clearLastAddedItem: () => void;
  clearCart: () => void;
}

const StateContext = createContext<StateContextType | undefined>(undefined);

export const StateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<AppSettings>(INITIAL_SETTINGS);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [stats, setStats] = useState<Stats>({ totalVisits: 0, leadsGenerated: 0, activeProducts: 0 });
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lastAddedItem, setLastAddedItem] = useState<Product | null>(null);

  // Router state - using pathname instead of hash for SEO-friendly URLs
  const [currentPath, setCurrentPath] = useState(window.location.pathname || '/');

  // Initial Load & Visit Counter
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await incrementVisit(); // Track visit on load
      await refreshData();
      setIsLoading(false);
    };
    init();

    // Router listener for browser back/forward navigation
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  const refreshData = async () => {
    try {
      const [fetchedProducts, fetchedSettings, fetchedStats, fetchedCoupons] = await Promise.all([
        getProducts(),
        getSettings(),
        getStats(),
        getCoupons()
      ]);
      setProducts(fetchedProducts);
      setSettings(fetchedSettings);
      setStats(fetchedStats);
      setCoupons(fetchedCoupons);
    } catch (error) {
      console.error("Failed to refresh data", error);
    }
  };

  const recordCheckout = () => {
    incrementLeads();
    refreshData(); // Update stats in UI
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setLastAddedItem(product);
  };

  const clearLastAddedItem = () => setLastAddedItem(null);
  const clearCart = () => setCart([]);

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const toggleCart = (open?: boolean) => {
    setIsCartOpen(prev => open !== undefined ? open : !prev);
  };

  const loginAdmin = () => setIsAdmin(true);
  const logoutAdmin = () => setIsAdmin(false);

  return (
    <StateContext.Provider value={{
      cart,
      isCartOpen,
      addToCart,
      removeFromCart,
      updateQuantity,
      toggleCart,
      products,
      settings,
      coupons,
      stats,
      refreshData,
      isAdmin,
      loginAdmin,
      logoutAdmin,
      isLoading,
      recordCheckout,
      currentPath,
      navigate,
      lastAddedItem,
      clearLastAddedItem,
      clearCart
    }}>
      {children}
    </StateContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StateContext);
  if (!context) throw new Error("useStore must be used within StateProvider");
  return context;
};