import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const ventas = await prisma.venta.findMany({
      orderBy: {
        fecha: 'desc'
      },
      take: 10
    });
    return NextResponse.json(ventas);
  } catch (error) {
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sku, nombre, precio } = body;

    const venta = await prisma.venta.create({
      data: {
        sku,
        nombre,
        precio
      }
    });

    return NextResponse.json(venta, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
