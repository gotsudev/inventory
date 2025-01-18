'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

import ThemeToggle from '@/components/theme-toggle';
import AlertDialogComponent from '@/components/alert-dialog';

export default function Home() {
  const { status } = useSession(); // Elimina 'session' si no la necesitas
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
    } catch {
      toast.error('Error al cargar las ventas');
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      cargarVentas();
    } else if (status === 'unauthenticated') {
      signIn();
    }
  }, [status]);

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
    } catch {
      toast.error('Error al procesar la solicitud');
    }

    setIsLoading(false); // Desactivar spinner
    setSku('');
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [ventaIdToDelete, setVentaIdToDelete] = useState<number | null>(null);
  const handleDeleteClick = (id: number) => {
    setVentaIdToDelete(id);
    setIsDialogOpen(true);
  };
  const handleConfirmDelete = async () => {
    if (ventaIdToDelete !== null) {
      try {
        const response = await fetch(`/api/ventas?id=${ventaIdToDelete}`, {
          method: 'DELETE'
        });
        if (!response.ok) {
          toast.error('Error al eliminar la venta');
          return;
        }
        toast.success('Venta eliminada exitosamente');
        await cargarVentas();
      } catch {
        toast.error('Error al eliminar la venta');
      }
    }
    setIsDialogOpen(false);
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div className="container mx-auto p-2">
      <div className="flex justify-end gap-2 pb-2">
        <ThemeToggle />
        <Button
          variant="destructive"
          onClick={() => signOut({ callbackUrl: '/auth/login' })}
        >
          Cerrar sesión
        </Button>
      </div>
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
                  Agregando
                </>
              ) : (
                'Agregar'
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
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Trash2
                            className="h-5 w-5 cursor-pointer hover:text-red-500 transition-colors"
                            onClick={() => handleDeleteClick(venta.id)}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Eliminar</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <AlertDialogComponent
              isOpen={isDialogOpen}
              setIsOpen={setIsDialogOpen}
              onConfirm={handleConfirmDelete}
            />
          </Table>
        </div>
      </Card>
    </div>
  );
}
