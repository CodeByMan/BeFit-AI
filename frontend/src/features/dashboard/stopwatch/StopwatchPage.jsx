import React, { useState, useRef } from "react";
import Header from "../layout/HeaderUser";
import Footer from "../layout/FooterUser";
import { useTheme } from "../../../context/ThemeContext";

const StopwatchPage = () => {
  const { darkMode } = useTheme();
  const [time, setTime] = useState(
    () => Number(sessionStorage.getItem("stopwatchTime")) || 0
  );
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);
  const [sessionName, setSessionName] = useState("");
  const [sessions, setSessions] = useState(
    () => JSON.parse(sessionStorage.getItem("stopwatchSessions")) || []
  );
  const [startedAt, setStartedAt] = useState(null);

  const orangeLight = "hsl(12, 98%, 65%)";
  const orangeDark = "hsl(12, 98%, 40%)";

  const themeColors = {
    light: {
      background: "#f8f9fa",
      cardBackground: "linear-gradient(145deg, #fefbfaff, #fefbfaff)",
      textPrimary: "#fd660fff",
      textSecondary: "#6c757d",
      border: "1px solid rgba(0,0,0,0.1)",
      buttonBg: "#fff",
    },
    dark: {
      background: "#111111",
      cardBackground: "#1e1e1e",
      textPrimary: "#f8f9fa",
      textSecondary: "#9ca3af",
      border: "1px solid rgba(255,255,255,0.15)",
      buttonBg: "#222",
    },
  };
  const theme = darkMode ? themeColors.dark : themeColors.light;

  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      if (!startedAt) setStartedAt(new Date());
      timerRef.current = setInterval(() => setTime((prev) => prev + 10), 10);
    }
  };

  const stopTimer = () => {
    clearInterval(timerRef.current);
    setIsRunning(false);
    if (time > 0 && startedAt) {
      const newSession = {
        id: Date.now(),
        name: sessionName || " ───── ",
        durationMs: time,
        startedAt,
        stoppedAt: new Date(),
      };
      const updatedSessions = [...sessions, newSession];
      setSessions(updatedSessions);
      sessionStorage.setItem("stopwatchSessions", JSON.stringify(updatedSessions));
      setTime(0);
      setSessionName("");
      setStartedAt(null);
      sessionStorage.setItem("stopwatchTime", "0");
    }
  };

  const removeSession = (id) => {
    if (!window.confirm("Remove this session?")) return;
    const updatedSessions = sessions.filter((s) => s.id !== id);
    setSessions(updatedSessions);
    sessionStorage.setItem("stopwatchSessions", JSON.stringify(updatedSessions));
  };

  const formatTime = (ms) => {
    const totalHundredths = Math.floor(ms / 10); // convert ms to hundredths
    const seconds = String(Math.floor(totalHundredths / 100) % 60).padStart(2, "0");
    const minutes = String(Math.floor(totalHundredths / 6000) % 60).padStart(2, "0");
    const hundredths = String(totalHundredths % 100).padStart(2, "0");
    return `${minutes}.${seconds}.${hundredths}`;
  };


const cardStyle = {
  borderRadius: "1.5rem",
  padding: "2rem",
  background: darkMode
    ? "linear-gradient(135deg, #1e1e1e, #2a2a2a)" // dark gradient
    : "linear-gradient(135deg, #fefaf8ff, #fefaf8ff)", // light gradient
  boxShadow: darkMode
    ? "0 6px 25px rgba(0,0,0,0.5)"
    : "0 6px 25px rgba(0,0,0,0.1)",
  marginBottom: "2rem",
  transition: "all 0.3s",
};

