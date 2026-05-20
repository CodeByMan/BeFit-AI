// frontend/src/hooks/useCounterAnimation.js
import { useState, useRef } from "react";
import API from "../api/Api";

export const useCounterAnimation = () => {
  const [counters, setCounters] = useState({
    users: 0,
    blogs: 0,
    testimonials: 0,
    support: 0,
  });

  const isAnimating = useRef(false);

  const animateCounters = async () => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    try {
      // Fetch from backend
      const res = await API.get("/stats");

      const targets = {
        users: res.data.users,
        blogs: res.data.blogs,
        testimonials: res.data.testimonials,
        support: res.data.support, // always 24
      };

      const duration = 2000;
      const steps = 60;
      const stepDuration = duration / steps;
      let step = 0;

      const timer = setInterval(() => {
        step++;
        const progress = step / steps;

        setCounters({
          users: Math.floor(targets.users * progress),
          blogs: Math.floor(targets.blogs * progress),
          testimonials: Math.floor(targets.testimonials * progress),
          support: Math.floor(targets.support * progress),
        });

        if (step >= steps) {
          clearInterval(timer);
          setCounters(targets);
        }
      }, stepDuration);
    } catch (err) {
      console.error("Stats fetch failed:", err);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M+";
    if (num >= 1_000) return (num / 1_000).toFixed(1) + "K+";
    return num;
  };

  return { counters, animateCounters, formatNumber };
};
