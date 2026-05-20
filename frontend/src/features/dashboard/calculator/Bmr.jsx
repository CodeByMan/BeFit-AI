import React, { useState } from "react";
import Header from "../layout/HeaderUser";
import Footer from "../layout/FooterUser";
import { useTheme } from "../../../context/ThemeContext";

const Bmr = () => {
  const { darkMode } = useTheme();

  const [form, setForm] = useState({
    age: "",
    gender: "male",
    weight: "",
    heightCm: "",
    heightFt: "",
    heightIn: "",
    unit: "metric",
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const switchUnit = (unit) => {
    setForm({
      age: "",
      gender: "male",
      weight: "",
      heightCm: "",
      heightFt: "",
      heightIn: "",
      unit,
    });
    setResult(null);
  };

  const handleReset = () => {
    setForm({
      age: "",
      gender: "male",
      weight: "",
      heightCm: "",
      heightFt: "",
      heightIn: "",
      unit: "metric",
    });
    setResult(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let { age, gender, weight, heightCm, heightFt, heightIn, unit } = form;

    age = parseInt(age);
    weight = parseFloat(weight);

    if (age < 1 || weight < 1) return alert("Age and weight must be at least 1");

    let height;
    if (unit === "metric") {
      height = parseFloat(heightCm);
      if (!height || height < 1) return alert("Height must be at least 1 cm");
    } else {
      const ft = parseFloat(heightFt) || 0;
      const inch = parseFloat(heightIn) || 0;
      height = ft * 30.48 + inch * 2.54;
      weight = weight * 0.453592;
      if (height < 1) return alert("Height must be at least 1 inch");
    }

    let bmr;
    if (gender === "male") bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    else bmr = 10 * weight + 6.25 * height - 5 * age - 161;

    const activityLevels = [
      { label: "Sedentary", multiplier: 1.2 },
      { label: "Light Exercise", multiplier: 1.375 },
      { label: "Moderate Exercise", multiplier: 1.465 },
      { label: "Active", multiplier: 1.55 },
      { label: "Very Active", multiplier: 1.725 },
      { label: "Extreme", multiplier: 1.9 },
    ];

    const table = activityLevels.map((item) => ({
      label: item.label,
      calories: Math.round(bmr * item.multiplier),
    }));

    setResult({ bmr: Math.round(bmr), table });
  };

  const theme = darkMode
    ? {
        bg: "#0f1115",
        panel: "rgba(30,30,30,0.85)",
        textPrimary: "hsl(12, 98%, 52%)",
        textSecondary: "#fff",
        inputBg: "#343a40",
        inputText: "#fff",
        inputBorder: "#6c757d",
        buttonPrimary: "hsl(12, 98%, 52%)",
        buttonSecondary: "#6c757d",
        tableHeader: "#343a40",
        tableRow: "#212529",
        shadow: "0 8px 20px rgba(0, 0, 0, 0.85)",
        tileBg: "#1e1e2a",
      }
    : {
        bg: "#f4f6f8",
        panel: "#fff",
        textPrimary: "#212529",
        textSecondary: "#6c757d",
        inputBg: "#e9ecef",
        inputText: "#212529",
        inputBorder: "#ced4da",
        buttonPrimary: "hsl(12, 98%, 52%)",
        buttonSecondary: "#6c757d",
        tableHeader: "#e9ecef",
        tableRow: "#fff",
        shadow: "0 8px 20px rgba(0,0,0,0.1)",
        tileBg: "#fff",
      };

  return (
    <div
      className="layout-wrapper layout-content-navbar"
      style={{ backgroundColor: theme.bg, minHeight: "100vh" }}
    >
      <div className="layout-container">
        <Header />
        <div className="layout-page">
          <div className="container mt-4">

            {/* === FORM & RESULT === */}
            <div className="row g-4">

              {/* LEFT: FORM */}
              <div className="col-lg-6">
                <div
                  className="card p-4 h-100 shadow"
                  style={{ backgroundColor: theme.panel, borderRadius: "1rem" }}
                >
                  <h4 style={{ color: theme.textPrimary, marginBottom: "1rem" }}>
                    BMR Calculator
                  </h4>

                  {/* Unit Toggle */}
                  <div className="btn-group w-100 mb-3">
                    {["metric", "us"].map((u) => (
                      <button
                        key={u}
                        type="button"
                        className={`btn btn-sm ${form.unit === u ? "btn-primary" : "btn-outline-secondary"}`}
                        onClick={() => switchUnit(u)}
                      >
                        {u === "metric" ? "Metric Units" : "US Units"}
                      </button>
                    ))}
                  </div>

                  {/* FORM */}
                  <form onSubmit={handleSubmit} className="row g-3">
                    <div className="col-12">
                      <label className="form-label text-secondary">Age</label>
                      <input
                        type="number"
                        name="age"
                        value={form.age}
                        onChange={handleChange}
                        min="1"
                        required
                        className="form-control"
                        style={{
                          backgroundColor: theme.inputBg,
                          color: theme.inputText,
                          borderColor: theme.inputBorder,
                        }}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label text-secondary mb-2">Gender</label>
                      <div className="btn-group w-100">
                        {["male", "female"].map((g) => (
                          <React.Fragment key={g}>
                            <input
                              type="radio"
                              className="btn-check"
                              name="gender"
                              id={`gender-${g}`}
                              value={g}
                              checked={form.gender === g}
                              onChange={handleChange}
                            />
                            <label className="btn btn-outline-primary" htmlFor={`gender-${g}`}>
                              {g.charAt(0).toUpperCase() + g.slice(1)}
                            </label>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>

                    <div className="col-12">
                      <label className="form-label text-secondary">Weight ({form.unit === "metric" ? "kg" : "lbs"})</label>
                      <input
                        type="number"
                        name="weight"
                        value={form.weight}
                        onChange={handleChange}
                        min="1"
                        required
                        className="form-control"
                        style={{
                          backgroundColor: theme.inputBg,
                          color: theme.inputText,
                          borderColor: theme.inputBorder,
                        }}
                      />
                    </div>

                    {form.unit === "metric" ? (
                      <div className="col-12">
                        <label className="form-label text-secondary">Height (cm)</label>
                        <input
                          type="number"
                          name="heightCm"
                          value={form.heightCm}
                          onChange={handleChange}
                          min="1"
                          required
                          className="form-control"
                          style={{
                            backgroundColor: theme.inputBg,
                            color: theme.inputText,
                            borderColor: theme.inputBorder,
                          }}
                        />
                      </div>
                    ) : (
                      <div className="col-12">
                        <label className="form-label text-secondary">Height (ft/in)</label>
                        <div className="d-flex gap-2">
                          <input
                            type="number"
                            name="heightFt"
                            placeholder="ft"
                            value={form.heightFt}
                            onChange={handleChange}
                            min="0"
                            required
                            className="form-control"
                            style={{
                              backgroundColor: theme.inputBg,
                              color: theme.inputText,
                              borderColor: theme.inputBorder,
                            }}
                          />
                          <input
                            type="number"
                            name="heightIn"
                            placeholder="in"
                            value={form.heightIn}
                            onChange={handleChange}
                            min="0"
                            className="form-control"
                            style={{
                              backgroundColor: theme.inputBg,
                              color: theme.inputText,
                              borderColor: theme.inputBorder,
                            }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="col-12 d-flex gap-2 mt-3">
                      <button
                        type="submit"
                        className="btn btn-primary w-50"
                        style={{ backgroundColor: theme.buttonPrimary }}
                      >
                        Calculate
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary w-50"
                        style={{ backgroundColor: theme.buttonSecondary }}
                        onClick={handleReset}
                      >
                        Reset
                      </button>
                    </div>
                  </form>
                </div>
              </div>

          {/* RIGHT: RESULT */}
          <div className="col-lg-6">
            <div className="row g-3">
              {/* BMR Card */}
              <div className="col-12">
                <div
                  className="card p-4 shadow h-100"
                  style={{ backgroundColor: theme.panel, borderRadius: "1rem" }}
                >
                  <h5 style={{ color: theme.textPrimary }}>Your BMR</h5>
                  <p className="fs-3 fw-bold text-primary">
                    {result ? result.bmr.toLocaleString() : "--"} kcal/day
                  </p>
                  <p className="small text-secondary">
                    Basal Metabolic Rate is the number of calories your body needs at rest.
                  </p>
                </div>
              </div>

              {/* Activity Table / Placeholder */}
              <div className="col-12">
                <div
                  className="card p-3 shadow h-100"
                  style={{
                    backgroundColor: theme.panel,
                    borderRadius: "1rem",
                    minHeight: "350px", // match calculator height
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  {!result ? (
                    <div className="d-flex flex-column align-items-center">
                      <span className="fs-1 mb-3">📊</span>
                      <p style={{ color: theme.textSecondary }}>
                        Your daily calorie needs will appear here.
                      </p>
                    </div>
                  ) : (
                    <>
                      <h5 style={{ color: theme.textPrimary }}>Daily Calorie Needs</h5>
                      <table
                        className="table table-hover table-striped mt-2 mb-0"
                        style={{ color: theme.textPrimary }}
                      >
                        <thead style={{ backgroundColor: theme.tableHeader }}>
                          <tr>
                            <th>Activity Level</th>
                            <th>Calories</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.table.map((row, i) => (
                            <tr key={i} style={{ backgroundColor: theme.tableRow }}>
                              <td>{row.label}</td>
                              <td>{row.calories.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <ul className="mt-3 small text-secondary">
                        <li>Exercise: 15–30 min elevated heart rate activity.</li>
                        <li>Intense: 45–120 min elevated heart rate activity.</li>
                        <li>Very intense: 2+ hours of elevated heart rate activity.</li>
                      </ul>
                    </>
                  )}
                </div>
              </div>
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

export default Bmr;
