'use client'

import { useState } from 'react'
import { Star, Send, CheckCircle, MessageSquare } from 'lucide-react'

export default function FeedbackPage() {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    comment: '',
    visit_date: new Date().toISOString().split('T')[0] // Formato YYYY-MM-DD
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  // Usar ruta relativa que será manejada por el proxy en desarrollo
  const API_URL = '';
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (rating === 0) {
      alert('Por favor selecciona una calificación')
      return
    }

    setIsSubmitting(true)

    try {
      // Asegurarse de que la fecha esté en formato string
      const requestData = {
        ...formData,
        rating,
        visit_date: formData.visit_date, // Ya está en formato YYYY-MM-DD
      };
      
      const apiUrl = '/api/feedback';
      console.log('Enviando datos a:', apiUrl);
      console.log('Datos a enviar:', requestData);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const responseData = await response.json().catch(() => ({}));
      console.log('Respuesta del servidor:', response.status, responseData);

      if (!response.ok) {
        throw new Error(responseData.detail || 'Error al enviar el feedback');
      }

      console.log('✅ Feedback enviado con éxito');
      setIsSubmitted(true);
      setFormData(prev => ({
        ...prev,
        name: '',
        email: '',
        comment: ''
      }));
      setRating(0);
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      console.error('Error al enviar feedback:', error)
      console.error('Error al enviar feedback:', error);
      // Mostrar mensaje de error al usuario
      alert('Error al enviar el feedback. Por favor, inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false)
    }
  }

  const ratingLabels = [
    'Muy malo',
    'Malo',
    'Regular',
    'Bueno',
    'Excelente'
  ]

  return (
    <div 
      className="pt-20 min-h-screen relative"
      style={{
        backgroundImage: "url('/images/patterns/patronweb.svg')",
        backgroundRepeat: 'repeat',
        backgroundSize: '200px',
        backgroundColor: '#000'
      }}
    >
      {/* Black Overlay */}
      <div className="absolute inset-0 bg-black opacity-60 pointer-events-none"></div>
      
      <div className="container-bora py-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 fade-in">
          <h1 className="font-bebas text-6xl md:text-7xl mb-4">
            <span className="text-fire glow-title">TU OPINIÓN IMPORTA</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Ayúdanos a mejorar compartiendo tu experiencia en Tacos Bora Bora. 
            Tu feedback es fundamental para seguir creciendo.
          </p>
          <div className="divider-tropical"></div>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Success Message */}
          {isSubmitted && (
            <div className="card-tropical bg-green-600/20 border-green-600 mb-8 fade-in">
              <div className="flex items-center gap-4">
                <CheckCircle className="w-12 h-12 text-green-500 flex-shrink-0" />
                <div>
                  <h3 className="font-bebas text-2xl text-green-500 mb-2 glow-title">
                    ¡GRACIAS POR TU FEEDBACK!
                  </h3>
                  <p className="text-gray-300">
                    Tu opinión ha sido registrada exitosamente. Valoramos mucho tu tiempo 
                    y tus comentarios nos ayudan a mejorar cada día.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Feedback Form */}
          <div className="card-tropical">
            <div className="flex items-center gap-3 mb-6">
              <MessageSquare className="w-8 h-8 text-bora-yellow" />
              <h2 className="font-bebas text-3xl text-bora-yellow glow-title">
                CUÉNTANOS TU EXPERIENCIA
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Rating Section */}
              <div className="bg-bora-brown/30 rounded-lg p-6 border border-bora-yellow/20">
                <label className="block text-bora-yellow mb-4 font-medium text-lg">
                  ¿Cómo calificarías tu experiencia? *
                </label>
                <div className="flex flex-col items-center gap-4">
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="transition-all duration-200 transform hover:scale-110"
                      >
                        <Star
                          className={`w-12 h-12 ${
                            star <= (hoveredRating || rating)
                              ? 'fill-bora-yellow text-bora-yellow'
                              : 'text-gray-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  {(hoveredRating || rating) > 0 && (
                    <p className="text-bora-orange font-medium text-lg">
                      {ratingLabels[(hoveredRating || rating) - 1]}
                    </p>
                  )}
                </div>
              </div>

              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-bora-yellow mb-2 font-medium">
                  Nombre *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input-bora"
                  placeholder="Tu nombre"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-bora-yellow mb-2 font-medium">
                  Email (opcional)
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-bora"
                  placeholder="tu@email.com"
                />
                <p className="text-gray-400 text-sm mt-1">
                  Solo si deseas que te contactemos para seguimiento
                </p>
              </div>

              {/* Visit Date */}
              <div>
                <label htmlFor="visitDate" className="block text-bora-yellow mb-2 font-medium">
                  Fecha de tu visita (opcional)
                </label>
                <input
                  type="date"
                  id="visit_date"
                  name="visit_date"
                  value={formData.visit_date}
                  onChange={handleChange}
                  className="input-bora w-full"
                  required
                />
              </div>

              {/* Comment */}
              <div>
                <label htmlFor="comment" className="block text-bora-yellow mb-2 font-medium">
                  Cuéntanos más sobre tu experiencia *
                </label>
                <textarea
                  id="comment"
                  name="comment"
                  value={formData.comment}
                  onChange={handleChange}
                  required
                  className="textarea-bora"
                  placeholder="¿Qué te gustó? ¿Qué podríamos mejorar? Tus comentarios son muy valiosos para nosotros..."
                  rows={6}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full flex items-center justify-center gap-2 text-lg"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-bora-brown"></div>
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Enviar Feedback
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="card-tropical text-center">
              <div className="text-4xl mb-3">💬</div>
              <h3 className="font-bebas text-xl text-bora-yellow mb-2 glow-title">
                TU VOZ CUENTA
              </h3>
              <p className="text-gray-300 text-sm">
                Cada comentario es leído y considerado por nuestro equipo para mejorar continuamente
              </p>
            </div>

            <div className="card-tropical text-center">
              <div className="text-4xl mb-3">🎁</div>
              <h3 className="font-bebas text-xl text-bora-yellow mb-2 glow-title">
                RECOMPENSAS
              </h3>
              <p className="text-gray-300 text-sm">
                Los clientes que dejan feedback pueden recibir promociones especiales
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="card-tropical mt-8 bg-bora-brown/20">
            <h3 className="font-bebas text-2xl text-bora-yellow mb-4 text-center glow-title">
              OTRAS FORMAS DE CONTACTARNOS
            </h3>
            <div className="text-center space-y-3">
              <p className="text-gray-300">
                ¿Prefieres hablar directamente con nosotros?
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://wa.me/1234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary inline-flex items-center justify-center"
                >
                  WhatsApp
                </a>
                <a
                  href="/contacto"
                  className="btn-outline inline-flex items-center justify-center"
                >
                  Formulario de Contacto
                </a>
              </div>
            </div>
          </div>

          {/* Privacy Note */}
          <p className="text-gray-400 text-sm text-center mt-6">
            Tu información será tratada de forma confidencial y solo será utilizada 
            para mejorar nuestros servicios. No compartiremos tus datos con terceros.
          </p>
        </div>
      </div>
    </div>
  )
}
