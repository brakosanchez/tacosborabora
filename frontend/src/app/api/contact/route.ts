import { NextResponse } from 'next/server';

// Clave secreta de reCAPTCHA - Reemplaza con tu clave secreta real
const RECAPTCHA_SECRET_KEY = '6LdXk9YpAAAAANjQzJf7QZQZQZQZQZQZQZQZQZQZ';

export async function POST(request: Request) {
  try {
    const { name, email, message, recaptchaToken } = await request.json();

    // Validar que todos los campos estén presentes
    if (!name || !email || !message || !recaptchaToken) {
      return NextResponse.json(
        { message: 'Todos los campos son obligatorios' },
        { status: 400 }
      );
    }

    // Validar el token de reCAPTCHA con Google
    const verificationUrl = 'https://www.google.com/recaptcha/api/siteverify';
    const verificationResponse = await fetch(verificationUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
    });

    const verificationData = await verificationResponse.json();

    // Verificar si la validación de reCAPTCHA fue exitosa
    if (!verificationData.success || verificationData.score < 0.5) {
      console.error('Error en la verificación reCAPTCHA:', verificationData);
      return NextResponse.json(
        { message: 'Error en la verificación de seguridad. Por favor, inténtalo de nuevo.' },
        { status: 400 }
      );
    }

    // Aquí iría la lógica para guardar el mensaje en tu base de datos
    // Por ejemplo, usando Prisma o tu ORM preferido
    // await prisma.contactMessage.create({ data: { name, email, message } });
    
    // Simulamos un guardado exitoso
    console.log('Mensaje recibido:', { name, email, message });

    // Enviar notificación por correo (opcional)
    // await sendEmailNotification(name, email, message);

    return NextResponse.json(
      { message: 'Mensaje enviado con éxito' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al procesar el formulario:', error);
    return NextResponse.json(
      { message: 'Error al procesar el formulario. Por favor, inténtalo de nuevo más tarde.' },
      { status: 500 }
    );
  }
}
