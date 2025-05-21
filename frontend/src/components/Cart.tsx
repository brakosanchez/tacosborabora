import { useState, createContext, useContext } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (item: CartItem) => {
    const existingItem = items.find(i => i.id === item.id);
    if (existingItem) {
      setItems(items.map(i =>
        i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
      ));
    } else {
      setItems([...items, item]);
    }
    toast.success('Producto agregado al carrito');
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
    toast.info('Producto eliminado del carrito');
  };

  const clearCart = () => {
    setItems([]);
    toast.info('Carrito vaciado');
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function CartIcon() {
  const { items } = useContext(CartContext);
  const { data: session } = useSession();

  if (!session) return null;

  return (
    <Link href="/cart" className="relative">
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      {items.length > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
          {items.length}
        </span>
      )}
    </Link>
  );
}
