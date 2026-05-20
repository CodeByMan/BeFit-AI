import React, { useEffect, useState } from "react";
import API from "../../../api/Api";
import Header from "../layout/HeaderAdmin";
import Footer from "../layout/FooterAdmin";
import { useTheme } from "../../../context/ThemeContext";

export default function AdminTestimonialsPage() {
  const { darkMode } = useTheme();
  const [list, setList] = useState([]);

  const load = async () => {
    const res = await API.get("/testimonials");
    setList(res.data.testimonials);
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id) => {
    if (!window.confirm("Delete this testimonial?")) return;
    await API.delete(`/testimonials/${id}`);
    load();
  };

  const theme = darkMode
    ? {
        background: "#111",
        card: "#1e1e1e",
        text: "#f8f9fa",
        textMuted: "#9ca3af",
        border: "rgba(255,255,255,0.12)",
        orange: "hsl(12,98%,52%)",
      }
    : {
        background: "#f8f9fa",
        card: "#fff",
        text: "#212529",
        textMuted: "#6c757d",
        border: "#dee2e6",
        orange: "hsl(12,98%,52%)",
      };

  // Group testimonials by rating (ascending)
  const ratings = [1, 2, 3, 4, 5];
  const testimonialsByRating = ratings.map((r) => ({
    rating: r,
    items: list.filter((t) => t.rating === r),
  }));

  // Helper to render stars
  const renderStars = (rating) => {
    const maxStars = 5;
    return (
      <span style={{ color: "#f59e0b" /* amber-500 */ }}>
        {"★".repeat(rating) + "☆".repeat(maxStars - rating)}
      </span>
    );
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
            <h2
              className="fw-bold mb-4"
              style={{
                fontSize: "2rem",
                fontWeight: "700",
                background: `linear-gradient(90deg, ${theme.orange}, #ff784b)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                color: "transparent",
                display: "inline-block",
              }}
            >
              Testimonials
            </h2>



            {/* TESTIMONIAL LIST BY RATING */}
            {testimonialsByRating.map((group) => (
              <div
                key={group.rating}
                className="card p-3 mb-4"
                style={{
                  background: theme.card,
                  border: `1px solid ${theme.border}`,
                  borderRadius: "1rem",
                }}
              >
                <h5 style={{ color: theme.text, marginBottom: "15px" }}>
                  {group.rating} Star{group.rating > 1 ? "s" : ""} (
                  {group.items.length})
                </h5>

                <div className="table-responsive">
                  <table
                    className="table table-hover align-middle mb-0"
                    style={{ color: theme.text }}
                  >
                    <thead style={{ color: theme.textMuted }}>
                      <tr>
                        <th>Email</th>
                        <th>Message</th>
                        <th>Rating</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.items.length > 0 ? (
                        group.items.map((t) => (
                          <tr key={t._id}>
                            <td style={{ color: theme.text }}>
                              {t.userId?.email}
                            </td>
                            <td
                              style={{
                                wordBreak: "break-word",
                                maxWidth: "300px",
                                color: theme.text,
                              }}
                            >
                              {t.message}
                            </td>
                            <td style={{ color: theme.text }}>
                              {renderStars(t.rating)}
                            </td>
                            <td className="text-nowrap">
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => remove(t._id)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="4"
                            className="text-center text-muted"
                          >
                            No testimonials found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>

          <Footer />
        </div>
      </div>
    </div>
  );
}
