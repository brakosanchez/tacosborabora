import { NextResponse } from 'next/server'

import { getDb } from '@/lib/mongodb'
import { contactoSchema } from '@/lib/validators/contacto'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = contactoSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const db = await getDb()
    const doc = {
      ...parsed.data,
      createdAt: new Date(),
    }

    const result = await db.collection('contacto').insertOne(doc)

    return NextResponse.json(
      { message: 'Mensaje guardado', id: result.insertedId.toString() },
      { status: 201 }
    )
  } catch (error) {
    console.error('POST /api/contact error:', error)
    const detail = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      {
        error: 'Error interno del servidor',
        ...(process.env.NODE_ENV !== 'production' ? { detail } : {}),
      },
      { status: 500 }
    )
  }
}
