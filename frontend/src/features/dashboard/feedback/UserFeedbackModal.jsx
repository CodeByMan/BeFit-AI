import React, { useState } from "react";
import API from "../../../api/Api";
import { FaStar } from "react-icons/fa";

export default function UserFeedbackModal({ onClose }) {
  const savedFeedback = JSON.parse(localStorage.getItem('userFeedback') || "{}");
  const [message, setMessage] = useState(savedFeedback.message || "");
  const [rating, setRating] = useState(savedFeedback.rating || 5);
  const [hoverRating, setHoverRating] = useState(0);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) return alert("Feedback cannot be empty");

    try {
      const feedbackId = localStorage.getItem("userFeedbackId");

      if (feedbackId) {
        await API.put(`/testimonials/${feedbackId}`, { message, rating });
      } else {
        const res = await API.post("/testimonials", { message, rating });
        localStorage.setItem("userFeedbackId", res.data.id);
      }

      localStorage.setItem('userFeedback', JSON.stringify({ message, rating }));
      setSuccess(true);
      setTimeout(() => onClose(), 1500);
    } catch (err) {
      console.log(err);
      alert("Failed to submit feedback");
    }
  };

  const handleCancel = () => onClose();

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
      animation: "fadeIn 0.3s"
    }}>
      <div className="card p-4" style={{
        width: "420px",
        borderRadius: "15px",
        boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
        position: "relative",
        backgroundColor: "#fff",
        animation: "scaleIn 0.3s"
      }}>
        {/* Close Button */}
        <button 
          onClick={handleCancel} 
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            border: "none",
            background: "transparent",
            fontSize: "1.2rem",
            cursor: "pointer",
            color: "#888"
          }}>×</button>

        {/* Header */}
        <h4 style={{ 
          background: "linear-gradient(90deg, #ff6b6b, #ff8e53)", 
          WebkitBackgroundClip: "text", 
          color: "transparent", 
          marginBottom: "15px"
        }}>
          Share Your Experience
        </h4>

        {/* Feedback Textarea */}
        <textarea
          className="form-control my-2"
          rows={4}
          placeholder="Tell us about your experience..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ borderRadius: "10px", padding: "10px", resize: "vertical" }}
        />

        {/* Star Rating */}
        <div style={{ display: "flex", justifyContent: "center", margin: "10px 0" }}>
          {[1,2,3,4,5].map((star) => (
            <FaStar 
              key={star}
              size={28}
              style={{ marginRight: 5, cursor: "pointer" }}
              color={rating >= star ? "#ff8e53" : "#ddd"}
              onClick={() => setRating(star)}
            />
          ))}
        </div>

        {/* Buttons */}
        <div className="d-flex justify-content-between mt-3">
          <button className="btn btn-outline-secondary" onClick={handleCancel} style={{ flex: 1, marginRight: 10 }}>
            Cancel
          </button>
          <button className="btn btn-gradient-primary" onClick={handleSubmit} style={{ flex: 1 }}>
            Submit
          </button>
        </div>

        {/* Success Message */}
        {success && <p className="text-success mt-2 text-center" style={{ fontWeight: 500 }}>Thanks for your feedback!</p>}
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeIn { from {opacity:0} to {opacity:1} }
        @keyframes scaleIn { from {transform: scale(0.9)} to {transform: scale(1)} }
        .btn-gradient-primary {
          background: linear-gradient(90deg, #ff6b6b, #ff8e53);
          border: none;
          color: white;
          font-weight: 500;
        }
        .btn-gradient-primary:hover {
          opacity: 0.9;
        }
      `}</style>
    </div>
  );
}
