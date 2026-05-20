// frontend/src/components/ProfileSetup/SetupStep2.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";

const avatars = [
  "https://api.dicebear.com/8.x/adventurer/svg?seed=Mittens",
  "https://api.dicebear.com/8.x/adventurer/svg?seed=Sheba",
  "https://api.dicebear.com/8.x/adventurer/svg?seed=Gizmo",
  "https://api.dicebear.com/8.x/adventurer/svg?seed=Pepper",
];

const SetupStep2 = ({ nextStep, prevStep, updateForm }) => {
  const [avatar, setAvatar] = useState(avatars[0]);
    const orange = "hsl(12, 98%, 65%)";

  const handleNext = () => {
    updateForm({ avatar_url: avatar });
    nextStep();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -300 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <h2 className="mb-4">Choose Your Avatar</h2>
      <div className="d-flex justify-content-around mb-4">
        {avatars.map((src) => (
          <img
            key={src}
            src={src}
            alt="avatar"
            onClick={() => setAvatar(src)}
            className={`rounded-circle border ${avatar === src ? "border-danger" : "border-secondary"}`}
            style={{ width: "80px", height: "80px", cursor: "pointer" }}
          />
        ))}
      </div>
      <div className="d-flex justify-content-between">
        <button className="btn btn-secondary" onClick={prevStep}>
          Back
        </button>
        <button
          className="btn"
          style={{ backgroundColor: orange, color: "#fff" }}
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </motion.div>
  );
};

export default SetupStep2;

