export interface Product {
  id: number;
  brand: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  original_price: number | null;
  stock: number;
  image: string;
  images: string[] | null;
  rating: number;
  review_count: number;
  badge: string | null;
  is_active: boolean;
  is_featured: boolean;
  category: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProductInput {
  brand: string;
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  original_price?: number | null;
  stock: number;
  image: string;
  images?: string[] | null;
  rating?: number;
  review_count?: number;
  badge?: string | null;
  is_active?: boolean;
  is_featured?: boolean;
  category?: string | null;
}

export interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_wilaya: string;
  customer_address: string;
  customer_notes: string | null;
  subtotal: number;
  shipping_cost: number;
  total: number;
  status: OrderStatus;
  payment_method: 'cod';
  payment_status: 'pending' | 'paid' | 'failed';
  created_at: string;
  updated_at: string;
  confirmed_at: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  cancelled_at: string | null;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_brand: string;
  product_name: string;
  product_price: number;
  quantity: number;
  subtotal: number;
  created_at: string;
}

export interface OrderWithItems extends Order {
  items: OrderItem[];
}

export interface AdminUser {
  id: number;
  email: string;
  password_hash: string;
  name: string;
  role: 'admin' | 'manager';
  is_active: boolean;
  last_login: string | null;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  product_id: number;
  quantity: number;
}

export interface CheckoutData {
  customer_name: string;
  customer_phone: string;
  customer_wilaya: string;
  customer_address: string;
  customer_notes?: string;
  items: CartItem[];
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}