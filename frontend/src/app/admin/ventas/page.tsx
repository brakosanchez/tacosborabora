'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface Sale {
  id: string;
  date: string;
  total: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

export default function SalesPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filter, setFilter] = useState<'day' | 'week' | 'month'>('day');
  
  // Simulamos datos de ventas
  const mockSales: Sale[] = [
    {
      id: '1',
      date: '2025-05-20',
      total: 1250.50,
      items: [
        { name: 'Tacos al Pastor', quantity: 30, price: 25 },
        { name: 'Salsa Roja', quantity: 15, price: 10.50 },
      ],
    },
    // ... más ventas
  ];

  const getSalesByDate = (date: Date): Sale[] => {
    return mockSales.filter(sale => {
      const saleDate = new Date(sale.date);
      return saleDate.getDate() === date.getDate() &&
             saleDate.getMonth() === date.getMonth() &&
             saleDate.getFullYear() === date.getFullYear();
    });
  };

  const getTotalSales = (sales: Sale[]) => {
    return sales.reduce((sum, sale) => sum + sale.total, 0);
  };

  const getTopSellingItems = (sales: Sale[]) => {
    const items: Record<string, { count: number; total: number }> = {};
    sales.forEach(sale => {
      sale.items.forEach(item => {
        if (!items[item.name]) {
          items[item.name] = { count: 0, total: 0 };
        }
        items[item.name].count += item.quantity;
        items[item.name].total += item.quantity * item.price;
      });
    });
    return Object.entries(items)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 3);
  };

  return (
    <div className="container py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Reporte de Ventas</h1>
        <div className="flex items-center space-x-4">
          <Button 
            variant={filter === 'day' ? 'contained' : 'outlined'} 
            color={filter === 'day' ? 'primary' : 'secondary'}
            onClick={() => setFilter('day')}
          >
            Hoy
          </Button>
          <Button 
            variant={filter === 'week' ? 'contained' : 'outlined'} 
            color={filter === 'week' ? 'primary' : 'secondary'}
            onClick={() => setFilter('week')}
          >
            Esta Semana
          </Button>
          <Button 
            variant={filter === 'month' ? 'contained' : 'outlined'} 
            color={filter === 'month' ? 'primary' : 'secondary'}
            onClick={() => setFilter('month')}
          >
            Este Mes
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Total de Ventas</h3>
          <p className="text-3xl font-bold text-primary-600">
            ${getTotalSales(getSalesByDate(selectedDate)).toFixed(2)}
          </p>
          <p className="text-gray-600">Ventas del día</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Pedidos</h3>
          <p className="text-3xl font-bold text-primary-600">
            {getSalesByDate(selectedDate).length}
          </p>
          <p className="text-gray-600">Número de pedidos</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Clientes</h3>
          <p className="text-3xl font-bold text-primary-600">
            {Math.floor(Math.random() * 100)}
          </p>
          <p className="text-gray-600">Clientes únicos</p>
        </Card>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Productos Más Vendidos</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {getTopSellingItems(getSalesByDate(selectedDate)).map((item, index) => (
            <Card key={index} className="p-4">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-gray-600">{item.count} vendidos</p>
              <p className="text-primary-600 font-medium">
                ${item.total.toFixed(2)} en ventas
              </p>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Detalles de Ventas</h2>
        <div className="space-y-4">
          {getSalesByDate(selectedDate).map((sale) => (
            <Card key={sale.id} className="p-4">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold">Pedido #{sale.id}</h3>
                <p className="text-primary-600 font-medium">${sale.total.toFixed(2)}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {sale.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span>{item.name}</span>
                    <span>{item.quantity} x ${item.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
