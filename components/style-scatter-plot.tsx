"use client"

import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  // Electrónica Comercial (azul)
  { x: 85, y: 78, cluster: "Electrónica Comercial", song: "Energy Boost", color: "#3b82f6" },
  { x: 82, y: 75, cluster: "Electrónica Comercial", song: "Digital Dreams", color: "#3b82f6" },
  { x: 88, y: 80, cluster: "Electrónica Comercial", song: "Synth Wave", color: "#3b82f6" },
  { x: 79, y: 72, cluster: "Electrónica Comercial", song: "Beat Drop", color: "#3b82f6" },
  { x: 86, y: 77, cluster: "Electrónica Comercial", song: "Pulse", color: "#3b82f6" },

  // Pop Mainstream (verde)
  { x: 65, y: 85, cluster: "Pop Mainstream", song: "Summer Vibes", color: "#10b981" },
  { x: 68, y: 82, cluster: "Pop Mainstream", song: "Feel Good", color: "#10b981" },
  { x: 62, y: 88, cluster: "Pop Mainstream", song: "Happy Days", color: "#10b981" },
  { x: 70, y: 80, cluster: "Pop Mainstream", song: "Sunshine", color: "#10b981" },
  { x: 66, y: 84, cluster: "Pop Mainstream", song: "Bright Light", color: "#10b981" },

  // Ambient/Cinematográfica (púrpura)
  { x: 25, y: 45, cluster: "Ambient/Cinematográfica", song: "Ethereal", color: "#8b5cf6" },
  { x: 30, y: 40, cluster: "Ambient/Cinematográfica", song: "Floating", color: "#8b5cf6" },
  { x: 22, y: 48, cluster: "Ambient/Cinematográfica", song: "Dreamscape", color: "#8b5cf6" },
  { x: 28, y: 42, cluster: "Ambient/Cinematográfica", song: "Serenity", color: "#8b5cf6" },
  { x: 26, y: 46, cluster: "Ambient/Cinematográfica", song: "Cosmos", color: "#8b5cf6" },

  // Rock/Alternative (naranja)
  { x: 90, y: 55, cluster: "Rock/Alternative", song: "Power Drive", color: "#f97316" },
  { x: 88, y: 58, cluster: "Rock/Alternative", song: "Thunder", color: "#f97316" },
  { x: 92, y: 52, cluster: "Rock/Alternative", song: "Electric Storm", color: "#f97316" },
  { x: 87, y: 60, cluster: "Rock/Alternative", song: "Rebel", color: "#f97316" },
  { x: 91, y: 56, cluster: "Rock/Alternative", song: "Intensity", color: "#f97316" },

  // Hip-Hop/Urban (rojo)
  { x: 75, y: 65, cluster: "Hip-Hop/Urban", song: "Street Beat", color: "#ef4444" },
  { x: 78, y: 62, cluster: "Hip-Hop/Urban", song: "Urban Flow", color: "#ef4444" },
  { x: 72, y: 68, cluster: "Hip-Hop/Urban", song: "City Lights", color: "#ef4444" },
  { x: 76, y: 64, cluster: "Hip-Hop/Urban", song: "Groove", color: "#ef4444" },
  { x: 74, y: 66, cluster: "Hip-Hop/Urban", song: "Rhythm", color: "#ef4444" },

  // Acoustic/Folk (amarillo)
  { x: 35, y: 70, cluster: "Acoustic/Folk", song: "Morning Dew", color: "#eab308" },
  { x: 38, y: 68, cluster: "Acoustic/Folk", song: "Countryside", color: "#eab308" },
  { x: 32, y: 72, cluster: "Acoustic/Folk", song: "Gentle Breeze", color: "#eab308" },
  { x: 36, y: 69, cluster: "Acoustic/Folk", song: "Harmony", color: "#eab308" },
  { x: 34, y: 71, cluster: "Acoustic/Folk", song: "Peaceful", color: "#eab308" },
]

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg">
        <p className="font-semibold text-slate-800">{data.song}</p>
        <p className="text-sm text-slate-600">{data.cluster}</p>
        <p className="text-sm text-slate-500">Energía: {data.x}%</p>
        <p className="text-sm text-slate-500">Valencia: {data.y}%</p>
      </div>
    )
  }
  return null
}

export function StyleScatterPlot() {
  const clusters = [
    { name: "Electrónica Comercial", color: "#3b82f6" },
    { name: "Pop Mainstream", color: "#10b981" },
    { name: "Ambient/Cinematográfica", color: "#8b5cf6" },
    { name: "Rock/Alternative", color: "#f97316" },
    { name: "Hip-Hop/Urban", color: "#ef4444" },
    { name: "Acoustic/Folk", color: "#eab308" },
  ]

  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            type="number"
            dataKey="x"
            name="Energía"
            domain={[0, 100]}
            label={{ value: "Energía (%)", position: "insideBottom", offset: -10 }}
            stroke="#64748b"
          />
          <YAxis
            type="number"
            dataKey="y"
            name="Valencia"
            domain={[0, 100]}
            label={{ value: "Valencia (%)", angle: -90, position: "insideLeft" }}
            stroke="#64748b"
          />
          <Tooltip content={<CustomTooltip />} />

          {clusters.map((cluster) => (
            <Scatter
              key={cluster.name}
              name={cluster.name}
              data={data.filter((d) => d.cluster === cluster.name)}
              fill={cluster.color}
              fillOpacity={0.7}
              stroke={cluster.color}
              strokeWidth={2}
            />
          ))}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}
