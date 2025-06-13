import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Music, TrendingUp, Target, BarChart3 } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <Music className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-slate-800">HitSense</h1>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-slate-800 mb-6">HitSense</h1>
          <p className="text-xl text-slate-600 mb-4">Midiendo el éxito de la música</p>
          <p className="text-lg text-slate-500 mb-12 max-w-2xl mx-auto">
            Analiza tus canciones, descubre patrones de éxito y optimiza tu producción para mayor impacto comercial.
          </p>

          <Link href="/radar">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
              Ingresar al Radar Sonoro
            </Button>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Mapa de Estilos</h3>
              <p className="text-slate-600">
                Visualiza clusters de estilos musicales y encuentra tu posición en el mercado
              </p>
              <Link href="/radar" className="inline-block mt-4">
                <Button variant="outline" size="sm">
                  Explorar
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Predicción de Popularidad</h3>
              <p className="text-slate-600">Analiza tus tracks y obtén predicciones de éxito comercial</p>
              <Link href="/prediction" className="inline-block mt-4">
                <Button variant="outline" size="sm">
                  Analizar
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Tendencias Temporales</h3>
              <p className="text-slate-600">Descubre la evolución de estilos y atributos musicales por año</p>
              <Link href="/trends" className="inline-block mt-4">
                <Button variant="outline" size="sm">
                  Ver Tendencias
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-8 mt-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-300 mb-2">Desarrollado por HitSense</p>
          <p className="text-sm text-slate-400">
            Proyecto académico - No oficial. Diseñado para productores musicales profesionales.
          </p>
        </div>
      </footer>
    </div>
  )
}
