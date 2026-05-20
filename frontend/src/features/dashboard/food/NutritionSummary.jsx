// src/components/NutritionSummary.jsx
import React from "react";
import { useTheme } from "../../context/ThemeContext";

export default function NutritionSummary({ summary = {} }) {
  const { calories = 0, protein = 0, carbs = 0, fats = 0 } = summary;
  const { darkMode } = useTheme();

  // Unified color system (same across all your dashboard pages)
  const orange = "hsl(12, 98%, 52%)";
  const orangeLight = "hsl(12, 98%, 65%)";
  const orangeDark = "hsl(12, 98%, 40%)";

  const theme = darkMode
    ? {
        cardBg: "rgba(30,30,30,0.85)",
        itemBg: "rgba(255,255,255,0.05)",
        textPrimary: "#f8f9fa",
        textSecondary: "#9ca3af",
        border: "1px solid rgba(255,255,255,0.15)",
        shadow: "0 4px 15px rgba(0,0,0,0.3)",
      }
    : {
        cardBg: "rgba(255,255,255,0.95)",
        itemBg: "rgba(0,0,0,0.05)",
        textPrimary: "#212529",
        textSecondary: "#6c757d",
        border: "1px solid rgba(0,0,0,0.1)",
        shadow: "0 4px 10px rgba(0,0,0,0.08)",
      };

  const itemStyle = {
    flex: 1,
    minWidth: "130px",
    padding: "1rem",
    borderRadius: "1rem",
    background: theme.itemBg,
    textAlign: "center",
  };

  return (
    <div
      style={{
        background: theme.cardBg,
        borderRadius: "1.25rem",
        padding: "1.25rem",
        border: theme.border,
        boxShadow: theme.shadow,
        marginBottom: "1rem",
      }}
    >
      <h6
        className="mb-3"
        style={{
          color: theme.textPrimary,
          fontWeight: 700,
          fontSize: "1rem",
          background: `linear-gradient(90deg, ${orangeLight}, ${orange}, ${orangeDark})`,
          WebkitBackgroundClip: "text",
          color: "transparent",
        }}
      >
        Today’s Nutrition
      </h6>

      <div
        className="d-flex flex-wrap gap-3"
        style={{ justifyContent: "space-between" }}
      >
        {/* Calories */}
        <div style={itemStyle}>
          <div style={{ color: theme.textSecondary }}>Calories</div>
          <div
            style={{
              fontWeight: 700,
              fontSize: "1.25rem",
              color: theme.textPrimary,
            }}
          >
            {Math.round(calories)}
          </div>
        </div>

        {/* Protein */}
        <div style={itemStyle}>
          <div style={{ color: theme.textSecondary }}>Protein (g)</div>
          <div
            style={{
              fontWeight: 700,
              fontSize: "1.25rem",
              color: theme.textPrimary,
            }}
          >
            {Math.round(protein)}
          </div>
        </div>

        {/* Carbs */}
        <div style={itemStyle}>
          <div style={{ color: theme.textSecondary }}>Carbs (g)</div>
          <div
            style={{
              fontWeight: 700,
              fontSize: "1.25rem",
              color: theme.textPrimary,
            }}
          >
            {Math.round(carbs)}
          </div>
        </div>

        {/* Fats */}
        <div style={itemStyle}>
          <div style={{ color: theme.textSecondary }}>Fats (g)</div>
          <div
            style={{
              fontWeight: 700,
              fontSize: "1.25rem",
              color: theme.textPrimary,
            }}
          >
            {Math.round(fats)}
          </div>
        </div>
      </div>
    </div>
  );
}
