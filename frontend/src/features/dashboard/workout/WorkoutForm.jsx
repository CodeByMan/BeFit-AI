import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import workoutService from "../../../api/workoutService";
import HeaderUser from "../layout/HeaderUser";
import FooterUser from "../layout/FooterUser";
import { useTheme } from "../../../context/ThemeContext";
import { toast } from "react-toastify";

const WorkoutForm = ({ onWorkoutAdded }) => {
  const { darkMode } = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();

  const orange = "hsl(12, 98%, 52%)";
  const orangeLight = "hsl(12, 98%, 65%)";
  const orangeDark = "hsl(12, 98%, 40%)";

  const themeColors = {
    light: {
      background: "#f4f6f8",
      cardBackground: "#fff",
      textPrimary: "#212529",
      textSecondary: "#6c757d",
      inputBackground: "#f8f9fa",
      inputText: "#212529",
      inputBorder: "#ced4da",
      border: "1px solid #e0e0e0",
      shadow: "0 6px 20px rgba(0,0,0,0.08)",
    },
    dark: {
      background: "#121212",
      cardBackground: "#1f1f1f",
      textPrimary: "#f8f9fa",
      textSecondary: "#9ca3af",
      inputBackground: "#2c2c2c",
      inputText: "#fff",
      inputBorder: "#3a3a3a",
      border: "1px solid #333",
      shadow: "0 6px 20px rgba(0,0,0,0.4)",
    },
  };

  const theme = darkMode ? themeColors.dark : themeColors.light;

  const emptyExercise = () => ({
    id: Date.now() + Math.random(),
    name: "",
    sets: 0,
    reps: [],
    weight: [],
    notes: "",
  });

  const [date, setDate] = useState("");
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [category, setCategory] = useState("strength");
  const [exercises, setExercises] = useState([emptyExercise()]);
  const [loading, setLoading] = useState(false);

  // Load existing workout
  useEffect(() => {
    if (!id) return;
    workoutService
      .getWorkout(id)
      .then((data) => {
        setTitle(data.title);
        setDuration(data.durationMinutes);
        setCategory(data.category);
        setDate(data.date ? data.date.split("T")[0] : "");
        setExercises(
          data.exercises.map((ex) => ({
            ...emptyExercise(),
            name: ex.name,
            sets: ex.sets,
            reps: ex.reps || Array(ex.sets).fill(""),
            weight: ex.weight || Array(ex.sets).fill(""),
            notes: ex.notes || "",
          }))
        );
      })
      .catch(() => toast.error("Failed to load workout."));
  }, [id]);

  const addExercise = () => setExercises([...exercises, emptyExercise()]);
  const removeExercise = (id) =>
    setExercises(exercises.filter((ex) => ex.id !== id));
  const updateExercise = (exId, field, value, subIdx = null) => {
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.id !== exId) return ex;
        const updated = { ...ex };
        if (field === "sets") {
          updated.sets = Number(value) || 0;
          const reps = updated.reps || [];
          const weight = updated.weight || [];
          updated.reps =
            updated.sets > reps.length
              ? [...reps, ...Array(updated.sets - reps.length).fill("")]
              : reps.slice(0, updated.sets);
          updated.weight =
            updated.sets > weight.length
              ? [...weight, ...Array(updated.sets - weight.length).fill("")]
              : weight.slice(0, updated.sets);
        } else if (field.startsWith("reps_")) {
          updated.reps[subIdx] = value;
        } else if (field.startsWith("weight_")) {
          updated.weight[subIdx] = value;
        } else {
          updated[field] = value;
        }
        return updated;
      })
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return toast.error("Workout title is required.");
    if (!duration || Number(duration) <= 0)
      return toast.error("Duration must be > 0");
    if (!date) return toast.error("Please select a date.");

    const payload = {
      title,
      durationMinutes: Number(duration),
      date,
      category,
      exercises: exercises.map((ex) => ({
        name: ex.name,
        sets: Number(ex.sets),
        reps: ex.reps.map((r) => Number(r) || 0),
        weight: ex.weight.map((w) => Number(w) || 0),
        notes: ex.notes,
      })),
    };

    try {
      setLoading(true);
      if (id) await workoutService.updateWorkout(id, payload);
      else await workoutService.createWorkout(payload);
      toast.success(id ? "Workout updated!" : "Workout logged!");
      if (!id) {
        setTitle("");
        setDuration("");
        setCategory("strength");
        setDate("");
        setExercises([emptyExercise()]);
      }
      if (onWorkoutAdded) onWorkoutAdded(payload);
      navigate("/user-dashboard/workouts");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save workout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="layout-wrapper layout-content-navbar"
      style={{
        backgroundColor: theme.background,
        minHeight: "100vh",
        paddingBottom: "3rem",
      }}
    >
      <div className="layout-container">
        <HeaderUser />
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
                  }}
                >
                  {/* Header */}
                  <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                    <h2
                      style={{
                        fontWeight: 800,
                        fontSize: "2rem",
                        background: `linear-gradient(90deg, ${orangeLight}, ${orange}, ${orangeDark})`,
                        WebkitBackgroundClip: "text",
                        color: "transparent",
                      }}
                    >
                      {id ? "Edit Workout" : "Log a Workout"}
                    </h2>
                    <div
                      style={{
                        backgroundColor: theme.inputBackground,
                        padding: "0.5rem 1rem",
                        borderRadius: "1rem",
                        border: `1px solid ${theme.inputBorder}`,
                        boxShadow: theme.shadow,
                        minWidth: "200px",
                      }}
                    >
                      <label style={{ fontSize: "0.8rem", color: theme.textSecondary }}>
                        Date
                      </label>
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="form-control"
                        style={{
                          backgroundColor: "transparent",
                          color: theme.inputText,
                          border: "none",
                          padding: "0",
                        }}
                      />
                    </div>
                  </div>

                  {/* Workout Details */}
                  <div className="mb-4 d-flex gap-3 flex-wrap">
                    <div style={{ flex: "1 1 200px" }}>
                      <label style={{ fontSize: "0.85rem", color: theme.textSecondary, fontWeight: 600 }}>
                        Workout Title
                      </label>
                      <input
                        type="text"
                        placeholder="Enter workout title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="form-control"
                        style={{
                          backgroundColor: theme.inputBackground,
                          color: theme.inputText,
                          borderColor: theme.inputBorder,
                          borderRadius: "1rem",
                          padding: "0.6rem 1rem",
                          fontWeight: 600,
                        }}
                      />
                    </div>
                    <div style={{ flex: "1 1 120px" }}>
                      <label style={{ fontSize: "0.85rem", color: theme.textSecondary, fontWeight: 600 }}>
                        Duration (minutes)
                      </label>
                      <input
                        type="number"
                        placeholder="0"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="form-control"
                        style={{
                          backgroundColor: theme.inputBackground,
                          color: theme.inputText,
                          borderColor: theme.inputBorder,
                          borderRadius: "1rem",
                          padding: "0.6rem 1rem",
                          fontWeight: 600,
                        }}
                      />
                    </div>
                    <div style={{ flex: "1 1 150px" }}>
                      <label style={{ fontSize: "0.85rem", color: theme.textSecondary, fontWeight: 600 }}>
                        Category
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="form-control"
                        style={{
                          backgroundColor: theme.inputBackground,
                          color: theme.inputText,
                          borderColor: theme.inputBorder,
                          borderRadius: "1rem",
                          padding: "0.6rem 1rem",
                          fontWeight: 600,
                        }}
                      >
                        <option value="strength">Strength</option>
                        <option value="cardio">Cardio</option>
                        <option value="mobility">Mobility</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Exercises */}
                  {exercises.map((ex, idx) => (
                    <div
                      key={ex.id}
                      className="mb-4 p-4"
                      style={{
                        backgroundColor: darkMode ? "#2c2c2c" : "#f8f9fa",
                        borderRadius: "1.5rem",
                        boxShadow: theme.shadow,
                        position: "relative",
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 style={{ fontWeight: 700 }}>Exercise {idx + 1}</h5>
                        {exercises.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeExercise(ex.id)}
                            className="btn"
                            style={{
                              backgroundColor: "#ff6b6b",
                              color: "#fff",
                              borderRadius: "1rem",
                              padding: "0.4rem 0.8rem",
                              fontWeight: 600,
                            }}
                          >
                            Cancel
                          </button>
                        )}
                      </div>

                      {/* Exercise Fields */}
                      <div className="d-flex gap-3 flex-wrap">
                        <div style={{ flex: "1 1 200px" }}>
                          <label style={{ fontSize: "0.85rem", color: theme.textSecondary }}>Exercise Name</label>
                          <input
                            type="text"
                            placeholder="Enter name"
                            value={ex.name}
                            onChange={(e) => updateExercise(ex.id, "name", e.target.value)}
                            className="form-control"
                            style={{
                              backgroundColor: theme.inputBackground,
                              color: theme.inputText,
                              borderColor: theme.inputBorder,
                              borderRadius: "1rem",
                              padding: "0.5rem 0.8rem",
                            }}
                          />
                        </div>
                        <div style={{ flex: "1 1 80px" }}>
                          <label style={{ fontSize: "0.85rem", color: theme.textSecondary }}>Sets</label>
                          <input
                            type="number"
                            value={ex.sets}
                            onChange={(e) => updateExercise(ex.id, "sets", e.target.value)}
                            className="form-control"
                            style={{
                              backgroundColor: theme.inputBackground,
                              color: theme.inputText,
                              borderColor: theme.inputBorder,
                              borderRadius: "1rem",
                              padding: "0.5rem 0.8rem",
                            }}
                          />
                        </div>
                        {ex.reps.map((r, rIdx) => (
                          <div key={rIdx} style={{ flex: "1 1 80px" }}>
                            <label style={{ fontSize: "0.85rem", color: theme.textSecondary }}>Reps {rIdx + 1}</label>
                            <input
                              type="number"
                              value={r}
                              onChange={(e) => updateExercise(ex.id, `reps_${rIdx}`, e.target.value, rIdx)}
                              className="form-control"
                              style={{
                                backgroundColor: theme.inputBackground,
                                color: theme.inputText,
                                borderColor: theme.inputBorder,
                                borderRadius: "1rem",
                                padding: "0.5rem 0.8rem",
                              }}
                            />
                          </div>
                        ))}
                        {ex.weight.map((w, wIdx) => (
                          <div key={wIdx} style={{ flex: "1 1 80px" }}>
                            <label style={{ fontSize: "0.85rem", color: theme.textSecondary }}>Weight {wIdx + 1}</label>
                            <input
                              type="number"
                              value={w}
                              onChange={(e) => updateExercise(ex.id, `weight_${wIdx}`, e.target.value, wIdx)}
                              className="form-control"
                              style={{
                                backgroundColor: theme.inputBackground,
                                color: theme.inputText,
                                borderColor: theme.inputBorder,
                                borderRadius: "1rem",
                                padding: "0.5rem 0.8rem",
                              }}
                            />
                          </div>
                        ))}
                        <div style={{ flex: "1 1 200px" }}>
                          <label style={{ fontSize: "0.85rem", color: theme.textSecondary }}>Notes</label>
                          <input
                            type="text"
                            value={ex.notes}
                            onChange={(e) => updateExercise(ex.id, "notes", e.target.value)}
                            className="form-control"
                            style={{
                              backgroundColor: theme.inputBackground,
                              color: theme.inputText,
                              borderColor: theme.inputBorder,
                              borderRadius: "1rem",
                              padding: "0.5rem 0.8rem",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Add Exercise */}
                  <div className="mb-4">
                    <button
                      type="button"
                      onClick={addExercise}
                      className="btn"
                      style={{
                        backgroundColor: orange,
                        color: "#fff",
                        borderRadius: "1rem",
                        padding: "0.6rem 1.2rem",
                        fontWeight: 700,
                        transition: "0.3s",
                      }}
                    >
                      + Add Exercise
                    </button>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="btn w-100"
                    style={{
                      background: `linear-gradient(90deg, ${orangeLight}, ${orange}, ${orangeDark})`,
                      color: "#fff",
                      borderRadius: "1rem",
                      padding: "0.8rem",
                      fontWeight: 700,
                      fontSize: "1rem",
                      transition: "0.3s",
                    }}
                  >
                    {loading ? "Saving..." : id ? "Update Workout" : "Save Workout"}
                  </button>
                </div>
              </div>
            </div>
            <div className="content-backdrop fade"></div>
            <FooterUser />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutForm;
