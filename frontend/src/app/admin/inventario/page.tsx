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

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState<Partial<InventoryItem>>({});
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  useEffect(() => {
    // Aquí iría la lógica para cargar el inventario
    // Por ahora, simulamos con datos estáticos
    const mockInventory: InventoryItem[] = [
      {
        id: '1',
        name: 'Carne de Cerdo',
        description: 'Carne de cerdo para tacos al pastor',
        quantity: 50,
        unit: 'kg',
        minQuantity: 20,
        lastPurchasePrice: 150,
        supplier: 'Granja Local',
        isCritical: false,
      },
      // ... más items
    ];
    setInventory(mockInventory);
  }, []);

  const handleAddItem = async () => {
    // Aquí iría la lógica para agregar un nuevo item
    console.log('Agregando nuevo item:', newItem);
    setIsModalOpen(false);
  };

  const handleUpdateQuantity = async (id: string, newQuantity: number) => {
    // Aquí iría la lógica para actualizar la cantidad
    console.log('Actualizando cantidad:', id, newQuantity);
  };

  const handleEditItem = (item: InventoryItem) => {
    setEditingItem(item);
    setNewItem({ ...item });
    setIsModalOpen(true);
  };

  return (
    <div className="container py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Inventario</h1>
        <Button
          onClick={() => {
            setNewItem({});
            setEditingItem(null);
            setIsModalOpen(true);
          }}
          variant="contained"
          color="primary"
        >
          Agregar Item
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
                <Button variant="outlined" size="small" onClick={() => handleEditItem(item)}>
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
