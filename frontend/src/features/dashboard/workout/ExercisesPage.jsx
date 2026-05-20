import React, { useState, useEffect } from "react";
import Header from "../layout/HeaderUser";
import Footer from "../layout/FooterUser";
import { useTheme } from "../../../context/ThemeContext";
import exercisesData from "../../../data/exercises.json";
import { FiZoomIn } from "react-icons/fi";

const ExercisesPage = () => {
  const [selectedBodyPart, setSelectedBodyPart] = useState("chest");
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [zoomedExercise, setZoomedExercise] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
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
      dropdownBg: "#fff",
      dropdownText: "#212529",
    },
    dark: {
      background: "#111111",
      cardBackground: "rgba(30,30,30,0.85)",
      textPrimary: "#f8f8f8",
      textSecondary: "#9ca3af",
      border: "1px solid rgba(255,255,255,0.15)",
      dropdownBg: "#1e1e1e",
      dropdownText: "#f8f8f8",
    },
  };

  const theme = darkMode ? themeColors.dark : themeColors.light;

  const cardStyle = {
    borderRadius: "1.5rem",
    padding: "1rem",
    boxShadow: darkMode
      ? "0 4px 20px rgba(0,0,0,0.4)"
      : "0 4px 20px rgba(0,0,0,0.1)",
    background: theme.cardBackground,
    border: theme.border,
    marginBottom: "1.5rem",
    transition: "all 0.3s",
    position: "relative",
    textAlign: "center",
  };

  useEffect(() => {
    let filtered = exercisesData;

    if (selectedBodyPart !== "all") {
      filtered = filtered.filter(
        (exercise) =>
          exercise.bodyPart.toLowerCase() === selectedBodyPart.toLowerCase()
      );
    }

    if (searchQuery.trim() !== "") {
      filtered = filtered.filter((exercise) =>
        exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredExercises(filtered);
  }, [selectedBodyPart, searchQuery]);

  return (
    <div
      className="layout-wrapper layout-content-navbar"
      style={{ backgroundColor: theme.background, minHeight: "100vh" }}
    >
      <Header />

      <div className="layout-container">
        <div className="layout-page">
          <div className="content-wrapper">
            <div className="container-xxl flex-grow-1 container-p-y">
              <div className="container">


                {/* TOP STATUS CARD */}
                <div
                  className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 p-3 rounded-3 shadow-sm"
                  style={{
                    background: darkMode ? "#1a1a1a" : "#fff3e6",
                    borderRadius: "1.2rem"
                  }}
                >
                  <div>
                    <h2
                      style={{
                        margin: 0,
                        fontWeight: 700,
                        fontSize: "1.8rem",
                        background: `linear-gradient(90deg, ${orangeLight}, ${orange}, ${orangeDark})`,
                        WebkitBackgroundClip: "text",
                        color: "transparent"
                      }}
                    >
                      Exercise Library
                    </h2>
                    <p style={{ margin: 0, color: theme.textSecondary }}>
                      Explore exercises by body part. Click the zoom icon to view GIFs.
                    </p>
                  </div>
                  </div>

                        {/* SEARCH + DROPDOWN ROW */}
                        <div
                          className="d-flex justify-content-between align-items-center mb-3 flex-column flex-md-row"
                          style={{ gap: "1rem" }}
                        >
                          <input
                            type="text"
                            placeholder="Search exercises..."
                            className="form-control"
                            style={{
                              flex: 1,
                              minWidth: "200px",
                              borderRadius: "0.75rem",
                              border: theme.border,
                              padding: "0.5rem 1rem",
                              color: theme.textPrimary,
                              backgroundColor: theme.dropdownBg,
                            }}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
        
                          <select
                            value={selectedBodyPart}
                            onChange={(e) => setSelectedBodyPart(e.target.value)}
                            className="form-select w-auto"
                            style={{
                              minWidth: "150px",
                              borderRadius: "0.75rem",
                              border: theme.border,
                              padding: "0.5rem 1rem",
                              color: theme.dropdownText,
                              backgroundColor: theme.dropdownBg,
                              fontWeight: 500,
                              cursor: "pointer",
                            }}
                          >
                            <option value="all">All</option>
                            <option value="chest">Chest</option>
                            <option value="legs">Legs</option>
                            <option value="shoulders">Shoulders</option>
                            <option value="biceps">Biceps</option>
                            <option value="triceps">Triceps</option>
                            <option value="back">Back</option>
                            <option value="abs">Abs</option>
                          </select>
                        </div>
                {/* EXERCISES GRID */}
                <div className="row">
                  {filteredExercises.map((exercise) => (
                    <div className="col-12 col-md-6 col-lg-4 mb-4" key={exercise.id}>
                      <div style={cardStyle}>
                        <button
                          onClick={() => setZoomedExercise(exercise)}
                          style={{
                            position: "absolute",
                            top: "10px",
                            right: "10px",
                            background: "transparent",
                            border: "none",
                            padding: "0.25rem",
                            color: orange,
                            cursor: "pointer",
                          }}
                          title="Zoom"
                        >
                          <FiZoomIn size={22} />
                        </button>

                        <img
                          src={exercise.gifUrl}
                          alt={exercise.name}
                          className="img-fluid mb-2"
                          style={{ maxHeight: "180px", objectFit: "contain" }}
                        />
                        <h5 style={{ color: theme.textPrimary }}>{exercise.name}</h5>
                        <p style={{ color: theme.textSecondary, margin: 0 }}>
                          {exercise.bodyPart.charAt(0).toUpperCase() +
                            exercise.bodyPart.slice(1)}
                        </p>
                      </div>
                    </div>
                  ))}

                  {filteredExercises.length === 0 && (
                    <p className="text-center" style={{ color: theme.textPrimary }}>
                      No exercises found for this category.
                    </p>
                  )}
                </div>

                {/* FLOATING CHAT BUTTON */}
                <button
                  className="btn"
                  style={{
                    position: "fixed",
                    bottom: "2rem",
                    right: "2rem",
                    background: `linear-gradient(90deg, ${orangeLight}, ${orangeDark})`,
                    color: "#fff",
                    borderRadius: "50%",
                    width: "3.5rem",
                    height: "3.5rem",
                    fontSize: "1.2rem",
                    border: "none",
                  }}
                >
                  💬
                </button>

                {/* ZOOM MODAL */}
                {zoomedExercise && (
                  <div
                    onClick={() => setZoomedExercise(null)}
                    style={{
                      position: "fixed",
                      top: 0,
                      left: 0,
                      width: "100vw",
                      height: "100vh",
                      backgroundColor: "rgba(0,0,0,0.8)",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      zIndex: 9999,
                      cursor: "pointer",
                    }}
                  >
                    <img
                      src={zoomedExercise.gifUrl}
                      alt={zoomedExercise.name}
                      style={{
                        maxWidth: "90%",
                        maxHeight: "90%",
                        borderRadius: "1rem",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="content-backdrop fade"></div>
              <Footer />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExercisesPage;
