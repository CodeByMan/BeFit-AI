// frontend/src/components/ProfileSetup/SetupStep4.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";

const SetupStep4 = ({ nextStep, prevStep, updateForm }) => {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [unitSystem, setUnitSystem] = useState("metric"); // 'metric' or 'imperial'

  // For imperial inputs
  const [heightFeet, setHeightFeet] = useState("");
  const [heightInches, setHeightInches] = useState("");

  const handleNext = () => {
    let finalHeight = height;
    let finalWeight = weight;

    if (unitSystem === "imperial") {
      finalHeight = Number(heightFeet) * 30.48 + Number(heightInches) * 2.54; // convert ft+in to cm
      finalWeight = Number(weight) * 0.453592; // lb to kg
    }

    updateForm({
      height: Math.round(finalHeight),
      weight: Math.round(finalWeight),
    });
    nextStep();
  };

  const toggleUnit = (unit) => {
    setUnitSystem(unit);
    // Reset inputs
    setHeight("");
    setWeight("");
    setHeightFeet("");
    setHeightInches("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -300 }}
      transition={{ duration: 0.5 }}
    >
      <h2 style={{ textAlign: "center", fontSize: "1.875rem", fontWeight: "bold", marginBottom: "16px" }}>
        Your Measurements
      </h2>

      {/* Unit toggle */}
      <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginBottom: "24px" }}>
        {["metric", "imperial"].map((unit) => (
          <div
            key={unit}
            onClick={() => toggleUnit(unit)}
            style={{
              padding: "8px 16px",
              borderRadius: "12px",
              cursor: "pointer",
              fontWeight: "bold",
              backgroundColor: unitSystem === unit ? "hsl(12, 98%, 65%)" : "#1F2937",
              color: unitSystem === unit ? "#FFF" : "#D1D5DB",
              border: unitSystem === unit ? "2px solid hsl(12, 98%, 65%)" : "2px solid #4B5563",
              transition: "all 0.2s ease",
            }}
          >
            {unit === "metric" ? "Metric (cm/kg)" : "Imperial (ft/lb)"}
          </div>
        ))}
      </div>

      {/* Inputs */}
      {unitSystem === "metric" ? (
        <>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="Height (cm)"
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "12px",
              border: "2px solid #4B5563",
              backgroundColor: "#1F2937",
              color: "#F9FAFB",
              fontSize: "1rem",
              marginBottom: "16px",
              outline: "none",
            }}
          />
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Weight (kg)"
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "12px",
              border: "2px solid #4B5563",
              backgroundColor: "#1F2937",
              color: "#F9FAFB",
              fontSize: "1rem",
              marginBottom: "16px",
              outline: "none",
            }}
          />
        </>
      ) : (
        <div style={{ display: "flex", gap: "16px", marginBottom: "16px", flexWrap: "wrap" }}>
          <input
            type="number"
            value={heightFeet}
            onChange={(e) => setHeightFeet(e.target.value)}
            placeholder="Height (ft)"
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "12px",
              border: "2px solid #4B5563",
              backgroundColor: "#1F2937",
              color: "#F9FAFB",
              fontSize: "1rem",
              outline: "none",
            }}
          />
          <input
            type="number"
            value={heightInches}
            onChange={(e) => setHeightInches(e.target.value)}
            placeholder="Height (in)"
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "12px",
              border: "2px solid #4B5563",
              backgroundColor: "#1F2937",
              color: "#F9FAFB",
              fontSize: "1rem",
              outline: "none",
            }}
          />
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Weight (lb)"
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "12px",
              border: "2px solid #4B5563",
              backgroundColor: "#1F2937",
              color: "#F9FAFB",
              fontSize: "1rem",
              outline: "none",
            }}
          />
        </div>
      )}

      {/* Navigation */}
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
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#6B7280")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#4B5563")}
        >
          Back
        </button>

        <button
          onClick={handleNext}
          disabled={
            unitSystem === "metric"
              ? !height || !weight
              : !heightFeet || !heightInches || !weight
          }
          style={{
            padding: "12px 24px",
            borderRadius: "12px",
            backgroundColor:
              unitSystem === "metric"
                ? !height || !weight
                  ? "#9CA3AF"
                  : "hsl(12, 98%, 65%)"
                : !heightFeet || !heightInches || !weight
                ? "#9CA3AF"
                : "hsl(12, 98%, 65%)",
            color: "#FFF",
            fontWeight: "bold",
            border: "none",
            cursor:
              unitSystem === "metric"
                ? !height || !weight
                  ? "not-allowed"
                  : "pointer"
                : !heightFeet || !heightInches || !weight
                ? "not-allowed"
                : "pointer",
            transition: "background-color 0.2s ease",
          }}
          onMouseEnter={(e) => {
            if (
              (unitSystem === "metric" && height && weight) ||
              (unitSystem === "imperial" && heightFeet && heightInches && weight)
            )
              e.currentTarget.style.backgroundColor = "hsl(12, 98%, 65%)";
          }}
          onMouseLeave={(e) => {
            if (
              (unitSystem === "metric" && height && weight) ||
              (unitSystem === "imperial" && heightFeet && heightInches && weight)
            )
              e.currentTarget.style.backgroundColor = "hsl(12, 98%, 65%)";
          }}
        >
          Next
        </button>
      </div>
    </motion.div>
  );
};

export default SetupStep4;
