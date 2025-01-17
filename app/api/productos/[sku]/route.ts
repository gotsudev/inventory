import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { sku: string } }
) {
  try {
    // Asegurarnos de que params.sku existe
    if (!params?.sku) {
      return NextResponse.json(
        { message: 'SKU es requerido' },
        { status: 400 }
      );
    }

    const sku = params.sku;

    const producto = await prisma.producto.findUnique({
      where: {
        sku: sku
      }
    });

    if (!producto) {
      return NextResponse.json(
        { message: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(producto);
  } catch (error) {
    console.error('Error al buscar producto:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
