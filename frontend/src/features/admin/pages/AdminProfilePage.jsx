import React, { useEffect, useState } from "react";
import API from "../../../api/Api";
import Header from "../layout/HeaderAdmin";
import Footer from "../layout/FooterAdmin";
import { useTheme } from "../../../context/ThemeContext";
import AdminImage from "../../../assets/admin.png"

// You can replace this with any static image URL

const AdminProfilePage = () => {
  const { darkMode } = useTheme();

  const [form, setForm] = useState({
    name: "",
    email: "",
  });

  // Load admin profile
  const loadProfile = async () => {
    try {
      const res = await API.get("/admin/profile");
      setForm(res.data.admin);
    } catch (err) {
      alert("Failed to load profile");
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const theme = darkMode
    ? {
        background: "#111111",
        cardBackground: "#212121",
        textPrimary: "#fff",
        textSecondary: "#9ca3af",
        inputBackground: "#212529",
        inputBorder: "#374151",
      }
    : {
        background: "#f8f9fa",
        cardBackground: "#fff",
        textPrimary: "#212529",
        textSecondary: "#6c757d",
        inputBackground: "#fff",
        inputBorder: "#ced4da",
      };

  return (
    <div
      className="layout-wrapper layout-content-navbar"
      style={{ background: theme.background, minHeight: "100vh" }}
    >
      <div className="layout-container">
        <Header />

        <div className="layout-page">
          <div
            className="container mt-5"
            style={{
              maxWidth: "600px",
              background: theme.cardBackground,
              padding: "30px",
              borderRadius: "10px",
              boxShadow: darkMode ? "0 0 10px #000" : "0 0 10px #ccc",
            }}
          >
            {/* Profile Image */}
            <div className="d-flex justify-content-center mb-4">
              <img
                src={AdminImage}
                alt="Admin"
                style={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: `3px solid ${theme.inputBorder}`,
                }}
              />
            </div>

<div className="d-flex justify-content-center mb-4">
  <h2
    style={{
      fontSize: "2rem",
      fontWeight: 700,
      background: `linear-gradient(90deg, hsl(12,98%,65%), hsl(12,98%,40%))`,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      color: "transparent",
      display: "inline-block", // needed for gradient
      textAlign: "center", // ensure text inside heading is centered
    }}
  >
    Admin Profile
  </h2>
</div>


            {/* Name */}
            <div className="mb-3">
              <label style={{ color: theme.textSecondary }}>Full Name</label>
              <input
                type="text"
                className="form-control"
                style={{
                  background: theme.inputBackground,
                  borderColor: theme.inputBorder,
                  color: theme.textPrimary,
                }}
                value={form.name}
                readOnly
              />
            </div>

            {/* Email */}
            <div className="mb-3">
              <label style={{ color: theme.textSecondary }}>Email</label>
              <input
                type="email"
                className="form-control"
                value={form.email}
                readOnly
                style={{
                  background: theme.inputBackground,
                  borderColor: theme.inputBorder,
                  color: theme.textPrimary,
                  opacity: 0.6,
                }}
              />
            </div>
          </div>

          <Footer />
        </div>
      </div>
    </div>
  );
};

export default AdminProfilePage;
