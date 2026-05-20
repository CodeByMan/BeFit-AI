import React, { useEffect, useState } from 'react';
import {
  Line, Bar, Pie, Doughnut, Radar, PolarArea
} from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement,
  LineElement, Title, Tooltip, Legend, ArcElement, Filler, RadialLinearScale
} from 'chart.js';

import API from '../../../api/Api';
import HeaderUser from '../layout/HeaderUser';
import FooterUser from '../layout/FooterUser';
import { useTheme } from '../../../context/ThemeContext';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, PointElement, LineElement,
  Title, Tooltip, Legend, ArcElement, Filler, RadialLinearScale
);

export default function WorkoutAnalytics() {
  const [workouts, setWorkouts] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const { darkMode } = useTheme();

  const orange = "hsl(12, 98%, 52%)";
  const orangeLight = "hsl(12, 98%, 65%)";
  const orangeDark = "hsl(12, 98%, 40%)";

  const themeColors = {
    light: {
      background: "#f8f9fa",
      cardBackground: "rgba(255,255,255,0.95)",
      textPrimary: "#212529",
      textSecondary: "#6c757d",
      border: "1px solid rgba(0,0,0,0.1)",
      gradientText: `linear-gradient(90deg, ${orangeLight}, ${orange}, ${orangeDark})`
    },
    dark: {
      background: "#111111",
      cardBackground: "rgba(30,30,30,0.85)",
      textPrimary: "#f8f8f8",
      textSecondary: "#9ca3af",
      border: "1px solid rgba(255,255,255,0.15)",
      gradientText: `linear-gradient(90deg, ${orangeLight}, ${orange}, ${orangeDark})`
    }
  };

  const theme = darkMode ? themeColors.dark : themeColors.light;

  const today = new Date();
  const defaultFrom = new Date(); defaultFrom.setDate(today.getDate() - 6);

  const fetchData = async () => {
    try {
      setLoading(true);
      const wRes = await API.get('/workouts'); 
      setWorkouts(wRes.data.workouts || []);
      const pRes = await API.get('/profile/me'); 
      if (pRes.data.success) setProfile(pRes.data.profile);
    } catch (err) { 
      console.error(err); 
      alert('Failed to load analytics data'); 
    } finally { setLoading(false); }
  };

  useEffect(() => {
    setFromDate(defaultFrom.toISOString().split('T')[0]);
    setToDate(today.toISOString().split('T')[0]);
    fetchData();
  }, []);

  if (!profile) return null;

  const weight = profile?.weight, height = profile?.height, age = profile?.age, gender = profile?.gender;
  const BMR = gender === 'female' ? 10*weight + 6.25*height - 5*age - 161 : 10*weight + 6.25*height - 5*age + 5;
  const BMR_per_hour = BMR/24;
  const MET_VALUES = { cardio: 8, strength: 6, other: 5 };

  const startDate = new Date(fromDate);
  const endDate = new Date(toDate > today.toISOString().split('T')[0] ? today.toISOString().split('T')[0] : toDate);

  const filteredWorkouts = workouts.filter(w => {
    const d = new Date(w.date);
    return d >= startDate && d <= endDate;
  });

  // Map days to workouts
  const dayMap = {};
  const cursor = new Date(startDate);
  while (cursor <= endDate) {
    const key = cursor.toISOString().split('T')[0];
    dayMap[key] = [];
    cursor.setDate(cursor.getDate() + 1);
  }
  filteredWorkouts.forEach(w => {
    const key = new Date(w.date).toISOString().split('T')[0];
    if (dayMap[key]) dayMap[key].push(w);
  });

  // Compute volume & calories
  const chartLabels = Object.keys(dayMap);
  const volumeData = chartLabels.map(date => {
    let vol = 0;
    dayMap[date].forEach(w => (w.exercises || []).forEach(ex => ex.reps.forEach((r,i) => vol += r*(ex.weight[i]||0))));
    return vol;
  });

  const caloriesMap = {};
  filteredWorkouts.forEach(w => {
    const durationH = (w.durationMinutes || 0)/60;
    const MET = MET_VALUES[w.category?.toLowerCase()] || 6;
    const calories = BMR_per_hour * MET * durationH;
    const key = new Date(w.date).toISOString().split('T')[0];
    caloriesMap[key] = (caloriesMap[key] || 0) + calories;
  });
  const caloriesData = chartLabels.map(d => caloriesMap[d] || 0);

// Build attendance array
const attendance = chartLabels.map(date => {
  const dayWorkouts = dayMap[date]; // all workouts for this date

  if (!dayWorkouts || dayWorkouts.length === 0) {
    // No workouts recorded
    return { date, status: 'Absent' };
  }

  const anyDoneTrue = dayWorkouts.some(w => w.done === true);
  const allDoneFalse = dayWorkouts.every(w => w.done === false);

  if (anyDoneTrue) return { date, status: 'Present' };
  if (allDoneFalse) return { date, status: 'Missed' };

  // Fallback (mixed) – if needed, could show 'Partial'
  return { date, status: 'Partial' };
});


  // Prepare 8 charts
  const charts = [
    { title: "Daily Volume", type: "bar", data: { labels: chartLabels, datasets: [{ label: 'Volume', data: volumeData, backgroundColor: orange }] } },
    { title: "Daily Calories Burned", type: "line", data: { labels: chartLabels, datasets:[{label:'Calories',data:caloriesData,borderColor:orange,backgroundColor:"rgba(255,165,0,0.2)",fill:true,tension:0.3}] } },
    { title: "Workout Category Pie", type: "pie", data: {
      labels: [...new Set(filteredWorkouts.map(w => w.category || "Other"))],
      datasets:[{ data: [...new Set(filteredWorkouts.map(w => w.category || "Other"))].map(c => filteredWorkouts.filter(w=>w.category===c).length), backgroundColor: chartLabels.map((_,i)=>`hsl(${i*45},70%,50%)`) }]
    }},
    { title: "Workout Category Doughnut", type: "doughnut", data: {
      labels: [...new Set(filteredWorkouts.map(w => w.category || "Other"))],
      datasets:[{ data: [...new Set(filteredWorkouts.map(w => w.category || "Other"))].map(c => filteredWorkouts.filter(w=>w.category===c).length), backgroundColor: chartLabels.map((_,i)=>`hsl(${i*50},65%,55%)`) }]
    }},
    { title: "Volume Radar", type: "radar", data: { labels: chartLabels, datasets:[{ label:'Volume', data: volumeData, backgroundColor:"rgba(255,165,0,0.3)", borderColor:orange }] }},
    { title: "Calories Polar Area", type: "polarArea", data: { labels: chartLabels, datasets:[{ data: caloriesData, backgroundColor: chartLabels.map((_,i)=>`hsl(${i*30},70%,50%)`) }] }},
    { title: "Cumulative Volume", type: "line", data: { labels: chartLabels, datasets:[{ label:'Cumulative Volume', data: volumeData.map((v,i)=>volumeData.slice(0,i+1).reduce((a,b)=>a+b,0)), borderColor:orange, fill:false }] }},
    { title: "Horizontal Volume Bar", type: "bar", data: { labels: chartLabels, datasets:[{ label:'Volume', data: volumeData, backgroundColor:orange }], options:{ indexAxis:'y' } } },
  ];

  return (
    <div className="layout-wrapper layout-content-navbar" style={{ background: theme.background, minHeight: '100vh' }}>
      <div className="layout-container">
        <HeaderUser />
        <div className="layout-page">
          <div className="content-wrapper">
            <div className="container-xxl flex-grow-1 container-p-y">
              <div className="container">
                <h3 style={{ fontWeight:700, fontSize:'1.8rem', background:theme.gradientText, WebkitBackgroundClip:'text' }}>Workout Analytics</h3>

                {/* Date filters */}
                <div className="row g-3 mb-3">
                  <div className="col-md-3"><label className="form-label">From</label>
                    <input type="date" className="form-control" max={today.toISOString().split('T')[0]} value={fromDate} onChange={e=>setFromDate(e.target.value)} />
                  </div>
                  <div className="col-md-3"><label className="form-label">To</label>
                    <input type="date" className="form-control" max={today.toISOString().split('T')[0]} value={toDate} onChange={e=>setToDate(e.target.value)} />
                  </div>
                </div>

                {/* Charts */}
                <div className="row">
                  {charts.map((c,i)=>(
                    <div key={i} className="col-lg-6 col-md-12 mb-4">
                      <div className="card p-3" style={{ background: theme.cardBackground, border: theme.border }}>
                        <h5 style={{ color: theme.textPrimary }}>{c.title}</h5>
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

                {/* Attendance Table */}
                <div className="card mb-4 p-3" style={{ background: theme.cardBackground, border: theme.border }}>
                  <h5 style={{ color: theme.textPrimary }}>Attendance Sheet</h5>
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attendance.map(a => (
                          <tr key={a.date}>
                            <td>{a.date}</td>
                            <td style={{ color: a.status==='Absent' ? 'red' : a.status==='Partial' ? 'orange' : 'green' }}>{a.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            </div>
            <div className="content-backdrop fade"></div>
            <FooterUser />
          </div>
        </div>
      </div>
    </div>
  );
}
