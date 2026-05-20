import React from "react";
import feature1Icon from "../../../assets/ai_tracker.png";
import feature2Icon from "../../../assets/Detailed_Dashboard.png";
import feature3Icon from "../../../assets/Get_tips.png";
import feature4Icon from "../../../assets/Tdee_Calculator.png";
import classesBg from "../../../assets/images/classes-bg.png";

const features = [
  {
    title: "Smart Workout Tracking",
    description:
      "Easily log your workouts and keep track of sets, reps, and exercise history in one organized place with notifications.",
    icon: feature1Icon,
  },
  {
    title: "Detailed Progress Dashboard",
    description:
      "View performance trends, activity summaries, and visual charts that help you understand your improvements and stay motivated.",
    icon: feature2Icon,
  },
  {
    title: "Personalized Fitness Tips",
    description:
      "Fitness tips with simple suggestions to help you improve performance, maintain consistency, and avoid common training mistakes.",
    icon: feature3Icon,
  },
  {
    title: "BMI & BMR Calculator",
    description:
      "Calculate BMR & BMR. This feature helps you plan meals, manage weight goals, to support your fitness journey.",
    icon: feature4Icon,
  },
];


export default function Features() {
  return (
    <section
      className="section feature bg-dark has-bg-image"
      id="features"
      style={{ backgroundImage: `url(${classesBg})` }}
    >
      <div className="container">
        <p className="section-subtitle text-center">Features</p>
        <h2 className="h2 section-title text-center">
          Why Us?
        </h2>

        {/* Bootstrap Grid */}
        <div className="row g-4 mt-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="col-12 col-sm-6 col-lg-3 d-flex"
            >
              <div className="feature-card w-100">
                <figure className="card-banner">
                  <img
                    src={feature.icon}
                    alt={feature.title}
                    className="img-fluid"
                  />
                </figure>

                <div className="card-content">
                  <h3 className="card-title">{feature.title}</h3>
                  <p className="card-text mb-2">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
