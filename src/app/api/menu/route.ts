import { NextResponse } from 'next/server'

export async function GET() {
  const menu = [
    {
      id: '1',
      name: 'Taco de Mixiote',
      description: 'Tradicional mixiote de borrego al vapor, con su jugo natural y especias.',
      price: 30,
      category: 'Tacos',
      spicy: false,
      vegetarian: false,
      popular: true,
      image: '/images/menu/tacos/taco-mixiote.webp',
    },
  ]

  return NextResponse.json({ items: menu }, { status: 200 })
}
