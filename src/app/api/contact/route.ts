import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.json();
    
    // Aquí podrías agregar validación de los datos del formulario
    if (!formData.name || !formData.email || !formData.message) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    // Aquí iría la lógica para enviar el correo o guardar en la base de datos
    // Por ahora, solo simulamos un envío exitoso
    console.log('Datos del formulario recibidos:', formData);

    // Simulamos un retraso de red
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json(
      { message: 'Mensaje enviado con éxito' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al procesar el formulario:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
