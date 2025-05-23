'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar el formulario
    console.log('Formulario enviado:', formData);
  };

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Contáctanos</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Información de contacto */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Nuestra Ubicación</h2>
          <p className="mb-4">Calle Alondras #410</p>
          <p className="mb-4">Nextlalpan, Estado de México</p>
          
          <h2 className="text-xl font-semibold mb-4">Horarios</h2>
          <p className="mb-4">Lunes - Domingo</p>
          <p className="mb-4">9:00 AM - 4:00 PM</p>
          
          <h2 className="text-xl font-semibold mb-4">Whatsapp</h2>
          <p className="mb-4">(55) 4965-5305</p>
          
        </Card>

        {/* Formulario de contacto */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Escríbenos</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              label="Nombre"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              type="email"
              label="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <Input
              type="textarea"
              label="Mensaje"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
            />
            <Button type="submit" variant="contained" className="w-full" sx={{ bgcolor: '#FCB235', '&:hover': { bgcolor: '#e6a030' } }}>
              Enviar Mensaje
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
