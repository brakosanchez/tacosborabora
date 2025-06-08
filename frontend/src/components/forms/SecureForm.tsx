import React, { useState, FormEvent, ReactNode } from 'react';
import { validateForm, validateField, sanitizeInput } from '@/utils/formValidation';

interface SecureFormProps {
  children: ReactNode;
  onSubmit: (formData: Record<string, string>) => Promise<void> | void;
  validationRules?: Record<string, ((value: string) => string | null)[]>;
  className?: string;
  id?: string;
}

export const SecureForm: React.FC<SecureFormProps> = ({
  children,
  onSubmit,
  validationRules = {},
  className = '',
  id,
}) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Manejar cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Sanitizar el valor del campo
    const sanitizedValue = sanitizeInput(value);
    
    // Actualizar el estado del formulario
    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue,
    }));
    
    // Validación en tiempo real (solo si hay un error previo para ese campo)
    if (errors[name]) {
      const fieldRules = validationRules[name] || [];
      const error = validateField(name, sanitizedValue, fieldRules);
      
      setErrors(prev => ({
        ...prev,
        [name]: error || '',
      }));
    }
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validar todos los campos
    const formErrors = validateForm(formData, validationRules);
    
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      
      // Llamar a la función onSubmit proporcionada
      await onSubmit(formData);
      
      // Limpiar el formulario y mostrar mensaje de éxito
      setSubmitSuccess(true);
      setFormData({});
      setErrors({});
      
      // Ocultar el mensaje de éxito después de 5 segundos
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
      
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      setSubmitError(
        error instanceof Error 
          ? error.message 
          : 'Ocurrió un error al procesar el formulario. Por favor, inténtalo de nuevo.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clonar los hijos para inyectarles las props necesarias
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      // Solo inyectar props a los elementos de formulario
      if (
        child.type === 'input' ||
        child.type === 'textarea' ||
        child.type === 'select' ||
        child.props.name // Si el componente personalizado tiene una prop 'name'
      ) {
        return React.cloneElement(child as React.ReactElement, {
          value: formData[child.props.name] || '',
          onChange: handleChange,
          error: errors[child.props.name],
          // Pasar cualquier otra prop personalizada
          ...child.props,
        });
      }
    }
    return child;
  });

  return (
    <form 
      onSubmit={handleSubmit} 
      className={`secure-form ${className}`}
      id={id}
      noValidate // Deshabilitar validación HTML5 predeterminada
    >
      {submitError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {submitError}
        </div>
      )}
      
      {submitSuccess && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          ¡Formulario enviado con éxito!
        </div>
      )}
      
      {childrenWithProps}
      
      <div className="mt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? 'Enviando...' : 'Enviar'}
        </button>
      </div>
    </form>
  );
};

// Componente de campo de formulario seguro
export const FormField: React.FC<{
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  className?: string;
  children?: ReactNode;
}> = ({
  name,
  label,
  type = 'text',
  placeholder = '',
  required = false,
  error,
  value = '',
  onChange,
  className = '',
  children,
  ...props
}) => {
  const id = `form-${name}`;
  
  return (
    <div className={`mb-4 ${className}`}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      
      {type === 'textarea' ? (
        <textarea
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
          rows={4}
          {...props}
        />
      ) : type === 'select' && children ? (
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={`mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
          {...props}
        >
          {children}
        </select>
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
          {...props}
        />
      )}
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};
