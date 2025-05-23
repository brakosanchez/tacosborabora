// Tipos de servicio
export type ServiceType = 'dine-in' | 'takeaway' | 'delivery';

// Opciones de personalización de tacos
export interface TacoCustomization {
  tortilla: 'maiz' | 'harina';
  acompanamiento: 'papas' | 'frijoles' | 'nada';
  queso: boolean;
  salsas?: string[];
  notas?: string;
}

// Estado del pedido
export type OrderStatus = 'draft' | 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

// Métodos de pago
export type PaymentMethod = 'efectivo' | 'tarjeta' | 'transferencia' | 'cripto';

// Artículo en el carrito
export interface CartItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
  category: 'tacos' | 'bebidas' | 'complementos';
  customizations?: TacoCustomization;
  total: number;
}

// Dirección de entrega
export interface DeliveryAddress {
  calle: string;
  numero: string;
  colonia: string;
  ciudad: string;
  estado: string;
  codigoPostal: string;
  referencias?: string;
}

// Datos del cliente
export interface CustomerInfo {
  nombre: string;
  telefono: string;
  email?: string;
  direccion?: DeliveryAddress;
}

// Estado del pedido actual
export interface OrderState {
  serviceType: ServiceType | null;
  items: CartItem[];
  customerInfo: CustomerInfo;
  scheduledTime: Date | null;
  paymentMethod: PaymentMethod | null;
  status: OrderStatus;
  notes?: string;
  saucePack?: {
    small: number;
    medium: number;
    large: number;
  };
}

// Datos para la API
export interface OrderRequest {
  serviceType: ServiceType;
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    price: number;
    customizations?: TacoCustomization;
  }>;
  customerInfo: CustomerInfo;
  scheduledTime?: string;
  paymentMethod: PaymentMethod;
  total: number;
  notes?: string;
}

// Respuesta de la API
export interface OrderResponse {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  estimatedTime?: number; // en minutos
  createdAt: string;
  updatedAt: string;
}
