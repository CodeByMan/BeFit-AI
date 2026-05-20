// frontend/src/components/ProfileSetup/SetupStep3.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";

const genders = ["Male", "Female", "Other"];

const SetupStep3 = ({ prevStep, updateForm, submitProfile, formData }) => {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");

const handleFinish = () => {
  updateForm({
    age: Number(age),
    gender: gender.toLowerCase(),
  });
  // submit profile immediately
  submitProfile({
    age: Number(age),
    gender: gender.toLowerCase(),
  });
};


  const buttonStyle = (isActive) => ({
    padding: "12px 24px",
    borderRadius: "12px",
    fontWeight: 600,
    cursor: "pointer",
    border: "2px solid",
    borderColor: isActive ? "hsl(12, 98%, 65%)" : "#4B5563",
    backgroundColor: isActive ? "hsl(12, 98%, 65%)" : "#1F2937",
    color: isActive ? "#FFF" : "#D1D5DB",
    transition: "all 0.2s ease",
    minWidth: "100px",
    textAlign: "center",
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -300 }}
      transition={{ duration: 0.5 }}
    >
      <h2 style={{ textAlign: "center", fontSize: "1.875rem", fontWeight: "bold", marginBottom: "16px" }}>
        Your Age
      </h2>
      <input
        type="number"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        placeholder="Enter your age"
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "12px",
          border: "2px solid #4B5563",
          backgroundColor: "#1F2937",
          color: "#F9FAFB",
          fontSize: "1rem",
          marginBottom: "24px",
          outline: "none",
        }}
      />

      <h2 style={{ textAlign: "center", fontSize: "1.875rem", fontWeight: "bold", marginBottom: "16px" }}>
        Your Gender
      </h2>
      <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
        {genders.map((g) => (
          <div
            key={g}
            onClick={() => setGender(g)}
            style={buttonStyle(gender === g)}
            onMouseEnter={(e) => {
              if (gender !== g) e.currentTarget.style.backgroundColor = "#374151";
            }}
            onMouseLeave={(e) => {
              if (gender !== g) e.currentTarget.style.backgroundColor = "#1F2937";
            }}
          >
            {g}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button
          onClick={prevStep}
          style={{
            padding: "12px 24px",
            borderRadius: "12px",
            backgroundColor: "#4B5563",
            color: "#F9FAFB",
            fontWeight: "bold",
            border: "none",
            cursor: "pointer",
            transition: "background-color 0.2s ease",
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#6B7280"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#4B5563"}
        >
          Back
        </button>

<button
  onClick={handleFinish}
  disabled={!age || !gender}
  style={{
    padding: "12px 24px",
    borderRadius: "12px",
    backgroundColor: !age || !gender ? "#9CA3AF" : "hsl(12, 98%, 65%)",
    color: "#FFF",
    fontWeight: "bold",
    border: "none",
    cursor: !age || !gender ? "not-allowed" : "pointer",
    transition: "background-color 0.2s ease",
  }}
>
  Finish
</button>

      </div>
    </motion.div>
  );
};

export default SetupStep3;
