// frontend/src/features/dashboard/UserDashboard.jsx
import React from "react";
import { motion } from "framer-motion";
import Header from "./layout/HeaderUser";
import Footer from "./layout/FooterUser";
import { useTheme } from "../../context/ThemeContext";
import { IoTrendingUpOutline, IoFlameOutline } from "react-icons/io5";
import Confetti from "react-confetti";
import API from "../../api/Api";
import { Line, Bar } from "react-chartjs-2";
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
  Filler,
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
  Filler
);

const MacroProgressBar = ({ name, current, goal, color, theme }) => {
  const progress = Math.min((current / goal) * 100, 100);

  return (
    <div
      style={{
        borderRadius: "1rem",
        padding: "1rem",
        background: theme.cardBackground,
        border: `1px solid ${theme.border}`,
        marginBottom: "1rem",
      }}
    >
      {/* Header: Name and Progress */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
        <p style={{ fontSize: "0.875rem", fontWeight: 600, color: theme.textSecondary }}>{name}</p>
        <p style={{ fontSize: "0.875rem", fontWeight: 700, color: theme.textPrimary }}>
          {current}g / {goal}g
        </p>
      </div>

      {/* Animated Progress Bar */}
      <motion.div
        style={{
          width: "100%",
          height: "0.75rem",
          borderRadius: "0.75rem",
          background: theme.progressBackground,
          overflow: "hidden",
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeInOut" }}
          style={{ height: "100%", borderRadius: "0.75rem", background: color }}
        />
      </motion.div>

      {/* Footer: 0g / Goal */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.5rem" }}>
        <span style={{ fontSize: "0.75rem", color: theme.textSecondary }}>0g</span>
        <span style={{ fontSize: "0.75rem", color: theme.textSecondary }}>{goal}g</span>
      </div>
    </div>
  );
};



const Dashboard = () => {
  const { darkMode } = useTheme();
  const [view, setView] = React.useState("today");
  const [goal, setGoal] = React.useState(null);
  const [summary, setSummary] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [dailySuccess, setDailySuccess] = React.useState(false);
  const [workouts, setWorkouts] = React.useState([]);

  const today = new Date();
  const formatDate = (d) => d.toISOString().split("T")[0];
  const orange = "hsl(12, 98%, 52%)";
    const theme = darkMode
    ? { background: "#111111", cardBackground: "rgba(31,41,55,0.8)", textPrimary: "#f8f9fa", textSecondary: "#9ca3af", border: "rgba(255,255,255,0.1)", progressBackground: "rgba(255,255,255,0.1)" }
    : { background: "#f8f9fa", cardBackground: "rgba(255,255,255,0.9)", textPrimary: "#212529", textSecondary: "#6c757d", border: "rgba(0,0,0,0.1)", progressBackground: "rgba(0,0,0,0.1)" };

  React.useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const goalRes = await API.get("/goal");
        setGoal(goalRes.data);

        if (view === "today") {
          const foodLogRes = await API.get("/foodlog/daily-summary", { params: { date: formatDate(today) } });
          setSummary(foodLogRes.data);
          if (foodLogRes.data?.caloriesIn >= goalRes.data?.dailyCalories) {
            setDailySuccess(true);
            setTimeout(() => setDailySuccess(false), 5000);
          }
        } else {
          const weekAgo = new Date();
          weekAgo.setDate(today.getDate() - 6);
          const res = await API.get("/foodlog", { params: { from: formatDate(weekAgo), to: formatDate(today) } });
          const weekly = res.data.logs.reduce(
            (acc, log) => {
              acc.caloriesIn += log.totals?.calories ?? 0;
              acc.protein += log.totals?.protein ?? 0;
              acc.carbs += log.totals?.carbs ?? 0;
              acc.fat += log.totals?.fats ?? 0;
              return acc;
            },
            { caloriesIn: 0, protein: 0, carbs: 0, fat: 0 }
          );
          weekly.caloriesGoal = (goalRes.data?.dailyCalories ?? 0) * 7;
          weekly.proteinGoal = (goalRes.data?.dailyProtein ?? 0) * 7;
          weekly.carbsGoal = (goalRes.data?.dailyCarbs ?? 0) * 7;
          weekly.fatGoal = (goalRes.data?.dailyFats ?? 0) * 7;
          setSummary(weekly);
        }

        const wRes = await API.get("/workouts", { params: { limit: 100 } });
        setWorkouts(wRes.data.workouts || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [view]);

  if (loading) return <div className="text-center mt-5">Loading dashboard...</div>;

  const caloriesGoal = view === "today" ? goal?.dailyCalories ?? 0 : summary?.caloriesGoal ?? 0;
  const caloriesIn = summary?.caloriesIn ?? 0;
  const caloriesLeft = caloriesGoal - caloriesIn;
  const proteinGoal = view === "today" ? goal?.dailyProtein ?? 1 : summary?.proteinGoal ?? 1;
  const carbsGoal = view === "today" ? goal?.dailyCarbs ?? 1 : summary?.carbsGoal ?? 1;
  const fatGoal = view === "today" ? goal?.dailyFats ?? 1 : summary?.fatGoal ?? 1;

  // ===== WORKOUT DATA =====
  const startDate = new Date();
  startDate.setDate(today.getDate() - 6);
  const endDate = today;

  const dayMap = {};
  const cursor = new Date(startDate);
  while (cursor <= endDate) {
    const key = cursor.toISOString().split("T")[0];
    dayMap[key] = [];
    cursor.setDate(cursor.getDate() + 1);
  }
  workouts.forEach((w) => {
    const key = new Date(w.date).toISOString().split("T")[0];
    if (dayMap[key]) dayMap[key].push(w);
  });

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

  const caloriesData = chartLabels.map(() => Math.floor(Math.random() * 500 + 200));

  // ===== 4 CHARTS ONLY =====
  const charts = [
    {
      title: "Daily Volume",
      type: "bar",
      data: { labels: chartLabels, datasets: [{ label: "Volume", data: volumeData, backgroundColor: orange }] },
    },
    {
      title: "Cumulative Volume Line",
      type: "line",
      data: { labels: chartLabels, datasets: [{ label: "Cumulative Volume", data: volumeData.map((v,i)=>volumeData.slice(0,i+1).reduce((a,b)=>a+b,0)), borderColor: orange, fill: false }] },
    },
    {
      title: "Daily Calories Burned",
      type: "line",
      data: { labels: chartLabels, datasets: [{ label: "Calories", data: caloriesData, borderColor: orange, backgroundColor: "rgba(249,115,22,0.2)", fill: true, tension: 0.3 }] },
    },
    {
      title: "Horizontal Volume Bar",
      type: "bar",
      data: { labels: chartLabels, datasets: [{ label: "Volume", data: volumeData, backgroundColor: orange }] },
      options: { indexAxis: "y" },
    },
  ];

  return (
    <div className="layout-wrapper layout-content-navbar" style={{ backgroundColor: darkMode ? "#111" : "#f8f9fa", minHeight: "100vh", transition: "all 0.3s" }}>
      <div className="layout-container">
        <Header />
        <div className="layout-page">
          <div className="content-wrapper">
            <div className="container-xxl flex-grow-1 container-p-y">
              <div className="container">
                
                {/* ===== DASHBOARD HEADER ===== */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-4 p-4 rounded-3 d-flex flex-column flex-md-row align-items-md-center justify-content-between">
                  <div>
                    <h1 className="fw-bold mb-1" style={{ fontSize: "2.2rem", background: "linear-gradient(90deg,#f97316,#facc15)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Dashboard</h1>
                    <p className="mb-0 small text-secondary">{view==="today"?"Today's Overview":"This Week's Overview"}</p>
                  </div>
                  <div className="d-flex gap-2 mt-3 mt-md-0 p-1 rounded-3" style={{ background: "rgba(30,36,48,0.1)", border: "1px solid rgba(0,0,0,0.1)" }}>
                    <motion.button onClick={()=>setView("today")} className={`btn btn-sm px-4 fw-semibold ${view==="today"?"text-white":"btn-outline-secondary border-0"}`} whileHover={{scale:1.05}} whileTap={{scale:0.95}} style={view==="today"?{background:"linear-gradient(90deg,#f97316,#facc15)", boxShadow:"0 4px 14px rgba(249,115,22,0.4)"}:{}}>Today</motion.button>
                    <motion.button onClick={()=>setView("week")} className={`btn btn-sm px-4 fw-semibold ${view==="week"?"text-white":"btn-outline-secondary border-0"}`} whileHover={{scale:1.05}} whileTap={{scale:0.95}} style={view==="week"?{background:"linear-gradient(90deg,#3b82f6,#60a5fa)", boxShadow:"0 4px 14px rgba(59,130,246,0.4)"}:{}}>This Week</motion.button>
                  </div>
                </motion.div>

                {/* ===== STAT CARDS ===== */}
                <div className="row g-4 mb-4">
                  {[{label:"Calories Goal",value:caloriesGoal,icon:<IoTrendingUpOutline size={22} className="text-info" />,bg:"linear-gradient(135deg, rgba(59,130,246,0.25), rgba(34,211,238,0.35))"},
                    {label:"Calories Consumed",value:caloriesIn,icon:<IoFlameOutline size={22} className="text-warning" />,bg:"linear-gradient(135deg, rgba(249,115,22,0.25), rgba(239,68,68,0.35))"},
                    {label:"Calories Left",value:caloriesLeft,icon:<IoTrendingUpOutline size={22} className="text-success" />,bg:"linear-gradient(135deg, rgba(16,185,129,0.25), rgba(5,150,105,0.35))"}].map((card, idx)=>(
                    <div className="col-md-4" key={idx}>
                      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:idx*0.2,duration:0.6}} className="card h-100 text-white" style={{background:card.bg,border:"1px solid rgba(255,255,255,0.15)",backdropFilter:"blur(10px)"}}>
                        <div className="card-body">
                          <div className="d-flex align-items-center justify-content-between mb-2">
                            <span className="text-secondary">{card.label}</span>
                            {card.icon}
                          </div>
                          <h3 className="fw-bold mb-0">{(card.value??0).toLocaleString()} kcal</h3>
                        </div>
                      </motion.div>
                    </div>
                  ))}
                </div>


                {/* Macro Progress */}
                <div className="row g-4 mb-4">
                  <div className="col-md-4">
                    <MacroProgressBar name="Protein" current={summary?.protein || 0} goal={view === "today" ? goal?.dailyProtein || 1 : summary?.proteinGoal || 1} color="linear-gradient(90deg,#f97316,#facc15)" theme={theme} />
                  </div>
                  <div className="col-md-4">
                    <MacroProgressBar name="Carbs" current={summary?.carbs || 0} goal={view === "today" ? goal?.dailyCarbs || 1 : summary?.carbsGoal || 1} color="linear-gradient(90deg,#34d399,#10b981)" theme={theme} />
                  </div>
                  <div className="col-md-4">
                    <MacroProgressBar name="Fat" current={summary?.fat || 0} goal={view === "today" ? goal?.dailyFats || 1 : summary?.fatGoal || 1} color="linear-gradient(90deg,#f97316,#f59e0b)" theme={theme} />
                  </div>
                </div>

                {/* ===== CONFETTI ===== */}
                {dailySuccess && <Confetti recycle={false}/>}
                {dailySuccess && <motion.div className="alert alert-danger text-center fw-bold">🎉 Congratulations! You achieved your daily goal! 🎉</motion.div>}

                {/* ===== CHARTS ===== */}
                <div className="row">
                  {charts.map((c,i)=>(
                    <div key={i} className="col-lg-6 col-md-12 mb-4">
                      <div className="card p-3" style={{ background: darkMode?"#222":"#fff", border: darkMode?"1px solid #444":"1px solid #ddd" }}>
                        <h5>{c.title}</h5>
                        {c.type==='bar' && <Bar data={c.data} options={c.options||{responsive:true}} />}
                        {c.type==='line' && <Line data={c.data} options={c.options||{responsive:true}} />}
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </div>
          <Footer/>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
