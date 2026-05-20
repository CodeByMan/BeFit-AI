// frontend/src/features/dashboard/UserDashboard.jsx
import React, { useEffect, useState } from "react";
import Header from "./layout/HeaderUser";
import Footer from "./layout/FooterUser";
import Chatbot from "./layout/Chatbot";
import { useTheme } from "../../context/ThemeContext";
import { IoChatbubbleEllipsesOutline, IoFlameOutline, IoTrendingUpOutline } from "react-icons/io5";
import UserFeedbackModal from "./feedback/UserFeedbackModal";
import API from "../../api/Api";
import { Line, Bar, Pie, Doughnut, Radar, PolarArea } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
  RadialLinearScale,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
  RadialLinearScale
);

const UserDashboard = () => {
  const [isTipOpen, setIsTipOpen] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [activeTab, setActiveTab] = useState("today");
  const { darkMode } = useTheme();

  const [workouts, setWorkouts] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const today = new Date();
  const defaultFrom = new Date();
  defaultFrom.setDate(today.getDate() - 6);

  const orange = "hsl(12, 98%, 52%)";
  const orangeLight = "hsl(12, 98%, 65%)";
  const orangeDark = "hsl(12, 98%, 40%)";

  const theme = darkMode
    ? {
        background: "#111111",
        textSecondary: "#9ca3af",
        cardBackground: "rgba(30,30,30,0.85)",
        border: "1px solid rgba(255,255,255,0.15)",
      }
    : {
        background: "#f8f9fa",
        textSecondary: "#6c757d",
        cardBackground: "rgba(255,255,255,0.95)",
        border: "1px solid rgba(0,0,0,0.1)",
      };

  useEffect(() => {
    if (parseInt(localStorage.getItem("roleId")) === 2) {
      if (!sessionStorage.getItem("feedbackShown")) {
        setShowFeedback(true);
        sessionStorage.setItem("feedbackShown", "true");
      }
    }
    setFromDate(defaultFrom.toISOString().split("T")[0]);
    setToDate(today.toISOString().split("T")[0]);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const wRes = await API.get("/workouts");
      setWorkouts(wRes.data.workouts || []);
      const pRes = await API.get("/profile/me");
      if (pRes.data.success) setProfile(pRes.data.profile);
    } catch (err) {
      console.error(err);
      alert("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  if (!profile) return null;

  const weight = profile?.weight,
    height = profile?.height,
    age = profile?.age,
    gender = profile?.gender;
  const BMR =
    gender === "female"
      ? 10 * weight + 6.25 * height - 5 * age - 161
      : 10 * weight + 6.25 * height - 5 * age + 5;
  const BMR_per_hour = BMR / 24;
  const MET_VALUES = { cardio: 8, strength: 6, other: 5 };

  // Filter workouts by date
  const startDate = new Date(fromDate);
  const endDate =
    new Date(toDate) > today ? today : new Date(toDate);
  const filteredWorkouts = workouts.filter((w) => {
    const d = new Date(w.date);
    return d >= startDate && d <= endDate;
  });

  // Map workouts by date
  const dayMap = {};
  const cursor = new Date(startDate);
  while (cursor <= endDate) {
    const key = cursor.toISOString().split("T")[0];
    dayMap[key] = [];
    cursor.setDate(cursor.getDate() + 1);
  }
  filteredWorkouts.forEach((w) => {
    const key = new Date(w.date).toISOString().split("T")[0];
    if (dayMap[key]) dayMap[key].push(w);
  });

  // Prepare chart data
  const chartLabels = Object.keys(dayMap);
  const volumeData = chartLabels.map((date) => {
    let vol = 0;
    dayMap[date].forEach((w) => {
      (w.exercises || []).forEach((ex) =>
        ex.reps.forEach((r, i) => (vol += r * (ex.weight[i] || 0)))
      );
    });
    return vol;
  });
  const caloriesMap = {};
  filteredWorkouts.forEach((w) => {
    const durationH = (w.durationMinutes || 0) / 60;
    const MET = MET_VALUES[w.category?.toLowerCase()] || 6;
    const calories = BMR_per_hour * MET * durationH;
    const key = new Date(w.date).toISOString().split("T")[0];
    caloriesMap[key] = (caloriesMap[key] || 0) + calories;
  });
  const caloriesData = chartLabels.map((d) => caloriesMap[d] || 0);

  const totalCaloriesIntake = 2000; // Example static value
  const caloriesOut = Math.round(caloriesData.reduce((a, b) => a + b, 0));
  const netCalories = totalCaloriesIntake - caloriesOut;

  const dashboardStats = {
    caloriesIn: totalCaloriesIntake,
    caloriesOut: caloriesOut,
    netCalories: netCalories,
    protein: 50,
    carbs: 150,
    fat: 60,
  };

  const tipButtonStyle = {
    position: "fixed",
    bottom: "2rem",
    right: "2rem",
    background: `linear-gradient(90deg, ${orangeLight}, ${orangeDark})`,
    color: "#fff",
    borderRadius: "50%",
    width: "3.5rem",
    height: "3.5rem",
    padding: 0,
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    zIndex: 5000,
  };

  // Attendance rows
  const attendanceRows = Object.keys(dayMap).map((d) => {
    const workoutsForDay = dayMap[d];
    if (workoutsForDay.length === 0) return { date: d, status: "Absent" };
    const doneTrue = workoutsForDay.some((w) => w.done === true);
    if (doneTrue) return { date: d, status: "Present" };
    return { date: d, status: "Planned But Absent" };
  });

  // Charts (same as your code)
  const charts = [
  {
    title: "Daily Volume",
    type: "bar",
    data: { labels: chartLabels, datasets: [{ label: "Volume", data: volumeData, backgroundColor: orange }] },
  },
  {
    title: "Daily Calories Burned",
    type: "line",
    data: {
      labels: chartLabels,
      datasets: [
        {
          label: "Calories",
          data: caloriesData,
          borderColor: orange,
          backgroundColor: "rgba(255,165,0,0.2)",
          fill: true,
          tension: 0.3,
        },
      ],
    },
  },
  {
    title: "Workout Category Distribution",
    type: "pie",
    data: {
      labels: [...new Set(filteredWorkouts.map((w) => w.category || "Other"))],
      datasets: [
        {
          data: [...new Set(filteredWorkouts.map((w) => w.category || "Other"))].map(
            (c) => filteredWorkouts.filter((w) => w.category === c).length
          ),
          backgroundColor: chartLabels.map((_, i) => `hsl(${i * 45},70%,50%)`),
        },
      ],
    },
  },
  {
    title: "Workout Category Doughnut",
    type: "doughnut",
    data: {
      labels: [...new Set(filteredWorkouts.map((w) => w.category || "Other"))],
      datasets: [
        {
          data: [...new Set(filteredWorkouts.map((w) => w.category || "Other"))].map(
            (c) => filteredWorkouts.filter((w) => w.category === c).length
          ),
          backgroundColor: chartLabels.map((_, i) => `hsl(${i * 50},65%,55%)`),
        },
      ],
    },
  },
  {
    title: "Volume Radar Chart",
    type: "radar",
    data: {
      labels: chartLabels,
      datasets: [{ label: "Volume", data: volumeData, backgroundColor: "rgba(255,165,0,0.3)", borderColor: orange }],
    },
  },
  {
    title: "Calories Polar Area",
    type: "polarArea",
    data: {
      labels: chartLabels,
      datasets: [{ data: caloriesData, backgroundColor: chartLabels.map((_, i) => `hsl(${i * 30},70%,50%)`) }],
    },
  },
  {
    title: "Cumulative Volume Line",
    type: "line",
    data: {
      labels: chartLabels,
      datasets: [
        {
          label: "Cumulative Volume",
          data: volumeData.map((v, i) => volumeData.slice(0, i + 1).reduce((a, b) => a + b, 0)),
          borderColor: orange,
          fill: false,
        },
      ],
    },
  },
  {
    title: "Horizontal Volume Bar",
    type: "bar",
    data: {
      labels: chartLabels,
      datasets: [{ label: "Volume", data: volumeData, backgroundColor: orange }],
      options: { indexAxis: "y" },
    },
  },
];



  return (
    <div className="layout-wrapper layout-content-navbar" style={{ backgroundColor: theme.background, minHeight: "100vh" }}>
      <div className="layout-container">
        <Header />
        <div className="layout-page">
          <div className="content-wrapper">
            <div className="container-xxl flex-grow-1 container-p-y">
              <div className="container">

                {/* ===== DASHBOARD HEADER ===== */}
<div
  className="mb-4 p-4 rounded-3 d-flex flex-column flex-md-row align-items-md-center justify-content-between"
>
  {/* LEFT SIDE */}
  <div>
    <h1
      className="fw-bold mb-1"
      style={{
        fontSize: "2.2rem",
        background: "linear-gradient(90deg,#ffffff,#bfc5ce)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
    >
      Welcome Back
    </h1>
    <p className="mb-0 small text-secondary">
      Here's your workout summary: {activeTab === "today" ? "Today's Overview" : "This Week's Overview"}
    </p>
  </div>

  {/* RIGHT SIDE TABS */}
  <div
    className="d-flex gap-2 mt-3 mt-md-0 p-1 rounded-3"
    style={{
      background: "rgba(30,36,48,0.6)",
      border: "1px solid #2e3748",
    }}
  >
    <button
      onClick={() => setActiveTab("today")}
      className={`btn btn-sm px-4 fw-semibold ${
        activeTab === "today"
          ? "text-white"
          : "btn-outline-secondary border-0"
      }`}
      style={
        activeTab === "today"
          ? {
              background:
                "linear-gradient(90deg,#22c55e,#16a34a)",
              boxShadow: "0 4px 14px rgba(34,197,94,0.4)",
            }
          : {}
      }
    >
      Today
    </button>

    <button
      onClick={() => setActiveTab("week")}
      className={`btn btn-sm px-4 fw-semibold ${
        activeTab === "week"
          ? "text-white"
          : "btn-outline-secondary border-0"
      }`}
      style={
        activeTab === "week"
          ? {
              background:
                "linear-gradient(90deg,#22c55e,#16a34a)",
              boxShadow: "0 4px 14px rgba(34,197,94,0.4)",
            }
          : {}
      }
    >
      This Week
    </button>
  </div>
</div>


{/* ===== CALORIE SUMMARY CARDS (2 CARDS) ===== */}
<div className="row g-4 mb-4">

  {/* Calories Consumed */}
  <div className="col-md-6">
    <div
      className="card h-100 text-white"
      style={{
        background: "linear-gradient(135deg, rgba(249,115,22,0.25), rgba(239,68,68,0.35))",
        border: "1px solid rgba(255,255,255,0.15)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div className="card-body">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <span className="text-secondary">Calories Consumed</span>
          <IoFlameOutline size={22} className="text-warning" />
        </div>
        <h3 className="fw-bold mb-0">
          {dashboardStats?.caloriesIn || 0} kcal
        </h3>
      </div>
    </div>
  </div>

  {/* Calories Burned */}
  <div className="col-md-6">
    <div
      className="card h-100 text-white"
      style={{
        background: "linear-gradient(135deg, rgba(59,130,246,0.25), rgba(34,211,238,0.35))",
        border: "1px solid rgba(255,255,255,0.15)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div className="card-body">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <span className="text-secondary">Calories Burned</span>
          <IoTrendingUpOutline size={22} className="text-info" />
        </div>
        <h3 className="fw-bold mb-0">
          {caloriesOut.toLocaleString()} kcal
        </h3>
      </div>
    </div>
  </div>

</div>



{/* ===== MACRONUTRIENT BREAKDOWN ===== */}
<div
  className="card p-4 mb-4"
  style={{
    background: "linear-gradient(135deg, rgba(31,41,55,0.85), rgba(17,24,39,0.9))",
    border: "1px solid rgba(255,255,255,0.15)",
    backdropFilter: "blur(10px)",
  }}
>
  <div className="mb-4">
    <h4 className="fw-bold text-white mb-1">Macronutrient Breakdown</h4>
    <p className="text-secondary mb-0">
      Track your daily nutrition goals
    </p>
  </div>

  {/* Protein */}
  <div className="mb-4">
    <div className="d-flex justify-content-between mb-1">
      <span className="text-white fw-semibold">Protein</span>
      <span className="text-secondary">
        {Math.round(dashboardStats.protein)} / 200 g
      </span>
    </div>
    <div className="progress" style={{ height: "10px" }}>
      <div
        className="progress-bar"
        style={{
          width: `${Math.min((dashboardStats.protein / 200) * 100, 100)}%`,
          background: "linear-gradient(90deg,#60a5fa,#2563eb)",
        }}
      />
    </div>
  </div>

  {/* Carbs */}
  <div className="mb-4">
    <div className="d-flex justify-content-between mb-1">
      <span className="text-white fw-semibold">Carbs</span>
      <span className="text-secondary">
        {Math.round(dashboardStats.carbs)} / 300 g
      </span>
    </div>
    <div className="progress" style={{ height: "10px" }}>
      <div
        className="progress-bar"
        style={{
          width: `${Math.min((dashboardStats.carbs / 300) * 100, 100)}%`,
          background: "linear-gradient(90deg,#4ade80,#16a34a)",
        }}
      />
    </div>
  </div>

  {/* Fat */}
  <div>
    <div className="d-flex justify-content-between mb-1">
      <span className="text-white fw-semibold">Fat</span>
      <span className="text-secondary">
        {Math.round(dashboardStats.fat)} / 100 g
      </span>
    </div>
    <div className="progress" style={{ height: "10px" }}>
      <div
        className="progress-bar"
        style={{
          width: `${Math.min((dashboardStats.fat / 100) * 100, 100)}%`,
          background: "linear-gradient(90deg,#facc15,#f97316)",
        }}
      />
    </div>
  </div>
</div>


                {/* ===== Attendance Table ===== */}
                <div className="card p-3 mb-4" style={{ background: theme.cardBackground, border: theme.border }}>
                  <h5>Attendance (Last 7 days)</h5>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceRows.map((row, i) => (
                        <tr key={i}>
                          <td>{row.date}</td>
                          <td>{row.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* ===== Charts ===== */}
                <div className="row">
                  {charts.map((c,i)=>(
                    <div key={i} className="col-lg-6 col-md-12 mb-4">
                      <div className="card p-3" style={{ background:theme.cardBackground, border:theme.border }}>
                        <h5>{c.title}</h5>
                        {c.type==='bar' && <Bar data={c.data} options={c.options||{}} />}
                        {c.type==='line' && <Line data={c.data} />}
                        {c.type==='pie' && <Pie data={c.data} />}
                        {c.type==='doughnut' && <Doughnut data={c.data} />}
                        {c.type==='radar' && <Radar data={c.data} />}
                        {c.type==='polarArea' && <PolarArea data={c.data} />}
                      </div>
                    </div>
                  ))}
                </div>

              </div>
              <div className="content-backdrop fade"></div>
            </div>
            <Footer />
          </div>
        </div>
      </div>

      {/* Chatbot button */}
      <button style={tipButtonStyle} onClick={()=>setIsTipOpen(true)}>
        <IoChatbubbleEllipsesOutline size={22} />
      </button>
      {isTipOpen && <Chatbot isOpen={isTipOpen} onClose={()=>setIsTipOpen(false)} />}
      {isTipOpen && <div onClick={()=>setIsTipOpen(false)} style={{ position:"fixed", inset:0, backgroundColor:"rgba(0,0,0,0.45)", zIndex:4000 }}></div>}

      {/* Feedback Modal */}
      {showFeedback && <UserFeedbackModal onClose={()=>setShowFeedback(false)} />}
    </div>
  );
};

export default UserDashboard;
