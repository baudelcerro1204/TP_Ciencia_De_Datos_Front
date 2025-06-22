import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PREDICTEL - Análisis Predictivo',
  description: 'Sistema avanzado de gestión hotelera con análisis predictivo de cancelaciones y segmentación de clientes',
  keywords: 'hotel, gestión, análisis predictivo, cancelaciones, reservas, machine learning',
  authors: [{ name: 'Equipo de Desarrollo' }],
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'PREDICTEL - Análisis Predictivo',
    description: 'Sistema avanzado de gestión hotelera con análisis predictivo de cancelaciones y segmentación de clientes',
    type: 'website',
    images: ['public/logo.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PREDICTEL - Análisis Predictivo',
    description: 'Sistema avanzado de gestión hotelera con análisis predictivo de cancelaciones y segmentación de clientes',
    images: ['public/logo.png'],
  },
  icons: {
    icon: 'public/logo.png',
    shortcut: 'public/logo.png',
    apple: 'public/logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <meta name="theme-color" content="#3b82f6" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
