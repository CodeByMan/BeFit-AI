import React, { useEffect, useState } from "react";
import API from "../../../api/Api";
import Header from "../layout/HeaderAdmin";
import Footer from "../layout/FooterAdmin";
import { useTheme } from "../../../context/ThemeContext";

const UsersPageAdmin = () => {
  const { darkMode } = useTheme();
  const [admins, setAdmins] = useState([]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const load = async () => {
    const res = await API.get("/admin/users");

    // Backend returns ALL roleId=2 users (if you fixed backend)
    // So we fetch all users including admins here:
    const allUsers = res.data.users;

    const adminList = allUsers.filter((u) => u.roleId === 1);
    const userList = allUsers.filter((u) => u.roleId === 2 && !u.isDeleted);

    setAdmins(adminList);
    setUsers(userList);
  };

  useEffect(() => {
    load();
  }, []);

  const softDelete = async (id) => {
    if (!window.confirm("Block this user? You will see them in Recycle Bin")) return;
    await API.patch(`/admin/users/soft-delete/${id}`);
    load();
  };

  const theme = darkMode
    ? {
        background: "#111111",
        card: "#212121",
        textPrimary: "#fff",
        textSecondary: "#9ca3af",
        tableBorder: "#374151",
        orange: "hsl(12,98%,52%)",
      }
    : {
        background: "#f8f9fa",
        card: "#fff",
        textPrimary: "#212529",
        textSecondary: "#6c757d",
        tableBorder: "#ced4da",
        orange: "hsl(12,98%,52%)",
      };

  // Search filter applied to both tables
  const filteredAdmins = admins.filter((u) => {
    const s = search.toLowerCase();
    return u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s);
  });

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
          <div  className="container py-4"
  style={{
    paddingTop: window.innerWidth < 768 ? "60px" : "0px", // adjust 60px if your mobile header height is different
  }}
>
            {/* TITLE + SEARCH */}
        <div className="row mb-4 align-items-center">
          <div className="col-12 col-md-6 mb-2 mb-md-0">
            <h2
              style={{
                fontSize: "2rem",
                fontWeight: "700",
                background: `linear-gradient(90deg, ${theme.orange}, #ff784b)`,
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              User Management
            </h2>
          </div>
          <div className="col-12 col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                background: theme.card,
                color: theme.textPrimary,
                border: `1px solid ${theme.tableBorder}`,
              }}
            />
          </div>
        </div>


            {/* ------------------------- ADMINS TABLE ------------------------- */}
            <div
              className="card p-3 mb-4"
              style={{
                background: theme.card,
                border: `1px solid ${theme.tableBorder}`,
                borderRadius: "10px",
              }}
            >
              <h4 style={{ color: theme.textPrimary, marginBottom: "15px" }}>
                Admins ({filteredAdmins.length})
              </h4>

              <div className="table-responsive">
                <table className="table" style={{ color: theme.textPrimary }}>
                  <thead>
                    <tr>
                      <th style={{ color: theme.orange }}>No.</th>
                      <th style={{ color: theme.orange }}>Name</th>
                      <th style={{ color: theme.orange }}>Email</th>
                      <th style={{ color: theme.orange }}>Status</th>
                      <th style={{ color: theme.orange }}>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredAdmins.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center" style={{ color: theme.textSecondary }}>
                          No admin accounts found.
                        </td>
                      </tr>
                    ) : (
                      filteredAdmins.map((u, index) => (
                        <tr key={u._id}>
                          <td style={{ color: theme.textPrimary }}>{index + 1}</td>
                          <td style={{ color: theme.textPrimary }}>{u.name}</td>
                          <td style={{ color: theme.textPrimary }}>{u.email}</td>
                          <td>
                            {u.isLoggedIn ? (
                              <span className="badge bg-danger">Active</span>
                            ) : (
                              <span className="badge bg-warning">Inactive</span>
                            )}
                          </td>
                          <td>
                            <i style={{ color: theme.textSecondary }}>Admin Protected</i>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ------------------------- USERS TABLE ------------------------- */}
            <div
              className="card p-3"
              style={{
                background: theme.card,
                border: `1px solid ${theme.tableBorder}`,
                borderRadius: "10px",
              }}
            >
              <h4 style={{ color: theme.textPrimary, marginBottom: "15px" }}>
                Users ({filteredUsers.length})
              </h4>

              <div className="table-responsive">
                <table className="table" style={{ color: theme.textPrimary }}>
                  <thead>
                    <tr>
                      <th style={{ color: theme.orange }}>No.</th>
                      <th style={{ color: theme.orange }}>Name</th>
                      <th style={{ color: theme.orange }}>Email</th>
                      <th style={{ color: theme.orange }}>Status</th>
                      <th style={{ color: theme.orange }}>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center" style={{ color: theme.textSecondary }}>
                          No users found.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u, index) => (
                        <tr key={u._id}>
                          <td style={{ color: theme.textPrimary }}>{index + 1}</td>
                          <td style={{ color: theme.textPrimary }}>{u.name}</td>
                          <td style={{ color: theme.textPrimary }}>{u.email}</td>

                          <td>
                            {u.isLoggedIn ? (
                              <span className="badge bg-danger">Active</span>
                            ) : (
                              <span className="badge bg-warning">Inactive</span>
                            )}
                          </td>

                          <td>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => softDelete(u._id)}
                            >
                              Block User
                            </button>
                          </td>
                        </tr>
                      ))
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

export default UsersPageAdmin;
