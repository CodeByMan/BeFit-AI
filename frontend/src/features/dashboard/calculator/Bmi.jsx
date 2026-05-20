import React, { useState } from "react";
import Header from "../layout/HeaderUser";
import Footer from "../layout/FooterUser";
import { useTheme } from "../../../context/ThemeContext";

const Bmi = () => {
  const { darkMode } = useTheme();

  const [form, setForm] = useState({
    weight: "",
    heightCm: "",
    heightFt: "",
    heightIn: "",
    unit: "metric",
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const switchUnit = (unit) => {
    setForm({
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
    let { weight, heightCm, heightFt, heightIn, unit } = form;
    weight = parseFloat(weight);

    if (weight < 1) return alert("Weight must be at least 1");

    let height;
    if (unit === "metric") {
      height = parseFloat(heightCm);
      if (height < 1) return alert("Height must be at least 1 cm");
      setResult((weight / ((height / 100) ** 2)).toFixed(1));
    } else {
      height = (parseFloat(heightFt) || 0) * 12 + (parseFloat(heightIn) || 0);
      if (height < 1) return alert("Height must be at least 1 inch");
      setResult(((weight / height ** 2) * 703).toFixed(1));
    }
  };

  const getBmiCategory = (bmi) => {
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal";
    if (bmi < 30) return "Overweight";
    return "Obese";
  };

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

  return (
    <div
      className="layout-wrapper layout-content-navbar"
      style={{ background: theme.bg, minHeight: "100vh" }}
    >
      <div className="layout-container">
        <Header />

        <div className="layout-page">
          <div className="container mt-4">

            {/* ===== TODAY SNAPSHOT ===== */}
            <div className="row mb-4">
              <div className="col-md-3 col-6 mb-3">
                <div
                  className="p-3 text-center h-100"
                  style={{
                    background: theme.panel,
                    border: `1px solid ${theme.border}`,
                    borderRadius: "0.75rem",
                  }}
                >
                  <small style={{ color: theme.muted }}>Weight</small>
                  <div className="fw-semibold">
                    {form.weight
                      ? `${form.weight} ${
                          form.unit === "metric" ? "kg" : "lbs"
                        }`
                      : "--"}
                  </div>
                </div>
              </div>

              <div className="col-md-3 col-6 mb-3">
                <div className="p-3 text-center h-100"
                  style={{
                    background: theme.panel,
                    border: `1px solid ${theme.border}`,
                    borderRadius: "0.75rem",
                  }}>
                  <small style={{ color: theme.muted }}>BMI</small>
                  <div className="fw-semibold">{result || "--"}</div>
                </div>
              </div>

              <div className="col-md-3 col-6 mb-3">
                <div className="p-3 text-center h-100"
                  style={{
                    background: theme.panel,
                    border: `1px solid ${theme.border}`,
                    borderRadius: "0.75rem",
                  }}>
                  <small style={{ color: theme.muted }}>Status</small>
                  <div className="fw-semibold">
                    {result ? getBmiCategory(result) : "--"}
                  </div>
                </div>
              </div>

              <div className="col-md-3 col-6 mb-3">
                <div className="p-3 text-center h-100"
                  style={{
                    background: theme.panel,
                    border: `1px solid ${theme.border}`,
                    borderRadius: "0.75rem",
                  }}>
                  <small style={{ color: theme.muted }}>Goal</small>
                  <div className="fw-semibold text-success">Maintain</div>
                </div>
              </div>
            </div>

            {/* ===== MAIN ROW (EQUAL HEIGHT) ===== */}
            <div className="row align-items-stretch">
              {/* LEFT */}
              <div className="col-lg-7 mb-4">
                <div
                  className="p-4 h-100"
                  style={{
                    background: theme.panel,
                    border: `1px solid ${theme.border}`,
                    borderRadius: "0.75rem",
                  }}
                >
                  <h5>BMI Calculator</h5>
                  <p className="small" style={{ color: theme.muted }}>
                    Calculate your body mass index accurately.
                  </p>

                  {/* UNIT */}
                  <div className="d-flex gap-2 mb-3">
                    {["metric", "us"].map((u) => (
                      <button
                        key={u}
                        className="btn btn-sm"
                        onClick={() => switchUnit(u)}
                        style={{
                          background:
                            form.unit === u ? theme.accent : "transparent",
                          color:
                            form.unit === u ? "#fff" : theme.text,
                          border: `1px solid ${theme.border}`,
                        }}
                      >
                        {u === "metric" ? "Metric" : "US"} Units
                      </button>
                    ))}
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label small">
                        Weight ({form.unit === "metric" ? "kg" : "lbs"})
                      </label>
                      <input
                        type="number"
                        name="weight"
                        value={form.weight}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>

                    {form.unit === "metric" ? (
                      <div className="mb-3">
                        <label className="form-label small">Height (cm)</label>
                        <input
                          type="number"
                          name="heightCm"
                          value={form.heightCm}
                          onChange={handleChange}
                          className="form-control"
                        />
                      </div>
                    ) : (
                      <div className="mb-3">
                        <label className="form-label small">Height</label>
                        <div className="row g-2">
                          <div className="col">
                            <input
                              type="number"
                              name="heightFt"
                              placeholder="ft"
                              onChange={handleChange}
                              className="form-control"
                            />
                          </div>
                          <div className="col">
                            <input
                              type="number"
                              name="heightIn"
                              placeholder="in"
                              onChange={handleChange}
                              className="form-control"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="d-flex gap-2 mt-3">
                      <button
                        type="submit"
                        className="btn btn-sm"
                        style={{ background: theme.accent, color: "#fff" }}
                      >
                        Calculate
                      </button>
                      <button
                        type="button"
                        onClick={handleReset}
                        className="btn btn-sm btn-outline-secondary"
                      >
                        Reset
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* RIGHT */}
              <div className="col-lg-5 mb-4">
                <div
                  className="p-4 h-100"
                  style={{
                    background: theme.panel,
                    border: `1px solid ${theme.border}`,
                    borderRadius: "0.75rem",
                  }}
                >
                  <h6>Result Overview</h6>

                  {!result ? (
                    <div className="text-center py-5">
                      <div style={{ fontSize: "2rem" }}>📊</div>
                      <p className="small" style={{ color: theme.muted }}>
                        Enter details to view BMI result.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="mb-3">
                        <small style={{ color: theme.muted }}>Your BMI</small>
                        <div className="fs-2 fw-semibold">{result}</div>
                        <span
                          className="badge"
                          style={{ background: theme.accent }}
                        >
                          {getBmiCategory(result)}
                        </span>
                      </div>

                      {/* BMI CATEGORY REFERENCE */}
                      <ul className="small ps-3" style={{ color: theme.muted }}>
                        <li>Underweight: &lt; 18.5</li>
                        <li>Normal: 18.5 – 24.9</li>
                        <li>Overweight: 25 – 29.9</li>
                        <li>Obese: ≥ 30</li>
                      </ul>
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

export default Bmi;
