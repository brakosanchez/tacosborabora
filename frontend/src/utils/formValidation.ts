/**
 * Utilidades para validación de formularios en el frontend
 */

// Tipos para validación
type ValidationRule = (value: string) => string | null;
type ValidationRules = Record<string, ValidationRule[]>;

/**
 * Validaciones comunes
 */
export const validations = {
  required: (fieldName: string): ValidationRule => (value: string) => 
    value.trim() === '' ? `${fieldName} es obligatorio` : null,
  
  minLength: (min: number, fieldName: string): ValidationRule => (value: string) => 
    value.length < min ? `${fieldName} debe tener al menos ${min} caracteres` : null,
  
  maxLength: (max: number, fieldName: string): ValidationRule => (value: string) => 
    value.length > max ? `${fieldName} no debe exceder ${max} caracteres` : null,
  
  email: (value: string): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) ? null : 'Correo electrónico no válido';
  },
  
  phone: (value: string): string | null => {
    const phoneRegex = /^[0-9+\-\s()]{10,20}$/;
    return phoneRegex.test(value) ? null : 'Número de teléfono no válido';
  },
  
  numeric: (value: string): string | null => {
    const numericRegex = /^\d+$/;
    return numericRegex.test(value) ? null : 'Solo se permiten números';
  },
  
  noSpecialChars: (value: string): string | null => {
    const specialCharsRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]+/;
    return specialCharsRegex.test(value) ? 'No se permiten caracteres especiales' : null;
  },
  
  noHtmlTags: (value: string): string | null => {
    const htmlRegex = /<[a-z][\s\S]*>/i;
    return htmlRegex.test(value) ? 'No se permiten etiquetas HTML' : null;
  },
  
  // Validación personalizada para contraseñas seguras
  strongPassword: (value: string): string | null => {
    if (value.length < 8) return 'La contraseña debe tener al menos 8 caracteres';
    if (!/[a-z]/.test(value)) return 'La contraseña debe contener al menos una letra minúscula';
    if (!/[A-Z]/.test(value)) return 'La contraseña debe contener al menos una letra mayúscula';
    if (!/[0-9]/.test(value)) return 'La contraseña debe contener al menos un número';
    if (!/[^A-Za-z0-9]/.test(value)) return 'La contraseña debe contener al menos un carácter especial';
    return null;
  }
};

/**
 * Valida un formulario completo
 * @param formData Objeto con los datos del formulario
 * @param rules Reglas de validación para cada campo
 * @returns Objeto con los errores de validación
 */
export const validateForm = (
  formData: Record<string, string>,
  rules: Record<string, ValidationRule[]>
): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  Object.entries(rules).forEach(([fieldName, fieldRules]) => {
    const value = formData[fieldName] || '';
    
    for (const rule of fieldRules) {
      const error = rule(value);
      if (error) {
        errors[fieldName] = error;
        break; // Solo mostrar un error por campo
      }
    }
  });
  
  return errors;
};

/**
 * Valida un campo individual
 * @param fieldName Nombre del campo
 * @param value Valor del campo
 * @param rules Reglas de validación para el campo
 * @returns Mensaje de error o null si es válido
 */
export const validateField = (
  fieldName: string,
  value: string,
  rules: ValidationRule[]
): string | null => {
  for (const rule of rules) {
    const error = rule(value);
    if (error) return error;
  }
  return null;
};

/**
 * Limpia y sanitiza el valor de un campo
 * @param value Valor a sanitizar
 * @returns Valor sanitizado
 */
export const sanitizeInput = (value: string): string => {
  // Eliminar espacios en blanco al inicio y final
  let sanitized = value.trim();
  
  // Reemplazar múltiples espacios por uno solo
  sanitized = sanitized.replace(/\s+/g, ' ');
  
  // Eliminar etiquetas HTML/JavaScript
  sanitized = sanitized.replace(/<[^>]*>?/gm, '');
  
  return sanitized;
};

/**
 * Agrega protección CSRF a las solicitudes fetch
 * @param url URL de la solicitud
 * @param options Opciones de fetch
 * @returns Promesa con la respuesta
 */
export const secureFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  // Obtener el token CSRF de las cookies
  const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  };
  
  const csrfToken = getCookie('csrftoken');
  
  // Configurar headers por defecto
  const headers = new Headers(options.headers);
  
  // Agregar token CSRF si existe
  if (csrfToken) {
    headers.set('X-CSRF-Token', csrfToken);
  }
  
  // Agregar headers de seguridad
  headers.set('Content-Type', 'application/json');
  headers.set('X-Requested-With', 'XMLHttpRequest');
  
  // Realizar la solicitud con los headers seguros
  return fetch(url, {
    ...options,
    headers,
    credentials: 'same-origin', // Incluir cookies en la solicitud
  });
};

/**
 * Inicializa la protección CSRF
 * Debe llamarse al cargar la aplicación
 */
export const initializeCsrfProtection = async (): Promise<void> => {
  try {
    // Obtener un token CSRF del servidor
    await fetch('/api/csrf-token', {
      method: 'GET',
      credentials: 'include',
    });
  } catch (error) {
    console.error('Error al inicializar protección CSRF:', error);
  }
};
