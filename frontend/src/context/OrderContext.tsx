'use client';

import { createContext, useContext, useReducer, ReactNode, useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { OrderState, OrderStatus, ServiceType, PaymentMethod, CartItem, TacoCustomization, CustomerInfo } from '@/types/order';

type OrderAction =
  | { type: 'SET_SERVICE_TYPE'; payload: ServiceType }
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'id' | 'total'> }
  | { type: 'UPDATE_ITEM'; payload: { id: string; quantity: number; customizations?: TacoCustomization } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_CUSTOMER_INFO'; payload: Partial<CustomerInfo> }
  | { type: 'SET_PAYMENT_METHOD'; payload: PaymentMethod }
  | { type: 'SET_SCHEDULED_TIME'; payload: Date | null }
  | { type: 'ADD_NOTE'; payload: string }
  | { type: 'UPDATE_SAUCE_PACK'; payload: { small: number; medium: number; large: number } };

const initialState: OrderState = {
  serviceType: null,
  items: [],
  customerInfo: {
    nombre: '',
    telefono: '',
    email: '',
  },
  scheduledTime: null,
  paymentMethod: null,
  status: 'draft',
  saucePack: {
    small: 0,
    medium: 0,
    large: 0,
  },
};

function orderReducer(state: OrderState, action: OrderAction): OrderState {
  switch (action.type) {
    case 'SET_SERVICE_TYPE':
      return { ...state, serviceType: action.payload };

    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(
        (item) =>
          item.productId === action.payload.productId &&
          JSON.stringify(item.customizations) === JSON.stringify(action.payload.customizations)
      );

      if (existingItemIndex >= 0) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + action.payload.quantity,
          total:
            updatedItems[existingItemIndex].total +
            action.payload.price * action.payload.quantity,
        };
        return { ...state, items: updatedItems };
      }

      const newItem: CartItem = {
        ...action.payload,
        id: uuidv4(),
        total: action.payload.price * action.payload.quantity,
      };
      return { ...state, items: [...state.items, newItem] };
    }

    case 'UPDATE_ITEM': {
      const updatedItems = state.items.map((item) =>
        item.id === action.payload.id
          ? {
              ...item,
              quantity: action.payload.quantity,
              customizations: action.payload.customizations || item.customizations,
              total: action.payload.quantity * item.price,
            }
          : item
      );
      return { ...state, items: updatedItems };
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };

    case 'CLEAR_CART':
      return { ...initialState, serviceType: state.serviceType };

    case 'SET_CUSTOMER_INFO':
      return {
        ...state,
        customerInfo: { ...state.customerInfo, ...action.payload },
      };

    case 'SET_PAYMENT_METHOD':
      return { ...state, paymentMethod: action.payload };

    case 'SET_SCHEDULED_TIME':
      return { ...state, scheduledTime: action.payload };

    case 'ADD_NOTE':
      return { ...state, notes: action.payload };

    case 'UPDATE_SAUCE_PACK':
      return {
        ...state,
        saucePack: { ...action.payload },
      };

    default:
      return state;
  }
}

const OrderContext = createContext<{
  state: OrderState;
  dispatch: React.Dispatch<OrderAction>;
  addToCart: (item: Omit<CartItem, 'id' | 'total'>) => void;
  updateCartItem: (id: string, quantity: number, customizations?: TacoCustomization) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  setServiceType: (type: ServiceType) => void;
  setCustomerInfo: (info: Partial<CustomerInfo>) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  setScheduledTime: (time: Date | null) => void;
  addNote: (note: string) => void;
  updateSaucePack: (pack: { small: number; medium: number; large: number }) => void;
  cartTotal: number;
  itemCount: number;
}>({
  state: initialState,
  dispatch: () => null,
  addToCart: () => {},
  updateCartItem: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  setServiceType: () => {},
  setCustomerInfo: () => {},
  setPaymentMethod: () => {},
  setScheduledTime: () => {},
  addNote: () => {},
  updateSaucePack: () => {},
  cartTotal: 0,
  itemCount: 0,
});

export function OrderProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(orderReducer, initialState);

  const addToCart = useCallback((item: Omit<CartItem, 'id' | 'total'>) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  }, []);

  const updateCartItem = useCallback(
    (id: string, quantity: number, customizations?: TacoCustomization) => {
      dispatch({ type: 'UPDATE_ITEM', payload: { id, quantity, customizations } });
    },
    []
  );

  const removeFromCart = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const setServiceType = useCallback((type: ServiceType) => {
    dispatch({ type: 'SET_SERVICE_TYPE', payload: type });
  }, []);

  const setCustomerInfo = useCallback((info: Partial<CustomerInfo>) => {
    dispatch({ type: 'SET_CUSTOMER_INFO', payload: info });
  }, []);

  const setPaymentMethod = useCallback((method: PaymentMethod) => {
    dispatch({ type: 'SET_PAYMENT_METHOD', payload: method });
  }, []);

  const setScheduledTime = useCallback((time: Date | null) => {
    dispatch({ type: 'SET_SCHEDULED_TIME', payload: time });
  }, []);

  const addNote = useCallback((note: string) => {
    dispatch({ type: 'ADD_NOTE', payload: note });
  }, []);

  const updateSaucePack = useCallback(
    (pack: { small: number; medium: number; large: number }) => {
      dispatch({ type: 'UPDATE_SAUCE_PACK', payload: pack });
    },
    []
  );

  const cartTotal = useMemo(
    () => state.items.reduce((sum, item) => sum + item.total, 0),
    [state.items]
  );

  const itemCount = useMemo(
    () => state.items.reduce((count, item) => count + item.quantity, 0),
    [state.items]
  );

  const value = useMemo(
    () => ({
      state,
      dispatch,
      addToCart,
      updateCartItem,
      removeFromCart,
      clearCart,
      setServiceType,
      setCustomerInfo,
      setPaymentMethod,
      setScheduledTime,
      addNote,
      updateSaucePack,
      cartTotal,
      itemCount,
    }),
    [
      state,
      addToCart,
      updateCartItem,
      removeFromCart,
      clearCart,
      setServiceType,
      setCustomerInfo,
      setPaymentMethod,
      setScheduledTime,
      addNote,
      updateSaucePack,
      cartTotal,
      itemCount,
    ]
  );

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder debe usarse dentro de un OrderProvider');
  }
  return context;
};
