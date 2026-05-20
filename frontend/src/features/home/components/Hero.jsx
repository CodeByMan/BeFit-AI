import { motion } from "framer-motion";
import heroBanner from "../../../assets/images/hero-banner.png";
import circleOne from "../../../assets/images/hero-circle-one.png";
import circleTwo from "../../../assets/images/hero-circle-two.png";
import heartRate from "../../../assets/images/heart-rate.svg";
import calories from "../../../assets/images/calories.svg";
import heroBg from "../../../assets/images/hero-bg.png";

export default function Hero() {
  const transition = { duration: 1.5, type: "spring" };
  const mobile = window.innerWidth <= 768;

  return (
    <section
      id="home"
      className="section hero bg-dark has-after has-bg-image"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      <div className="container">

        <div className="hero-content">
          {/* Animated subtitle */}
          <p className="hero-subtitle">
            <motion.strong
              className="strong"
              initial={{ x: mobile ? 100 : 200, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ ...transition, delay: 0.2 }}
            >
              The Best
            </motion.strong>{" "}
            Fitness Tracker
          </p>

          {/* Animated main title */}
          <motion.h1
            className="h1 hero-title"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ ...transition, delay: 0.4 }}
          >
            Shape Your 
            <br></br> 
            Ideal Body
          </motion.h1>

          {/* Animated description */}
          <motion.p
            className="section-text"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ ...transition, delay: 0.6 }}
          >
            BeFit helps you monitor your daily activity, log exercises, and stay motivated with real-time progress tracking.
          </motion.p>

          {/* Animated button */}
          <motion.a
            href="/login"
            className="btn btn-primary"
            style={{
              borderColor: "#ff3e1d",
              borderWidth: "2px",
              borderStyle: "solid"
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ ...transition, delay: 0.8 }}
          >
            Get Started
          </motion.a>
        </div>

        <div className="hero-banner">
          {/* Hero image */}
          <motion.img
            src={heroBanner}
            className="w-100"
            alt="hero banner"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ ...transition, delay: 1 }}
          />

          {/* Decorative circles */}
          <motion.img
            src={circleOne}
            className="circle-1 circular"
            alt=""
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 0.7 }}
            transition={{ ...transition, delay: 1.2 }}
          />
          <motion.img
            src={circleTwo}
            className="circular circle-2"
            alt=""
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 0.7 }}
            transition={{ ...transition, delay: 1.2 }}
          />

          {/* Heart rate & calories icons */}
          <motion.img
            src={heartRate}
            className="abs-img abs-img-1"
            alt="heart rate"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ ...transition, delay: 1.4 }}
          />
          <motion.img
            src={calories}
            className="abs-img abs-img-2"
            alt="calories"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ ...transition, delay: 1.4 }}
          />
        </div>
      </div>
    </section>
  );
}
