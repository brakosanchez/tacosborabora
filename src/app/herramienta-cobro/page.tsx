'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Product } from '@/lib/validators/sale';

// Productos del menú real con precios actualizados
const PRODUCTOS: Product[] = [
  // Tacos (1-8)
  { id: '1', name: 'Taco de Mixiote', price: 50, category: 'Tacos' },
  { id: '2', name: 'Taco de Bistec de Res', price: 50, category: 'Tacos' },
  { id: '3', name: 'Taco de Longaniza', price: 50, category: 'Tacos' },
  { id: '4', name: 'Taco de Pechuga de Pollo', price: 50, category: 'Tacos' },
  { id: '5', name: 'Taco de Arrachera', price: 50, category: 'Tacos' },
  { id: '6', name: 'Taco de Aguja Norteña', price: 50, category: 'Tacos' },
  { id: '7', name: 'Taco de Cecina', price: 50, category: 'Tacos' },
  { id: '8', name: 'Taco de Picaña', price: 50, category: 'Tacos' },

  // Campechanos (9-14)
  { id: '9', name: 'Campechano de Res', price: 50, category: 'Campechanos' },
  { id: '10', name: 'Campechano de Pollo', price: 50, category: 'Campechanos' },
  { id: '11', name: 'Campechano de Cecina', price: 50, category: 'Campechanos' },
  { id: '12', name: 'Campechano de Arrachera', price: 50, category: 'Campechanos' },
  { id: '13', name: 'Campechano de Aguja', price: 50, category: 'Campechanos' },
  { id: '14', name: 'Campechano de Picaña', price: 50, category: 'Campechanos' },

  // Aguas Frescas (15-26)
  { id: '15', name: 'Agua de Limón con Kiwi', price: 50, category: 'Aguas Frescas' },
  { id: '16', name: 'Agua de Limón con Chía', price: 50, category: 'Aguas Frescas' },
  { id: '17', name: 'Agua de Fresa con Guayaba', price: 50, category: 'Aguas Frescas' },
  { id: '18', name: 'Agua de Fresa con Maracuyá', price: 50, category: 'Aguas Frescas' },
  { id: '19', name: 'Agua de Frutos Rojos', price: 50, category: 'Aguas Frescas' },
  { id: '20', name: 'Agua de Jamaica con Naranja', price: 50, category: 'Aguas Frescas' },
  { id: '21', name: 'Agua de Piña con Mango', price: 50, category: 'Aguas Frescas' },
  { id: '22', name: 'Agua de Piña con Maracuyá', price: 50, category: 'Aguas Frescas' },
  { id: '23', name: 'Agua de Tamarindo', price: 50, category: 'Aguas Frescas' },
  { id: '24', name: 'Horchata', price: 50, category: 'Aguas Frescas' },
  { id: '25', name: 'Agua de Melón', price: 50, category: 'Aguas Frescas' },
  { id: '26', name: 'Agua de Limón con Maracuyá', price: 50, category: 'Aguas Frescas' },

  // Refrescos (27-30)
  { id: '27', name: 'Coca-Cola', price: 50, category: 'Refrescos' },
  { id: '28', name: 'Sprite', price: 50, category: 'Refrescos' },
  { id: '29', name: 'Fanta', price: 50, category: 'Refrescos' },
  { id: '30', name: 'Sidral Mundet', price: 50, category: 'Refrescos' },

  // Tés (31-32)
  { id: '31', name: 'Fuze Tea', price: 50, category: 'Tés' },
  { id: '32', name: 'Topo Chico', price: 50, category: 'Tés' },

  // Jugos y Néctares (33-38)
  { id: '33', name: 'Boing de Guayaba', price: 50, category: 'Jugos y Néctares' },
  { id: '34', name: 'Boing de Mango', price: 50, category: 'Jugos y Néctares' },
  { id: '35', name: 'Néctar de Mango', price: 50, category: 'Jugos y Néctares' },
  { id: '36', name: 'Néctar de Naranja', price: 50, category: 'Jugos y Néctares' },
  { id: '37', name: 'Néctar de Piña', price: 50, category: 'Jugos y Néctares' },
  { id: '38', name: 'Néctar de Uva', price: 50, category: 'Jugos y Néctares' },

  // Malteadas (39-41)
  { id: '39', name: 'Malteada de Chocolate', price: 50, category: 'Malteadas' },
  { id: '40', name: 'Malteada de Fresa', price: 50, category: 'Malteadas' },
  { id: '41', name: 'Malteada de Vainilla', price: 50, category: 'Malteadas' }
];

