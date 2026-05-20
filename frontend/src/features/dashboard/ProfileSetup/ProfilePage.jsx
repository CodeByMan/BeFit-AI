import React, { useEffect, useState } from "react";
import Header from "../layout/HeaderUser";
import Footer from "../layout/FooterUser";
import API from "../../../api/Api";
import { useTheme } from "../../../context/ThemeContext";
import "bootstrap/dist/css/bootstrap.min.css";

const ProfilePage = () => {
  const { darkMode } = useTheme();

  const [profile, setProfile] = useState(null);
  const [goal, setGoal] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  useEffect(() => {
    fetchProfileAndGoal();
  }, []);

  const fetchProfileAndGoal = async () => {
    try {
      const profileRes = await API.get("/profile/me");
      if (profileRes.data.success) {
        setProfile(profileRes.data.profile);
        setFormData(profileRes.data.profile);
      }

      const goalRes = await API.get("/goal");
      if (goalRes.data) setGoal(goalRes.data);
    } catch {
      alert("Failed to fetch profile or goal data");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const uploadAvatar = async () => {
    if (!avatarFile) return null;

    const data = new FormData();
    data.append("avatar", avatarFile);

    try {
      const res = await API.post("/profile/avatar", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.profile.avatar_filename;
    } catch {
      alert("Avatar upload failed");
      return null;
    }
  };

  const handleSave = async () => {
    try {
      let updatedProfile = { age: formData.age };

      if (avatarFile) {
        const avatarPath = await uploadAvatar();
        if (avatarPath) updatedProfile.avatar_filename = avatarPath;
      }

      const profileRes = await API.put("/profile/update", updatedProfile);

      if (profileRes.data.success) {
        await fetchProfileAndGoal();
        setEditing(false);
        setAvatarFile(null);
        setAvatarPreview(null);
      }
    } catch {
      alert("Failed to update profile");
    }
  };

  const formatGoal = (goalStr) => {
    if (!goalStr) return "Not set";
    return goalStr
      .replace("_", " ")
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  const theme = darkMode
    ? {
        background: "#0d1117",
        card: "#161b22",
        text: "#fff",
        textSecondary: "#9ca3af",
        border: "1px solid rgba(255,255,255,0.1)",
        accent: "hsl(12,98%,52%)",
        inputBg: "#21262d",
      }
    : {
        background: "#f8f9fa",
        card: "#fff",
        text: "#212529",
        textSecondary: "#6c757d",
        border: "1px solid #dee2e6",
        accent: "hsl(12,98%,52%)",
        inputBg: "#fff",
      };

  if (!profile) return <p>Loading...</p>;

  return (
    <div className="layout-wrapper layout-content-navbar" style={{ backgroundColor: theme.background, minHeight: "100vh" }}>
      <div className="layout-container">
        <Header />
        <div className="layout-page">
          <div className="container py-5">
            <div className="row g-4 d-flex align-items-stretch">
              
              {/* LEFT SIDE: Avatar & Age */}
              <div className="col-12 col-md-4">
                <div
                  className="card p-4 text-center shadow-sm h-100"
                  style={{ backgroundColor: theme.card, color: theme.text, border: theme.border, borderRadius: "15px" }}
                >
                  <div style={{ position: "relative", width: "150px", height: "150px", margin: "0 auto" }}>
                    <img
                      src={
                        avatarPreview
                          ? avatarPreview
                          : profile.avatar_filename?.startsWith("http")
                          ? profile.avatar_filename
                          : profile.avatar_filename
                          ? `http://localhost:5000${profile.avatar_filename}?t=${Date.now()}`
                          : ""
                      }
                      alt="User Avatar"
                      {...(profile.avatar_filename?.startsWith("http") ? {} : { crossOrigin: "use-credentials" })}
                      style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%", border: `3px solid ${theme.accent}` }}
                    />
                    {editing && (
                      <label
                        htmlFor="avatarUpload"
                        style={{
                          position: "absolute",
                          bottom: 0,
                          right: 0,
                          width: "40px",
                          height: "40px",
                          background: theme.accent,
                          color: "#fff",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          border: "2px solid #fff",
                          fontSize: "20px",
                        }}
                      >
                        +
                      </label>
                    )}
                    <input
                      id="avatarUpload"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      style={{ display: "none" }}
                    />
                  </div>

                  <h3 className="mt-3">{formData.full_name}</h3>
                  <p className="mt-2">
                    <strong>Age:</strong>{" "}
                    {editing ? (
                      <input
                        type="number"
                        className="form-control text-center"
                        style={{ backgroundColor: theme.inputBg }}
                        name="age"
                        value={formData.age || ""}
                        onChange={handleChange}
                      />
                    ) : (
                      <span className="fw-semibold">{formData.age || "—"}</span>
                    )}
                  </p>

                  <p>
                    <strong>Gender:</strong>{" "}
                    <span className="fw-semibold text-capitalize">{formData.gender || "—"}</span>
                  </p>
                </div>
              </div>

              {/* RIGHT SIDE: Read-only goal info */}
              <div className="col-12 col-md-8">
                <div
                  className="card p-4 shadow-sm text-center h-100"
                  style={{ backgroundColor: theme.card, color: theme.text, border: theme.border, borderRadius: "15px" }}
                >
                  <h4 className="mb-4" style={{ color: theme.accent }}>Profile Information</h4>

                  <div className="row g-4 justify-content-center">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Height (cm)</label>
                      <p className="fw-semibold">{goal?.currentHeight || "—"} cm</p>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Weight (kg)</label>
                      <p className="fw-semibold">{goal?.currentWeight || "—"} kg</p>
                    </div>

                    <div className="col-12">
                      <div style={{ padding: "10px", fontWeight: "600", fontSize: "1.2rem", color: theme.accent }}>
                        Goal: {formatGoal(goal?.goalType)}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Goal Amount (kg)</label>
                      <p className="fw-semibold">{goal?.targetWeight || "—"} kg</p>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Timeframe (weeks)</label>
                      <p className="fw-semibold">{goal ? Math.round(goal.durationDays / 7) : "—"} weeks</p>
                    </div>
                  </div>

                  {/* Edit & Save Buttons */}
                  <div className="d-flex justify-content-center mt-4 gap-3">
                    {editing ? (
                      <>
                        <button
                          className="btn btn-outline-secondary"
                          onClick={() => {
                            setEditing(false);
                            fetchProfileAndGoal();
                            setAvatarPreview(null);
                            setAvatarFile(null);
                          }}
                        >
                          Cancel
                        </button>

                        <button
                          className="btn"
                          style={{ backgroundColor: theme.accent, color: "#fff" }}
                          onClick={handleSave}
                        >
                          Save
                        </button>
                      </>
                    ) : (
                      <button
                        className="btn"
                        style={{ backgroundColor: theme.accent, color: "#fff" }}
                        onClick={() => setEditing(true)}
                      >
                        Edit Profile
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Footer />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
