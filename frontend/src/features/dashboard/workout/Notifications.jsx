import React, { useEffect, useState } from "react";
import API from "../../../api/Api";
import HeaderUser from "../layout/HeaderUser";
import FooterUser from "../layout/FooterUser";
import { useTheme } from "../../../context/ThemeContext";

const Notifications = () => {
  const [yesterday, setYesterday] = useState([]);
  const [today, setToday] = useState([]);
  const [tomorrow, setTomorrow] = useState([]);
  const [future, setFuture] = useState([]);
  const [loading, setLoading] = useState(true);

  const { darkMode } = useTheme();

  const orange = "hsl(12, 98%, 52%)";
  const orangeLight = "hsl(12, 98%, 65%)";
  const orangeDark = "hsl(12, 98%, 40%)";

  const themeColors = {
    light: {
      background: "#f8f9fa",
      cardBackground: "#fff",
      textPrimary: "#212529",
      textSecondary: "#6c757d",
      border: "1px solid rgba(0,0,0,0.1)",
      highlight: orange,
      gradientText: `linear-gradient(90deg, ${orangeLight}, ${orange}, ${orangeDark})`,
      activityIconBg: `${orange}33`,
      checkboxBg: "#fff",
      checkboxBorder: "#ced4da",
      shadow: "0 4px 20px rgba(0,0,0,0.08)"
    },
    dark: {
      background: "#111111",
      cardBackground: "#1e1e1e",
      textPrimary: "#f8f9fa",
      textSecondary: "#9ca3af",
      border: "1px solid rgba(255,255,255,0.15)",
      highlight: orange,
      gradientText: `linear-gradient(90deg, ${orangeLight}, ${orange}, ${orangeDark})`,
      activityIconBg: `${orange}33`,
      checkboxBg: "#222",
      checkboxBorder: "#555",
      shadow: "0 4px 20px rgba(0,0,0,0.3)"
    }
  };

  const theme = darkMode ? themeColors.dark : themeColors.light;

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await API.get("/workouts/notifications");
      if (res.data.success) {
        setYesterday(res.data.yesterday || []);
        setToday(res.data.today || []);
        setTomorrow(res.data.tomorrow || []);
        setFuture(res.data.future || []);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  // MARK DONE (force refresh page)
  const markDone = async (id) => {
    try {
      await API.patch(`/workouts/${id}/done`);
      window.location.reload(); // <- page refresh
    } catch (err) {
      console.error("Failed to mark done:", err);
    }
  };

  // Workout Card Component
  const WorkoutCard = ({ workout, highlight = false, tag = "" }) => {
    const [checked, setChecked] = useState(false);

    return (
      <div
        className="d-flex flex-column flex-md-row justify-content-between align-items-center"
        style={{
          backgroundColor: theme.cardBackground,
          padding: "15px",
          borderRadius: "1rem",
          boxShadow: theme.shadow,
          marginBottom: "1rem",
          transition: "all 0.2s",
          cursor: "pointer"
        }}
      >
        <div className="d-flex align-items-center mb-3 mb-md-0">
          <div
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              backgroundColor: theme.activityIconBg,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "1.5rem",
              marginRight: "15px"
            }}
          >
            🏋️
          </div>
          <div>
            <h5 style={{ margin: 0, fontWeight: highlight ? "700" : "500" }}>{workout.title}</h5>
            <div style={{ fontSize: "0.85rem", color: theme.textSecondary }}>
              Duration: {workout.durationMinutes} min | Category: {workout.category}
            </div>
            {tag && (
              <span
                style={{
                  display: "inline-block",
                  marginTop: "5px",
                  padding: "2px 8px",
                  borderRadius: "12px",
                  background: `linear-gradient(90deg, ${orangeLight}, ${orange}, ${orangeDark})`,
                  color: "#000",
                  fontSize: "0.75rem",
                  fontWeight: "bold"
                }}
              >
                {tag}
              </span>
            )}
          </div>
        </div>

        {/* ONLY CHECKBOX, remove "Remove" button completely */}
        <div
          onClick={() => {
            setChecked(!checked);
            markDone(workout._id);
          }}
          style={{
            width: "20px",
            height: "20px",
            borderRadius: "4px",
            border: `2px solid ${theme.checkboxBorder}`,
            backgroundColor: checked ? theme.highlight : theme.checkboxBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer"
          }}
        >
          {checked && <span style={{ color: "#fff", fontSize: "14px", fontWeight: "bold" }}>✔</span>}
        </div>
      </div>
    );
  };

  return (
    <div
      className="layout-wrapper layout-content-navbar"
      style={{
        backgroundColor: theme.background,
        minHeight: "100vh",
        transition: "all 0.3s"
      }}
    >
      <div className="layout-container">
        <HeaderUser />

        <div className="layout-page">
          <div className="content-wrapper">
            <div className="container-xxl flex-grow-1 container-p-y" style={{ paddingTop: "1rem" }}>
              <div className="container">
                <div className="row">
                  {/* Left Column: Notifications */}
                  <div className="col-lg-8 mb-4 order-0">
                    <h2
                      style={{
                        fontSize: "2rem",
                        fontWeight: "700",
                        background: theme.gradientText,
                        WebkitBackgroundClip: "text",
                        color: "transparent",
                        marginBottom: "1rem"
                      }}
                    >
                      Workout Notifications
                    </h2>

                    {loading && <p style={{ color: theme.textPrimary }}>Loading...</p>}

                    {!loading &&
                      yesterday.length === 0 &&
                      today.length === 0 &&
                      tomorrow.length === 0 &&
                      future.length === 0 && (
                        <p style={{ color: theme.textPrimary }}>No workout notifications.</p>
                      )}

                    {/* Render all workouts */}
                    {yesterday.length > 0 && (
                      <>
                        <h5 style={{ color: theme.textPrimary, marginTop: "15px" }}>Yesterday</h5>
                        {yesterday.map((w) => (
                          <WorkoutCard key={w._id} workout={w} highlight={true} tag="Yesterday" />
                        ))}
                      </>
                    )}

                    {today.length > 0 && (
                      <>
                        <h5 style={{ color: theme.textPrimary, marginTop: "20px" }}>Today</h5>
                        {today.map((w) => (
                          <WorkoutCard key={w._id} workout={w} highlight={true} tag="Today" />
                        ))}
                      </>
                    )}

                    {tomorrow.length > 0 && (
                      <>
                        <h5 style={{ color: theme.textPrimary, marginTop: "20px" }}>Tomorrow</h5>
                        {tomorrow.map((w) => (
                          <WorkoutCard key={w._id} workout={w} highlight={true} tag="Tomorrow" />
                        ))}
                      </>
                    )}

                    {future.length > 0 && (
                      <>
                        <h5 style={{ color: theme.textPrimary, marginTop: "20px" }}>Upcoming Workouts</h5>
                        {future.map((w) => (
                          <WorkoutCard key={w._id} workout={w} highlight={false} tag="Future" />
                        ))}
                      </>
                    )}
                  </div>

                  {/* Right Column: Summary */}
                  <div className="col-lg-4 col-md-4 order-1">
                    <div className="row">
                      <div className="col-12 mb-4">
                        <div
                          className="card"
                          style={{
                            backgroundColor: theme.cardBackground,
                            color: theme.textPrimary,
                            borderRadius: "1rem",
                            border: theme.border,
                            boxShadow: theme.shadow
                          }}
                        >
                          <div className="card-body">
                            <h6 className="card-title mb-3">Summary</h6>
                            <p style={{ color: theme.textSecondary, marginBottom: "5px" }}>Yesterday: {yesterday.length}</p>
                            <p style={{ color: theme.textSecondary, marginBottom: "5px" }}>Today: {today.length}</p>
                            <p style={{ color: theme.textSecondary }}>Upcoming: {tomorrow.length + future.length}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="content-backdrop fade"></div>
            </div>

            <FooterUser />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
