'use client'

import { useState } from 'react'
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaInstagram, FaPaperPlane, FaCheckCircle } from 'react-icons/fa'
import { motion } from 'framer-motion'

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validación simple
    if (!formData.name.trim() || !formData.email || !formData.phone || !formData.message) {
      setError('Por favor completa todos los campos')
      return
    }
    
    setIsSubmitting(true)
    setError('')

    try {
      // Usar ruta relativa que será manejada por el proxy en desarrollo
      const apiUrl = '/api/contact';
      const requestData = {
        ...formData,
        source: 'contacto',
        timestamp: new Date().toISOString()
      };
      
      console.log('Enviando a:', apiUrl);
      console.log('Datos:', requestData);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      })

      const responseData = await response.json();
      console.log('Respuesta del servidor:', responseData);
      
      if (!response.ok) {
        throw new Error(responseData.detail || 'Error al enviar el mensaje');
      }

      setIsSubmitted(true)
      setFormData({ name: '', email: '', phone: '', message: '' })
    } catch (err) {
      console.error('Error:', err)
      setError('Error al enviar el mensaje. Por favor inténtalo de nuevo más tarde.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-bora-yellow/20"
        >
          <div className="flex justify-center mb-6">
            <FaCheckCircle className="text-6xl text-bora-yellow" />
          </div>
          <h1 className="text-4xl font-bebas text-bora-yellow mb-3 tracking-wider glow-title">¡MENSAJE ENVIADO!</h1>
          <p className="text-gray-300 mb-8 font-unbounded">Gracias por contactarnos. Hemos recibido tu mensaje y te responderemos a la brevedad.</p>
          <button
            onClick={() => {
              setIsSubmitted(false)
              setFormData({ name: '', email: '', phone: '', message: '' })
            }}
            className="w-full bg-gradient-to-r from-bora-yellow to-bora-orange text-gray-900 py-3 px-6 rounded-full font-bebas text-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
          >
            ENVIAR OTRO MENSAJE
          </button>
          
          <div className="mt-8 pt-6 border-t border-bora-yellow/20">
            <p className="text-bora-yellow text-sm font-unbounded">O visítanos en nuestras redes sociales</p>
            <div className="flex justify-center gap-4 mt-4">
              <a 
                href="https://instagram.com/tacosborabora" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-bora-yellow hover:text-bora-orange text-2xl transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative">
      {/* Fondo con patrón y overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/patterns/patronweb.svg')",
          backgroundSize: '200px',
          backgroundRepeat: 'repeat',
          backgroundPosition: 'center',
          backgroundColor: '#000'
        }}
      >
        <div className="absolute inset-0 bg-black/70"></div>
      </div>
      
      {/* Contenido principal */}
      <div className="relative z-10 pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-7xl font-bebas text-bora-yellow mb-6 tracking-wider glow-title">CONTÁCTANOS</h1>
            <div className="divider-tropical my-8"></div>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto font-unbounded">
            ¿Tienes alguna pregunta o comentario? Estamos aquí para ayudarte. 
            Escríbenos y te responderemos lo antes posible.
          </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8">
            {/* Primera fila: Formulario e Información de contacto */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Sección del Formulario */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="bg-black/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-bora-yellow/20 hover:border-bora-yellow/40 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-6">
                  <FaPaperPlane className="w-6 h-6 text-bora-yellow" />
                  <h2 className="text-3xl font-bebas text-bora-yellow tracking-wider glow-title">ENVÍANOS UN MENSAJE</h2>
                </div>
                
                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
                    <p>{error}</p>
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-bora-yellow mb-2 font-medium font-unbounded">
                      Nombre completo <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="input-bora w-full px-4 py-3 border border-bora-yellow/30 rounded-lg focus:ring-2 focus:ring-bora-yellow focus:border-bora-yellow transition duration-200 bg-black/40 text-white placeholder-gray-400 font-sans"
                      placeholder="Tu nombre"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="email" className="block text-bora-yellow mb-2 font-medium font-unbounded">
                        Correo electrónico <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="input-bora w-full px-4 py-3 border border-bora-yellow/30 rounded-lg focus:ring-2 focus:ring-bora-yellow focus:border-bora-yellow transition duration-200 bg-black/40 text-white placeholder-gray-400 font-sans"
                        placeholder="tucorreo@ejemplo.com"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-bora-yellow mb-2 font-medium font-unbounded">
                        Teléfono <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="input-bora w-full px-4 py-3 border border-bora-yellow/30 rounded-lg focus:ring-2 focus:ring-bora-yellow focus:border-bora-yellow transition duration-200 bg-black/40 text-white placeholder-gray-400 font-sans"
                        placeholder="55 1234 5678"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-bora-yellow mb-2 font-medium font-unbounded">
                      Mensaje <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      className="input-bora w-full px-4 py-3 border border-bora-yellow/30 rounded-lg focus:ring-2 focus:ring-bora-yellow focus:border-bora-yellow transition duration-200 bg-black/40 text-white placeholder-gray-400 font-sans"
                      placeholder="¿En qué podemos ayudarte?"
                      required
                    ></textarea>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex justify-center items-center py-3 px-6 border border-transparent rounded-full text-gray-900 font-unbounded font-semibold text-lg bg-gradient-to-r from-bora-yellow to-bora-orange hover:from-bora-yellow/90 hover:to-bora-orange/90 transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bora-yellow shadow-md hover:shadow-lg"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Enviando...
                        </>
                      ) : (
                        <>
                          <FaPaperPlane className="mr-2" />
                          Enviar Mensaje
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>

              {/* Sección de Información de Contacto */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="bg-black/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-bora-yellow/20 hover:border-bora-yellow/40 transition-all duration-300"
              >
                <h2 className="text-3xl font-bebas text-bora-yellow tracking-wider mb-8 glow-title text-center">INFORMACIÓN DE CONTACTO</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Dirección */}
                  <div className="p-6 bg-black/60 rounded-xl border border-bora-yellow/20 hover:border-bora-yellow/40 transition-all duration-300">
                    <div className="w-14 h-14 bg-bora-yellow/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-bora-yellow/20">
                      <FaMapMarkerAlt className="h-6 w-6 text-bora-yellow" />
                    </div>
                    <h3 className="text-xl font-bebas text-bora-yellow text-center mb-3 glow-title">DIRECCIÓN</h3>
                    <p className="text-gray-200 text-center font-unbounded leading-relaxed text-sm">
                      Alondras 410, Los Aguiluchos<br />
                      Nextlalpan, Estado de México<br />
                      C.P. 55796
                    </p>
                  </div>
                  
                  {/* Teléfono */}
                  <div className="p-6 bg-black/60 rounded-xl border border-bora-yellow/20 hover:border-bora-yellow/40 transition-all duration-300">
                    <div className="w-14 h-14 bg-bora-yellow/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-bora-yellow/20">
                      <FaPhone className="h-6 w-6 text-bora-yellow" />
                    </div>
                    <h3 className="text-xl font-bebas text-bora-yellow text-center mb-3 glow-title">TELÉFONO</h3>
                    <p className="text-center">
                      <a 
                        href="tel:+525549655305" 
                        className="text-bora-yellow hover:text-bora-orange transition-colors font-unbounded text-base block"
                      >
                        +52 55 4965 5305
                      </a>
                    </p>
                  </div>
                  
                  {/* Correo */}
                  <div className="p-6 bg-black/60 rounded-xl border border-bora-yellow/20 hover:border-bora-yellow/40 transition-all duration-300">
                    <div className="w-14 h-14 bg-bora-yellow/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-bora-yellow/20">
                      <FaEnvelope className="h-6 w-6 text-bora-yellow" />
                    </div>
                    <h3 className="text-xl font-bebas text-bora-yellow text-center mb-3 glow-title">CORREO</h3>
                    <p className="text-center">
                      <a 
                        href="mailto:tacosborabora@gmail.com" 
                        className="text-bora-yellow hover:text-bora-orange transition-colors font-unbounded text-sm block"
                      >
                        tacosborabora@gmail.com
                      </a>
                    </p>
                  </div>
                  
                  {/* Redes Sociales */}
                  <div className="p-6 bg-black/60 rounded-xl border border-bora-yellow/20 hover:border-bora-yellow/40 transition-all duration-300">
                    <div className="w-14 h-14 bg-bora-yellow/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-bora-yellow/20">
                      <FaInstagram className="h-6 w-6 text-bora-yellow" />
                    </div>
                    <h3 className="text-xl font-bebas text-bora-yellow text-center mb-3 glow-title">SÍGUENOS</h3>
                    <p className="text-center">
                      <a 
                        href="https://instagram.com/tacosborabora" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-bora-yellow hover:text-bora-orange transition-colors font-unbounded text-base block"
                      >
                        @tacosborabora
                      </a>
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Segunda fila: Mapa */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="bg-black/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl overflow-hidden border border-bora-yellow/20 hover:border-bora-yellow/40 transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                <h3 className="text-2xl font-bebas text-bora-yellow tracking-wider glow-title">UBICACIÓN</h3>
                <div className="text-sm text-bora-yellow/80 font-unbounded text-center md:text-right">
                  <p>Lunes a Viernes: 11:00 AM - 4:00 PM</p>
                  <p>Sábado y Domingo: 9:00 AM - 4:00 PM</p>
                </div>
              </div>
              <div className="h-[600px] rounded-lg overflow-hidden">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3755.707934412246!2d-99.09335459267035!3d19.72505493692606!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d18dfc827df46b%3A0x82a71a9b70d60acc!2sTacos%20Bora%20Bora!5e0!3m2!1ses-419!2smx!4v1761720437200" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicación de Tacos Bora Bora"
                  className="rounded-lg"
                ></iframe>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
