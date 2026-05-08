import type { Product } from "./products";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ShippingInfo {
  fullName: string;
  address: string;
  city: string;
  zip: string;
  country: string;
}

export interface Order {
  id: string;
  userEmail: string;
  customerName: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  shippingInfo: ShippingInfo;
  createdAt: string; // ISO
  estimatedDelivery: string; // ISO
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}
