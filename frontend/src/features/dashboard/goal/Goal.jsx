import React, { useEffect, useState } from "react";
import Header from "../layout/HeaderUser";
import Footer from "../layout/FooterUser";
import { useTheme } from "../../../context/ThemeContext";
import API from "../../../api/Api";

const Goal = () => {
  const { darkMode } = useTheme();

  const theme = darkMode
    ? {
        bg: "#0b0f14",
        panel: "rgba(30,30,30,0.85)",
        border: "rgba(30,30,30,0.85)",
        text: "#e5e7eb",
        muted: "#9ca3af",
        accent: "hsl(12, 98%, 52%)",
      }
    : {
        bg: "#f4f6f8",
        panel: "#ffffff",
        border: "#dee2e6",
        text: "#212529",
        muted: "#6c757d",
        accent: "hsl(12, 98%, 52%)",
      };

  const [goal, setGoal] = useState({
    currentHeight: "", // NEW
    currentWeight: "", // NEW
    dailyCalories: "",
    dailyCarbs: "",
    dailyProtein: "",
    dailyFats: "",
    targetWeight: "",
    weightUnit: "kg",
    duration: "",
    durationUnit: "days",
    goalType: "weight loss",
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    API.get("/goal")
      .then((res) => {
        if (res.data) {
          setGoal({
            ...res.data,
            currentHeight: res.data.currentHeight || "",
            currentWeight: res.data.currentWeight || "",
            weightUnit: "kg",
            durationUnit: "days",
            duration: res.data.durationDays,
          });
        }
        setLoading(false);
      })
      .catch(() => {
        setMessage("Failed to load goal.");
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGoal((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let weightInKg = goal.targetWeight;
    if (goal.weightUnit === "lb") {
      weightInKg = (parseFloat(goal.targetWeight) * 0.453592).toFixed(1);
    }

    let durationInDays = parseFloat(goal.duration);
    if (goal.durationUnit === "weeks") durationInDays = durationInDays * 7;
    if (goal.durationUnit === "months") durationInDays = durationInDays * 30;

    const payload = {
      currentHeight: goal.currentHeight, // NEW
      currentWeight: goal.currentWeight, // NEW
      dailyCalories: goal.dailyCalories,
      dailyCarbs: goal.dailyCarbs,
      dailyProtein: goal.dailyProtein,
      dailyFats: goal.dailyFats,
      targetWeight: weightInKg,
      durationDays: durationInDays,
      goalType: goal.goalType,
    };

    API.post("/goal", payload)
      .then(() => {
        setMessage("Goal saved successfully!");
        setTimeout(() => setMessage(""), 10000);
      })
      .catch(() => setMessage("Error saving goal."));
  };

  if (loading) return <p style={{ color: theme.text }}>Loading...</p>;

  const displayDuration = () => {
    if (goal.durationUnit === "weeks") return `${(goal.duration / 7).toFixed(1)} weeks`;
    if (goal.durationUnit === "months") return `${(goal.duration / 30).toFixed(1)} months`;
    return `${goal.duration} days`;
  };

  const displayWeight = () => {
    if (goal.weightUnit === "lb") return (goal.targetWeight * 2.20462).toFixed(1) + " lb";
    return goal.targetWeight + " kg";
  };

  return (
    <div className="layout-wrapper layout-content-navbar" style={{ background: theme.bg, minHeight: "100vh" }}>
      <div className="layout-container">
        <Header />

        <div className="layout-page">
          <div className="container mt-4">
            <div className="row align-items-stretch">

              {/* ===== LEFT: GOAL FORM ===== */}
              <div className="col-lg-7 mb-4">
                <div className="p-4 h-100" style={{ background: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "0.75rem" }}>
                  <h5>Set Your Fitness Goal</h5>
                  <p className="small" style={{ color: theme.muted }}>Update your current stats, daily calories, macros, target weight, and duration.</p>

                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label small">Current Height (cm)</label>
                        <input
                          type="number"
                          name="currentHeight"
                          value={goal.currentHeight}
                          onChange={handleChange}
                          className="form-control"
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label small">Current Weight (kg)</label>
                        <input
                          type="number"
                          name="currentWeight"
                          value={goal.currentWeight}
                          onChange={handleChange}
                          className="form-control"
                        />
                      </div>

                      {["Calories", "Protein", "Carbs", "Fats"].map((label) => (
                        <div className="col-md-6" key={label}>
                          <label className="form-label small">Daily {label}</label>
                          <input
                            type="number"
                            name={`daily${label}`}
                            value={goal[`daily${label}`]}
                            onChange={handleChange}
                            className="form-control"
                          />
                        </div>
                      ))}

                      <div className="col-md-6">
                        <label className="form-label small">Target Weight</label>
                        <div className="d-flex gap-2">
                          <input
                            type="number"
                            name="targetWeight"
                            value={goal.targetWeight}
                            onChange={handleChange}
                            className="form-control"
                          />
                          <select
                            name="weightUnit"
                            value={goal.weightUnit}
                            onChange={handleChange}
                            className="form-select"
                          >
                            <option value="kg">kg</option>
                            <option value="lb">lb</option>
                          </select>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label small">Duration</label>
                        <div className="d-flex gap-2">
                          <input
                            type="number"
                            name="duration"
                            value={goal.duration}
                            onChange={handleChange}
                            className="form-control"
                          />
                          <select
                            name="durationUnit"
                            value={goal.durationUnit}
                            onChange={handleChange}
                            className="form-select"
                          >
                            <option value="days">Days</option>
                            <option value="weeks">Weeks</option>
                            <option value="months">Months</option>
                          </select>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label small">Goal Type</label>
                        <select
                          name="goalType"
                          value={goal.goalType}
                          onChange={handleChange}
                          className="form-select"
                        >
                          <option value="weight gain">Weight Gain</option>
                          <option value="weight loss">Weight Loss</option>
                          <option value="maintain">Maintain</option>
                        </select>
                      </div>
                    </div>

                    <button type="submit" className="btn mt-3" style={{ background: theme.accent, color: "#fff" }}>Save Goal</button>
                  </form>
                </div>
              </div>

              {/* ===== RIGHT: ENHANCED RESULT CARD ===== */}
              <div className="col-lg-5 mb-4">
                <div className="p-4 h-100" style={{ background: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "0.75rem" }}>
                  <h6>Goal Summary</h6>
                  <div className="mb-3">
                    <strong>Current Height:</strong> {goal.currentHeight} cm
                  </div>
                  <div className="mb-3">
                    <strong>Current Weight:</strong> {goal.currentWeight} kg
                  </div>
                  <div className="mb-3">
                    <strong>Target Weight:</strong> {displayWeight()}
                  </div>
                  <div className="mb-3">
                    <strong>Duration:</strong> {displayDuration()}
                  </div>
                  <div className="mb-3">
                    <strong>Goal Type:</strong>{" "}
                    <span style={{ color: theme.accent, fontWeight: "bold" }}>{goal.goalType.toUpperCase()}</span>
                  </div>

                  <table className="table table-borderless mb-3">
                    <thead>
                      <tr>
                        <th style={{ color: theme.muted }}>Macro</th>
                        <th style={{ color: theme.muted }}>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ color: theme.muted }}>Calories</td>
                        <td style={{ color: theme.muted }}>{goal.dailyCalories}</td>
                      </tr>
                      <tr>
                        <td style={{ color: theme.muted }}>Protein</td>
                        <td style={{ color: theme.muted }}>{goal.dailyProtein} g</td>
                      </tr>
                      <tr>
                        <td style={{ color: theme.muted }}>Carbs</td>
                        <td style={{ color: theme.muted }}>{goal.dailyCarbs} g</td>
                      </tr>
                      <tr>
                        <td style={{ color: theme.muted }}>Fats</td>
                        <td style={{ color: theme.muted }}>{goal.dailyFats} g</td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="mt-3">
                    <small style={{ color: theme.muted }}>Progress</small>
                    <div style={{ width: "100%", height: "12px", background: theme.border, borderRadius: "6px", marginTop: "4px" }}>
                      <div style={{ width: "100%", height: "100%", background: theme.accent, borderRadius: "6px" }}></div>
                    </div>
                  </div>

                  {message && <p className="text-success mt-3">{message}</p>}
                </div>
              </div>

            </div>
          </div>

          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Goal;
