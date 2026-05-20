// frontend/src/features/dashboard/food/FoodLogForm.jsx
import React, { useState, useEffect } from "react";
import API from "../../../api/Api";
import { toast } from "react-toastify";
import Header from "../layout/HeaderUser";
import Footer from "../layout/FooterUser";
import { useTheme } from "../../../context/ThemeContext";
import { useNavigate, useParams } from "react-router-dom";


const FoodLogForm = () => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();

  const orange = "hsl(12, 98%, 52%)";
  const orangeLight = "hsl(12, 98%, 65%)";
  const orangeDark = "hsl(12, 98%, 40%)";

  const themeColors = {
    light: {
      background: "#f4f6f8",
      cardBackground: "#fff",
      textPrimary: "#212529",
      textSecondary: "#6c757d",
      inputBackground: "#f8f9fa",
      inputText: "#212529",
      inputBorder: "#ced4da",
      border: "1px solid #e0e0e0",
      shadow: "0 6px 20px rgba(0,0,0,0.08)",
    },
    dark: {
      background: "#121212",
      cardBackground: "#1f1f1f",
      textPrimary: "#f8f9fa",
      textSecondary: "#9ca3af",
      inputBackground: "#2c2c2c",
      inputText: "#fff",
      inputBorder: "#3a3a3a",
      border: "1px solid #333",
      shadow: "0 6px 20px rgba(0,0,0,0.4)",
    },
  };

  const theme = darkMode ? themeColors.dark : themeColors.light;

  const mealColors = [
    { bg: "#ffe5e5", emoji: "🍳" },
    { bg: "#e5f7ff", emoji: "🥗" },
    { bg: "#fff0e5", emoji: "🍲" },
    { bg: "#e6ffe5", emoji: "🥪" },
    { bg: "#f5e5ff", emoji: "🍹" },
    { bg: "#fffbe5", emoji: "🍎" },
  ];

  const emptyItem = () => ({
    id: Date.now() + Math.random(),
    name: "",
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
  });

  const emptyMeal = () => ({
    id: Date.now() + Math.random(),
    name: "",
    items: [emptyItem()],
  });

  const [date, setDate] = useState("");
  const [meals, setMeals] = useState([]);
  const [saving, setSaving] = useState(false);

  const addMeal = () => setMeals([...meals, emptyMeal()]);
  const removeMeal = (mealId) => setMeals(meals.filter((meal) => meal.id !== mealId));
  const addItem = (mealId) => {
    setMeals((prev) =>
      prev.map((meal) =>
        meal.id === mealId ? { ...meal, items: [...meal.items, emptyItem()] } : meal
      )
    );
  };
  const updateMealName = (mealId, value) => {
    setMeals((prev) =>
      prev.map((meal) => (meal.id === mealId ? { ...meal, name: value } : meal))
    );
  };
  const updateItem = (mealId, itemId, field, value) => {
    setMeals((prev) =>
      prev.map((meal) =>
        meal.id === mealId
          ? {
              ...meal,
              items: meal.items.map((item) =>
                item.id === itemId ? { ...item, [field]: value } : item
              ),
            }
          : meal
      )
    );
  };
  const removeItem = (mealId, itemId) => {
    setMeals((prev) =>
      prev.map((meal) =>
        meal.id === mealId
          ? { ...meal, items: meal.items.filter((item) => item.id !== itemId) }
          : meal
      )
    );
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!date) return toast.error("Please select a date.");
  if (meals.length === 0) return toast.error("Please add at least one meal.");

  try {
    setSaving(true);
    const payload = { date, meals };

    if (id) {
      await API.put(`/foodlog/${id}`, payload);
      toast.success("Food log updated!");
    } else {
      await API.post("/foodlog", payload);
      toast.success("Food log saved!");
    }

    navigate("/user-dashboard/foodlogs");
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to save");
  } finally {
    setSaving(false);
  }
};


  const mealTotals = (meal) => {
    const calories = meal.items.reduce((a, b) => a + Number(b.calories || 0), 0);
    const protein = meal.items.reduce((a, b) => a + Number(b.protein || 0), 0);
    const carbs = meal.items.reduce((a, b) => a + Number(b.carbs || 0), 0);
    const fats = meal.items.reduce((a, b) => a + Number(b.fats || 0), 0);
    return { calories, protein, carbs, fats };
  };

  useEffect(() => {
  if (!id) return;

  const loadFoodLog = async () => {
    try {
      const res = await API.get(`/foodlog/${id}`);

      const data = res.data;

      setDate(data.date ? data.date.split("T")[0] : "");

      setMeals(
        data.meals.map((meal) => ({
          id: Date.now() + Math.random(),
          name: meal.name,
          items: meal.items.map((item) => ({
            id: Date.now() + Math.random(),
            name: item.name,
            calories: item.calories,
            protein: item.protein,
            carbs: item.carbs,
            fats: item.fats,
          })),
        }))
      );
    } catch (err) {
      toast.error("Failed to load food log.");
    }
  };

  loadFoodLog();
}, [id]);


  const grandTotals = meals.reduce(
    (totals, meal) => {
      const m = mealTotals(meal);
      totals.calories += m.calories;
      totals.protein += m.protein;
      totals.carbs += m.carbs;
      totals.fats += m.fats;
      return totals;
    },
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  return (
    <div
      className="layout-wrapper layout-content-navbar"
      style={{
        backgroundColor: theme.background,
        minHeight: "100vh",
        transition: "0.3s",
        paddingBottom: "3rem",
      }}
    >
      <div className="layout-container">
        <Header />
        <div className="layout-page">
          <div className="content-wrapper">
            <div className="container-xxl flex-grow-1 container-p-y">
              <div className="container" style={{ maxWidth: "900px" }}>
                <div
                  className="card p-5"
                  style={{
                    backgroundColor: theme.cardBackground,
                    borderRadius: "2rem",
                    boxShadow: theme.shadow,
                    border: theme.border,
                    color: theme.textPrimary,
                  }}
                >
                  {/* Header */}
                  <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                    <h2
                      style={{
                        fontWeight: 800,
                        fontSize: "2rem",
                        background: `linear-gradient(90deg, ${orangeLight}, ${orange}, ${orangeDark})`,
                        WebkitBackgroundClip: "text",
                        color: "transparent",
                      }}
                    >
                       {id ? "Edit Food Log" : "Daily Food Log"}
                    </h2>
                    
                    <div
                      style={{
                        backgroundColor: theme.inputBackground,
                        padding: "0.5rem 1rem",
                        borderRadius: "1rem",
                        border: `1px solid ${theme.inputBorder}`,
                        boxShadow: theme.shadow,
                        minWidth: "200px",
                      }}
                    >
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="form-control"
                        style={{
                          backgroundColor: "transparent",
                          color: theme.inputText,
                          border: "none",
                          padding: "0",
                        }}
                      />
                    </div>
                  </div>

                  {/* Add Meal Button */}
                  <div className="mb-4">
                    <button
                      type="button"
                      className="btn"
                      onClick={addMeal}
                      style={{
                        backgroundColor: orange,
                        color: "#fff",
                        borderRadius: "1rem",
                        padding: "0.6rem 1.2rem",
                        fontWeight: 700,
                        transition: "0.3s",
                      }}
                    >
                      + Add Meal
                    </button>
                  </div>

                  {/* Meals */}
                  {meals.map((meal, index) => {
                    const totals = mealTotals(meal);
                    const colorData = mealColors[index % mealColors.length];
                    return (
                      <div
                        key={meal.id}
                        className="mb-5 p-4"
                        style={{
                          backgroundColor: darkMode ? "#2c2c2c" : colorData.bg,
                          borderRadius: "1.5rem",
                          boxShadow: theme.shadow,
                          transition: "all 0.3s",
                        }}
                      >
                        {/* Meal Name */}
                        <label
                          style={{
                            fontWeight: 700,
                            marginBottom: "0.5rem",
                            display: "block",
                            fontSize: "1.1rem",
                          }}
                        >
                          {colorData.emoji} Meal Name
                        </label>
                        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                          <input
                            type="text"
                            placeholder="e.g., Breakfast"
                            value={meal.name}
                            onChange={(e) => updateMealName(meal.id, e.target.value)}
                            className="form-control"
                            style={{
                              backgroundColor: theme.inputBackground,
                              color: theme.inputText,
                              borderColor: theme.inputBorder,
                              borderRadius: "1rem",
                              padding: "0.6rem 1rem",
                              fontWeight: 600,
                              flex: 1,
                              minWidth: "200px",
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => removeMeal(meal.id)}
                            className="btn"
                            style={{
                              backgroundColor: "#ff6b6b",
                              color: "#fff",
                              borderRadius: "1rem",
                              padding: "0.5rem 1rem",
                              fontWeight: 600,
                            }}
                          >
                            Cancel Meal
                          </button>
                        </div>

                        {/* Items */}
                        {meal.items.map((item) => (
                          <div
                            key={item.id}
                            className="d-flex flex-wrap gap-3 mb-3 align-items-center"
                          >
                            {[
                              ["name", "Item Name"],
                              ["calories", "Calories"],
                              ["protein", "Protein"],
                              ["carbs", "Carbs"],
                              ["fats", "Fats"],
                            ].map(([field, label]) => (
                              <div
                                key={field}
                                style={{ flex: field === "name" ? "2 1 180px" : "1 1 100px" }}
                              >
                                <label
                                  style={{
                                    fontSize: "0.8rem",
                                    color: theme.textSecondary,
                                    fontWeight: 600,
                                    display: "block",
                                    marginBottom: "0.2rem",
                                  }}
                                >
                                  {label}
                                </label>
                                <input
                                  type={field === "name" ? "text" : "number"}
                                  placeholder={label}
                                  value={item[field]}
                                  onChange={(e) =>
                                    updateItem(meal.id, item.id, field, e.target.value)
                                  }
                                  className="form-control"
                                  style={{
                                    backgroundColor: theme.inputBackground,
                                    color: theme.inputText,
                                    borderColor: theme.inputBorder,
                                    borderRadius: "1rem",
                                    padding: "0.5rem 0.8rem",
                                    width: "100%",
                                  }}
                                />
                              </div>
                            ))}

                            {meal.items.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeItem(meal.id, item.id)}
                                className="btn"
                                style={{
                                  backgroundColor: "#ff6b6b",
                                  color: "#fff",
                                  borderRadius: "50%",
                                  width: "2.5rem",
                                  height: "2.5rem",
                                  border: "none",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  marginTop: "1.5rem",
                                }}
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={() => addItem(meal.id)}
                          className="btn"
                          style={{
                            backgroundColor: "#6c757d",
                            color: "#fff",
                            borderRadius: "1rem",
                            padding: "0.6rem 1rem",
                            fontWeight: 600,
                          }}
                        >
                          + Add Item
                        </button>

                        {/* Meal Nutrition Summary */}
                        <div
                          className="d-flex justify-content-around mt-4 p-3"
                          style={{
                            backgroundColor: darkMode ? "#1a1a1a" : "#ffffffaa",
                            borderRadius: "1rem",
                            border: `1px solid ${colorData.bg}`,
                          }}
                        >
                          {[
                            ["Calories", totals.calories],
                            ["Protein", totals.protein],
                            ["Carbs", totals.carbs],
                            ["Fats", totals.fats],
                          ].map(([label, value]) => (
                            <div key={label} style={{ textAlign: "center" }}>
                              <div style={{ fontWeight: 700, fontSize: "1.1rem", color: orange }}>
                                {value}
                              </div>
                              <div style={{ fontSize: "0.8rem", color: theme.textSecondary }}>
                                {label}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}

                  {/* Grand Total */}
                  <div
                    className="d-flex justify-content-around bg-light p-3 mb-4"
                    style={{
                      backgroundColor: darkMode ? "#2c2c2c" : "#f1f3f5",
                      borderRadius: "1.5rem",
                      boxShadow: theme.shadow,
                    }}
                  >
                    {[
                      ["Calories", grandTotals.calories],
                      ["Protein", grandTotals.protein],
                      ["Carbs", grandTotals.carbs],
                      ["Fats", grandTotals.fats],
                    ].map(([label, value]) => (
                      <div key={label} style={{ textAlign: "center" }}>
                        <div style={{ fontWeight: 700, fontSize: "1.2rem", color: orange }}>
                          {value}
                        </div>
                        <div style={{ fontSize: "0.85rem", color: theme.textSecondary }}>
                          {label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Save */}
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={saving}
                    className="btn w-100"
                    style={{
                      background: `linear-gradient(90deg, ${orangeLight}, ${orange}, ${orangeDark})`,
                      color: "#fff",
                      borderRadius: "1rem",
                      padding: "0.8rem",
                      fontWeight: 700,
                      fontSize: "1rem",
                      transition: "0.3s",
                    }}
                  >
                    {saving ? "Saving..." : id ? "Update Food Log" : "Save Daily Log"}
                  </button>
                </div>
              </div>
            </div>
            <div className="content-backdrop fade"></div>
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodLogForm;
