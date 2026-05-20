// frontend/src/components/ProfileSetup/SetupStep5.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";

const goals = ["Lose Weight", "Gain Weight", "Maintain Weight"];
const mapGoal = {
  "Lose Weight": "lose_weight",
  "Gain Weight": "gain_weight",
  "Maintain Weight": "maintain_weight",
};

const SetupStep5 = ({ prevStep, formData, submitProfile }) => {
  const [goal, setGoal] = useState(
    formData.goal ? Object.keys(mapGoal).find(k => mapGoal[k] === formData.goal) : ""
  );
  const [amount, setAmount] = useState(formData.goal_amount || "");
  const [unit, setUnit] = useState("kg"); // default unit
  const [timeframe, setTimeframe] = useState(formData.goal_timeframe || "");
  const orange = "hsl(12, 98%, 65%)";

  const handleSubmit = () => {
    // Convert lbs to kg if needed
    let convertedAmount = Number(amount);
    if (unit === "lb") {
      convertedAmount = Number(amount) * 0.453592; // lb -> kg
    }

    const payload = {
      goal: mapGoal[goal],
      goal_amount: goal === "Maintain Weight" ? 0 : convertedAmount,
      goal_timeframe: goal === "Maintain Weight" ? 0 : Number(timeframe),
    };
    submitProfile(payload);
  };

  const isDisabled = !goal || (goal !== "Maintain Weight" && (!amount || !timeframe));

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -300 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="mb-4 text-center">Your Goal</h2>
      <div className="d-flex justify-content-around mb-3 flex-wrap">
        {goals.map((g) => (
          <button
              key={g}
              onClick={() => setGoal(g)}
              className="btn mb-2"
              style={{
                backgroundColor: goal === g ? orange : "transparent",
                color: goal === g ? "#fff" : "#fff",
                border: `1px solid ${orange}`,
              }}
            >
              {g}
            </button>
        ))}
      </div>

      {goal && goal !== "Maintain Weight" && (
        <>
          <div className="d-flex mb-3">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="form-control me-2"
              placeholder={`Amount (${unit})`}
            />
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="form-select"
            >
              <option value="kg">kg</option>
              <option value="lb">lb</option>
            </select>
          </div>

          <input
            type="number"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="form-control mb-3"
            placeholder="Timeframe (weeks)"
          />
        </>
      )}

      <div className="d-flex justify-content-between">
        <button onClick={prevStep} className="btn btn-secondary">Back</button>
        <button onClick={handleSubmit} className="btn btn-dan" disabled={isDisabled} style={{ backgroundColor: orange, color: "#fff" }}>Finish</button>
      </div>
    </motion.div>
  );
};

export default SetupStep5;