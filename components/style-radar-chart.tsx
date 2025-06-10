"use client"

import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from "recharts"

const data = [
  {
    attribute: "Energía",
    Electrónica: 85,
    Pop: 65,
    Ambient: 25,
    Rock: 90,
    "Hip-Hop": 75,
    Acoustic: 35,
  },
  {
    attribute: "Valencia",
    Electrónica: 75,
    Pop: 85,
    Ambient: 45,
    Rock: 55,
    "Hip-Hop": 65,
    Acoustic: 70,
  },
  {
    attribute: "Bailabilidad",
    Electrónica: 80,
    Pop: 78,
    Ambient: 30,
    Rock: 60,
    "Hip-Hop": 85,
    Acoustic: 45,
  },
  {
    attribute: "Acústico",
    Electrónica: 15,
    Pop: 25,
    Ambient: 60,
    Rock: 20,
    "Hip-Hop": 10,
    Acoustic: 85,
  },
  {
    attribute: "Instrumental",
    Electrónica: 70,
    Pop: 20,
    Ambient: 90,
    Rock: 65,
    "Hip-Hop": 40,
    Acoustic: 50,
  },
]

export function StyleRadarChart() {
  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis dataKey="attribute" tick={{ fontSize: 12, fill: "#64748b" }} />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10, fill: "#94a3b8" }} tickCount={6} />

          <Radar
            name="Electrónica"
            dataKey="Electrónica"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.1}
            strokeWidth={2}
          />
          <Radar name="Pop" dataKey="Pop" stroke="#10b981" fill="#10b981" fillOpacity={0.1} strokeWidth={2} />
          <Radar name="Ambient" dataKey="Ambient" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.1} strokeWidth={2} />

          <Legend wrapperStyle={{ fontSize: "12px" }} iconType="line" />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
