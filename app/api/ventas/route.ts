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

    // Formatear la fecha en el servidor
    const ventasFormateadas = ventas.map((venta) => ({
      ...venta,
      fecha: new Date(venta.fecha).toLocaleString('es-CO', {
        timeZone: 'America/Bogota'
      })
    }));

    return NextResponse.json(ventasFormateadas);
  } catch {
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

    // Formatear la fecha en el servidor
    const ventaFormateada = {
      ...venta,
      fecha: new Date(venta.fecha).toLocaleString('es-CO', {
        timeZone: 'America/Bogota'
      })
    };

    return NextResponse.json(ventaFormateada, { status: 201 });
  } catch {
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
