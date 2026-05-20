import { AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from '../../../api/Api';

import SetupStep1 from "./SetupStep1";
import SetupStep2 from "./SetupStep2";
import SetupStep3 from "./SetupStep3";

const ProfileSetup = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    full_name: "",
    avatar_url: "",
    age: "",
    gender: "",
  });

  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const orange = "hsl(12, 98%, 65%)";

  // Fetch logged-in user info and populate full_name
  useEffect(() => {
    API.get("/user/dashboard")
      .then(res => {
        const name = res.data.user.name || "";
        setUserName(name);
        setFormData(prev => ({ ...prev, full_name: name }));
      })
      .catch(err => console.error(err));
  }, []);

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);
  const updateForm = data => setFormData(prev => ({ ...prev, ...data }));

  const submitProfile = async (additionalData = {}) => {
    try {
      // Merge formData and additionalData, convert numbers
      const payload = {
        ...formData,
        ...additionalData,
        avatar_filename: formData.avatar_url || null,
        age: additionalData.age ?? (formData.age ? Number(formData.age) : null),
        gender: additionalData.gender ?? formData.gender ?? null,
        height: additionalData.height ?? (formData.height ? Number(formData.height) : null),
        weight: additionalData.weight ?? (formData.weight ? Number(formData.weight) : null),
        goal: additionalData.goal ?? formData.goal ?? null,
        goal_amount:
          additionalData.goal_amount !== undefined
            ? Number(additionalData.goal_amount)
            : formData.goal_amount
            ? Number(formData.goal_amount)
            : null,
        goal_timeframe:
          additionalData.goal_timeframe !== undefined
            ? Number(additionalData.goal_timeframe)
            : formData.goal_timeframe
            ? Number(formData.goal_timeframe)
            : null,
      };

      const res = await API.post("/profile/setup", payload);
      if (res.data.success) {
        navigate("/user-dashboard");
      } else {
        alert("Failed to save profile");
      }
    } catch (err) {
      console.error("Profile setup error:", err.response?.data || err.message);
      alert("Failed to save profile");
    }
  };

const steps = [
  <SetupStep1 key={1} nextStep={nextStep} userName={userName} />,
  <SetupStep2 key={2} nextStep={nextStep} prevStep={prevStep} updateForm={updateForm} />,
  <SetupStep3
    key={3}
    prevStep={prevStep}
    updateForm={updateForm}
    submitProfile={submitProfile} // ✅ pass submitProfile here
    formData={formData}          // optional if you need existing data
  />,
];

  return (
    <div className="min-vh-100 bg-dark text-white d-flex flex-column align-items-center justify-content-center p-4">
      <div className="w-100" style={{ maxWidth: "480px" }}>
        <div className="mb-4">
          <div className="d-flex mb-2">
          {steps.map((_, i) => (
            <div
              key={i}
              className="flex-fill me-1 rounded" // remove bg-primary / bg-secondary
              style={{
                height: "6px",
                backgroundColor: step > i ? orange : "#6c757d", // active steps orange, others gray
              }}
            ></div>
          ))}
        </div>
        </div>
        <AnimatePresence mode="wait">{steps[step - 1]}</AnimatePresence>
      </div>
    </div>
  );
};

export default ProfileSetup;
