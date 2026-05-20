import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../../api/Api";
import HeaderUser from "../layout/HeaderUser";
import FooterUser from "../layout/FooterUser";
import { useTheme } from "../../../context/ThemeContext";

const WorkoutDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState(null);
  const [profile, setProfile] = useState(null);
  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const { darkMode } = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [workoutRes, profileRes, goalRes] = await Promise.all([
          API.get(`/workouts/${id}`),
          API.get("/profile/me"),
          API.get("/goal")
        ]);

        setWorkout(workoutRes.data);
        if (profileRes.data.success) setProfile(profileRes.data.profile);
        setGoal(goalRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // === THEME (same as UserDashboard.jsx) ===
  const orange = "hsl(12, 98%, 52%)";
  const orangeLight = "hsl(12, 98%, 65%)";
  const orangeDark = "hsl(12, 98%, 40%)";

  const themeColors = {
    light: {
      background: "#f8f9fa",
      cardBackground: "rgba(255,255,255,0.95)",
      textPrimary: "#212529",
      textSecondary: "#6c757d",
      border: "1px solid rgba(0,0,0,0.15)",
      gradientText: `linear-gradient(90deg, ${orangeLight}, ${orange}, ${orangeDark})`,
    },
    dark: {
      background: "#111111",
      cardBackground: "rgba(30,30,30,0.85)",
      textPrimary: "#f8f9fa",
      textSecondary: "#9ca3af",
      border: "1px solid rgba(255,255,255,0.15)",
      gradientText: `linear-gradient(90deg, ${orangeLight}, ${orange}, ${orangeDark})`,
    },
  };

  const theme = darkMode ? themeColors.dark : themeColors.light;

  // BEFORE: your code returned early → breaks layout  
  // NOW: we show loading *inside* dashboard layout (same behavior, better UI)
  const isReady = !loading && workout && profile && goal;

  // ---------- PROFILE + CALORIES LOGIC (UNCHANGED) ----------
  let totalCaloriesBurned = 0;
  let totalWorkoutVolume = 0;

  if (isReady) {
  const age = Number(profile.age);
  const gender = profile.gender;

  const weight = Number(goal.currentWeight);
  const height = Number(goal.currentHeight);

  const durationMinutes = Number(workout.durationMinutes) || 0;
  const workoutDurationHrs = durationMinutes / 60;

  const hasValidData =
    age > 0 &&
    weight > 0 &&
    height > 0 &&
    (gender === "male" || gender === "female") &&
    workoutDurationHrs > 0;

  if (hasValidData) {
    const bmr =
      gender === "female"
        ? 10 * weight + 6.25 * height - 5 * age - 161
        : 10 * weight + 6.25 * height - 5 * age + 5;

    const bmrPerHour = bmr / 24;
    const strengthMET = 6;

    totalCaloriesBurned = Math.round(
      bmrPerHour * strengthMET * workoutDurationHrs
    );
  } else {
    totalCaloriesBurned = 0;
  }

  const exerciseVolumes = (workout.exercises || []).map(ex =>
    ex.reps.reduce(
      (sum, r, i) => sum + r * (Number(ex.weight[i]) || 0),
      0
    )
  );

  totalWorkoutVolume = exerciseVolumes.reduce((s, v) => s + v, 0);
}

  const tableMutedStyle = {
    color: theme.textSecondary,
    borderColor: darkMode
      ? "rgba(255,255,255,0.15)"
      : "rgba(0,0,0,0.15)",
    fontWeight: 500,
  };


  return (
    <div
      className="layout-wrapper layout-content-navbar"
      style={{ backgroundColor: theme.background, minHeight: "100vh", transition: "0.3s" }}
    >
      <div className="layout-container">
        <HeaderUser />

        <div className="layout-page">
          <div className="content-wrapper">
            <div className="container-xxl flex-grow-1 container-p-y">

              <div className="container">
                {/* ======== HEADING & TOP ACTIONS ======== */}
                {!isReady ? (
                  <p style={{ color: theme.textPrimary }}>Loading...</p>
                ) : (
                  <>
                    <div className="row mb-3">
                      <div className="col-12 d-flex justify-content-between align-items-start">
                        <div>
                          <h2
                            style={{
                              fontSize: "2rem",
                              fontWeight: "700",
                              background: theme.gradientText,
                              WebkitBackgroundClip: "text",
                              color: "transparent",
                            }}
                          >
                            {workout.title}
                          </h2>

                          <p style={{ color: theme.textSecondary }}>
                            <strong>Date:</strong>{" "}
                            {workout.date ? new Date(workout.date).toLocaleDateString() : "-"}
                          </p>
                        </div>

                        <div>
                          <button
                            className="btn btn-primary me-2"
                            onClick={() => navigate(`/user-dashboard/workout-form/${workout._id}`)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-secondary"
                            onClick={() => navigate("/user-dashboard/workouts")}
                          >
                            Back
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* ======== BASIC INFO ======== */}
                    <div className="row">
                      <div className="col-lg-8 mb-4">
                        <div
                          className="card mb-3 p-3"
                          style={{
                            backgroundColor: theme.cardBackground,
                            border: theme.border,
                          }}
                        >
                          <p style={{ color: theme.textSecondary }}>
                            <strong>Duration:</strong> {workout.durationMinutes} min
                          </p>
                          <p style={{ color: theme.textSecondary }}>
                            <strong>Category:</strong> {workout.category}
                          </p>
                          <p style={{ color: theme.textSecondary }}>
                            <strong>Tags:</strong> {(workout.tags || []).join(", ")}
                          </p>

                          <div className="alert alert-danger mt-3">
                            <strong>Total Calories Burned:</strong> {totalCaloriesBurned} kcal
                          </div>
                        </div>

                        {/* ======== EXERCISES ======== */}
                        <h4
                          className="mt-4 mb-3"
                          style={{
                            fontSize: "1.5rem",
                            fontWeight: "600",
                            color: theme.textPrimary,
                          }}
                        >
                          Exercises
                        </h4>

                        {(workout.exercises || []).map((ex, idx) => {
                          const setVolumes = ex.reps.map((r, i) => r * (ex.weight[i] || 0));
                          const totalVolume = setVolumes.reduce((sum, v) => sum + v, 0);

                          const caloriesPerExercise = Math.round(
                            totalCaloriesBurned * (totalVolume / (totalWorkoutVolume || 1))
                          );

                          return (
                            <div
                              key={idx}
                              className="card mb-3"
                              style={{
                                backgroundColor: theme.cardBackground,
                                border: theme.border,
                                padding: "1rem",
                              }}
                            >
                              <h5 style={{ color: theme.textPrimary }}>{ex.name}</h5>
                              <p style={{ color: theme.textSecondary }}>Sets: {ex.sets}</p>

                              <div className="table-responsive">
                                <table className="table table-sm table-bordered text-center">
                                  <thead>
                                    <tr>
                                      {Array.from({ length: ex.sets }, (_, i) => (
                                        <th key={i}>Set {i + 1}</th>
                                      ))}
                                      <th>Total Volume</th>
                                      <th>Calories</th>
                                    </tr>
                                  </thead>

                                  <tbody>
                                    <tr>
                                      {ex.reps.map((r, i) => (
                                        <td
                                          key={i}
                                          style={tableMutedStyle}
                                        >
                                          {r}
                                        </td>
                                      ))}
                                      <td
                                        rowSpan={2}
                                        style={tableMutedStyle}
                                      >
                                        {totalVolume}
                                      </td>
                                      <td
                                        rowSpan={2}
                                        style={tableMutedStyle}
                                      >
                                        {caloriesPerExercise}
                                      </td>
                                    </tr>

                                    <tr>
                                      {ex.weight.map((w, i) => (
                                        <td
                                          key={i}
                                          style={tableMutedStyle}
                                        >
                                          {w}
                                        </td>
                                      ))}
                                    </tr>

                                    <tr>
                                      {setVolumes.map((v, i) => (
                                        <td
                                          key={i}
                                          style={tableMutedStyle}
                                        >
                                          {v}
                                        </td>
                                      ))}
                                      <td
                                        colSpan={2}
                                        style={tableMutedStyle}
                                      />
                                    </tr>
                                  </tbody>
                                </table>
                              </div>

                              {ex.notes && (
                                <p className="mt-2" style={{ color: theme.textSecondary }}>
                                  <strong>Notes:</strong> {ex.notes}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* ======== RIGHT COLUMN SUMMARY ======== */}
                      <div className="col-lg-4 col-md-4 order-1">
                        <div
                          className="card mb-3"
                          style={{
                            backgroundColor: theme.cardBackground,
                            border: theme.border,
                            color: theme.textPrimary,
                          }}
                        >
                          <div className="card-body">
                            <h6 className="card-title">Quick Stats</h6>
                            <p style={{ color: theme.textSecondary }}>
                              Total Volume: {totalWorkoutVolume}
                            </p>
                            <p style={{ color: theme.textSecondary }}>
                              Calories: {totalCaloriesBurned}
                            </p>
                            <p style={{ color: theme.textSecondary }}>
                              Category: {workout.category}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
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

export default WorkoutDetail;
