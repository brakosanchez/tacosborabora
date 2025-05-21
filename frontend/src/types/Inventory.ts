export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unit: string;
  minimumQuantity: number;
  supplier: string;
  price: number;
  category: string;
  createdAt: string;
  updatedAt: string;
  alerts: Array<{
    type: 'low_stock' | 'out_of_stock' | 'reorder';
    threshold: number;
    message: string;
    active: boolean;
  }>;
}
