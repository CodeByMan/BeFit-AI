import React from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

export default function CaloriesChart({ data = [] }) {
  if (!data || data.length === 0) return <div className="text-muted">No chart data</div>;

 const chartData = data.map(d => ({
  date: d.date,
  calories: d.totals?.calories || 0
}));

  return (
    <div style={{ width: "100%", height: 220, minWidth: 200 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="calories" stroke="#1976d2" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
