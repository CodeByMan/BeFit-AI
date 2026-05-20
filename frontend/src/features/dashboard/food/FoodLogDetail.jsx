// frontend/src/features/dashboard/food/FoodLogDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../../api/Api";
import { toast } from "react-toastify";
import Header from "../layout/HeaderUser";
import Footer from "../layout/FooterUser";
import { useTheme } from "../../../context/ThemeContext";
import { FaFilePdf } from "react-icons/fa";

export default function FoodLogDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const [log, setLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const orange = "hsl(12, 98%, 52%)";
  const orangeLight = "hsl(12, 98%, 65%)";
  const orangeDark = "hsl(12, 98%, 40%)";

  const themeColors = {
    light: {
      background: "#f4f6f8",
      cardBackground: "#fff",
      textPrimary: "#212529",
      textSecondary: "#6c757d",
      tableHeader: "#f3f4f6",
      tableRow: "#fff",
      tableRowAlt: "#f9fafb",
      border: "1px solid #e0e0e0",
      shadow: "0 6px 20px rgba(0,0,0,0.08)",
    },
    dark: {
      background: "#121212",
      cardBackground: "#1f1f1f",
      textPrimary: "#f8f9fa",
      textSecondary: "#9ca3af",
      tableHeader: "#222831",
      tableRow: "#1a1f24",
      tableRowAlt: "#111517",
      border: "1px solid #333",
      shadow: "0 6px 20px rgba(0,0,0,0.4)",
    },
  };

  const theme = darkMode ? themeColors.dark : themeColors.light;

  const fetchLog = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/foodlog/${id}`);
      setLog(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch food log");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLog();
  }, [id]);

  const calculateMealTotals = (meal) => {
    const totals = { calories: 0, carbs: 0, protein: 0, fats: 0 };
    meal.items.forEach((item) => {
      totals.calories += Number(item.calories || 0);
      totals.carbs += Number(item.carbs || 0);
      totals.protein += Number(item.protein || 0);
      totals.fats += Number(item.fats || 0);
    });
    return totals;
  };

  const calculateGrandTotals = () => {
    const totals = { calories: 0, carbs: 0, protein: 0, fats: 0 };
    log?.meals.forEach((meal) => {
      const mTotals = calculateMealTotals(meal);
      totals.calories += mTotals.calories;
      totals.carbs += mTotals.carbs;
      totals.protein += mTotals.protein;
      totals.fats += mTotals.fats;
    });
    return totals;
  };

  const handleExportPdf = async () => {
    try {
      setExporting(true);
      const res = await API.get(`/foodlog/${id}/export-pdf`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `foodlog-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      toast.error("Failed to export PDF");
    } finally {
      setExporting(false);
    }
  };

  if (loading)
    return (
      <div style={{ color: theme.textPrimary, padding: "2rem", textAlign: "center" }}>
        Loading...
      </div>
    );
  if (!log)
    return (
      <div style={{ color: theme.textPrimary, padding: "2rem", textAlign: "center" }}>
        No data found.
      </div>
    );

  const grandTotals = calculateGrandTotals();

  return (
    <div
      className="layout-wrapper layout-content-navbar"
      style={{
        backgroundColor: theme.background,
        minHeight: "100vh",
        transition: "0.3s",
        paddingBottom: "3rem",
      }}
    >
      <div className="layout-container">
        <Header />
        <div className="layout-page">
          <div className="content-wrapper">
            <div className="container-xxl flex-grow-1 container-p-y">
              <div className="container" style={{ maxWidth: "900px" }}>
                <div
                  className="card p-5"
                  style={{
                    backgroundColor: theme.cardBackground,
                    borderRadius: "2rem",
                    boxShadow: theme.shadow,
                    border: theme.border,
                    color: theme.textPrimary,
                    position: "relative",
                  }}
                >
                  {/* PDF Export Button */}
                  <button
                    onClick={handleExportPdf}
                    disabled={exporting}
                    style={{
                      position: "absolute",
                      top: "1.5rem",
                      right: "1.5rem",
                      background: `linear-gradient(90deg, ${orangeLight}, ${orange}, ${orangeDark})`,
                      border: "none",
                      borderRadius: "1rem",
                      color: "#fff",
                      padding: "0.6rem 1rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      transition: "0.3s",
                    }}
                  >
                    <FaFilePdf />
                    {exporting ? "Exporting..." : "Export PDF"}
                  </button>

                  {/* Header */}
                  <h1
                    style={{
                      fontWeight: 800,
                      fontSize: "2rem",
                      marginBottom: "0.5rem",
                      background: `linear-gradient(90deg, ${orangeLight}, ${orange}, ${orangeDark})`,
                      WebkitBackgroundClip: "text",
                      color: "transparent",
                    }}
                  >
                    {log.title}
                  </h1>
                  <p style={{ color: theme.textSecondary, marginBottom: "2rem" }}>
                    {log.date ? new Date(log.date).toDateString() : "No date"}
                  </p>

                  {/* Meals */}
                  {log.meals.map((meal, mealIndex) => {
                    const totals = calculateMealTotals(meal);
                    return (
                      <div
                        key={mealIndex}
                        style={{
                          backgroundColor: theme.cardBackground,
                          padding: "1.5rem",
                          marginBottom: "2rem",
                          borderRadius: "1rem",
                          boxShadow: darkMode
                            ? "0 8px 25px rgba(0,0,0,0.6)"
                            : "0 8px 25px rgba(0,0,0,0.1)",
                          transition: "transform 0.2s",
                        }}
                      >
                        {/* Meal Title */}
                        <h3
                          style={{
                            marginBottom: "1rem",
                            color: orange,
                            borderBottom: `2px solid ${orange}`,
                            paddingBottom: "0.5rem",
                          }}
                        >
                          Meal {mealIndex + 1}: {meal.name}
                        </h3>

                        {/* Table */}
                        <div style={{ overflowX: "auto" }}>
                          <table
                            style={{
                              width: "100%",
                              borderCollapse: "separate",
                              borderSpacing: 0,
                              borderRadius: "0.5rem",
                              overflow: "hidden",
                              fontSize: "0.95rem",
                            }}
                          >
                            <thead>
                              <tr style={{ backgroundColor: theme.tableHeader }}>
                                <th style={thStyle}>Item</th>
                                <th style={thStyle}>Calories</th>
                                <th style={thStyle}>Carbs</th>
                                <th style={thStyle}>Protein</th>
                                <th style={thStyle}>Fats</th>
                              </tr>
                            </thead>
                            <tbody>
                              {meal.items.map((item, idx) => (
                                <tr
                                  key={idx}
                                  style={{
                                    backgroundColor:
                                      idx % 2 === 0 ? theme.tableRow : theme.tableRowAlt,
                                    transition: "background 0.3s",
                                  }}
                                >
                                  <td style={tdStyle}>{item.name}</td>
                                  <td style={tdStyle}>{item.calories || 0}</td>
                                  <td style={tdStyle}>{item.carbs || 0}</td>
                                  <td style={tdStyle}>{item.protein || 0}</td>
                                  <td style={tdStyle}>{item.fats || 0}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Meal Totals */}
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-around",
                            marginTop: "1rem",
                            padding: "0.75rem",
                            borderTop: `1px solid ${theme.border}`,
                            fontWeight: 600,
                          }}
                        >
                          <div style={{ textAlign: "center" }}>
                            <div style={{ color: orange }}>{totals.calories}</div>
                            <div style={{ fontSize: "0.8rem", color: theme.textSecondary }}>
                              Calories
                            </div>
                          </div>
                          <div style={{ textAlign: "center" }}>
                            <div style={{ color: orange }}>{totals.carbs}</div>
                            <div style={{ fontSize: "0.8rem", color: theme.textSecondary }}>
                              Carbs
                            </div>
                          </div>
                          <div style={{ textAlign: "center" }}>
                            <div style={{ color: orange }}>{totals.protein}</div>
                            <div style={{ fontSize: "0.8rem", color: theme.textSecondary }}>
                              Protein
                            </div>
                          </div>
                          <div style={{ textAlign: "center" }}>
                            <div style={{ color: orange }}>{totals.fats}</div>
                            <div style={{ fontSize: "0.8rem", color: theme.textSecondary }}>
                              Fats
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Grand Total */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-around",
                      padding: "1rem",
                      backgroundColor: darkMode ? "#1a1a1a" : "#f1f3f5",
                      borderRadius: "1rem",
                      fontWeight: 700,
                      color: orange,
                      marginBottom: "2rem",
                    }}
                  >
                    <div style={{ textAlign: "center" }}>
                      <div>{grandTotals.calories}</div>
                      <div style={{ fontSize: "0.85rem", color: theme.textSecondary }}>
                        Total Calories
                      </div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div>{grandTotals.carbs}</div>
                      <div style={{ fontSize: "0.85rem", color: theme.textSecondary }}>
                        Total Carbs
                      </div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div>{grandTotals.protein}</div>
                      <div style={{ fontSize: "0.85rem", color: theme.textSecondary }}>
                        Total Protein
                      </div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div>{grandTotals.fats}</div>
                      <div style={{ fontSize: "0.85rem", color: theme.textSecondary }}>
                        Total Fats
                      </div>
                    </div>
                  </div>

                  {/* Back Button */}
                  <button
                    onClick={() => navigate(-1)}
                    style={{
                      padding: "0.6rem 1.2rem",
                      backgroundColor: orange,
                      color: "#fff",
                      border: "none",
                      borderRadius: "1rem",
                      cursor: "pointer",
                      fontWeight: 700,
                      transition: "0.3s",
                    }}
                  >
                    Back
                  </button>
                </div>
              </div>
            </div>
            <div className="content-backdrop fade"></div>
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}

// Table styles
const thStyle = {
  padding: "0.75rem",
  textAlign: "left",
  fontWeight: "bold",
  borderBottom: "1px solid #ccc",
};

const tdStyle = {
  padding: "0.75rem",
  textAlign: "left",
  borderBottom: "1px solid #eee",
};
