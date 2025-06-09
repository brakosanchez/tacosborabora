'use client';

import Card from '@/components/ui/Card';
import dynamic from 'next/dynamic';

// Importar el formulario de contacto con carga dinámica para evitar problemas con reCAPTCHA
const ContactForm = dynamic(() => import('@/components/ContactForm'), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse space-y-6">
      <div className="h-4 bg-white/10 rounded w-3/4"></div>
      <div className="h-12 bg-white/10 rounded"></div>
      <div className="h-4 bg-white/10 rounded w-1/2"></div>
      <div className="h-12 bg-white/10 rounded"></div>
      <div className="h-4 bg-white/10 rounded w-2/3"></div>
      <div className="h-32 bg-white/10 rounded"></div>
      <div className="h-12 bg-yellow-500/50 rounded"></div>
    </div>
  ),
});

export default function ContactPage() {
  const mapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3756.123456789012!2d-99.12345678901234!3d19.123456789012345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85ce0123456789ab%3A0x1234567890abcdef!2sAlondras%20410%2C%20Los%20Aguiluchos%2C%2055796%20Nextlalpan%2C%20M%C3%A9x.!5e0!3m2!1ses!2smx!4v1234567890123!5m2!1ses!2smx";

  return (
    <div className="min-h-screen pt-32 pb-12 relative">
      {/* Fondo con overlay */}
      <div className="absolute inset-0 -z-10" style={{
        backgroundImage: "url('/fondos/fondoelegante7.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}></div>
      <div className="absolute inset-0 -z-10 bg-black/60"></div>

      <div className="container mx-auto px-4 relative">
        <h1 className="text-4xl md:text-5xl font-bebas text-yellow-400 text-center mb-12">
          Contáctanos
        </h1>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Información de contacto */}
          <Card className="p-6 bg-white/5 backdrop-blur-sm border border-white/10">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bebas text-yellow-400 mb-4">Nuestra Ubicación</h2>
                <div className="space-y-2 text-white/90">
                  <p className="flex items-start">
                    <svg className="w-5 h-5 mr-2 mt-0.5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Alondras #410, Los Aguiluchos
                  </p>
                  <p className="pl-7">Nextlalpan, Estado de México</p>
                  <p className="pl-7">CP 55796</p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bebas text-yellow-400 mb-4">Horarios</h2>
                <div className="flex items-center text-white/90">
                  <svg className="w-5 h-5 mr-2 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p>Lunes - Domingo</p>
                    <p>9:00 AM - 4:00 PM</p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bebas text-yellow-400 mb-4">Whatsapp</h2>
                <a 
                  href="https://wa.me/525549655305" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-white/90 hover:text-yellow-400 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2 text-yellow-400" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.966-.273-.099-.471-.148-.67.15-.197.297-.767.963-.94 1.16-.173.199-.347.222-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.795-1.484-1.781-1.66-2.079-.173-.298-.018-.46.13-.606.136-.129.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.345m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.359-.214-3.741.982.998-3.648-.235-.375a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.549 4.142 1.595 5.945L0 24l6.335-1.652a11.882 11.882 0 005.723 1.467h.005c6.554 0 11.89-5.335 11.89-11.893 0-3.18-1.258-6.196-3.544-8.488"/>
                  </svg>
                  (55) 4965-5305
                </a>
              </div>
            </div>
          </Card>

          {/* Mapa de Google Maps */}
          <div className="lg:col-span-2 h-96 md:h-auto rounded-xl overflow-hidden shadow-xl">
            <iframe
              src={mapUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full min-h-[400px]"
              title="Ubicación de Tacos Bora Bora"
            ></iframe>
          </div>
        </div>

        {/* Formulario de contacto */}
        <div className="max-w-3xl mx-auto">
          <Card className="p-6 md:p-8 bg-white/5 backdrop-blur-sm border border-white/10">
            <h2 className="text-2xl md:text-3xl font-bebas text-yellow-400 text-center mb-8">
              Escríbenos
            </h2>
            <ContactForm />
          </Card>
        </div>
      </div>
    </div>
  );
}
