"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

const data = [
  { year: "2020", energy: 68, danceability: 72, valence: 65, acousticness: 28 },
  { year: "2021", energy: 71, danceability: 74, valence: 67, acousticness: 26 },
  { year: "2022", energy: 74, danceability: 76, valence: 69, acousticness: 24 },
  { year: "2023", energy: 77, danceability: 78, valence: 71, acousticness: 22 },
  { year: "2024", energy: 79, danceability: 80, valence: 73, acousticness: 20 },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg">
        <p className="font-semibold text-slate-800">{`Año ${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}%
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function AttributeEvolutionChart() {
  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 12 }} />
          <YAxis stroke="#64748b" tick={{ fontSize: 12 }} domain={[0, 100]} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />

          <Line
            type="monotone"
            dataKey="energy"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: "#3b82f6", strokeWidth: 2, r: 3 }}
            name="Energía"
          />
          <Line
            type="monotone"
            dataKey="danceability"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ fill: "#10b981", strokeWidth: 2, r: 3 }}
            name="Bailabilidad"
          />
          <Line
            type="monotone"
            dataKey="valence"
            stroke="#f59e0b"
            strokeWidth={2}
            dot={{ fill: "#f59e0b", strokeWidth: 2, r: 3 }}
            name="Valencia"
          />
          <Line
            type="monotone"
            dataKey="acousticness"
            stroke="#8b5cf6"
            strokeWidth={2}
            dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 3 }}
            name="Acústico"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
