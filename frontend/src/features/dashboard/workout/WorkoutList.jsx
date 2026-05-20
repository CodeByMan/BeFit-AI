import React, { useEffect, useState } from "react";
import {
  IoCreateOutline,
  IoTrashOutline,
  IoChatbubbleEllipsesOutline,
  IoEyeOutline,
} from "react-icons/io5";
import API from "../../../api/Api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTheme } from "../../../context/ThemeContext";
import Header from "../layout/HeaderUser";
import Footer from "../layout/FooterUser";

export default function WorkoutList() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ from: "", to: "" });

  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const orange = "hsl(12, 98%, 52%)";

  const theme = darkMode
    ? {
        background: "#111111",
        card: "rgba(30,30,30,0.85)",
        textPrimary: "#f8f9fa",
        textSecondary: "#9ca3af",
      }
    : {
        background: "#f8f9fa",
        card: "#ffffff",
        textPrimary: "#111827",
        textSecondary: "#6c757d",
      };

  // ================= FETCH WORKOUTS =================
  const fetchWorkouts = async () => {
    setLoading(true);
    try {
      const res = await API.get("/workouts");
      setWorkouts(Array.isArray(res.data.workouts) ? res.data.workouts : []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch workouts");
      setWorkouts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this workout?")) return;
    try {
      await API.delete(`/workouts/${id}`);
      toast.success("Workout deleted!");
      fetchWorkouts();
    } catch {
      toast.error("Failed to delete workout");
    }
  };

  // ================= FILTER =================
  const filteredWorkouts = workouts.filter((w) => {
    const wDate = w.date ? new Date(w.date) : null;
    const fromDate = filters.from ? new Date(filters.from) : null;
    const toDate = filters.to ? new Date(filters.to) : null;

    if (!wDate) return false;
    if (fromDate && wDate < fromDate) return false;
    if (toDate && wDate > toDate) return false;
    return true;
  });

  return (
    <div
      className="layout-wrapper layout-content-navbar"
      style={{ background: theme.background, minHeight: "100vh" }}
    >
      <Header />

      <div className="layout-container">
        <div className="layout-page">
          <div className="content-wrapper">
            <div className="container-xxl flex-grow-1 container-p-y">
              <div className="container">
                {/* HEADER */}
                <h1 style={{ fontWeight: 800, color: orange }}>My Workouts</h1>
                <p style={{ color: theme.textSecondary }}>
                  Browse and track your workout sessions
                </p>

                {/* FILTER */}
                <div
                  className="mb-4 p-3"
                  style={{
                    background: darkMode
                      ? "rgba(30,30,30,0.85)"
                      : "#ffffff",
                    borderRadius: "1rem",
                    boxShadow: "0 10px 24px rgba(0,0,0,0.12)",
                    display: "flex",
                    gap: "1rem",
                    flexWrap: "wrap",
                    alignItems: "flex-end",
                  }}
                >
                  <div className="col-md-3">
                    <label className="form-label small">From</label>
                    <input
                      type="date"
                      value={filters.from}
                      onChange={(e) =>
                        setFilters({ ...filters, from: e.target.value })
                      }
                      className="form-control"
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="form-label small">To</label>
                    <input
                      type="date"
                      value={filters.to}
                      onChange={(e) =>
                        setFilters({ ...filters, to: e.target.value })
                      }
                      className="form-control"
                    />
                  </div>

                  <div className="col-md-2">
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => setFilters({ from: "", to: "" })}
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* LIST */}
                <div>
                  {loading && (
                    <div
                      style={{
                        padding: "2rem",
                        textAlign: "center",
                        color: theme.textSecondary,
                      }}
                    >
                      Loading workouts...
                    </div>
                  )}

                  {!loading && filteredWorkouts.length === 0 && (
                    <div
                      style={{
                        padding: "2rem",
                        textAlign: "center",
                        background: theme.card,
                        borderRadius: "1rem",
                        color: theme.textSecondary,
                        boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
                      }}
                    >
                      No workouts found 🏋️
                    </div>
                  )}

                  {!loading &&
                    filteredWorkouts.map((workout) => (
                      <div
                        key={workout._id}
                        style={{
                          background: theme.card,
                          borderRadius: "1rem",
                          boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
                          marginBottom: "1.5rem",
                          overflow: "hidden",
                        }}
                      >
                        {/* DATE HEADER */}
                        <div
                          style={{
                            background: orange,
                            color: "#fff",
                            padding: "0.6rem 1.2rem",
                            fontWeight: 700,
                            fontSize: "0.9rem",
                          }}
                        >
                          {workout.date
                            ? new Date(workout.date).toDateString()
                            : "No Date"}
                        </div>

                        {/* BODY */}
                        <div
                          style={{
                            padding: "1rem 1.5rem",
                            display: "flex",
                            justifyContent: "space-between",
                            flexWrap: "wrap",
                            gap: "1rem",
                          }}
                        >
                          <div>
                            <h5
                              style={{
                                margin: 0,
                                color: theme.textPrimary,
                              }}
                            >
                              {workout.title}
                            </h5>
                            <small style={{ color: theme.textSecondary }}>
                              {workout.exercises?.length || 0} exercises •{" "}
                              {workout.durationMinutes || 0} min
                            </small>
                          </div>

                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <ActionBtn
                              color={orange}
                              onClick={() =>
                                navigate(
                                  `/user-dashboard/workouts/${workout._id}`
                                )
                              }
                            >
                              <IoEyeOutline size={16} /> View
                            </ActionBtn>

                            <ActionBtn
                              color={orange}
                              onClick={() =>
                                navigate(
                                  `/user-dashboard/workout-form/${workout._id}`
                                )
                              }
                            >
                              <IoCreateOutline size={16} /> Edit
                            </ActionBtn>

                            <ActionBtn
                              color={orange}
                              onClick={() => handleDelete(workout._id)}
                            >
                              <IoTrashOutline size={16} /> Delete
                            </ActionBtn>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                {/* FLOATING CHAT */}
                <button
                  className="btn"
                  style={{
                    position: "fixed",
                    bottom: "2rem",
                    right: "2rem",
                    background: orange,
                    color: "#fff",
                    borderRadius: "50%",
                    width: "3.5rem",
                    height: "3.5rem",
                    border: "none",
                    fontSize: "1.2rem",
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
}

// ================= BUTTON =================
const ActionBtn = ({ children, onClick, color }) => (
  <button
    onClick={onClick}
    style={{
      background: color,
      color: "#fff",
      border: "none",
      borderRadius: "0.6rem",
      padding: "0.4rem 0.8rem",
      fontSize: "0.85rem",
      fontWeight: 600,
      display: "flex",
      alignItems: "center",
      gap: "0.3rem",
      cursor: "pointer",
    }}
  >
    {children}
  </button>
);
