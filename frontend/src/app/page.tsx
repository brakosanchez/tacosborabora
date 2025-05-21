import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="relative h-screen">
        {/* Hero Section */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-400">
          <div className="relative h-full flex flex-col justify-center items-center text-center">
            <h1 className="text-5xl font-bold text-white mb-4">
              Tacos Bora Bora
            </h1>
            <p className="text-xl text-white/90 mb-8">
              La auténtica experiencia mexicana en cada bocado
            </p>
            <Link
              href="/menu"
              className="btn btn-primary px-8 py-3 text-lg"
            >
              Ver Menú
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">
            ¿Por qué elegirnos?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Ingredientes frescos</h3>
              <p className="text-gray-600">Solo usamos los mejores ingredientes frescos y de calidad.</p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Servicio rápido</h3>
              <p className="text-gray-600">Pedidos rápidos y entrega a domicilio disponible.</p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Ambiente familiar</h3>
              <p className="text-gray-600">Un lugar acogedor para disfrutar con amigos y familia.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
