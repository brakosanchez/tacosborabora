export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  options?: Array<{
    name: string;
    price: number;
  }>;
  available: boolean;
  createdAt: string;
  updatedAt: string;
}
