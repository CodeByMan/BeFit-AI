import React, { useState } from "react";
import { Link } from "react-router-dom";
import useDynamicCSS from "../../../hooks/useDynamicCSS";
import favicon from "../../../assets/img/favicon/favicon.svg";
import { useTheme } from "../../../context/ThemeContext";

const HeaderAdmin = () => {
  useDynamicCSS("/src/assets/vendor/css/core.css");
  useDynamicCSS("/src/assets/vendor/css/theme-default.css");
  useDynamicCSS("/src/assets/css/demo.css");

  const { darkMode, toggleDarkMode } = useTheme();

  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);


  const navLinkStyle = {
    color: darkMode ? "#f8f9fa" : "#212529",
    cursor: "pointer",
  };

const handleLogout = async () => {
  const confirm = window.confirm("Are you sure you want to logout?");
  if (!confirm) return; // Cancel logout if user clicks "Cancel"

  try {
    const token = localStorage.getItem("token");
    await fetch("http://localhost:5000/api/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error("Admin logout failed:", error);
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("roleId");
    window.location.href = "/login";
  }
};



  return (
    <>
      {/* ------------ DESKTOP SIDEBAR ------------ */}
      <nav
        className="d-none d-md-flex flex-column align-items-start position-sticky top-0"
        style={{
          width: "260px",
          height: "100vh",
          padding: "20px 0",
          backgroundColor: darkMode ? "#1C1C1C" : "#fff",
          borderRight: darkMode ? "1px solid #2b2b2b" : "1px solid #e4e4e4",
        }}
      >

{/* Logo + Theme Toggle */}
<div
  className="d-flex align-items-center justify-content-between px-3 mb-4"
  style={{ width: "100%" }}
>
  <Link
    to="/admin-dashboard"
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


        {/* ------------ NAVIGATION ------------ */}
        <ul className="nav flex-column w-100">

          {/* Users */}
          <li className="nav-item mb-1">
            <Link to="/admin-dashboard/users" className="nav-link" style={navLinkStyle}>
              <i className="bx bx-group me-2"></i> Users
            </Link>
          </li>

         {/* BLOGS */}
          <li className="nav-item mb-1">
            <Link to="/admin-dashboard/add-blog" className="nav-link" style={navLinkStyle}>
              <i className="bx bx-news me-2"></i> Blogs
            </Link>
          </li>

          {/* Testimonials */}
          <li className="nav-item mb-1">
            <Link to="/admin-dashboard/testimonials" className="nav-link" style={navLinkStyle}>
              <i className="bx bx-comment-dots me-2"></i> Testimonials
            </Link>
          </li>

          {/* Recycle Bin */}
          <li className="nav-item mb-1">
            <Link to="/admin-dashboard/recycle-bin" className="nav-link" style={navLinkStyle}>
              <i className="bx bx-trash me-2"></i> Recycle Bin
            </Link>
          </li>

          {/* Account */}
          <li className="nav-item mb-1">
            <span
              onClick={() => setAccountOpen(!accountOpen)}
              className="nav-link d-flex justify-content-between align-items-center"
              style={navLinkStyle}
            >
              <span>
                <i className="bx bx-user-circle me-2"></i> Account
              </span>
              <i className={`bx ${accountOpen ? "bx-chevron-up" : "bx-chevron-down"}`}></i>
            </span>

            <ul
              className="nav flex-column ms-3"
              style={{ display: accountOpen ? "block" : "none" }}
            >
              <li className="nav-item">
                <Link
                  to="/admin-dashboard/profile"
                  className="nav-link"
                  style={navLinkStyle}
                >
                  <i className="bx bx-chevron-right me-2"></i> Profile
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  to="/admin-dashboard/password"
                  className="nav-link"
                  style={navLinkStyle}
                >
                  <i className="bx bx-chevron-right me-2"></i> Change Password
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

      {/* ------------ MOBILE TOP NAV ------------ */}
      <div
        className="d-flex d-md-none fixed-top align-items-center justify-content-between px-3 py-2 border-bottom"
        style={{
          backgroundColor: darkMode ? "#1C1C1C" : "#fff",
          zIndex: 1055,
        }}
      >
        <Link to="/admin-dashboard/users" className="d-flex align-items-center text-decoration-none">
          <img src={favicon} width="25" height="25" alt="logo" />
          <span className="fw-bolder ms-2" style={{ color: darkMode ? "#f8f9fa" : "#212529" }}>
            BeFit Admin
          </span>
        </Link>

        <div className="d-flex align-items-center">
          <button
            onClick={toggleDarkMode}
            className="btn me-2"
            style={{ fontSize: "1.2rem", color: darkMode ? "#f8f9fa" : "#212529" }}
          >
            {darkMode ? <i className="bx bx-sun"></i> : <i className="bx bx-moon"></i>}
          </button>

          <button
            className="btn"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ fontSize: "1.5rem", color: darkMode ? "#f8f9fa" : "#212529" }}
          >
            <i className="bx bx-menu"></i>
          </button>
        </div>
      </div>

      {/* ------------ MOBILE MENU ------------ */}
      {menuOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{
            zIndex: 1060,
            overflowY: "auto",
            // paddingTop: "60px",
            backgroundColor: darkMode ? "#1C1C1C" : "#fff",
          }}
        >
          <div className="d-flex justify-content-end p-2 border-bottom">
            <button
              className="btn"
              onClick={() => setMenuOpen(false)}
              style={{ fontSize: "1.5rem", color: darkMode ? "#f8f9fa" : "#212529" }}
            >
              <i className="bx bx-x"></i>
            </button>
          </div>

          <ul className="nav flex-column m-3">
            <li className="nav-item mb-2">
              <Link to="/admin-dashboard/users" className="nav-link" style={navLinkStyle}>
                <i className="bx bx-group me-2"></i> Users
              </Link>
            </li>

            <li className="nav-item mb-2">
              <Link to="/admin-dashboard/blogs" className="nav-link" style={navLinkStyle}>
                <i className="bx bx-news me-2"></i> Blogs
              </Link>
            </li>

            <li className="nav-item mb-2">
              <Link to="/admin-dashboard/testimonials" className="nav-link" style={navLinkStyle}>
                <i className="bx bx-comment-dots me-2"></i> Testimonials
              </Link>
            </li>

            <li className="nav-item mb-2">
              <Link to="/admin-dashboard/recycle-bin" className="nav-link" style={navLinkStyle}>
                <i className="bx bx-trash me-2"></i> Recycle Bin
              </Link>
            </li>

            {/* ACCOUNT */}
            <li className="nav-item mb-2">
              <span
                onClick={() => setAccountOpen(!accountOpen)}
                className="nav-link d-flex justify-content-between align-items-center"
                style={navLinkStyle}
              >
                <span>
                  <i className="bx bx-user-circle me-2"></i> Account
                </span>
                <i className={`bx ${accountOpen ? "bx-chevron-up" : "bx-chevron-down"}`}></i>
              </span>

              <ul className="nav flex-column ms-3" style={{ display: accountOpen ? "block" : "none" }}>
                <li className="nav-item">
                  <Link to="/admin-dashboard/profile" className="nav-link" style={navLinkStyle}>
                    <i className="bx bx-chevron-right me-2"></i> Profile
                  </Link>
                </li>

                <li className="nav-item">
                  <Link to="/admin-dashboard/password" className="nav-link" style={navLinkStyle}>
                    <i className="bx bx-chevron-right me-2"></i> Change Password
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

export default HeaderAdmin;
