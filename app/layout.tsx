import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
// import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/theme-provider';

// const geistSans = Geist({
//   variable: '--font-geist-sans',
//   subsets: ['latin']
// });

// const geistMono = Geist_Mono({
//   variable: '--font-geist-mono',
//   subsets: ['latin']
// });

export const metadata: Metadata = {
  title: 'Inventario Renovar',
  description: 'Aplicación para el control del inventario rápido de Renovar'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      {/* <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      > */}
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <body className={`${GeistSans.variable} ${GeistMono.variable}`}>
          <Toaster richColors />
          {children}
        </body>
      </ThemeProvider>
    </html>
  );
}
