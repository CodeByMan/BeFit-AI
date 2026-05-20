import React, { useEffect, useState } from "react";
import API from "../../../api/Api";
import Header from "../layout/HeaderAdmin";
import Footer from "../layout/FooterAdmin";
import { useTheme } from "../../../context/ThemeContext";

const RecycleBinPage = () => {
  const { darkMode } = useTheme();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const load = async () => {
    const res = await API.get("/admin/users/deleted");
    setUsers(res.data.users);
  };

  useEffect(() => {
    load();
  }, []);

  const restoreUser = async (id) => {
    if (!window.confirm("Restore this user?")) return;
    await API.patch(`/admin/users/restore/${id}`);
    load();
  };

  const permanentDelete = async (id) => {
    if (!window.confirm("Permanently delete this user? This cannot be undone.")) return;
    await API.delete(`/admin/users/delete/${id}`);
    load();
  };

  const theme = darkMode
    ? {
        background: "#111",
        card: "#1e1e1e",
        text: "#f8f9fa",
        textMuted: "#9ca3af",
        border: "rgba(255,255,255,0.12)",
        inputBg: "#1e1e1e",
        orange: "hsl(12,98%,52%)",
      }
    : {
        background: "#f8f9fa",
        card: "#fff",
        text: "#212529",
        textMuted: "#6c757d",
        border: "#dee2e6",
        inputBg: "#fff",
        orange: "hsl(12,98%,52%)",
      };

  const filteredUsers = users.filter((u) => {
    const s = search.toLowerCase();
    return u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s);
  });

  return (
    <div
      className="layout-wrapper layout-content-navbar"
      style={{ background: theme.background, minHeight: "100vh" }}
    >
      <div className="layout-container">
        <Header />
        <div className="layout-page">
          <div className="container py-4">

            {/* TITLE + SEARCH */}
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
              <h2
                style={{
                  fontSize: "2rem",
                  fontWeight: "700",
                  background: `linear-gradient(90deg, ${theme.orange}, #ff784b)`,
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                  marginBottom: "0.5rem",
                }}
              >
                Recycle Bin
              </h2>

              <div className="flex-shrink-0" style={{ minWidth: "200px", maxWidth: "300px" }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search deleted users..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    backgroundColor: theme.inputBg,
                    color: theme.text,
                    border: `1px solid ${theme.border}`,
                  }}
                />
              </div>
            </div>

            {/* TABLE */}
            <div
              className="card p-3"
              style={{
                background: theme.card,
                border: `1px solid ${theme.border}`,
                borderRadius: "1rem",
              }}
            >
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0" style={{ color: theme.text }}>
                  <thead style={{ color: theme.textMuted }}>
                    <tr>
                      <th>No.</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((u, index) => (
                        <tr key={u._id}>
                          <td style={{ color: theme.text }}>{index + 1}</td>
                          <td style={{ color: theme.text }}>{u.name}</td>
                          <td style={{ color: theme.text }}>{u.email}</td>
                          <td className="text-nowrap">
                            <button
                              className="btn btn-warning btn-sm me-2 mb-1"
                              onClick={() => restoreUser(u._id)}
                            >
                              Restore
                            </button>
                            <button
                              className="btn btn-danger btn-sm mb-1"
                              onClick={() => permanentDelete(u._id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center text-muted">
                          No deleted users found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default RecycleBinPage;
