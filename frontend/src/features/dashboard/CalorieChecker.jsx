import React, { useState } from "react";
import API from "../../api/Api";
import Header from "./layout/HeaderUser";
import Footer from "./layout/FooterUser";
import { useTheme } from "../../context/ThemeContext";

const CalorieChecker = () => {
  const { darkMode } = useTheme();

  const [query, setQuery] = useState("");
  const [weight, setWeight] = useState(100);
  const [unit, setUnit] = useState("g");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNutrition = async () => {
    try {
      setLoading(true);
      setError(null);
      setResult(null);

      const res = await API.post("/nutrition", { query, weight, unit });
      setResult(res.data);
    } catch (err) {
      setError(err?.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setQuery("");
    setWeight(100);
    setUnit("g");
    setResult(null);
    setError(null);
  };

  const theme = darkMode
    ? {
        bg: "#0f1115",
        cardBg: "rgba(30,30,30,0.85)",
        textPrimary: "hsl(12, 98%, 52%)",
        textSecondary: "#fff",
        inputBg: "#343a40",
        inputText: "#fff",
        inputBorder: "#6c757d",
        buttonPrimary: "hsl(12, 98%, 52%)",
        buttonSecondary: "#6c757d",
        tableHeader: "#343a40",
        tableRow: "#212529",
        shadow: "0 4px 15px rgba(0,0,0,0.3)",
        placeholderBg: "#1e1e2a",
      }
    : {
        bg: "#f8f9fa",
        cardBg: "#fff",
        textPrimary: "#212529",
        textSecondary: "#6c757d",
        inputBg: "#fff",
        inputText: "#000",
        inputBorder: "#ced4da",
        buttonPrimary: "hsl(12, 98%, 52%)",
        buttonSecondary: "#6c757d",
        tableHeader: "#e9ecef",
        tableRow: "#fff",
        shadow: "0 4px 12px rgba(0,0,0,0.1)",
        placeholderBg: "#f1f3f5",
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

        {/* === COMPACT TOP HERO SECTION === */}
        <div className="row mb-3">
          <div className="col-12">
            <div
              className="card d-flex flex-column flex-md-row align-items-center justify-content-start p-3 shadow-sm"
              style={{
                backgroundColor: darkMode ? "#1a1a1a" : "#fef9f4",
                color: darkMode ? "#e0e0e0" : "#495057",
                borderRadius: "1.2rem",
                gap: "0.8rem",
              }}
            >
              {/* Left: Illustration / Icon */}
              <div className="d-flex align-items-center justify-content-center" style={{ fontSize: "2.5rem" }}>
                🥗
              </div>

              {/* Right: Text Info */}
              <div className="text-center text-md-start ms-2">
                <h5 style={{ marginBottom: "0.3rem" }}>Check Your Food's Calories</h5>
                <p style={{ marginBottom: "0", fontSize: "0.85rem", color: darkMode ? "#ccc" : "#6c757d" }}>
                  Quickly find out the nutritional value of any food item. Track calories & nutrients effortlessly.
                </p>
              </div>
            </div>
          </div>
        </div>

            {/* === FORM & RESULT === */}
            <div className="row g-4">

              {/* LEFT: FORM */}
              <div className="col-lg-6">
                <div
                  className="card p-4 h-100 shadow"
                  style={{ backgroundColor: theme.cardBg, borderRadius: "1rem" }}
                >
                  <h4 style={{ color: theme.textPrimary, marginBottom: "1rem" }}>
                    Calorie Checker
                  </h4>

                  <div className="mb-3">
                    <label className="form-label text-secondary">Food Name</label>
                    <input
                      type="text"
                      placeholder="Enter food name"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="form-control"
                      style={{
                        backgroundColor: theme.inputBg,
                        color: theme.inputText,
                        borderColor: theme.inputBorder,
                      }}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-secondary">Weight</label>
                    <div className="d-flex gap-2">
                      <input
                        type="number"
                        placeholder="Weight"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="form-control"
                        style={{
                          backgroundColor: theme.inputBg,
                          color: theme.inputText,
                          borderColor: theme.inputBorder,
                        }}
                      />
                      <select
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                        className="form-select"
                        style={{
                          backgroundColor: theme.inputBg,
                          color: theme.inputText,
                          borderColor: theme.inputBorder,
                        }}
                      >
                        <option value="g">grams</option>
                        <option value="oz">oz</option>
                      </select>
                    </div>
                  </div>

                  <div className="d-flex gap-2 mb-3">
                    <button
                      onClick={fetchNutrition}
                      disabled={loading}
                      className="btn"
                      style={{ backgroundColor: theme.buttonPrimary, color: "#fff", flex: 1 }}
                    >
                      {loading ? "Loading..." : "Check Nutrition"}
                    </button>
                    <button
                      onClick={handleReset}
                      className="btn"
                      style={{ backgroundColor: theme.buttonSecondary, color: "#fff", flex: 1 }}
                    >
                      Reset
                    </button>
                  </div>

                  {error && (
                    <p className="text-center" style={{ color: "red" }}>
                      {error}
                    </p>
                  )}
                </div>
              </div>

              {/* RIGHT: RESULT */}
              <div className="col-lg-6">
                <div
                  className="card p-3 shadow h-100 d-flex justify-content-center align-items-center"
                  style={{
                    backgroundColor: theme.cardBg,
                    borderRadius: "1rem",
                    minHeight: "400px",
                  }}
                >
                  {!result ? (
                    <div className="d-flex flex-column align-items-center">
                      <span className="fs-1 mb-3">📊</span>
                      <p style={{ color: theme.textSecondary }}>
                        Nutrition facts will appear here.
                      </p>
                    </div>
                  ) : (
                    <div className="w-100">
                      <h5 style={{ color: theme.textPrimary, marginBottom: "1rem", textAlign: "center" }}>
                        <strong>{result.ingredient} - Nutrition Facts</strong>
                      </h5>
                      <table className="table table-borderless" style={{ color: theme.textPrimary }}>
                        <thead>
                          <tr style={{ backgroundColor: theme.tableHeader }}>
                            <th style={{ width: "60%" }}>Nutrient</th>
                            <th style={{ width: "40%" }}>Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr style={{ backgroundColor: theme.tableRow }}>
                            <td><strong>Weight</strong></td>
                            <td>{result.weightInGrams} g</td>
                          </tr>
                          <tr style={{ backgroundColor: theme.tableRow }}>
                            <td><strong>Calories</strong></td>
                            <td>{result.calories?.toFixed(2)}</td>
                          </tr>
                          <tr style={{ backgroundColor: theme.tableRow }}>
                            <td><strong>Protein</strong></td>
                            <td>{result.protein?.toFixed(2)} g</td>
                          </tr>
                          <tr style={{ backgroundColor: theme.tableRow }}>
                            <td><strong>Carbs</strong></td>
                            <td>{result.carbs?.toFixed(2)} g</td>
                          </tr>
                          <tr style={{ backgroundColor: theme.tableRow }}>
                            <td><strong>Fat</strong></td>
                            <td>{result.fat?.toFixed(2)} g</td>
                          </tr>
                          <tr style={{ backgroundColor: theme.tableRow }}>
                            <td><strong>Fiber</strong></td>
                            <td>{result.fiber?.toFixed(2)} g</td>
                          </tr>
                        </tbody>
                      </table>
                      <p style={{ fontSize: "0.85rem", color: theme.textSecondary, marginTop: "0.5rem" }}>
                        *Nutrition values are provided via the USDA API and may differ from actual values. Use as a general guide only.
                      </p>
                    </div>
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

export default CalorieChecker;
