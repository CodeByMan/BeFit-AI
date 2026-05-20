import React from "react";
import Header from "./layout/HeaderUser";
import Footer from "./layout/FooterUser";
import { useTheme } from "../../context/ThemeContext";
import {
  IoChatbubbleEllipsesOutline,
  IoTrendingUpOutline,
  IoFlameOutline,
} from "react-icons/io5";
import { FaTrophy, FaShoePrints } from "react-icons/fa";

const StatCard = ({ label, value, unit, icon, gradient, valueColor }) => (
  <div
    style={{
      borderRadius: "1.5rem",
      padding: "1.5rem",
      background: gradient,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
      transition: "all 0.3s",
    }}
  >
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
      <div style={{ padding: "0.5rem", borderRadius: "0.75rem", backgroundColor: "rgba(255,255,255,0.1)" }}>
        {icon}
      </div>
      <p style={{ fontSize: "0.875rem", color: "#6c757d", fontWeight: 500 }}>{label}</p>
    </div>
    <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
      <p style={{ fontSize: "1.75rem", fontWeight: "700", color: valueColor }}>{value}</p>
      <span style={{ fontSize: "1rem", color: "#adb5bd" }}>{unit}</span>
    </div>
  </div>
);

const AchievementCard = ({ icon, text, theme }) => (
  <div
    style={{
      borderRadius: "1.5rem",
      padding: "1.25rem",
      display: "flex",
      alignItems: "center",
      gap: "1rem",
      background: theme.cardBackground,
      border: `1px solid ${theme.border}`,
      boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
      transition: "all 0.3s",
    }}
  >
    <div
      style={{
        borderRadius: "1rem",
        padding: "0.75rem",
        background: theme.iconBackground,
      }}
    >
      {icon}
    </div>
    <p style={{ fontSize: "0.875rem", fontWeight: 600, color: theme.textPrimary, margin: 0 }}>{text}</p>
  </div>
);

const MacroProgressBar = ({ name, current, goal, color, theme }) => {
  const progress = Math.min((current / goal) * 100, 100);
  return (
    <div
      style={{
        borderRadius: "1rem",
        padding: "1rem",
        background: theme.cardBackground,
        border: `1px solid ${theme.border}`,
        marginBottom: "1rem",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
        <p style={{ fontSize: "0.875rem", fontWeight: 600, color: theme.textSecondary }}>{name}</p>
        <p style={{ fontSize: "0.875rem", fontWeight: 700, color: theme.textPrimary }}>{current}g / {goal}g</p>
      </div>
      <div style={{ width: "100%", height: "0.75rem", borderRadius: "0.75rem", background: theme.progressBackground }}>
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            borderRadius: "0.75rem",
            background: color,
            transition: "width 0.5s",
          }}
        ></div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.5rem" }}>
        <span style={{ fontSize: "0.75rem", color: theme.textSecondary }}>0g</span>
        <span style={{ fontSize: "0.75rem", color: theme.textSecondary }}>{goal}g</span>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  const orange = "hsl(12, 98%, 52%)";

  const theme = darkMode
    ? {
        background: "#111111",
        cardBackground: "rgba(31,41,55,0.8)",
        textPrimary: "#f8f9fa",
        textSecondary: "#9ca3af",
        border: "rgba(255,255,255,0.1)",
        progressBackground: "rgba(255,255,255,0.1)",
        iconBackground: "rgba(249,115,22,0.2)",
      }
    : {
        background: "#f8f9fa",
        cardBackground: "rgba(255,255,255,0.9)",
        textPrimary: "#212529",
        textSecondary: "#6c757d",
        border: "rgba(0,0,0,0.1)",
        progressBackground: "rgba(0,0,0,0.1)",
        iconBackground: "rgba(249,115,22,0.1)",
      };

  return (
    <div className="layout-wrapper layout-content-navbar" style={{ backgroundColor: theme.background, minHeight: "100vh", transition: "all 0.3s" }}>
      <div className="layout-container">
        <Header />

        <div className="layout-page">
          {/* Navbar */}

          <div className="content-wrapper">
            <div className="container-xxl flex-grow-1 container-p-y">
              <div className="container">
                {/* Header */}
                <div className="mb-4">
                  <h1
                    style={{
                      fontSize: "2.5rem",
                      fontWeight: "700",
                      background: `linear-gradient(90deg, ${orange}, #facc15)`,
                      WebkitBackgroundClip: "text",
                      color: "transparent",
                    }}
                  >
                    Dashboard
                  </h1>
                  <p style={{ color: theme.textSecondary }}>Today's Overview</p>
                </div>

                {/* Stat Cards */}
                <div className="row g-4 mb-4">
                  <div className="col-md-4">
                    <StatCard
                      label="Calories In"
                      value={1500}
                      unit="kcal"
                      icon={<IoFlameOutline style={{ fontSize: "1.25rem", color: orange }} />}
                      gradient={`linear-gradient(135deg, ${orange}33, ${orange}1A)`}
                      valueColor={orange}
                    />
                  </div>
                  <div className="col-md-4">
                    <StatCard
                      label="Calories Out"
                      value={2300}
                      unit="kcal"
                      icon={<IoTrendingUpOutline style={{ fontSize: "1.25rem", color: "#3b82f6" }} />}
                      gradient="linear-gradient(135deg, rgba(59,130,246,0.2), rgba(14,165,233,0.2))"
                      valueColor="#3b82f6"
                    />
                  </div>
                  <div className="col-md-4">
                    <StatCard
                      label="Net Calories"
                      value={-800}
                      unit="kcal"
                      icon={<IoTrendingUpOutline style={{ fontSize: "1.25rem", color: "#10b981" }} />}
                      gradient="linear-gradient(135deg, rgba(16,185,129,0.2), rgba(5,150,105,0.2))"
                      valueColor="#10b981"
                    />
                  </div>
                </div>

                {/* Macro Progress */}
                <div className="row g-4 mb-4">
                  <div className="col-md-4">
                    <MacroProgressBar name="Protein" current={120} goal={200} color="linear-gradient(90deg,#f97316,#facc15)" theme={theme} />
                  </div>
                  <div className="col-md-4">
                    <MacroProgressBar name="Carbs" current={250} goal={300} color="linear-gradient(90deg,#34d399,#10b981)" theme={theme} />
                  </div>
                  <div className="col-md-4">
                    <MacroProgressBar name="Fat" current={70} goal={100} color="linear-gradient(90deg,#f97316,#f59e0b)" theme={theme} />
                  </div>
                </div>

                {/* Achievements */}
                <div className="row g-4 mb-4">
                  <div className="col-md-6">
                    <AchievementCard icon={<FaTrophy style={{ color: "#facc15", fontSize: "1.25rem" }} />} text="First Week Completed" theme={theme} />
                  </div>
                  <div className="col-md-6">
                    <AchievementCard icon={<FaShoePrints style={{ color: "#3b82f6", fontSize: "1.25rem", transform: "rotate(-90deg)" }} />} text="10,000 Steps Reached" theme={theme} />
                  </div>
                </div>

                {/* Chat Button */}
                <button
                  className="btn"
                  style={{
                    position: "fixed",
                    bottom: "2rem",
                    right: "2rem",
                    background: `linear-gradient(90deg,#f97316,#facc15)`,
                    color: "#fff",
                    borderRadius: "50%",
                    width: "3.5rem",
                    height: "3.5rem",
                    fontSize: "1.2rem",
                    border: "none",
                  }}
                >
                  <IoChatbubbleEllipsesOutline />
                </button>
              </div>
            </div>
          </div>

          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
