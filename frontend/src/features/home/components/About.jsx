import React from "react";
import AboutBannerImg from "../../../assets/images/about-banner.png";
import CircleOneImg from "../../../assets/images/about-circle-one.png";
import CircleTwoImg from "../../../assets/images/about-circle-two.png";
import FitnessImg from "../../../assets/images/fitness.png";

const About = () => {
  return (
    <section className="section about" id="about" aria-label="about">
      <div className="container">

        <div className="about-banner has-after">
          <img
            src={AboutBannerImg}
            width="660"
            height="648"
            loading="lazy"
            alt="about banner"
            className="w-100"
          />

          <img
            src={CircleOneImg}
            width="660"
            height="534"
            loading="lazy"
            aria-hidden="true"
            alt=""
            className="circle"
          />

          <img
            src={CircleTwoImg}
            width="660"
            height="534"
            loading="lazy"
            aria-hidden="true"
            alt=""
            className="circle"
          />

          <img
            src={FitnessImg}
            width="650"
            height="154"
            loading="lazy"
            alt="fitness"
            className="abs-img w-100"
          />
        </div>

        <div className="about-content">
          <p className="section-subtitle">About</p>
          <h2 className="h2 section-title">Your Personal Fitness Tracker</h2>

          <p className="section-text">
            Our fitness tracker app helps you monitor workouts, track progress, 
            and stay consistent with your health goals. Whether you’re a beginner 
            or an experienced athlete, we make it simple to understand your data 
            and turn it into results.
          </p>

          <p className="section-text">
            Track your workouts, set personalized goals, view detailed analytics, 
            and stay motivated with smart reminders and progress insights—everything 
            you need in one place.
          </p>

          <div className="wrapper">
            <a href="#features" className="btn btn-primary" style={{
              borderColor: "#ff3e1d",
              borderWidth: "2px",
              borderStyle: "solid"
            }}>Explore Features</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
