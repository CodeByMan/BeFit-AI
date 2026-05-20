// src/pages/NotFound.jsx
import React from "react";
import CircleTwoImg from "../assets/img/illustrations/page-misc-error-light.png";

const NotFound = () => {
  // Styles
  const pageStyle = {
    minHeight: "80vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa", // light background
    color: "#212529",
    padding: "2rem",
    transition: "all 0.3s",
  };


  return (
    <div style={pageStyle}>
      <div className="text-center">
        {/* Error Code */}
        {/* <h1
          style={{
            fontSize: "6rem",
            fontWeight: 900,
            color: "#f97316",
            marginBottom: "1rem",
          }}
        >
          404
        </h1> */}

        {/* Error Message */}
        <h2 style={{ fontWeight: 700, marginBottom: "1rem" }}>Page Not Found</h2>
        <p style={{ fontSize: "1.2rem", color: "#6c757d", marginBottom: "2rem" }}>
          Oops! The requested URL was not found on this server.
        </p>

        {/* Illustration */}
        <div className="mt-5">
          <img
            src={CircleTwoImg}
            alt="404 illustration"
            width="400"
            style={{ boxShadow: "0 8px 20px rgba(0,0,0,0.1)", borderRadius: "1rem" }}
          />
        </div>
      </div>
    </div>
  );
};

export default NotFound;
