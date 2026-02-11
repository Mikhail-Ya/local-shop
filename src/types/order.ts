// src/types/order.ts

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface OrderData {
  customerName: string;
  phone: string;
  email: string;
  deliveryCity: string;
  deliveryAddress: string;
  items: CartItem[];
  totalAmount: number;
}