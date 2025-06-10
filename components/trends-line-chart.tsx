"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

const data = [
  { year: "2020", duration: 195, energy: 68, danceability: 72 },
  { year: "2021", duration: 188, energy: 71, danceability: 74 },
  { year: "2022", duration: 182, energy: 74, danceability: 76 },
  { year: "2023", duration: 178, energy: 77, danceability: 78 },
  { year: "2024", duration: 175, energy: 79, danceability: 80 },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg">
        <p className="font-semibold text-slate-800">{`Año ${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
            {entry.dataKey === "duration" ? "s" : "%"}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function TrendsLineChart() {
  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 12 }} />
          <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />

          <Line
            type="monotone"
            dataKey="duration"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
            name="Duración (segundos)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
