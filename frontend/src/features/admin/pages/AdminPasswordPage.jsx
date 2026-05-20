import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../layout/HeaderAdmin";
import Footer from "../layout/FooterAdmin";
import API from "../../../api/Api";
import { useTheme } from "../../../context/ThemeContext";

const AdminPasswordPage = () => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async () => {
    if (newPassword !== confirmPassword) {
      return alert("New passwords do not match");
    }

    try {
      const res = await API.put("/admin/profile/password", {
        currentPassword,
        newPassword,
      });

      if (res.data.success) {
        alert(res.data.message);
        navigate("/admin-dashboard/profile");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update password");
    }
  };

  const theme = darkMode
    ? {
        background: "#111111",
        cardBackground: "#212121",
        textPrimary: "#fff",
        textSecondary: "#9ca3af",
        inputBackground: "#212529",
        inputBorder: "#374151",
        buttonPrimary: "hsl(12, 98%, 52%)",
        buttonSecondary: "#6c757d",
      }
    : {
        background: "#f8f9fa",
        cardBackground: "#fff",
        textPrimary: "#212529",
        textSecondary: "#6c757d",
        inputBackground: "#fff",
        inputBorder: "#ced4da",
        buttonPrimary: "hsl(12, 98%, 52%)",
        buttonSecondary: "#6c757d",
      };

  return (
    <div
      className="layout-wrapper layout-content-navbar"
      style={{ background: theme.background, minHeight: "100vh" }}
    >
<style>
{`
  /* Merge eye icon with input in all states */
  .input-group .input-group-text {
    border: 1px solid ${theme.inputBorder} !important; /* match input */
    border-left: none; /* remove double border between input and icon */
    border-radius: 0 0.375rem 0.375rem 0; /* right rounded corners */
    background: ${theme.inputBackground} !important;
    color: ${theme.textPrimary};
    box-shadow: none !important;
  }

  /* Remove hover/focus styles */
  .input-group .input-group-text:focus,
  .input-group .input-group-text:active,
  .input-group .input-group-text:hover {
    outline: none !important;
    box-shadow: none !important;
    border-color: ${theme.inputBorder} !important;
  }

  /* Merge input right border with icon */
  .input-group .form-control {
    border-right: none;
    border-radius: 0.375rem 0 0 0.375rem; /* left rounded corners */
  }

  .input-group:focus-within .form-control {
    border-color: ${theme.inputBorder} !important;
    box-shadow: none !important;
  }
`}
</style>


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
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <h2
              style={{
                fontSize: "2rem",
                fontWeight: 700,
                background: `linear-gradient(90deg, hsl(12,98%,65%), hsl(12,98%,40%))`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent", // for Chrome/Safari
                backgroundClip: "text",
                color: "transparent",
                display: "inline-block", // important
              }}
            >
              Change Admin Password
            </h2>
          </div>
            <PasswordInput
              label="Current Password"
              value={currentPassword}
              setValue={setCurrentPassword}
              show={showCurrent}
              setShow={setShowCurrent}
              theme={theme}
            />

            <PasswordInput
              label="New Password"
              value={newPassword}
              setValue={setNewPassword}
              show={showNew}
              setShow={setShowNew}
              theme={theme}
            />

            <PasswordInput
              label="Confirm New Password"
              value={confirmPassword}
              setValue={setConfirmPassword}
              show={showConfirm}
              setShow={setShowConfirm}
              theme={theme}
            />

            <div className="d-flex justify-content-between mt-4">
              <button
                className="btn"
                style={{ background: theme.buttonSecondary, color: "#fff" }}
                onClick={() => navigate("/admin-dashboard/profile")}
              >
                Back
              </button>

              <button
                className="btn"
                style={{ background: theme.buttonPrimary, color: "#fff" }}
                onClick={handleSubmit}
              >
                Update Password
              </button>
            </div>
          </div>

          <Footer />
        </div>
      </div>
    </div>
  );
};

const PasswordInput = ({ label, value, setValue, show, setShow, theme }) => (
  <div className="mb-3 form-password-toggle">
    <label style={{ color: theme.textSecondary }}>{label}</label>

    <div className="input-group input-group-merge">
      <input
        type={show ? "text" : "password"}
        className="form-control"
        style={{
          background: theme.inputBackground,
          borderColor: theme.inputBorder,
          color: theme.textPrimary,
        }}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      <span
        className="input-group-text cursor-pointer"
        onClick={() => setShow(!show)}
      >
        <i className={show ? "bx bx-show" : "bx bx-hide"}></i>
      </span>
    </div>
  </div>
);

export default AdminPasswordPage;
