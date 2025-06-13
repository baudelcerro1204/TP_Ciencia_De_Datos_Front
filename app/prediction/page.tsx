"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { ArrowLeft, Upload, Music, TrendingUp } from "lucide-react"
import { PredictionRadarChart } from "@/components/prediction-radar-chart"

export default function PredictionPage() {
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const [attributes, setAttributes] = useState({
    energy: [75],
    danceability: [68],
    valence: [60],
    acousticness: [25],
    instrumentalness: [40],
    tempo: [128],
  })

  const [popularityScore, setPopularityScore] = useState<number>(78)
  const [assignedCluster, setAssignedCluster] = useState<string>("Electrónica Comercial")

  const handleAnalyze = async () => {
    if (!audioFile) {
      alert("Por favor selecciona un archivo de audio primero.")
      return
    }

    setIsAnalyzing(true)
    const formData = new FormData()
    formData.append("file", audioFile)

    try {
      const res = await fetch("http://localhost:8000/predict-audio", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        throw new Error("Error en la predicción")
      }

      const result = await res.json()
      console.log("Resultado recibido:", result)

      // Suponiendo que el backend devuelve: { popularity: 72, cluster: "Electrónica Comercial", features: { energy: ..., ... } }
      setPopularityScore(result.popularity)
      setAssignedCluster(result.cluster || "Desconocido")
      if (result.features) {
        setAttributes({
          energy: [Math.round(result.features.energy * 100)],
          danceability: [Math.round(result.features.danceability * 100)],
          valence: [Math.round(result.features.valence * 100)],
          acousticness: [Math.round(result.features.acousticness * 100)],
          instrumentalness: [Math.round(result.features.instrumentalness * 100)],
          tempo: [Math.round(result.features.tempo)],
        })
      }

      setShowResults(true)
    } catch (error) {
      console.error(error)
      alert("Hubo un error al analizar el archivo.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
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
                <TrendingUp className="h-6 w-6 text-blue-600" />
                <h1 className="text-xl font-bold text-slate-800">Predicción de Popularidad</h1>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href="/radar">
                <Button variant="outline" size="sm">
                  Radar
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
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Analiza tu Track</h2>
          <p className="text-slate-600 max-w-2xl">
            Sube tu canción o ingresa manualmente los atributos para obtener una predicción de popularidad y ver cómo se
            compara con su cluster asignado.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            {/* File Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Subir Archivo de Audio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
                  onClick={() => document.getElementById("fileInput")?.click()}
                >
                  <Music className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 mb-2">Arrastra tu archivo aquí o haz clic para seleccionar</p>
                  <p className="text-sm text-slate-500">Formatos soportados: MP3, WAV (máx. 10MB)</p>
                  <Button variant="outline" className="mt-4">
                    Seleccionar Archivo
                  </Button>
                </div>
                <input
                  id="fileInput"
                  type="file"
                  accept=".mp3,.wav"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) setAudioFile(file)
                  }}
                />
                {audioFile && (
                  <p className="text-sm text-slate-700 mt-2">
                    Archivo seleccionado: <strong>{audioFile.name}</strong>
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Manual Input */}
            <Card>
              <CardHeader>
                <CardTitle>Atributos Manuales</CardTitle>
                <p className="text-sm text-slate-600">Ajusta los valores manualmente si prefieres no subir un archivo</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-sm font-medium">Energía: {attributes.energy[0]}%</Label>
                  <Slider
                    value={attributes.energy}
                    onValueChange={(value) => setAttributes({ ...attributes, energy: value })}
                    max={100}
                    step={1}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Bailabilidad: {attributes.danceability[0]}%</Label>
                  <Slider
                    value={attributes.danceability}
                    onValueChange={(value) => setAttributes({ ...attributes, danceability: value })}
                    max={100}
                    step={1}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Valencia (Positividad): {attributes.valence[0]}%</Label>
                  <Slider
                    value={attributes.valence}
                    onValueChange={(value) => setAttributes({ ...attributes, valence: value })}
                    max={100}
                    step={1}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Acústico: {attributes.acousticness[0]}%</Label>
                  <Slider
                    value={attributes.acousticness}
                    onValueChange={(value) => setAttributes({ ...attributes, acousticness: value })}
                    max={100}
                    step={1}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Instrumental: {attributes.instrumentalness[0]}%</Label>
                  <Slider
                    value={attributes.instrumentalness}
                    onValueChange={(value) => setAttributes({ ...attributes, instrumentalness: value })}
                    max={100}
                    step={1}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Tempo (BPM)</Label>
                  <Input
                    type="number"
                    value={attributes.tempo[0]}
                    onChange={(e) =>
                      setAttributes({
                        ...attributes,
                        tempo: [Number.parseInt(e.target.value) || 120],
                      })
                    }
                    className="mt-2"
                    min="60"
                    max="200"
                  />
                </div>

                <Button onClick={handleAnalyze} className="w-full bg-blue-600 hover:bg-blue-700" disabled={isAnalyzing}>
                  {isAnalyzing ? "Analizando..." : "Analizar Track"}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {showResults ? (
              <>
                {/* Popularity Score */}
                <Card>
                  <CardHeader>
                    <CardTitle>Predicción de Popularidad</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div
                        className={`text-6xl font-bold mb-2 ${
                          popularityScore >= 80
                            ? "text-green-600"
                            : popularityScore >= 60
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {popularityScore}
                      </div>
                      <p className="text-slate-600 mb-4">Puntuación de popularidad comercial</p>
                      <div
                        className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                          popularityScore >= 80
                            ? "bg-green-100 text-green-800"
                            : popularityScore >= 60
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {popularityScore >= 80
                          ? "Alto potencial"
                          : popularityScore >= 60
                          ? "Potencial moderado"
                          : "Potencial bajo"}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Cluster Assignment */}
                <Card>
                  <CardHeader>
                    <CardTitle>Cluster Asignado</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
                      </div>
                      <h3 className="text-xl font-semibold text-slate-800 mb-2">{assignedCluster}</h3>
                      <p className="text-slate-600">
                        Tu track se clasifica en el cluster de música electrónica comercial, ideal para publicidad y
                        contenido dinámico.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Radar Comparison */}
                <Card>
                  <CardHeader>
                    <CardTitle>Comparación con Cluster</CardTitle>
                    <p className="text-sm text-slate-600">Tu track vs. promedio del cluster</p>
                  </CardHeader>
                  <CardContent>
                    <PredictionRadarChart userTrack={attributes} />
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="h-96 flex items-center justify-center">
                <CardContent className="text-center">
                  <Music className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">Los resultados del análisis aparecerán aquí</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}