// frontend/src/features/macros/MacroCalculator.jsx
import React, { useState } from "react";
import Header from "../layout/HeaderUser";
import Footer from "../layout/FooterUser";
import { useTheme } from "../../../context/ThemeContext";

const MacroCalculator = () => {
  const { darkMode } = useTheme();

  const [unit, setUnit] = useState("metric"); // metric or us
  const [form, setForm] = useState({
    weight: "",
    heightCm: "",
    heightFt: "",
    heightIn: "",
    age: "",
    gender: "",
    activity: "",
    goal: "",
  });

  const [result, setResult] = useState(null);

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

  const activityLevels = [
    { label: "Sedentary (little or no exercise)", multiplier: 1.2, time: "15-30 mins/week" },
    { label: "Light (1-3 times/week)", multiplier: 1.375, time: "15-30 mins/day" },
    { label: "Moderate (3-5 times/week)", multiplier: 1.55, time: "30-45 mins/day" },
    { label: "Active (6-7 times/week)", multiplier: 1.725, time: "45-60 mins/day" },
    { label: "Very Active (intense daily)", multiplier: 1.9, time: "2+ hours/day" },
  ];

  const goals = [
    { label: "Mild weight gain 0.5 lb (0.25 kg)/week", calAdjust: 250 },
    { label: "Weight gain 1 lb (0.5 kg)/week", calAdjust: 500 },
    { label: "Extreme weight gain 2 lb (1 kg)/week", calAdjust: 1000 },
    { label: "Maintain weight", calAdjust: 0 },
    { label: "Mild weight loss 0.5 lb (0.25 kg)/week", calAdjust: -250 },
    { label: "Weight loss 1 lb (0.5 kg)/week", calAdjust: -500 },
    { label: "Extreme weight loss 2 lb (1 kg)/week", calAdjust: -1000 },
  ];

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const switchUnit = (u) => {
    setUnit(u);
    handleReset();
  };

  const handleReset = () => {
    setForm({
      weight: "",
      heightCm: "",
      heightFt: "",
      heightIn: "",
      age: "",
      gender: "",
      activity: "",
      goal: "",
    });
    setResult(null);
  };

  const validateForm = () => {
    const { weight, heightCm, heightFt, heightIn, age, gender, activity, goal } = form;
    if (!weight || !age || !gender || !activity || !goal) return false;
    if (unit === "metric" && !heightCm) return false;
    if (unit === "us" && (!heightFt || !heightIn)) return false;
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return alert("Please fill all required fields");

    let weight = parseFloat(form.weight);
    let height;

    if (unit === "metric") {
      height = parseFloat(form.heightCm) / 100; // meters
    } else {
      height = ((parseFloat(form.heightFt) || 0) * 12 + (parseFloat(form.heightIn) || 0)) * 0.0254; // meters
      weight = weight * 0.453592; // lbs -> kg
    }

    const age = parseInt(form.age);
    const gender = form.gender;

    // BMR (Mifflin-St Jeor)
    let BMR =
      gender === "female"
        ? 10 * weight + 6.25 * height * 100 - 5 * age - 161
        : 10 * weight + 6.25 * height * 100 - 5 * age + 5;

    // Activity multiplier
    const activityMultiplier = activityLevels.find(a => a.label === form.activity)?.multiplier || 1.2;
    let TDEE = BMR * activityMultiplier;

    // Goal adjustment
    const goalAdjust = goals.find(g => g.label === form.goal)?.calAdjust || 0;
    TDEE += goalAdjust;

    // --- Online calculator matching macros ---
    // Protein: 1–2.2 g/kg, ideal ~1.7 g/kg
    const proteinLow = Math.round(weight * 1.0);
    const proteinHigh = Math.round(weight * 2.2);
    const proteinIdeal = Math.round(weight * 1.7);

    // Fat: 22–28% calories, ideal 25%
    const fatLow = Math.round((TDEE * 0.22) / 9);
    const fatHigh = Math.round((TDEE * 0.28) / 9);
    const fatIdeal = Math.round((TDEE * 0.25) / 9);

    // Carbs: remaining calories
    const carbsLow = Math.round((TDEE - (proteinHigh * 4 + fatLow * 9)) / 4);
    const carbsHigh = Math.round((TDEE - (proteinLow * 4 + fatHigh * 9)) / 4);
    const carbsIdeal = Math.round((TDEE - (proteinIdeal * 4 + fatIdeal * 9)) / 4);

    setResult({
      calories: Math.round(TDEE),
      protein: proteinIdeal,
      proteinLow,
      proteinHigh,
      fats: fatIdeal,
      fatLow,
      fatHigh,
      carbs: carbsIdeal,
      carbLow: carbsLow,
      carbHigh: carbsHigh,
      activityText: form.activity,
    });
  };

  return (
    <div className="layout-wrapper layout-content-navbar" style={{ background: theme.bg, minHeight: "100vh" }}>
      <div className="layout-container">
        <Header />
        <div className="layout-page">
          <div className="container mt-4">
            <div className="row">
              {/* Left Calculator */}
              <div className="col-lg-6 mb-4">
                <div className="p-4 h-100" style={{ background: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "0.75rem" }}>
                  <h5>Macro Calculator</h5>
                  <p className="small" style={{ color: theme.muted }}>Enter your details to calculate your macros.</p>

                  {/* Unit Toggle */}
                  <div className="mb-3 d-flex gap-2">
                    {["metric", "us"].map(u => (
                      <button
                        key={u}
                        className="btn btn-sm"
                        style={{
                          background: unit === u ? theme.accent : "transparent",
                          color: unit === u ? "#fff" : theme.text,
                          border: `1px solid ${theme.border}`
                        }}
                        onClick={() => switchUnit(u)}
                      >
                        {u === "metric" ? "Metric" : "US"} Units
                      </button>
                    ))}
                  </div>

                  <form onSubmit={handleSubmit}>
                    {/* Weight + Height */}
                    <div className="row g-3 mb-3">
                      <div className="col-md-6">
                        <label className="form-label small">Weight ({unit === "metric" ? "kg" : "lbs"})</label>
                        <input type="number" name="weight" value={form.weight} onChange={handleChange} className="form-control" required />
                      </div>
                      <div className="col-md-6">
                        {unit === "metric" ? (
                          <>
                            <label className="form-label small">Height (cm)</label>
                            <input type="number" name="heightCm" value={form.heightCm} onChange={handleChange} className="form-control" required />
                          </>
                        ) : (
                          <div className="row g-2">
                            <div className="col">
                              <label className="form-label small">Height (ft)</label>
                              <input type="number" name="heightFt" placeholder="ft" onChange={handleChange} className="form-control" required />
                            </div>
                            <div className="col">
                              <label className="form-label small">Height (in)</label>
                              <input type="number" name="heightIn" placeholder="in" onChange={handleChange} className="form-control" required />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Age + Gender */}
                    <div className="row g-3 mb-3">
                      <div className="col-md-6">
                        <label className="form-label small">Age</label>
                        <input type="number" name="age" value={form.age} onChange={handleChange} className="form-control" required />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small">Gender</label>
                        <select name="gender" value={form.gender} onChange={handleChange} className="form-select" required>
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                      </div>
                    </div>

                    {/* Activity */}
                    <div className="mb-3">
                      <label className="form-label small">Activity Level</label>
                      <select name="activity" value={form.activity} onChange={handleChange} className="form-select" required>
                        <option value="">Select Activity</option>
                        {activityLevels.map((a, idx) => (
                          <option key={idx} value={a.label}>{a.label} ({a.time})</option>
                        ))}
                      </select>
                    </div>

                    {/* Goal */}
                    <div className="mb-3">
                      <label className="form-label small">Goal</label>
                      <select name="goal" value={form.goal} onChange={handleChange} className="form-select" required>
                        <option value="">Select Goal</option>
                        {goals.map((g, idx) => (
                          <option key={idx} value={g.label}>{g.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="d-flex gap-2">
                      <button type="submit" className="btn btn-sm" style={{ background: theme.accent, color: "#fff" }}>Calculate</button>
                      <button type="button" onClick={handleReset} className="btn btn-sm btn-outline-secondary">Reset</button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Right Result Card */}
              <div className="col-lg-6 mb-4">
                <div
                  className="p-4 h-100"
                  style={{
                    background: result ? (darkMode ? "rgba(30,30,30,0.85)" : "#fff3e0") : (darkMode ? "rgba(30,30,30,0.85)" : "#fef6ee"),
                    border: `1px solid ${theme.border}`,
                    borderRadius: "0.75rem",
                    minHeight: "300px",
                    overflow: "hidden",
                  }}
                >
                  {!result ? (
                    <div className="text-center py-5">
                      <div style={{ fontSize: "2rem" }}>📊</div>
                      <p className="small" style={{ color: theme.muted }}>
                        Enter details to view macro result.
                      </p>
                    </div>
                  ) : (
                    <>
                      <h5 style={{ color: theme.text }}>Macro Result</h5>

                      {/* Calories */}
                      <div className="mb-3">
                        <small>Calories</small>
                        <div className="fw-semibold fs-4">{result.calories} kcal</div>
                      </div>

                      {/* Protein */}
                      <div className="mb-3">
                        <small>Protein</small>
                        <div className="fw-semibold fs-4">{result.protein} g</div>
                        <div className="small text-muted">Range: {result.proteinLow} - {result.proteinHigh} g</div>
                      </div>

                      {/* Fats */}
                      <div className="mb-3">
                        <small>Fats</small>
                        <div className="fw-semibold fs-4">{result.fats} g</div>
                        <div className="small text-muted">Range: {result.fatLow} - {result.fatHigh} g</div>
                      </div>

                      {/* Carbs */}
                      <div className="mb-3">
                        <small>Carbs</small>
                        <div className="fw-semibold fs-4">{result.carbs} g</div>
                        <div className="small text-muted">Range: {result.carbLow} - {result.carbHigh} g</div>
                      </div>

                      {/* Health Guidance */}
                      <div className="mt-4">
                        <h6>Health Guidance:</h6>
                        <ul className="mb-0">
                          <li>Walk at least 30 minutes daily.</li>
                          <li>Drink 8 liters of water daily.</li>
                          <li>Sleep 7–8 hours each night.</li>
                        </ul>
                      </div>
                    </>
                  )}
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

export default MacroCalculator;
