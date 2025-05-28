'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';

interface InventoryItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unit: string;
  minQuantity: number;
  lastPurchasePrice: number;
  supplier: string;
  isCritical: boolean;
}

// Simulamos la carga de datos del inventario
async function getInventory() {
  // En una aplicación real, aquí harías una llamada a tu API
  return [
    {
      id: '1',
      name: 'Tortillas',
      description: 'Tortillas de maíz',
      quantity: 50,
      unit: 'kg',
      minQuantity: 10,
      lastPurchasePrice: 25.50,
      supplier: 'Tortillería La Michoacana',
      isCritical: false,
    },
    // Agrega más ítems según sea necesario
  ];
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState<Partial<InventoryItem>>({});
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Cargar los datos del inventario
    const loadInventory = async () => {
      try {
        const data = await getInventory();
        setInventory(data);
      } catch (error) {
        console.error('Error al cargar el inventario:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInventory();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold">Cargando inventario...</div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewItem(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'minQuantity' || name === 'lastPurchasePrice'
        ? parseFloat(value) || 0
        : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      setInventory(inventory.map(item => 
        item.id === editingItem.id ? { ...item, ...newItem } as InventoryItem : item
      ));
      setEditingItem(null);
    } else {
      const newInventoryItem: InventoryItem = {
        id: Math.random().toString(36).substr(2, 9),
        name: newItem.name || '',
        description: newItem.description || '',
        quantity: newItem.quantity || 0,
        unit: newItem.unit || 'unidad',
        minQuantity: newItem.minQuantity || 0,
        lastPurchasePrice: newItem.lastPurchasePrice || 0,
        supplier: newItem.supplier || '',
        isCritical: newItem.isCritical || false,
      };
      setInventory([...inventory, newInventoryItem]);
    }
    setNewItem({});
    setIsModalOpen(false);
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setNewItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este ítem?')) {
      setInventory(inventory.filter(item => item.id !== id));
    }
  };

  const handleUpdateQuantity = async (id: string, newQuantity: number) => {
    setInventory(inventory.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  return (
    <div className="container py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gestión de Inventario</h1>
        <Button onClick={() => {
          setNewItem({});
          setEditingItem(null);
          setIsModalOpen(true);
        }}>
          Agregar Producto
        </Button>
      </div>

      <div className="grid gap-6">
        {inventory.map((item) => (
          <Card key={item.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-gray-600">{item.description}</p>
                <p className="mt-2">
                  Stock: {item.quantity} {item.unit}
                  {item.isCritical && (
                    <span className="ml-2 px-2 py-1 text-xs text-red-800 bg-red-100 rounded-full">
                      Crítico
                    </span>
                  )}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleUpdateQuantity(item.id, Number(e.target.value))}
                  className="w-24"
                />
                <Button variant="outlined" size="small" onClick={() => handleEdit(item)}>
                  Editar
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                >
                  +
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                >
                  -
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Proveedor: {item.supplier}</p>
                <p className="text-sm text-gray-600">
                  Precio Últ. Compra: ${item.lastPurchasePrice.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  Mínimo: {item.minQuantity} {item.unit}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => {
        setIsModalOpen(false);
        setEditingItem(null);
        setNewItem({});
      }} title={editingItem ? 'Editar Item' : 'Agregar Item'}>
        <form onSubmit={(e) => {
          e.preventDefault();
          handleAddItem();
        }} className="space-y-4">
          <Input
            label="Nombre"
            value={newItem.name || ''}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            required
          />
          <Input
            label="Descripción"
            value={newItem.description || ''}
            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Cantidad"
              type="number"
              value={newItem.quantity || ''}
              onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
              required
            />
            <Input
              label="Unidad"
              value={newItem.unit || ''}
              onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
              required
            />
          </div>
          <Button variant="contained" color="primary" type="submit">
            {editingItem ? 'Actualizar' : 'Agregar'} Producto
          </Button>
        </form>
      </Modal>
    </div>
  );
}
