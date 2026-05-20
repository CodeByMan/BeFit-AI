import React, { createContext, useState, useEffect, useContext  } from "react";
import { Link } from "react-router-dom";
import useDynamicCSS from "../../../hooks/useDynamicCSS";
import favicon from "../../../assets/img/favicon/favicon.svg";
import { useTheme } from "../../../context/ThemeContext";
import { useNotification } from "../../../context/NotificationContext";

const HeaderUserDashboard = () => {
  useDynamicCSS("/src/assets/vendor/css/core.css");
  useDynamicCSS("/src/assets/vendor/css/theme-default.css");
  useDynamicCSS("/src/assets/css/demo.css");
  useDynamicCSS("/src/assets/vendor/css/pages/page-auth.css");

  const { darkMode, toggleDarkMode } = useTheme();
  const { notificationCount } = useNotification();

  console.log("Notification count:", notificationCount);

  const [healthOpen, setHealthOpen] = useState(false);
  const [mealOpen, setMealOpen] = useState(false);
  const [workoutOpen, setWorkoutOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [offcanvasType, setOffcanvasType] = useState("");

const handleLogout = async () => {
  try {
    const token = localStorage.getItem("token");

    await fetch("http://localhost:5000/api/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("roleId");
    window.location.href = "/login";
  }
};

  const navLinkStyle = {
    color: darkMode ? "#f8f9fa" : "#212529",
    cursor: "pointer",
  };



  return (
    
    <>
    <style>
{`
@keyframes badgePulse {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 77, 79, 0.7);
    transform: scale(1);
  }
  70% {
    box-shadow: 0 0 0 8px rgba(255, 77, 79, 0);
    transform: scale(1.05);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 77, 79, 0);
    transform: scale(1);
  }
}

@keyframes badgeBounce {
  0%   { transform: scale(0.7); }
  50%  { transform: scale(1.25); }
  100% { transform: scale(1); }
}
`}
</style>

      {/* SIDEBAR FOR DESKTOP/LAPTOP */}
      <nav
        className="d-none d-md-flex flex-column align-items-start position-sticky top-0"
        style={{
          width: "260px",
          height: "100vh",
          padding: "20px 0",
          backgroundColor: darkMode ? "#1C1C1C" : "#fff",
          borderRight: darkMode ? "1px solid #2b2b2b" : "1px solid #e4e4e4",
          transition: "all 0.3s",
        }}
      >
{/* Logo + Theme Toggle */}
<div
  className="d-flex align-items-center justify-content-between px-3 mb-4"
  style={{ width: "100%" }}
>
  <Link
    to="/user-dashboard"
    className="d-flex align-items-center text-decoration-none"
  >
    <img src={favicon} width="25" height="25" alt="logo" />
    <span
      className="fw-bolder ms-2"
      style={{ color: darkMode ? "#f8f9fa" : "#212529" }}
    >
      BeFit
    </span>
  </Link>

  {/* Modern Toggle Switch */}
  <div
    onClick={toggleDarkMode}
    className={`d-flex align-items-center p-1 rounded-pill`}
    style={{
      cursor: "pointer",
      backgroundColor: darkMode ? "#302d2aff" : "#e4e4e4",
      width: "70px",
      height: "35px",
      position: "relative",
      transition: "background-color 0.3s",
    }}
  >
    {/* Slider */}
    <div
      style={{
        position: "absolute",
        top: "3px",
        left: darkMode ? "35px" : "3px",
        width: "28px",
        height: "28px",
        backgroundColor: "#fff",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "left 0.3s",
      }}
    >
      {darkMode ? (
        <i className="bx bx-moon" style={{ fontSize: "16px", color: "#111" }}></i>
      ) : (
        <i className="bx bx-sun" style={{ fontSize: "16px", color: "#f59e0b" }}></i>
      )}
    </div>
  </div>
</div>

        {/* NAVIGATION */}
        <ul className="nav flex-column w-100">

          {/* HOME */}
          <li className="nav-item mb-1">
            <Link to="/user-dashboard" className="nav-link" style={navLinkStyle}>
              <i className="bx bx-home-circle me-2"></i> Home
            </Link>
          </li>

          {/* Goal */}
          <li className="nav-item mb-1">
            <Link to="/user-dashboard/goals" className="nav-link" style={navLinkStyle}>
              <i className="bx bx-target-lock me-2"></i> Goal
            </Link>
          </li>

          {/* HEALTH METRIC */}
          <li className="nav-item mb-1">
            <span
              onClick={() => setHealthOpen(!healthOpen)}
              className="nav-link d-flex justify-content-between align-items-center"
              style={navLinkStyle}
            >
              <span>
                <i className="bx bx-calculator me-2"></i>Health Metric
              </span>
              <i className={`bx ${healthOpen ? "bx-chevron-up" : "bx-chevron-down"}`}></i>
            </span>

            <ul className="nav flex-column ms-3" style={{ display: healthOpen ? "block" : "none" }}>
              <li className="nav-item">
                <Link to="/user-dashboard/bmi" className="nav-link" style={navLinkStyle}>
                  <i className="bx bx-chevron-right me-2"></i> BMI Calculator
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/user-dashboard/bmr" className="nav-link" style={navLinkStyle}>
                  <i className="bx bx-chevron-right me-2"></i> BMR Calculator
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/user-dashboard/macro-calculator" className="nav-link" style={navLinkStyle}>
                  <i className="bx bx-chevron-right me-2"></i> Macro Calculator
                </Link>
              </li>
            </ul>
          </li>

          {/* WORKOUT PLAN */}
          <li className="nav-item mb-1">
            <span
              onClick={() => setWorkoutOpen(!workoutOpen)}
              className="nav-link d-flex justify-content-between align-items-center"
              style={navLinkStyle}
            >
              <span>
                <i className="bx bx-dumbbell me-2"></i>Workout
              </span>
              <i className={`bx ${workoutOpen ? "bx-chevron-up" : "bx-chevron-down"}`}></i>
            </span>

            <ul className="nav flex-column ms-3" style={{ display: workoutOpen ? "block" : "none" }}>
              <li className="nav-item">
                <Link to="/user-dashboard/workouts" className="nav-link" style={navLinkStyle}>
                  <i className="bx bx-chevron-right me-2"></i> Workout Log
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/user-dashboard/workout-form" className="nav-link" style={navLinkStyle}>
                  <i className="bx bx-chevron-right me-2"></i> Workout Form
                </Link>
              </li>
            </ul>
          </li>

          {/* MEALS PLAN */}
          <li className="nav-item mb-1">
            <span
              onClick={() => setMealOpen(!mealOpen)}
              className="nav-link d-flex justify-content-between align-items-center"
              style={navLinkStyle}
            >
              <span>
                <i className="bx bx-restaurant me-2"></i>Food
              </span>
              <i className={`bx ${mealOpen ? "bx-chevron-up" : "bx-chevron-down"}`}></i>
            </span>

            <ul className="nav flex-column ms-3" style={{ display: mealOpen ? "block" : "none" }}>
              <li className="nav-item">
                <Link to="/user-dashboard/foodlogs" className="nav-link" style={navLinkStyle}>
                  <i className="bx bx-chevron-right me-2"></i> Food Log
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/user-dashboard/foodlog-form" className="nav-link" style={navLinkStyle}>
                  <i className="bx bx-chevron-right me-2"></i> Food Form
                </Link>
              </li>
            </ul>
          </li>

          {/* CALORIE CHECKER */}
          <li className="nav-item mb-1">
            <Link
              to="/user-dashboard/calorie-checker"
              className="nav-link"
              style={navLinkStyle}
            >
              <i className="bx bx-food-menu me-2"></i> Calorie Checker
            </Link>
          </li>

          {/* EXERCISE GUIDE */}
          <li className="nav-item mb-1">
            <Link to="/user-dashboard/exercises" className="nav-link" style={navLinkStyle}>
              <i className="bx bx-run me-2"></i> Exercise Guide
            </Link>
          </li>

          {/* STOPWATCH */}
          <li className="nav-item mb-1">
            <Link to="/user-dashboard/stopwatch" className="nav-link" style={navLinkStyle}>
              <i className="bx bx-timer me-2"></i> StopWatch
            </Link>
          </li>

          {/* NOTIFICATIONS */}
          <li className="nav-item mb-1">
            <Link to="/user-dashboard/notifications" className="nav-link" style={navLinkStyle}>
              <i className="bx bx-bell me-2"></i> Notifications
                {notificationCount > 0 && (
                  <span
                    style={{
                      minWidth: "18px",
                      height: "18px",
                      padding: "0 6px",
                      marginLeft: "8px",

                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",

                      fontSize: "11px",
                      fontWeight: "600",
                      lineHeight: "1",

                      color: "#fff",
                      background: "linear-gradient(135deg, #ff4d4f, #ff7875)",
                      borderRadius: "999px",

                      animation: "badgePulse 1.6s infinite, badgeBounce 0.4s ease",
                    }}
                  >
                    {notificationCount}
                  </span>
                )}
                  </Link>
          </li>


                {/* ACCOUNT */}
                <li className="nav-item mb-1">
                  <span
                    onClick={() => setUserOpen(!userOpen)}
                    className="nav-link d-flex justify-content-between align-items-center"
                    style={navLinkStyle}
                  >
                    <span>
                      <i className="bx bx-user-circle me-2"></i> Account
                    </span>
                    <i className={`bx ${userOpen ? "bx-chevron-up" : "bx-chevron-down"}`}></i>
                  </span>

                  <ul className="nav flex-column ms-3" style={{ display: userOpen ? "block" : "none" }}>
                    <li className="nav-item">
                      <Link to="/user-dashboard/profile" className="nav-link" style={navLinkStyle}>
                        <i className="bx bx-chevron-right me-2"></i> Profile
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link to="/user-dashboard/update-password" className="nav-link" style={navLinkStyle}>
                        <i className="bx bx-chevron-right me-2"></i> Update Password
                      </Link>
                    </li>

                    <li className="nav-item">
                      <span onClick={handleLogout} className="nav-link" style={navLinkStyle}>
                        <i className="bx bx-chevron-right me-2"></i> Logout
                      </span>
                    </li>
                  </ul>
                </li>
              </ul>
            </nav>

            {/* TOP NAVBAR FOR MOBILE */}
            <div
              className="d-flex d-md-none fixed-top align-items-center justify-content-between px-3 py-2 border-bottom"
              style={{
                backgroundColor: darkMode ? "#1C1C1C" : "#fff",
                zIndex: 1055,
                transition: "all 0.3s",
              }}
            >
              {/* LOGO LEFT */}
              <Link to="/user-dashboard" className="d-flex align-items-center text-decoration-none">
                <img src={favicon} width="25" height="25" alt="logo" />
                <span className="fw-bolder ms-2" style={{ color: darkMode ? "#f8f9fa" : "#212529" }}>
                  BeFit
                </span>
              </Link>

              {/* HAMBURGER RIGHT */}
              <div className="d-flex align-items-center">
                <button
                  onClick={toggleDarkMode}
                  className="btn me-2"
                  style={{ fontSize: "1.2rem", color: darkMode ? "#f8f9fa" : "#212529" }}
                >
                  {darkMode ? <i className="bx bx-sun"></i> : <i className="bx bx-moon"></i>}
                </button>

                <div style={{ position: "relative" }}>
        <button
          className="btn"
          onClick={() => setOffcanvasType(offcanvasType === "all" ? "" : "all")}
          style={{ fontSize: "1.5rem", color: darkMode ? "#f8f9fa" : "#212529" }}
        >
          <i className="bx bx-menu"></i>
        </button>

        {notificationCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: "2px",
              right: "2px",

              minWidth: "16px",
              height: "16px",
              padding: "0 5px",

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              fontSize: "10px",
              fontWeight: "600",

              color: "#fff",
              background: "#ff4d4f",
              borderRadius: "999px",
            }}
          >
            {notificationCount}
          </span>
        )}
      </div>

        </div>
      </div>

      {/* OFFCANVAS FOR ALL LINKS */}
      {offcanvasType === "all" && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{
            zIndex: 1060,
            overflowY: "auto",
            paddingTop: "60px",
            backgroundColor: darkMode ? "#1C1C1C" : "#fff",
            transition: "transform 0.3s",
          }}
        >
          <div className="d-flex justify-content-end p-2 border-bottom">
            <button
              className="btn"
              onClick={() => setOffcanvasType("")}
              style={{ fontSize: "1.5rem", color: darkMode ? "#f8f9fa" : "#212529" }}
            >
              <i className="bx bx-x"></i>
            </button>
          </div>

          <ul className="nav flex-column m-3">

            {/* HOME */}
            <li className="nav-item mb-2">
              <Link to="/user-dashboard" className="nav-link" style={navLinkStyle}>
                <i className="bx bx-home-circle me-2"></i> Home
              </Link>
            </li>


            {/* HEALTH METRIC */}
            <li className="nav-item mb-2">
              <span
                onClick={() => setHealthOpen(!healthOpen)}
                className="nav-link d-flex justify-content-between align-items-center"
                style={navLinkStyle}
              >
                <span>
                  <i className="bx bx-calculator me-2"></i> Health Metric
                </span>
                <i className={`bx ${healthOpen ? "bx-chevron-up" : "bx-chevron-down"}`}></i>
              </span>
              <ul className="nav flex-column ms-3" style={{ display: healthOpen ? "block" : "none" }}>
                <li className="nav-item">
                  <Link to="/user-dashboard/bmi" className="nav-link" style={navLinkStyle}>
                    <i className="bx bx-chevron-right me-2"></i> BMI Calculator
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/user-dashboard/bmr" className="nav-link" style={navLinkStyle}>
                    <i className="bx bx-chevron-right me-2"></i> BMR Calculator
                  </Link>
                </li>
              </ul>
            </li>


            {/* WORKOUT PLAN */}
            <li className="nav-item mb-2">
              <span
                onClick={() => setWorkoutOpen(!workoutOpen)}
                className="nav-link d-flex justify-content-between align-items-center"
                style={navLinkStyle}
              >
                <span>
                  <i className="bx bx-dumbbell me-2"></i> Workouts
                </span>
                <i className={`bx ${workoutOpen ? "bx-chevron-up" : "bx-chevron-down"}`}></i>
              </span>
              <ul className="nav flex-column ms-3" style={{ display: workoutOpen ? "block" : "none" }}>
                <li className="nav-item">
                  <Link to="/user-dashboard/workouts" className="nav-link" style={navLinkStyle}>
                    <i className="bx bx-chevron-right me-2"></i> Workout Log
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/user-dashboard/workout-form" className="nav-link" style={navLinkStyle}>
                    <i className="bx bx-chevron-right me-2"></i> Workout Form
                  </Link>
                </li>
              </ul>
            </li>

            {/* MEALS PLAN */}
            <li className="nav-item mb-2">
              <span
                onClick={() => setMealOpen(!mealOpen)}
                className="nav-link d-flex justify-content-between align-items-center"
                style={navLinkStyle}
              >
                <span>
                  <i className="bx bx-restaurant me-2"></i> Food
                </span>
                <i className={`bx ${mealOpen ? "bx-chevron-up" : "bx-chevron-down"}`}></i>
              </span>
              <ul className="nav flex-column ms-3" style={{ display: mealOpen ? "block" : "none" }}>
                <li className="nav-item">
                  <Link to="/user-dashboard/foodlogs" className="nav-link" style={navLinkStyle}>
                    <i className="bx bx-chevron-right me-2"></i> Food Log
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/user-dashboard/foodlog-form" className="nav-link" style={navLinkStyle}>
                    <i className="bx bx-chevron-right me-2"></i> Food Form
                  </Link>
                </li>
              </ul>
            </li>

            {/* CALORIE CHECKER */}
            <li className="nav-item mb-2">
              <Link to="/user-dashboard/calorie-checker" className="nav-link" style={navLinkStyle}>
                <i className="bx bx-food-menu me-2"></i> Calorie Checker
              </Link>
            </li>

            {/* EXERCISE GUIDE */}
            <li className="nav-item mb-2">
              <Link to="/user-dashboard/exercises" className="nav-link" style={navLinkStyle}>
                <i className="bx bx-run me-2"></i> Exercise Guide
              </Link>
            </li>

            {/* STOPWATCH */}
            <li className="nav-item mb-2">
              <Link to="/user-dashboard/stopwatch" className="nav-link" style={navLinkStyle}>
                <i className="bx bx-timer me-2"></i> StopWatch
              </Link>
            </li>

            {/* NOTIFICATIONS */}
            <li className="nav-item mb-2">
              <Link to="/user-dashboard/notifications" className="nav-link d-flex align-items-center" style={navLinkStyle}>
                <i className="bx bx-bell me-2"></i>
                <span>Notifications</span>

                {notificationCount > 0 && (
                  <span
                    style={{
                      minWidth: "18px",
                      height: "18px",
                      padding: "0 6px",
                      marginLeft: "8px",

                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",

                      fontSize: "11px",
                      fontWeight: "600",
                      lineHeight: "1",

                      color: "#fff",
                      background: "linear-gradient(135deg, #ff4d4f, #ff7875)",
                      borderRadius: "999px",

                      animation: "badgePulse 1.6s infinite, badgeBounce 0.4s ease",
                    }}
                  >
                    {notificationCount}
                  </span>
                )}
              </Link>
            </li>

            {/* ACCOUNT */}
            <li className="nav-item mb-2">
              <span
                onClick={() => setUserOpen(!userOpen)}
                className="nav-link d-flex justify-content-between align-items-center"
                style={navLinkStyle}
              >
                <span>
                  <i className="bx bx-user-circle me-2"></i> Account
                </span>
                <i className={`bx ${userOpen ? "bx-chevron-up" : "bx-chevron-down"}`}></i>
              </span>
              <ul className="nav flex-column ms-3" style={{ display: userOpen ? "block" : "none" }}>
                <li className="nav-item">
                  <Link to="/user-dashboard/profile" className="nav-link" style={navLinkStyle}>
                    <i className="bx bx-chevron-right me-2"></i> Profile
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/user-dashboard/update-password" className="nav-link" style={navLinkStyle}>
                    <i className="bx bx-chevron-right me-2"></i> Update Password
                  </Link>
                </li>
                <li className="nav-item">
                  <span onClick={handleLogout} className="nav-link" style={navLinkStyle}>
                    <i className="bx bx-chevron-right me-2"></i> Logout
                  </span>
                </li>
              </ul>
            </li>

          </ul>
        </div>
      )}

    </>
  );
};

export default HeaderUserDashboard;