const timerStyle = {
  width: "240px",
  height: "240px",
  borderRadius: "50%",
  background: "hsl(12, 98%, 65%)", // solid inner color
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "2.7rem",
  fontWeight: "700",
  color: "#fff",
  fontFamily: "'Courier New', monospace",
  margin: "0 auto 1.5rem auto",
  boxShadow: isRunning
    ? `0 0 20px hsl(12, 98%, 65%), 0 0 40px rgba(255, 184, 108, 0.4), 0 0 60px rgba(255, 184, 108, 0.2)`
    : "0 4px 25px rgba(255, 140, 0, 0.5)", // static shadow when stopped
  animation: isRunning ? "pulse 1.2s infinite" : "none",
  transition: "all 0.3s",
};

  const buttonStyle = {
    borderRadius: "1rem",
    padding: "0.6rem 1.5rem",
    fontWeight: "600",
    minWidth: "90px",
    transition: "all 0.2s",
    cursor: "pointer",
  };

  return (
    <div
      className="layout-wrapper layout-content-navbar"
      style={{ backgroundColor: theme.background, minHeight: "100vh" }}
    >
      <Header />

      <div className="layout-container">
        <div className="layout-page">
          <div className="content-wrapper">
            <div className="container-xxl py-3">

              {/* Stopwatch Card */}
              <div className="row justify-content-center">
                <div className="col-12 col-sm-10 col-md-8 col-lg-6">
                    <label
                      style={{
                        display: "block",
                        textAlign: "center",
                        marginBottom: "0.5rem",
                        color: theme.textPrimary,
                        fontWeight: 500,
                      }}
                    >
                      Activity
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Activity Name ..."
                      value={sessionName}
                      onChange={(e) => setSessionName(e.target.value)}
                      className="form-control mb-3"
                      style={{
                        textAlign: "center",
                        borderRadius: "1rem",
                        border: theme.border,
                        background: theme.buttonBg,
                        color: theme.textPrimary,
                      }}
                    />

                    <div style={timerStyle}>{formatTime(time)}</div>

                    {startedAt && (
                      <p
                        className="mb-3"
                        style={{
                          color: theme.textSecondary,
                          textAlign: "center",
                          fontSize: "0.9rem",
                        }}
                      >
                        Started at: <strong>{startedAt.toLocaleTimeString()}</strong>
                      </p>
                    )}

                    <div className="d-flex justify-content-center gap-3 flex-wrap">
                      <button
                        style={{
                          ...buttonStyle,
                          background: `linear-gradient(90deg, ${orangeLight}, ${orangeDark})`,
                          color: "#fff",
                          border: "none",
                        }}
                        onClick={startTimer}
                        disabled={isRunning}
                      >
                        Start
                      </button>

                      <button
                        style={{
                          ...buttonStyle,
                          background: theme.buttonBg,
                          color: theme.textPrimary,
                          border: theme.border,
                        }}
                        onClick={stopTimer}
                        disabled={!isRunning}
                      >
                        Stop
                      </button>
                    </div>
                </div>
              </div>

              {/* Sessions Card */}
              <div style={cardStyle} className="mt-5">
                {sessions.length === 0 ? (
                  <p style={{ color: theme.textSecondary }}>No sessions yet.</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-borderless">
                      <thead style={{ color: theme.textSecondary }}>
                        <tr>
                          <th>Activity</th>
                          <th>Start</th>
                          <th>Stop</th>
                          <th>Duration</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sessions.map((s) => (
                          <tr key={s.id} style={{ color: theme.textPrimary }}>
                            <td style={{ color: theme.textSecondary }}>{s.name}</td>
                            <td style={{ color: theme.textSecondary }}>
                              {new Date(s.startedAt).toLocaleTimeString()}
                            </td>
                            <td style={{ color: theme.textSecondary }}>
                              {new Date(s.stoppedAt).toLocaleTimeString()}
                            </td>
                            <td style={{ color: theme.textSecondary }}>
                              {formatTime(s.durationMs)}
                            </td>
                            <td>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => removeSession(s.id)}
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            </div>
            <div className="content-backdrop fade"></div>
            <Footer />
          </div>
        </div>
      </div>

      {/* Pulse Animation */}
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); box-shadow: 0 0 10px rgba(255, 94, 0, 0.4); }
          50% { transform: scale(1.05); box-shadow: 0 0 25px rgba(255, 89, 0, 0.6); }
          100% { transform: scale(1); box-shadow: 0 0 10px rgba(255, 85, 0, 0.4); }
        }
      `}</style>
    </div>
  );
};

export default StopwatchPage;
