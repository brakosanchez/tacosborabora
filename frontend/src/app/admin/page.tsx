import { Card } from '@/components/ui/Card';

export default function AdminPage() {
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Panel de Administración</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Pedidos Pendientes</h2>
          <p className="text-3xl font-bold text-primary-600">12</p>
          <p className="text-gray-600">Nuevos pedidos en los últimos 24 horas</p>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Inventario Bajo</h2>
          <p className="text-3xl font-bold text-primary-600">5</p>
          <p className="text-gray-600">Productos que necesitan reabastecimiento</p>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Ventas del Día</h2>
          <p className="text-3xl font-bold text-primary-600">$1,250.00</p>
          <p className="text-gray-600">Total de ventas en el día</p>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Clientes Activos</h2>
          <p className="text-3xl font-bold text-primary-600">250</p>
          <p className="text-gray-600">Clientes únicos en los últimos 30 días</p>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Calificaciones</h2>
          <p className="text-3xl font-bold text-primary-600">4.8/5</p>
          <p className="text-gray-600">Promedio de calificaciones</p>
        </Card>
      </div>
    </div>
  );
}
