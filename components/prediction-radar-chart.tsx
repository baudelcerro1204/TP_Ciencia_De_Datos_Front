"use client"

import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from "recharts"

interface PredictionRadarChartProps {
  userTrack: {
    energy: number[]
    danceability: number[]
    valence: number[]
    acousticness: number[]
    instrumentalness: number[]
  }
}

export function PredictionRadarChart({ userTrack }: PredictionRadarChartProps) {
  const data = [
    {
      attribute: "Energía",
      "Tu Track": userTrack.energy[0],
      "Promedio Cluster": 85,
    },
    {
      attribute: "Valencia",
      "Tu Track": userTrack.valence[0],
      "Promedio Cluster": 75,
    },
    {
      attribute: "Bailabilidad",
      "Tu Track": userTrack.danceability[0],
      "Promedio Cluster": 80,
    },
    {
      attribute: "Acústico",
      "Tu Track": userTrack.acousticness[0],
      "Promedio Cluster": 15,
    },
    {
      attribute: "Instrumental",
      "Tu Track": userTrack.instrumentalness[0],
      "Promedio Cluster": 70,
    },
  ]

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis dataKey="attribute" tick={{ fontSize: 12, fill: "#64748b" }} />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10, fill: "#94a3b8" }} tickCount={6} />

          <Radar name="Tu Track" dataKey="Tu Track" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} strokeWidth={3} />
          <Radar
            name="Promedio Cluster"
            dataKey="Promedio Cluster"
            stroke="#94a3b8"
            fill="#94a3b8"
            fillOpacity={0.1}
            strokeWidth={2}
            strokeDasharray="5 5"
          />

          <Legend wrapperStyle={{ fontSize: "12px" }} iconType="line" />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
