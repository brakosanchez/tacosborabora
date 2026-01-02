import { NextResponse } from 'next/server'

import { getDb } from '@/lib/mongodb'
import { feedbackSchema } from '@/lib/validators/feedback'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = feedbackSchema.safeParse(body)

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

    const result = await db.collection('feedback').insertOne(doc)

    return NextResponse.json(
      { message: 'Feedback guardado', id: result.insertedId.toString() },
      { status: 201 }
    )
  } catch (error) {
    console.error('POST /api/feedback error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
