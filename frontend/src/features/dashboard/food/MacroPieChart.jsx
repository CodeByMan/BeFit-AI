// src/components/MacroPieChart.jsx
import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function MacroPieChart({ summary }) {
  const data = [
    { name: "Protein", value: summary.protein || 0 },
    { name: "Carbs", value: summary.carbs || 0 },
    { name: "Fats", value: summary.fat || 0 },
  ];

  const COLORS = ["#f97316", "#3b82f6", "#f59e0b"];

  return (
    <div style={{ width: "100%", height: 220, minWidth: 200 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36}/>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
