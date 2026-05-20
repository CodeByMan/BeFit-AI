// src/pages/dashboard/food/MacroChart.jsx
import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function MacroChart({ data = [] }) {
  if (!data || data.length === 0) return <div className="text-muted">No chart data</div>;

  const chartData = data.map((d) => ({
    date: d.date,
    protein: Number(d.protein) || 0,
    carbs: Number(d.carbs) || 0,
    fats: Number(d.fats) || 0,
    calories: Number(d.calories) || 0,
  }));

  return (
    <div style={{ width: "100%", height: 250 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="protein" stackId="a" fill="#ff7043" />
          <Bar dataKey="carbs" stackId="a" fill="#42a5f5" />
          <Bar dataKey="fats" stackId="a" fill="#ffee58" />
          <Bar dataKey="calories" stackId="b" fill="#66bb6a" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
