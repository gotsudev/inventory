'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { signIn, useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function SignIn() {
  const { status } = useSession(); // Elimina 'session' si no la necesitas
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (status === 'authenticated') {
      window.location.href = '/';
    }
  }, [status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false
    });
    if (result?.error) {
      toast.error('Credenciales inválidas');
    } else {
      window.location.href = '/';
    }
    setIsLoading(false);
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-6 mb-2 w-full max-w-md mx-auto shadow-lg">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-items-center justify-center">
                <h2 className="font-bold text-center p-2 text-xl">
                  Control de inventario
                </h2>
                <Badge variant="outline" className="text-xs">
                  V 1.0
                </Badge>
              </div>

              <div>
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                  autoFocus
                  disabled={isLoading}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full"
                  disabled={isLoading}
                  required
                />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Iniciando sesión
                  </>
                ) : (
                  'Iniciar sesión'
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
}
