// frontend/src/features/dashboard/food/FoodLog.jsx
import React, { useEffect, useState } from "react";
import Header from "../layout/HeaderUser";
import Footer from "../layout/FooterUser";
import API from "../../../api/Api";
import { useTheme } from "../../../context/ThemeContext";
import { toast } from "react-toastify";
import { IoSearch, IoCalendarOutline, IoCreateOutline } from "react-icons/io5";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import { BarChart, Bar } from "recharts";
import FoodLogList from "./FoodLogList";
import jsPDF from "jspdf";
import "jspdf-autotable";

// Modal
import Modal from "react-modal";

const MACROS = [
  { key: "calories", label: "Calories", unit: "kcal", color: "#ff7a18" },
  { key: "protein", label: "Protein", unit: "g", color: "#34d399" },
  { key: "carbs", label: "Carbs", unit: "g", color: "#3b82f6" },
  { key: "fats", label: "Fats", unit: "g", color: "#f59e0b" },
];

Modal.setAppElement("#root");

export default function FoodLog() {
  const { darkMode } = useTheme();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ from: "", to: "", search: "", macro: "calories" });
  const [summary, setSummary] = useState({ caloriesIn: 0, protein: 0, carbs: 0, fat: 0 });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentLog, setCurrentLog] = useState(null);

  const theme = darkMode
    ? {
        bg: "#0f0f0f",
        card: "rgba(30,30,30,0.85)",
        border: "1px solid rgba(255,255,255,0.08)",
        text: "#f8f9fa",
        muted: "#9ca3af",
        shadow: "0 10px 30px rgba(0,0,0,0.6)",
      }
    : {
        bg: "#f4f6f8",
        card: "rgba(255,255,255,0.95)",
        border: "1px solid rgba(0,0,0,0.08)",
        text: "#212529",
        muted: "#6c757d",
        shadow: "0 10px 24px rgba(0,0,0,0.12)",
      };

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await API.get("/foodlog", { params: filters });
      setLogs(res.data.logs || []);

      const sum = res.data.logs.reduce(
        (acc, log) => {
          acc.caloriesIn += log.totals.calories;
          acc.protein += log.totals.protein;
          acc.carbs += log.totals.carbs;
          acc.fat += log.totals.fats;
          return acc;
        },
        { caloriesIn: 0, protein: 0, carbs: 0, fat: 0 }
      );
      setSummary(sum);
    } catch {
      toast.error("Failed to load food logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [filters]);

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Meal Plan Report", 14, 22);
    doc.setFontSize(12);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 30);
    doc.text(`From: ${filters.from || "All"} To: ${filters.to || "All"}`, 14, 36);
    doc.text(`Search: ${filters.search || "All"}`, 14, 42);

    let y = 50;
    logs.forEach((log, idx) => {
      doc.setFontSize(14);
      doc.text(`Date: ${new Date(log.date).toDateString()}`, 14, y);
      y += 6;

      log.meals.forEach(meal => {
        doc.setFontSize(12);
        doc.text(`Meal: ${meal.name}`, 18, y);
        y += 6;

        const mealTable = meal.items.map((item, i) => [
          i + 1,
          item.name,
          item.calories,
          item.protein,
          item.carbs,
          item.fats,
        ]);

        doc.autoTable({
          startY: y,
          head: [["#", "Item", "Calories", "Protein", "Carbs", "Fats"]],
          body: mealTable,
          theme: "grid",
          headStyles: { fillColor: [60, 141, 188] },
          margin: { left: 18, right: 14 },
          styles: { fontSize: 10 },
          didDrawPage: (data) => { y = data.cursor.y + 6; },
        });
        y += mealTable.length * 6;
      });

      doc.setFontSize(12);
      doc.text(`Totals - Calories: ${log.totals.calories}, Protein: ${log.totals.protein}, Carbs: ${log.totals.carbs}, Fats: ${log.totals.fat}`, 18, y);
      y += 10;

      if (y > 250) { doc.addPage(); y = 20; }
    });

    // Summary at end
    doc.setFontSize(14);
    doc.text("Summary", 14, y);
    y += 6;
    doc.setFontSize(12);
    doc.text(`Total Calories: ${summary.caloriesIn}`, 18, y);
    y += 6;
    doc.text(`Total Protein: ${summary.protein}`, 18, y);
    y += 6;
    doc.text(`Total Carbs: ${summary.carbs}`, 18, y);
    y += 6;
    doc.text(`Total Fats: ${summary.fat}`, 18, y);

    doc.save("MealPlanReport.pdf");
  };

  // Chart data
  const macroPieData = [
    { name: "Protein", value: summary.protein },
    { name: "Carbs", value: summary.carbs },
    { name: "Fats", value: summary.fat },
  ];
  const lineData = logs.map(log => ({
    date: new Date(log.date).toLocaleDateString(),
    calories: log.totals.calories,
    protein: log.totals.protein,
    carbs: log.totals.carbs,
    fats: log.totals.fats,
  }));
  const COLORS = ["#34d399", "#3b82f6", "#f59e0b"];

  // Edit modal submit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/foodlog/${currentLog._id}`, currentLog);
      toast.success("Meal plan updated!");
      setEditModalOpen(false);
      fetchLogs();
    } catch {
      toast.error("Failed to update");
    }
  };

  return (
    <div className="layout-wrapper layout-content-navbar" style={{ background: theme.bg, minHeight: "100vh" }}>
      <div className="layout-container">
        <Header />
        <div className="layout-page">
          <div className="content-wrapper">
            <div className="container-xxl flex-grow-1 container-p-y">
              <div className="container">
                <h1 style={{ fontWeight: 800, color: theme.text }}>Food & Nutrition Tracker</h1>
                <p style={{ color: theme.muted }}>Track daily meals, macros & calories</p>

                {/* FILTERS + PDF BUTTON */}
                <div className="mb-4 p-3" style={{ background: theme.card, border: theme.border, borderRadius: "1rem", boxShadow: theme.shadow }}>
                  <div className="row g-3 align-items-center">
                    <div className="col-md-3">
                      <label className="small text-muted">From</label>
                      <div className="input-group">
                        <span className="input-group-text"><IoCalendarOutline /></span>
                        <input type="date" className="form-control" onChange={e => setFilters(f => ({ ...f, from: e.target.value }))} />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <label className="small text-muted">To</label>
                      <div className="input-group">
                        <span className="input-group-text"><IoCalendarOutline /></span>
                        <input type="date" className="form-control" onChange={e => setFilters(f => ({ ...f, to: e.target.value }))} />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <label className="small text-muted">Search</label>
                      <div className="input-group">
                        <span className="input-group-text"><IoSearch /></span>
                        <input type="text" className="form-control" placeholder="Meal or item" onChange={e => setFilters(f => ({ ...f, search: e.target.value }))} />
                      </div>
                    </div>
                    <div className="col-md-3 d-flex align-items-end gap-2">
                      <button onClick={exportPDF} className="btn btn-danger btn-sm w-100">Download PDF</button>
                    </div>
                  </div>
                </div>

                {/* SUMMARY CARDS */}
                <div className="row g-4 mb-4">
                  {MACROS.map((m, i) => (
                    <div className="col-md-3" key={i}>
                      <div style={{ background: m.color, color: "#fff", padding: "1.5rem", borderRadius: "1rem", textAlign: "center", transition: "all 0.3s", cursor: "pointer" }}>
                        <h6>{m.label}</h6>
                        <h2>{summary[m.key === "calories" ? "caloriesIn" : m.key]}</h2>
                      </div>
                    </div>
                  ))}
                </div>

                {/* CHARTS */}
                <div className="row g-4 mb-4">
                  <div className="col-md-6">
                    <div style={{ background: theme.card, padding: "1rem", borderRadius: "1rem", boxShadow: theme.shadow }}>
                      <h6>Macro Distribution</h6>
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie data={macroPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                            {macroPieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div style={{ background: theme.card, padding: "1rem", borderRadius: "1rem", boxShadow: theme.shadow }}>
                      <h6>Calories & Macros Trend</h6>
                      <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={lineData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          {MACROS.map(m => (
                            <Line key={m.key} type="monotone" dataKey={m.key === "calories" ? "calories" : m.key} stroke={m.color} strokeWidth={2} dot={{ r: 3 }} />
                          ))}
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* FOOD LOG LIST */}
                <FoodLogList
                  logs={logs}
                  loading={loading}
                  onChanged={fetchLogs}
                  onEdit={(log) => { setCurrentLog(log); setEditModalOpen(true); }}
                />

                {/* EDIT MODAL */}
                <Modal
                  isOpen={editModalOpen}
                  onRequestClose={() => setEditModalOpen(false)}
                  contentLabel="Edit Meal Plan"
                  style={{
                    overlay: { backgroundColor: "rgba(0,0,0,0.5)" },
                    content: { maxWidth: "600px", margin: "auto", borderRadius: "1rem", padding: "2rem" }
                  }}
                >
                  {currentLog && (
                    <form onSubmit={handleEditSubmit}>
                      <h5>Edit Meal Plan - {new Date(currentLog.date).toDateString()}</h5>
                      <div className="mb-3">
                        <label className="form-label">Title</label>
                        <input type="text" className="form-control" value={currentLog.title} onChange={e => setCurrentLog({...currentLog, title: e.target.value})} />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Date</label>
                        <input type="date" className="form-control" value={currentLog.date.slice(0,10)} onChange={e => setCurrentLog({...currentLog, date: e.target.value})} />
                      </div>
                      <button type="submit" className="btn btn-primary me-2">Save</button>
                      <button type="button" className="btn btn-secondary" onClick={() => setEditModalOpen(false)}>Cancel</button>
                    </form>
                  )}
                </Modal>

              </div>
            </div>
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}
