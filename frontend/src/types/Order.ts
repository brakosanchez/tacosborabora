export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  options?: Array<{
    name: string;
    price: number;
  }>;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  paymentMethod: 'cash' | 'card' | 'online';
  deliveryAddress?: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  pickupTime?: string;
  createdAt: string;
  updatedAt: string;
}
