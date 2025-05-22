'use client';

import { useState, useEffect } from 'react';
import { useCart } from '../../components/Cart';
import axios from 'axios';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  ingredients: string[];
}

export default function MenuPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${process.env.API_URL}/api/menu/products`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
    });
  };

  if (loading) {
    return (
      <div className="container py-12">
        <div className="text-center">
          <p className="text-gray-600">Cargando menú...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Nuestro Menú</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="p-6">
            <div className="relative aspect-square mb-4">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            
            <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <p className="text-primary-600 font-semibold mb-4">
              ${product.price.toFixed(2)}
            </p>
            
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {product.ingredients.join(', ')}
              </div>
              <Button
                onClick={() => handleAddToCart(product)}
                variant="primary"
              >
                Agregar al Carrito
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
