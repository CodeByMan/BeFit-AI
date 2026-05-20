import React, { useEffect, useState } from "react";
import Header from "./layout/HeaderAdmin";
import Footer from "./layout/FooterAdmin";
import { useTheme } from "../../context/ThemeContext";
import API from "../../api/Api";
import { FaUsers, FaBlog, FaCommentDots } from "react-icons/fa";

const AdminDashboard = () => {
  const orangeLight = "hsl(12, 98%, 65%)";
  const orangeDark = "hsl(12, 98%, 40%)";
  const { darkMode } = useTheme();
  const [counts, setCounts] = useState({
    users: 0,
    blogs: 0,
    testimonials: 0,
  });
  const [adminName, setAdminName] = useState("");

  const theme = darkMode
    ? {
        background: "#111111",
        textPrimary: "#fff",
        textSecondary: "#9ca3af",
      }
    : {
        background: "#f8f9fa",
        textPrimary: "#111",
        textSecondary: "#6c757d",
      };

  useEffect(() => {
    const loadData = async () => {
      try {
        // Users
        const usersRes = await API.get("/admin/users");
        const users = usersRes.data.users.filter(
          (u) => u.roleId === 2 && !u.isDeleted
        );

        // Blogs
        const blogsRes = await API.get("/admin/blogs");
        const blogs = blogsRes.data.blogs;

        // Testimonials
        const testimonialsRes = await API.get("/testimonials");
        const testimonials = testimonialsRes.data.testimonials;

        // Admin profile
        const profileRes = await API.get("/admin/profile");
        setAdminName(profileRes.data.admin.name);

        // Set counts
        setCounts({
          users: users.length,
          blogs: blogs.length,
          testimonials: testimonials.length,
        });
      } catch (err) {
        console.error("Error fetching dashboard data:", err.response || err);
      }
    };

    loadData();
  }, []);

  // Card data
  const cardData = [
  {
    title: "Users",
    count: counts.users,
    icon: <FaUsers size={38} color={orangeLight} />,
  },
  {
    title: "Blogs",
    count: counts.blogs,
    icon: <FaBlog size={38} color={orangeLight} />,
  },
  {
    title: "Testimonials",
    count: counts.testimonials,
    icon: <FaCommentDots size={38} color={orangeLight} />,
  },
];

  return (
    <div
      className="layout-wrapper layout-content-navbar"
      style={{ backgroundColor: theme.background, minHeight: "100vh" }}
    >
      <div className="layout-container">
        <Header />

        <div className="layout-page">
          <div className="content-wrapper">
            <div className="container-xxl flex-grow-1 container-p-y">
              {/* Heading */}
            <div className="container mb-4 text-center">
              <h1
                className="mb-1"
                style={{
                  fontSize: "2.5rem",
                  fontWeight: 700,
                  background: `linear-gradient(90deg, ${orangeLight}, ${orangeDark})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent", // ✅ critical
                  backgroundClip: "text",
                  color: "transparent",
                  display: "inline-block",
                }}
              >
                {adminName ? `Welcome, ${adminName}` : "Welcome, Administrator"}
              </h1>

              <p style={{ color: theme.textSecondary, fontSize: "1.1rem" }}>
                Manage users, blogs & testimonials.
              </p>
            </div>

              {/* Cards */}
              <div className="container">
                <div className="row g-4 justify-content-center">
                  {cardData.map((card) => (
                    <div key={card.title} className="col-md-4">
              <div
                className="card text-center p-4"
                style={{
                  background: darkMode
                    ? "linear-gradient(135deg, #1e1e1e, #2a2a2a)"
                    : "linear-gradient(135deg, #fff5f0, #ffe6d6)",

                  color: darkMode ? theme.textPrimary : "#111",
                  borderRadius: "1.5rem",

                  boxShadow: darkMode
                    ? "0 8px 30px rgba(0, 0, 0, 0.6)"
                    : "0 6px 25px rgba(246, 80, 9, 0.25)",

                  border: darkMode
                    ? "1px solid rgba(255, 255, 255, 0.08)"
                    : "none",

                  transition: "all 0.3s ease",
                }}
              >

                        <div className="mb-3">{card.icon}</div>
                        <h5 style={{ fontWeight: "500" }}>{card.title}</h5>
                        <h2
                          style={{
                            fontWeight: 700,
                            marginTop: "10px",
                            color: darkMode ? orangeLight : "#d35400",
                          }}
                        >
                          {card.count}
                        </h2>
                      </div>
                    </div>
                  ))}
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

export default AdminDashboard;
