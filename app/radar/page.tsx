import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Music } from "lucide-react"
import { StyleRadarChart } from "@/components/style-radar-chart"
import { StyleScatterPlot } from "@/components/style-scatter-plot"

export default function RadarPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Music className="h-6 w-6 text-blue-600" />
                <h1 className="text-xl font-bold text-slate-800">Radar Sonoro</h1>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href="/prediction">
                <Button variant="outline" size="sm">
                  Predicción
                </Button>
              </Link>
              <Link href="/trends">
                <Button variant="outline" size="sm">
                  Tendencias
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Mapa Interactivo de Estilos</h2>
          <p className="text-slate-600 max-w-2xl">
            Explora los clusters de estilos musicales y descubre dónde se posicionan las canciones más exitosas en el
            mercado comercial.
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="w-48">
                <label className="text-sm font-medium text-slate-700 mb-2 block">Año</label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar año" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los años</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2022">2022</SelectItem>
                    <SelectItem value="2021">2021</SelectItem>
                    <SelectItem value="2020">2020</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-48">
                <label className="text-sm font-medium text-slate-700 mb-2 block">Género</label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar género" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los géneros</SelectItem>
                    <SelectItem value="electronic">Electrónica</SelectItem>
                    <SelectItem value="pop">Pop</SelectItem>
                    <SelectItem value="rock">Rock</SelectItem>
                    <SelectItem value="ambient">Ambient</SelectItem>
                    <SelectItem value="cinematic">Cinematográfica</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Mapa de Estilos (Scatter Plot)</CardTitle>
              <p className="text-sm text-slate-600">Cada punto representa una canción. Hover para ver detalles.</p>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div className="h-96 bg-slate-100 animate-pulse rounded" />}>
                <StyleScatterPlot />
              </Suspense>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Radar de Atributos</CardTitle>
              <p className="text-sm text-slate-600">Comparación de atributos promedio por cluster.</p>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div className="h-96 bg-slate-100 animate-pulse rounded" />}>
                <StyleRadarChart />
              </Suspense>
            </CardContent>
          </Card>
        </div>

        {/* Legend */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Leyenda de Clusters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-slate-800">Electrónica Comercial</p>
                  <p className="text-sm text-slate-600">Alta energía, tempo rápido</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-slate-800">Pop Mainstream</p>
                  <p className="text-sm text-slate-600">Melódico, accesible</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-slate-800">Ambient/Cinematográfica</p>
                  <p className="text-sm text-slate-600">Atmosférica, emocional</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-slate-800">Rock/Alternative</p>
                  <p className="text-sm text-slate-600">Energético, instrumental</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-slate-800">Hip-Hop/Urban</p>
                  <p className="text-sm text-slate-600">Rítmico, percusivo</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-slate-800">Acoustic/Folk</p>
                  <p className="text-sm text-slate-600">Orgánico, melódico</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
