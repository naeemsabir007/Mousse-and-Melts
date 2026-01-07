export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number; // New field for discounts
  category: string;
  image: string;
  isBestSeller?: boolean;
  displayOrder?: number; // Custom ordering for Admin drag-and-drop
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Coupon {
  id: string;
  code: string;
  discountPercent: number;
  active: boolean;
}

export interface HeroConfig {
  title: string;
  subtitle: string;
  price: number;
  image: string;
  linkedProductId?: string; // To add to cart
}

export interface AppSettings {
  announcement: {
    text: string;
    active: boolean;
    isMarquee: boolean; // Toggle animation
  };
  hero: HeroConfig;
}

export interface Stats {
  totalVisits: number;
  leadsGenerated: number;
  activeProducts: number;
}

export type Category = 'All' | 'Cupcakes' | 'Sundaes' | 'Cakes & Pastries' | 'Breads' | 'Coffee & Shakes';