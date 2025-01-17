'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import ThemeToggle from '@/components/theme-toggle';

export default function Home() {
  const [sku, setSku] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  interface Venta {
    id: number;
    nombre: string;
    precio: number;
    fecha: string;
  }

  const [ventas, setVentas] = useState<Venta[]>([]);

  const cargarVentas = async () => {
    try {
      const ventasResponse = await fetch('/api/ventas');
      if (!ventasResponse.ok) {
        toast.error('Error al cargar las ventas');
        return;
      }
      const nuevasVentas = await ventasResponse.json();
      setVentas(nuevasVentas);
    } catch (error) {
      console.error('Error al cargar ventas:', error);
      toast.error('Error al cargar las ventas');
    }
  };

  useEffect(() => {
    cargarVentas();
  }, []);

  const handleSkuSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true); // Activar spinner

    if (!sku.trim()) {
      toast.error('Por favor ingrese un SKU');
      setIsLoading(false); // Desactivar spinner
      return;
    }

    try {
      const response = await fetch(`/api/productos/${sku}`);
      if (!response.ok) {
        const error = await response.json();
        toast.error(error.message || 'Error al buscar producto');
        setIsLoading(false); // Desactivar spinner
        return;
      }

      const producto = await response.json();

      // Registrar la venta
      const ventaResponse = await fetch('/api/ventas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sku: producto.sku,
          nombre: producto.nombre,
          precio: producto.precio
        })
      });

      if (!ventaResponse.ok) {
        const error = await ventaResponse.json();
        toast.error(error.message || 'Error al registrar la venta');
        setIsLoading(false); // Desactivar spinner
        return;
      }

      toast.success('Venta registrada exitosamente');

      // Cargar las ventas actualizadas
      await cargarVentas();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al procesar la solicitud');
    }

    setIsLoading(false); // Desactivar spinner
    setSku('');
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="p-6 mb-2">
        <form onSubmit={handleSkuSubmit} className="space-y-4">
          <div className="flex gap-4">
            <Input
              type="text"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              placeholder="Escanea el SKU del producto"
              className="flex-1"
              autoFocus
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading} className="w-32">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Buscando
                </>
              ) : (
                'Buscar'
              )}
            </Button>
          </div>
        </form>

        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4 text-center">Últimas ventas</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Id</TableHead>
                <TableHead>Producto</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Fecha</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ventas.map((venta) => (
                <TableRow key={venta.id}>
                  <TableCell>{venta.id}</TableCell>
                  <TableCell>{venta.nombre}</TableCell>
                  <TableCell>
                    $
                    {venta.precio.toLocaleString('es-CO', {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    })}
                  </TableCell>

                  <TableCell>{venta.fecha}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
      <div className="flex justify-end">
        <ThemeToggle />
      </div>
    </div>
  );
}
