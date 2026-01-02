const clientPromise = Promise.reject(
  new Error('MongoDB no está disponible en el frontend. Usa un backend/API para acceder a la BD.')
);

export default clientPromise;
