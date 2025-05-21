export interface User {
  id: string;
  email: string;
  name: string;
  role: 'client' | 'waiter' | 'cook' | 'admin';
  isActive: boolean;
  addresses?: Array<{
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    default: boolean;
  }>;
  orders?: string[];
  createdAt: string;
  updatedAt: string;
}