type CartItem = {
  product: Product;
  quantity: number;
};

type OrderType = 'local' | 'takeaway' | 'delivery';

// Componente para el paso 1: Selección de tipo de pedido
const OrderTypeStep = ({ onSelect }: { onSelect: (type: OrderType) => void }) => {
  return (
    <div 
      className="pt-20 min-h-screen relative flex items-center justify-center"
      style={{
        backgroundImage: "url('/images/patterns/patronweb.svg')",
        backgroundRepeat: 'repeat',
        backgroundSize: '200px',
        backgroundColor: '#000'
      }}
    >
      {/* Black Overlay */}
      <div className="absolute inset-0 bg-black opacity-60 pointer-events-none"></div>
      
      <div className="container-bora py-12 relative z-10 max-w-4xl w-full">
        <div className="text-center mb-12 fade-in">
          <h1 className="font-bebas text-6xl md:text-7xl mb-4">
            <span className="text-fire glow-title">BORAFLOW POS</span>
          </h1>
          <h2 className="font-bebas text-4xl md:text-5xl mb-4 text-bora-yellow">
            Selecciona el tipo de pedido
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Elige cómo quieres procesar esta orden en nuestro sistema tropical
          </p>
          <div className="divider-tropical"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <button
            onClick={() => onSelect('local')}
            className="card-tropical group bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2"
          >
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">🏠</div>
            <h3 className="font-bebas text-2xl mb-2 text-bora-yellow glow-title">En el local</h3>
            <p className="text-gray-300">Para consumir en el restaurante</p>
            <div className="mt-4 text-bora-orange font-bold opacity-0 group-hover:opacity-100 transition-opacity">
              Seleccionar →
            </div>
          </button>
          
          <button
            onClick={() => onSelect('takeaway')}
            className="card-tropical group bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2"
          >
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">🥡</div>
            <h3 className="font-bebas text-2xl mb-2 text-bora-yellow glow-title">Para llevar</h3>
            <p className="text-gray-300">Recoger en mostrador</p>
            <div className="mt-4 text-bora-orange font-bold opacity-0 group-hover:opacity-100 transition-opacity">
              Seleccionar →
            </div>
          </button>
          
          <button
            onClick={() => onSelect('delivery')}
            className="card-tropical group bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2"
          >
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">🚴</div>
            <h3 className="font-bebas text-2xl mb-2 text-bora-yellow glow-title">A domicilio</h3>
            <p className="text-gray-300">Envío a domicilio</p>
            <div className="mt-4 text-bora-orange font-bold opacity-0 group-hover:opacity-100 transition-opacity">
              Seleccionar →
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente para el paso 2: Información de la mesa (cuando es para consumir en el local)
const TableInfoStep = ({ 
  tableInfo, 
  onUpdate, 
  onNext,
  onBack
}: { 
  tableInfo: { diners: number; tableNumber: string }, 
  onUpdate: (data: { diners?: number; tableNumber?: string }) => void,
  onNext: () => void,
  onBack: () => void
}) => {
  return (
    <div 
      className="pt-20 min-h-screen relative flex items-center justify-center"
      style={{
        backgroundImage: "url('/images/patterns/patronweb.svg')",
        backgroundRepeat: 'repeat',
        backgroundSize: '200px',
        backgroundColor: '#000'
      }}
    >
      {/* Black Overlay */}
      <div className="absolute inset-0 bg-black opacity-60 pointer-events-none"></div>
      
      <div className="container-bora py-12 relative z-10 max-w-md w-full">
        <button
          onClick={onBack}
          className="mb-6 flex items-center text-bora-orange hover:text-bora-yellow transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver al tipo de pedido
        </button>

        <div className="card-tropical bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
          <h2 className="font-bebas text-3xl text-bora-yellow mb-6 glow-title">Información de la mesa</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3">
                Número de comensales
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                  <button
                    key={num}
                    onClick={() => onUpdate({ diners: num })}
                    className={`py-3 px-4 rounded-lg font-bold transition-all duration-200 ${
                      tableInfo.diners === num
                        ? 'bg-bora-orange text-white shadow-lg transform -translate-y-1'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20'
                    }`}
                  >
                    {num}
                  </button>
                ))}
                <button
                  onClick={() => onUpdate({ diners: 9 })}
                  className={`py-3 px-4 rounded-lg font-bold transition-all duration-200 ${
                    tableInfo.diners >= 9
                      ? 'bg-bora-orange text-white shadow-lg transform -translate-y-1'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20'
                  }`}
                >
                  9+
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3">
                Número de mesa
              </label>
              <input
                type="text"
                value={tableInfo.tableNumber}
                onChange={(e) => onUpdate({ tableNumber: e.target.value })}
                placeholder="Ej. M1, M2, Terraza..."
                className="w-full p-4 text-lg bg-white/10 border border-white/20 rounded-xl focus:ring-bora-orange focus:border-bora-orange text-white placeholder-gray-400 transition-colors"
                required
              />
            </div>
            
            <button
              onClick={onNext}
              disabled={!tableInfo.tableNumber}
              className={`w-full py-4 px-6 rounded-xl font-bold text-white text-lg transition-all duration-200 ${
                tableInfo.tableNumber 
                  ? 'bg-gradient-to-r from-bora-orange to-bora-yellow hover:from-bora-yellow hover:to-bora-orange shadow-lg hover:shadow-bora-yellow/30 transform hover:-translate-y-1' 
                  : 'bg-gray-600 cursor-not-allowed'
              }`}
            >
              Continuar al menú →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente para el paso 2: Información de envío (cuando es a domicilio)
const DeliveryInfoStep = ({ 
  deliveryInfo, 
  onUpdate, 
  onNext,
  onBack
}: { 
  deliveryInfo: { hasWhatsapp: boolean; address: string; phone: string; customerName: string }, 
  onUpdate: (data: Partial<typeof deliveryInfo>) => void,
  onNext: () => void,
  onBack: () => void
}) => {
  const isFormValid = deliveryInfo.customerName && 
                     (deliveryInfo.hasWhatsapp || (deliveryInfo.address && deliveryInfo.phone));

  return (
    <div 
      className="pt-20 min-h-screen relative flex items-center justify-center"
      style={{
        backgroundImage: "url('/images/patterns/patronweb.svg')",
        backgroundRepeat: 'repeat',
        backgroundSize: '200px',
        backgroundColor: '#000'
      }}
    >
      {/* Black Overlay */}
      <div className="absolute inset-0 bg-black opacity-60 pointer-events-none"></div>
      
      <div className="container-bora py-12 relative z-10 max-w-md w-full">
        <button
          onClick={onBack}
          className="mb-6 flex items-center text-bora-orange hover:text-bora-yellow transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver al tipo de pedido
        </button>

        <div className="card-tropical bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
          <h2 className="font-bebas text-3xl text-bora-yellow mb-6 glow-title">Información de envío</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3">
                Nombre del cliente
              </label>
              <input
                type="text"
                value={deliveryInfo.customerName}
                onChange={(e) => onUpdate({ customerName: e.target.value })}
                placeholder="Nombre completo"
                className="w-full p-4 text-lg bg-white/10 border border-white/20 rounded-xl focus:ring-bora-orange focus:border-bora-orange text-white placeholder-gray-400 transition-colors"
                required
              />
            </div>

            <div className="bg-bora-orange/20 rounded-xl p-4 border border-bora-orange/30">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={deliveryInfo.hasWhatsapp}
                  onChange={(e) => onUpdate({ hasWhatsapp: e.target.checked })}
                  className="h-5 w-5 text-bora-orange focus:ring-bora-orange border-gray-300 rounded mr-3"
                />
                <span className="text-bora-yellow font-medium">El cliente ya tiene su dirección en WhatsApp</span>
              </label>
            </div>

            {!deliveryInfo.hasWhatsapp && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    Dirección de envío
                  </label>
                  <textarea
                    value={deliveryInfo.address}
                    onChange={(e) => onUpdate({ address: e.target.value })}
                    placeholder="Calle, número, colonia, referencias..."
                    rows={3}
                    className="w-full p-4 text-lg bg-white/10 border border-white/20 rounded-xl focus:ring-bora-orange focus:border-bora-orange text-white placeholder-gray-400 transition-colors"
                    required={!deliveryInfo.hasWhatsapp}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    Teléfono de contacto
                  </label>
                  <input
                    type="tel"
                    value={deliveryInfo.phone}
                    onChange={(e) => onUpdate({ phone: e.target.value })}
                    placeholder="Número de teléfono"
                    className="w-full p-4 text-lg bg-white/10 border border-white/20 rounded-xl focus:ring-bora-orange focus:border-bora-orange text-white placeholder-gray-400 transition-colors"
                    required={!deliveryInfo.hasWhatsapp}
                  />
                </div>
              </>
            )}

            <button
              onClick={onNext}
              disabled={!isFormValid}
              className={`w-full py-4 px-6 rounded-xl font-bold text-white text-lg transition-all duration-200 ${
                isFormValid
                  ? 'bg-gradient-to-r from-bora-orange to-bora-yellow hover:from-bora-yellow hover:to-bora-orange shadow-lg hover:shadow-bora-yellow/30 transform hover:-translate-y-1' 
                  : 'bg-gray-600 cursor-not-allowed'
              }`}
            >
              Continuar al menú →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente para el paso 2: Información para llevar
const TakeawayInfoStep = ({ 
  takeawayInfo, 
  onUpdate, 
  onNext,
  onBack
}: { 
  takeawayInfo: { customerName: string; phone: string }, 
  onUpdate: (data: Partial<typeof takeawayInfo>) => void,
  onNext: () => void,
  onBack: () => void
}) => {
  const isFormValid = takeawayInfo.customerName;

  return (
    <div 
      className="pt-20 min-h-screen relative flex items-center justify-center"
      style={{
        backgroundImage: "url('/images/patterns/patronweb.svg')",
        backgroundRepeat: 'repeat',
        backgroundSize: '200px',
        backgroundColor: '#000'
      }}
    >
      {/* Black Overlay */}
      <div className="absolute inset-0 bg-black opacity-60 pointer-events-none"></div>
      
      <div className="container-bora py-12 relative z-10 max-w-md w-full">
        <button
          onClick={onBack}
          className="mb-6 flex items-center text-bora-orange hover:text-bora-yellow transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver al tipo de pedido
        </button>

        <div className="card-tropical bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
          <h2 className="font-bebas text-3xl text-bora-yellow mb-6 glow-title">Información del pedido</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3">
                Nombre del cliente
              </label>
              <input
                type="text"
                value={takeawayInfo.customerName}
                onChange={(e) => onUpdate({ customerName: e.target.value })}
                placeholder="Nombre para la orden"
                className="w-full p-4 text-lg bg-white/10 border border-white/20 rounded-xl focus:ring-bora-orange focus:border-bora-orange text-white placeholder-gray-400 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3">
                Teléfono (opcional)
              </label>
              <input
                type="tel"
                value={takeawayInfo.phone}
                onChange={(e) => onUpdate({ phone: e.target.value })}
                placeholder="Para notificaciones"
                className="w-full p-4 text-lg bg-white/10 border border-white/20 rounded-xl focus:ring-bora-orange focus:border-bora-orange text-white placeholder-gray-400 transition-colors"
              />
            </div>

            <button
              onClick={onNext}
              disabled={!isFormValid}
              className={`w-full py-4 px-6 rounded-xl font-bold text-white text-lg transition-all duration-200 ${
                isFormValid
                  ? 'bg-gradient-to-r from-bora-orange to-bora-yellow hover:from-bora-yellow hover:to-bora-orange shadow-lg hover:shadow-bora-yellow/30 transform hover:-translate-y-1' 
                  : 'bg-gray-600 cursor-not-allowed'
              }`}
            >
              Continuar al menú →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente para el menú de productos
const MenuStep = ({ 
  products,
  cart,
  onAddToCart,
  onUpdateQuantity,
  onBack,
  orderInfo,
  orderType
}: {
  products: Product[],
  cart: CartItem[],
  onAddToCart: (product: Product) => void,
  onUpdateQuantity: (productId: string, quantity: number) => void,
  onBack: () => void,
  orderInfo: any,
  orderType: OrderType
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['Todas', ...new Set(products.map(p => p.category))];
  const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  const getOrderTypeDisplay = () => {
    switch(orderType) {
      case 'local': return `🏠 Mesa ${orderInfo.tableNumber} - ${orderInfo.diners} comensales`;
      case 'takeaway': return `🥡 Para llevar - ${orderInfo.customerName}`;
      case 'delivery': return `🚴 Domicilio - ${orderInfo.customerName}`;
      default: return '';
    }
  };

  return (
    <div 
      className="pt-20 min-h-screen relative"
      style={{
        backgroundImage: "url('/images/patterns/patronweb.svg')",
        backgroundRepeat: 'repeat',
        backgroundSize: '200px',
        backgroundColor: '#000'
      }}
    >
      {/* Black Overlay */}
      <div className="absolute inset-0 bg-black opacity-60 pointer-events-none"></div>
      
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-sm text-white p-4 shadow-lg sticky top-0 z-20 border-b border-white/10">
        <div className="container-bora">
          <div className="flex justify-between items-center mb-2">
            <button
              onClick={onBack}
              className="flex items-center text-bora-orange hover:text-bora-yellow transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver
            </button>
            <h1 className="font-bebas text-3xl text-bora-yellow glow-title">BORAFLOW POS</h1>
            <div className="w-16"></div>
          </div>
          <div className="bg-bora-orange/20 rounded-lg px-3 py-2 text-center border border-bora-orange/30">
            <p className="text-sm font-medium text-gray-300">{getOrderTypeDisplay()}</p>
          </div>
        </div>
      </header>

      <main className="container-bora py-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Panel de productos */}
          <div className="lg:col-span-3 space-y-6">
            {/* Barra de búsqueda y filtros */}
            <div className="card-tropical bg-white/10 backdrop-blur-sm border border-white/20 p-6">
              <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-6 w-6 text-bora-orange" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  className="w-full pl-12 pr-4 py-3 text-lg bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-bora-orange focus:border-bora-orange text-white placeholder-gray-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {/* Filtros de categoría */}
              <div className="flex flex-wrap gap-3">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category || 'Todas')}
                    className={`px-6 py-3 text-sm font-bold rounded-full transition-all duration-200 whitespace-nowrap ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-bora-orange to-bora-yellow text-white shadow-lg shadow-bora-yellow/30 transform -translate-y-1'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Lista de productos */}
            <div className="card-tropical bg-white/10 backdrop-blur-sm border border-white/20 overflow-hidden">
              <div className="p-6 border-b border-white/20 bg-gradient-to-r from-bora-orange/20 to-bora-yellow/20">
                <h2 className="font-bebas text-2xl text-bora-yellow glow-title">Productos</h2>
              </div>
              <div className="p-6">
                {filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {filteredProducts.map((product) => {
                      const cartItem = cart.find(item => item.product.id === product.id);
                      const quantity = cartItem ? cartItem.quantity : 0;
                      
                      return (
                        <div 
                          key={product.id}
                          onClick={() => onAddToCart(product)}
                          className="card-tropical group bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 cursor-pointer hover:bg-white/20 transition-all duration-200 flex flex-col relative overflow-hidden hover:scale-105"
                        >
                          <div className="bg-gradient-to-br from-bora-orange/20 to-bora-yellow/20 rounded-lg h-24 mb-3 flex items-center justify-center overflow-hidden">
                            <span className="text-4xl opacity-80 group-hover:scale-110 transition-transform duration-200">
                              {product.category === 'Bebidas' ? '🥤' : 
                               product.category === 'Hamburguesas' ? '🍔' : 
                               product.category === 'Acompañamientos' ? '🍟' : '🌮'}
                            </span>
                          </div>
                          <h3 className="font-bold text-gray-300 group-hover:text-bora-yellow transition-colors text-center">
                            {product.name}
                          </h3>
                          <div className="mt-2 text-center">
                            <span className="text-bora-orange font-bold text-lg">${product.price.toFixed(2)}</span>
                          </div>
                          
                          {quantity > 0 && (
                            <div className="absolute -top-2 -right-2 bg-bora-orange text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-lg">
                              {quantity}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-400">No se encontraron productos</h3>
                    <p className="mt-1 text-gray-500">Intenta con otro término de búsqueda o categoría</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Panel del carrito */}
          <div className="lg:col-span-1">
            <div className="card-tropical bg-white/10 backdrop-blur-sm border border-white/20 overflow-hidden sticky top-24">
              <div className="p-4 border-b border-white/20 bg-gradient-to-r from-bora-orange/20 to-bora-yellow/20">
                <h2 className="font-bebas text-xl text-bora-yellow glow-title">Orden Actual</h2>
              </div>
              
              <div className="p-4">
                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-400">Carrito vacío</h3>
                    <p className="mt-1 text-xs text-gray-500">Agrega productos para comenzar</p>
                  </div>
                ) : (
                  <>
                    <div className="max-h-64 overflow-y-auto space-y-3 pr-2">
                      {cart.map((item) => (
                        <div key={item.product.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/10 transition-colors">
                          <div className="flex-1">
                            <p className="font-medium text-sm text-gray-300">{item.product.name}</p>
                            <p className="text-xs text-bora-orange font-medium">
                              ${item.product.price.toFixed(2)} x {item.quantity}
                            </p>
                          </div>
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onUpdateQuantity(item.product.id || '', item.quantity - 1);
                              }}
                              className="w-6 h-6 flex items-center justify-center bg-bora-orange/20 text-bora-orange rounded-full hover:bg-bora-orange/30 transition-colors text-sm font-bold"
                            >
                              -
                            </button>
                            <span className="w-6 text-center font-medium text-gray-300 text-sm">{item.quantity}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onUpdateQuantity(item.product.id || '', item.quantity + 1);
                              }}
                              className="w-6 h-6 flex items-center justify-center bg-bora-orange/20 text-bora-orange rounded-full hover:bg-bora-orange/30 transition-colors text-sm font-bold"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-white/20 mt-4 pt-4">
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between">
                          <span className="text-gray-400 text-sm">Subtotal:</span>
                          <span className="font-medium text-sm text-gray-300">${total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">IVA (16%):</span>
                          <span className="text-gray-400">${(total * 0.16).toFixed(2)}</span>
                        </div>
                        <div className="border-t border-white/20 pt-2 mt-2 flex justify-between font-bold text-bora-yellow">
                          <span>Total:</span>
                          <span>${(total * 1.16).toFixed(2)}</span>
                        </div>
                      </div>
                      
                      <button
                        className="w-full py-3 bg-gradient-to-r from-bora-orange to-bora-yellow text-white rounded-xl hover:from-bora-yellow hover:to-bora-orange font-bold shadow-lg hover:shadow-bora-yellow/30 transform hover:-translate-y-1 transition-all duration-200"
                        disabled={cart.length === 0}
                      >
                        Finalizar pedido
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default function HerramientaCobroPage() {
  // Estados para el flujo de pasos
  const [currentStep, setCurrentStep] = useState(1);
  const [orderType, setOrderType] = useState<OrderType | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Estados para la información de cada tipo de pedido
  const [tableInfo, setTableInfo] = useState({
    diners: 1,
    tableNumber: ''
  });

  const [deliveryInfo, setDeliveryInfo] = useState({
    hasWhatsapp: false,
    address: '',
    phone: '',
    customerName: ''
  });

  const [takeawayInfo, setTakeawayInfo] = useState({
    customerName: '',
    phone: ''
  });

  // Estados para el carrito
  const [cart, setCart] = useState<CartItem[]>([]);

  // Funciones de actualización específicas para cada tipo de información
  const updateTableInfo = useCallback((data: { diners?: number; tableNumber?: string }) => {
    setTableInfo(prev => ({ ...prev, ...data }));
  }, []);

  const updateDeliveryInfo = useCallback((data: Partial<typeof deliveryInfo>) => {
    setDeliveryInfo(prev => ({ ...prev, ...data }));
  }, []);

  const updateTakeawayInfo = useCallback((data: Partial<typeof takeawayInfo>) => {
    setTakeawayInfo(prev => ({ ...prev, ...data }));
  }, []);

  // Efecto para manejar el renderizado del lado del cliente
  useEffect(() => {
    setIsClient(true);
    
    // Limpiar el carrito al desmontar para evitar duplicados
    return () => {
      setCart([]);
    };
  }, []);

  const addToCart = useCallback((product: Product) => {
    setCart(currentCart => {
      const existingItem = currentCart.find(item => item.product.id === product.id);
      
      if (existingItem) {
        return currentCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      return [...currentCart, { product, quantity: 1 }];
    });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(currentCart => currentCart.filter(item => item.product.id !== productId));
      return;
    }
    
    setCart(currentCart =>
      currentCart.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  }, []);

  const handleOrderTypeSelect = (type: OrderType) => {
    setOrderType(type);
    setCurrentStep(2);
  };

  const handleGoToMenu = () => {
    setCurrentStep(3);
  };

  const handleGoBack = () => {
    if (currentStep === 3) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(1);
      setOrderType(null);
    }
  };

  // No renderizar nada hasta que estemos en el cliente
  if (!isClient) {
    return <div className="min-h-screen bg-gray-50"></div>;
  }

  // Renderizar el paso actual
  if (currentStep === 1) {
    return <OrderTypeStep onSelect={handleOrderTypeSelect} />;
  }

  if (currentStep === 2 && orderType === 'local') {
    return (
      <TableInfoStep
        tableInfo={tableInfo}
        onUpdate={updateTableInfo}
        onNext={handleGoToMenu}
        onBack={handleGoBack}
      />
    );
  }

  if (currentStep === 2 && orderType === 'delivery') {
    return (
      <DeliveryInfoStep
        deliveryInfo={deliveryInfo}
        onUpdate={updateDeliveryInfo}
        onNext={handleGoToMenu}
        onBack={handleGoBack}
      />
    );
  }

  if (currentStep === 2 && orderType === 'takeaway') {
    return (
      <TakeawayInfoStep
        takeawayInfo={takeawayInfo}
        onUpdate={updateTakeawayInfo}
        onNext={handleGoToMenu}
        onBack={handleGoBack}
      />
    );
  }

  if (currentStep === 3) {
    const orderInfo = orderType === 'local' ? tableInfo : 
                     orderType === 'delivery' ? deliveryInfo : takeawayInfo;
    
    return (
      <MenuStep
        products={PRODUCTOS}
        cart={cart}
        onAddToCart={addToCart}
        onUpdateQuantity={updateQuantity}
        onBack={handleGoBack}
        orderInfo={orderInfo}
        orderType={orderType!}
      />
    );
  }

  return <div className="min-h-screen bg-gray-50"></div>;
}