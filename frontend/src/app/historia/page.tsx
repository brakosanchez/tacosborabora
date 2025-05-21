export default function HistoryPage() {
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Nuestra Historia</h1>

      <div className="space-y-8">
        {/* Sección de historia */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Nuestra Pasión por los Tacos</h2>
            <p className="text-gray-600">
              Todo comenzó hace más de 30 años cuando Don Juan, un apasionado de la cocina mexicana,
              decidió compartir sus recetas familiares con el mundo. Desde entonces, hemos crecido
              manteniendo la esencia de nuestros orígenes y la calidad de nuestros ingredientes.
            </p>
            <p className="text-gray-600">
              Nuestros tacos son preparados con los ingredientes más frescos y de la mejor calidad,
              siguiendo recetas tradicionales que han sido perfeccionadas a lo largo de generaciones.
            </p>
          </div>
          <div className="relative aspect-video">
            <img
              src="/images/historia.jpg"
              alt="Historia de Tacos Bora Bora"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>

        {/* Sección de valores */}
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Calidad</h3>
            <p className="text-gray-600">
              Solo usamos ingredientes frescos y de la mejor calidad para garantizar la autenticidad
              de nuestros tacos.
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Tradición</h3>
            <p className="text-gray-600">
              Nuestras recetas son herencia de generaciones de cocineros mexicanos que han perfeccionado
              sus técnicas a lo largo de años.
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Servicio</h3>
            <p className="text-gray-600">
              Nuestro equipo está comprometido en brindar un servicio excepcional y hacer que tu experiencia
              sea inolvidable.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
