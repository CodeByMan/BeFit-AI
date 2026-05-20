import React, { useState } from "react"; 
import { useNavigate } from "react-router-dom";
import Header from "../layout/HeaderUser";
import Footer from "../layout/FooterUser";
import API from "../../../api/Api";
import { useTheme } from "../../../context/ThemeContext";

const PasswordUpdate = () => {
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
      const res = await API.put("/user/profile/password", {
        currentPassword,
        newPassword,
      });

      if (res.data.success) {
        alert(res.data.message);
        navigate("/user-dashboard/profile");
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
      {/* Internal CSS for border styling */}
      <style>
{`
  /* Remove border/shadow on eye icon */
  .input-group .input-group-text {
    border-left: 0 !important;
    box-shadow: none !important;
    background: ${theme.inputBackground} !important;
    color: ${theme.textPrimary};
  }

  /* Prevent focus/active styles on eye icon */
  .input-group .input-group-text:focus,
  .input-group .input-group-text:active {
    outline: none !important;
    box-shadow: none !important;
    border-color: ${theme.inputBorder} !important;
  }

  /* Prevent input focus affecting the icon border */
  .input-group:focus-within .input-group-text {
    border-color: ${theme.inputBorder} !important;
  }

  /* Force input border in all modes */
  .input-group .form-control {
    border-color: ${theme.inputBorder} !important;
    background: ${theme.inputBackground} !important;
    color: ${theme.textPrimary} !important;
    box-shadow: none !important;  /* REMOVE Bootstrap focus shadow */
  }

  .input-group .form-control:focus {
    border-color: ${theme.inputBorder} !important;
    outline: none !important;
    box-shadow: none !important;  /* REMOVE Bootstrap focus shadow */
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
            <h2
              className="mb-4 text-center"
              style={{ color: theme.textPrimary }}
            >
              Update Password
            </h2>

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
                onClick={() => navigate("/user-dashboard/profile")}
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

export default PasswordUpdate;
