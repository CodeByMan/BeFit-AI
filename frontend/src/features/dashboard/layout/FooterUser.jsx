import React from "react";
import useDynamicCSS from "../../../hooks/useDynamicCSS";
import { useTheme } from "../../../context/ThemeContext";

const FooterUserDashboard = () => {
  useDynamicCSS("/src/assets/vendor/css/core.css");
  useDynamicCSS("/src/assets/vendor/css/theme-default.css");
  useDynamicCSS("/src/assets/css/demo.css");
  useDynamicCSS("/src/assets/vendor/css/pages/page-auth.css");

  const year = new Date().getFullYear();
  const { darkMode } = useTheme();

  // Primary and secondary colors
  const orange = "hsl(12, 98%, 52%)"; // dominant
  const orangeLight = "hsl(12, 98%, 65%)";
  const orangeDark = "hsl(12, 98%, 40%)";
  const blue = "#3B82F6";   // secondary
  const green = "#10B981";  // secondary
  const yellow = "#FACC15"; // secondary

  // Theme colors for footer text and links
  const themeText = darkMode ? "#f8f9fa" : "#212529";
  const themeLink = darkMode ? orangeLight : orange;

  return (
    // Footer
    <footer
      className="content-footer footer mt-5"
      style={{
        backgroundColor: darkMode ? "#111111" : "#f8f9fa", // Dark/light footer background
        color: themeText,
        transition: "all 0.3s",
      }}
    >
      <div className="container-xxl d-flex flex-wrap justify-content-center py-2 flex-md-row flex-column">
        <div className="mb-2 mb-md-0">
          © {year}, made with ❤️ by{" "}
          <a
            href="https://github.com/muhmdan"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link fw-bolder"
            style={{ color: themeLink }} // Dominant orange link
          >
            CodeByMan
          </a>
        </div>
      </div>
    </footer>
    // / Footer
  );
};

export default FooterUserDashboard;
