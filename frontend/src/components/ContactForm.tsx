'use client';

import { useState } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { toast } from 'react-hot-toast';
import Button from './ui/Button';
import Input from './ui/Input';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!executeRecaptcha) {
      toast.error('No se pudo cargar reCAPTCHA. Por favor, recarga la página.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Obtener el token de reCAPTCHA
      const token = await executeRecaptcha('contact_form_submit');
      
      // Validar el token con tu backend
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          recaptchaToken: token,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.');
        setFormData({ name: '', email: '', message: '' });
      } else {
        throw new Error(data.message || 'Error al enviar el mensaje');
      }
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      toast.error(error instanceof Error ? error.message : 'Error al enviar el mensaje. Por favor, inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-white/90 mb-2">Nombre</label>
          <Input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-yellow-400 focus:ring-yellow-400"
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-white/90 mb-2">Email</label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-yellow-400 focus:ring-yellow-400"
            disabled={isSubmitting}
          />
        </div>
      </div>
      <div>
        <label htmlFor="message" className="block text-white/90 mb-2">Mensaje</label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={5}
          className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-yellow-400 focus:ring-yellow-400 focus:ring-1 focus:outline-none transition-colors"
          placeholder="¿En qué podemos ayudarte?"
          disabled={isSubmitting}
        ></textarea>
      </div>
      <div className="text-center">
        <Button 
          type="submit" 
          variant="contained" 
          className="w-full md:w-auto px-8 py-3 text-lg font-medium bg-yellow-500 hover:bg-yellow-600 text-dark-brown transition-colors shadow-lg hover:shadow-yellow-500/20"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
        </Button>
      </div>
    </form>
  );
}
