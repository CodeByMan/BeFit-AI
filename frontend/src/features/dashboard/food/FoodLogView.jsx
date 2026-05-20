// frontend/src/features/dashboard/food/FoodLogView.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../../api/Api";
import { toast } from "react-toastify";
import Header from "../layout/HeaderUser";
import Footer from "../layout/FooterUser";

export default function FoodLogView() {
  const { id } = useParams();
  const [log, setLog] = useState(null);

  useEffect(() => {
    const fetchLog = async () => {
      try {
        const res = await API.get(`/foodlog/${id}`);
        setLog(res.data);
      } catch {
        toast.error("Failed to fetch log");
      }
    };
    fetchLog();
  }, [id]);

  if (!log) return <p>Loading...</p>;

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fa" }}>
      <Header />
      <div style={{ padding: "2rem" }}>
        <h2>{log.title}</h2>
        <p>{new Date(log.date).toDateString()}</p>
        {log.meals.map((meal) => (
          <div key={meal.id} style={{ marginBottom: "2rem" }}>
            <h4>{meal.name}</h4>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Calories</th>
                  <th>Protein</th>
                  <th>Carbs</th>
                  <th>Fats</th>
                </tr>
              </thead>
              <tbody>
                {meal.items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.calories}</td>
                    <td>{item.protein}</td>
                    <td>{item.carbs}</td>
                    <td>{item.fats}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
}
