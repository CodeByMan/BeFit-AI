// frontend/src/components/ProfileSetup/SetupStep1.jsx
import React from "react";
import { motion } from "framer-motion";
const orange = "hsl(12, 98%, 65%)";
const SetupStep1 = ({ nextStep, userName }) => (
  <motion.div
    initial={{ opacity: 0, x: 300 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -300 }}
    transition={{ duration: 0.5 }}
    className="text-center"
  >
    <h2 className="mb-4">Hi {userName || "User"}!</h2>
    <p className="mb-4">Let's set up your profile.</p>
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="btn"
      style={{
        backgroundColor: orange,
        color: "#fff",
        border: "none",
        padding: "0.6rem 1.5rem",
        borderRadius: "0.5rem",
        fontWeight: 600,
      }}
      onClick={nextStep}
    >
      Next
    </motion.button>
  </motion.div>
);

export default SetupStep1;

