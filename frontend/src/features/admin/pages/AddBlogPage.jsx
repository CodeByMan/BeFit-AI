import React, { useEffect, useState } from "react";
import API from "../../../api/Api";
import Header from "../layout/HeaderAdmin";
import Footer from "../layout/FooterAdmin";
import { useTheme } from "../../../context/ThemeContext";

const emptyBlog = { title: "", image: "", intro: "", link: "" };

const AdminBlogsPage = () => {
  const { darkMode } = useTheme();

  const [blogs, setBlogs] = useState([]);
  const [form, setForm] = useState(emptyBlog);
  const [editingId, setEditingId] = useState(null);
  const [mode, setMode] = useState("view"); // view | create | edit

  const loadBlogs = async () => {
    const res = await API.get("/admin/blogs");
    setBlogs(res.data.blogs);
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const saveBlog = async () => {
    if (mode === "edit") {
      await API.put(`/admin/blogs/${editingId}`, form);
    } else {
      await API.post("/admin/blogs", form);
    }

    setForm(emptyBlog);
    setEditingId(null);
    setMode("view");
    loadBlogs();
  };

  const removeBlog = async (id) => {
    if (!window.confirm("Delete this blog?")) return;
    await API.delete(`/admin/blogs/${id}`);
    loadBlogs();
  };

  /* ---------- THEME ---------- */
  const theme = darkMode
    ? {
        background: "#111",
        card: "#1e1e1e",
        text: "#f8f9fa",
        textMuted: "#9ca3af",
        border: "rgba(255,255,255,0.12)",
        inputBg: "#1e1e1e",
      }
    : {
        background: "#f8f9fa",
        card: "#fff",
        text: "#212529",
        textMuted: "#6c757d",
        border: "#dee2e6",
        inputBg: "#fff",
      };

  const inputStyle = {
    backgroundColor: theme.inputBg,
    color: theme.text,
    border: `1px solid ${theme.border}`,
  };

  return (
    <div
      className="layout-wrapper layout-content-navbar"
      style={{ background: theme.background, minHeight: "100vh" }}
    >
      <div className="layout-container">
        <Header />

        <div className="layout-page">
          <div className="container py-4">

            {/* HEADER BAR */}
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
            <h2
              className="fw-bold mb-0"
              style={{
                fontSize: "2rem",
                fontWeight: 700,
                background: `linear-gradient(90deg, hsl(12,98%,65%), hsl(12,98%,40%))`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent", // ✅ ensures gradient visible
                backgroundClip: "text",
                color: "transparent",
                display: "inline-block", // ✅ prevents full-width bar
              }}
            >
              {mode === "view"
                ? "Blogs"
                : mode === "create"
                ? "Create Blog"
                : "Edit Blog"}
            </h2>

            {mode === "view" ? (
              <button
                className="btn btn-danger"
                onClick={() => setMode("create")}
              >
                + Create Blog
              </button>
            ) : (
              <button
                className="btn btn-outline-secondary"
                onClick={() => {
                  setMode("view");
                  setForm(emptyBlog);
                  setEditingId(null);
                }}
              >
                Cancel
              </button>
            )}
          </div>


            {/* FORM */}
            {mode !== "view" && (
              <div
                className="card p-4 mb-4"
                style={{
                  background: theme.card,
                  border: `1px solid ${theme.border}`,
                  borderRadius: "1rem",
                }}
              >
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <input
                      className="form-control"
                      style={inputStyle}
                      placeholder="Blog Title"
                      value={form.title}
                      onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                      }
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <input
                      className="form-control"
                      style={inputStyle}
                      placeholder="Image URL"
                      value={form.image}
                      onChange={(e) =>
                        setForm({ ...form, image: e.target.value })
                      }
                    />
                  </div>

                  <div className="col-12">
                    <textarea
                      className="form-control"
                      style={inputStyle}
                      rows="3"
                      placeholder="Short Intro"
                      value={form.intro}
                      onChange={(e) =>
                        setForm({ ...form, intro: e.target.value })
                      }
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <input
                      className="form-control"
                      style={inputStyle}
                      placeholder="External Blog Link"
                      value={form.link}
                      onChange={(e) =>
                        setForm({ ...form, link: e.target.value })
                      }
                    />
                  </div>

                  <div className="col-12">
                    <button
                      className="btn btn-danger w-100"
                      onClick={saveBlog}
                    >
                      {mode === "edit" ? "Update Blog" : "Create Blog"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* BLOG LIST */}
            {mode === "view" && (
              <div
                className="card p-3"
                style={{
                  background: theme.card,
                  border: `1px solid ${theme.border}`,
                  borderRadius: "1rem",
                }}
              >
                <div className="table-responsive">
                  <table
                    className="table table-hover align-middle mb-0"
                    style={{ color: theme.text }}
                  >
                    <thead style={{ color: theme.textMuted }}>
                      <tr>
                        <th>Title</th>
                        <th>Image</th>
                        <th>Intro</th>
                        <th>URL</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {blogs.map((b) => (
                        <tr key={b._id}>
                          <td style={{ color: theme.text, fontWeight: 500 }}>
                            {b.title}
                          </td>

                          <td>
                            {b.image && (
                              <img
                                src={b.image}
                                alt=""
                                style={{
                                  width: "70px",
                                  borderRadius: "8px",
                                }}
                              />
                            )}
                          </td>

                          <td
                            className="text-truncate"
                            style={{ maxWidth: "260px", color: theme.text }}
                          >
                            {b.intro}
                          </td>

                          <td>
                            {b.link && (
                              <a
                                href={b.link}
                                target="_blank"
                                rel="noreferrer"
                                className="btn btn-sm btn-outline-danger"
                              >
                                Visit
                              </a>
                            )}
                          </td>

                          <td className="text-nowrap">
                            <button
                              className="btn btn-sm btn-warning me-2"
                              onClick={() => {
                                setMode("edit");
                                setEditingId(b._id);
                                setForm({
                                  title: b.title,
                                  image: b.image,
                                  intro: b.intro,
                                  link: b.link,
                                });
                              }}
                            >
                              Edit
                            </button>

                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => removeBlog(b._id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}

                      {blogs.length === 0 && (
                        <tr>
                          <td colSpan="5" className="text-center text-muted">
                            No blogs found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>

          <Footer />
        </div>
      </div>
    </div>
  );
};

export default AdminBlogsPage;
