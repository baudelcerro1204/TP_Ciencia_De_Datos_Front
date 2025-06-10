import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, BarChart3 } from "lucide-react"
import { TrendsLineChart } from "@/components/trends-line-chart"
import { AttributeEvolutionChart } from "@/components/attribute-evolution-chart"

export default function TrendsPage() {
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
                <BarChart3 className="h-6 w-6 text-blue-600" />
                <h1 className="text-xl font-bold text-slate-800">Exploración Temporal</h1>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href="/radar">
                <Button variant="outline" size="sm">
                  Radar
                </Button>
              </Link>
              <Link href="/prediction">
                <Button variant="outline" size="sm">
                  Predicción
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Tendencias Temporales</h2>
          <p className="text-slate-600 max-w-2xl">
            Descubre cómo han evolucionado los atributos musicales a lo largo del tiempo para inspirar tu próxima
            producción.
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Filtros de Análisis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="w-48">
                <label className="text-sm font-medium text-slate-700 mb-2 block">Período</label>
                <Select defaultValue="2020-2024">
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2020-2024">2020-2024</SelectItem>
                    <SelectItem value="2015-2024">2015-2024</SelectItem>
                    <SelectItem value="2010-2024">2010-2024</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-48">
                <label className="text-sm font-medium text-slate-700 mb-2 block">Cluster</label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar cluster" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los clusters</SelectItem>
                    <SelectItem value="electronic">Electrónica Comercial</SelectItem>
                    <SelectItem value="pop">Pop Mainstream</SelectItem>
                    <SelectItem value="ambient">Ambient/Cinematográfica</SelectItem>
                    <SelectItem value="rock">Rock/Alternative</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Charts Grid */}
        <div className="space-y-8">
          {/* Duration Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Evolución de la Duración Promedio</CardTitle>
              <p className="text-sm text-slate-600">Tendencia de la duración de las canciones más exitosas por año</p>
            </CardHeader>
            <CardContent>
              <TrendsLineChart />
            </CardContent>
          </Card>

          {/* Attribute Evolution */}
          <Card>
            <CardHeader>
              <CardTitle>Evolución de Atributos Musicales</CardTitle>
              <p className="text-sm text-slate-600">Cambios en los atributos clave de la música comercial exitosa</p>
            </CardHeader>
            <CardContent>
              <AttributeEvolutionChart />
            </CardContent>
          </Card>

          {/* Insights */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Insights Clave</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-slate-800">Duración Óptima</h4>
                  <p className="text-sm text-slate-600">
                    Las canciones comerciales exitosas tienden a durar entre 2:30 y 3:15 minutos
                  </p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold text-slate-800">Energía en Alza</h4>
                  <p className="text-sm text-slate-600">La energía promedio ha aumentado 15% en los últimos 3 años</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-semibold text-slate-800">Tempo Estable</h4>
                  <p className="text-sm text-slate-600">
                    El tempo promedio se mantiene entre 120-130 BPM para música comercial
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recomendaciones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Para Stock Music</h4>
                  <p className="text-sm text-blue-700">
                    Enfócate en alta energía (70-85%) y valencia positiva (60-80%)
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Para Publicidad</h4>
                  <p className="text-sm text-green-700">
                    Mantén duración corta (30-60s) con alta bailabilidad (65-85%)
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">Para Cine</h4>
                  <p className="text-sm text-purple-700">Prioriza instrumentalidad (60-90%) y variabilidad emocional</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
