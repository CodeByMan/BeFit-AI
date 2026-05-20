// frontend/src/features/home/components/StatsSection.jsx
import React, { forwardRef, useEffect, useRef, useState } from "react";
import { useCounterAnimation } from "../../../hooks/useCounterAnimation";
import { FaUsers, FaBlog, FaComments, FaHeadset } from "react-icons/fa";

const StatsSection = forwardRef((props, ref) => {
  const { counters, animateCounters, formatNumber } = useCounterAnimation();
  const internalRef = ref || useRef();
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          animateCounters();
          setHasAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (internalRef.current) observer.observe(internalRef.current);

    return () => observer.disconnect();
  }, [animateCounters, hasAnimated]);

  const stats = [
    { value: counters.users, label: "Users", icon: <FaUsers size={32} /> },
    { value: counters.blogs, label: "Blogs", icon: <FaBlog size={32} /> },
    { value: counters.testimonials, label: "Testimonials", icon: <FaComments size={32} /> },
    { value: counters.support, label: "Support", icon: <FaHeadset size={32} /> },
  ];

  const accent = "hsl(12,98%,52%)";

  return (
    <div ref={internalRef} className="py-5 position-relative" style={{ overflow: "hidden" }}>
      {/* Background bubbles */}
      <div className="position-absolute top-0 start-0 w-100 h-100" style={{ zIndex: 0 }}>
        <div
          style={{
            position: "absolute",
            width: 150,
            height: 150,
            borderRadius: "50%",
            background: "rgba(255,100,50,0.1)",
            top: -50,
            left: -50,
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "rgba(255,200,50,0.1)",
            bottom: -100,
            right: -100,
          }}
        />
      </div>

      {/* Content */}
      <div className="container text-center position-relative" style={{ zIndex: 1 }}>
        <div className="row row-cols-2 row-cols-md-4 g-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="col"
              style={{
                transition: "all 0.8s ease",
                transitionDelay: `${index * 0.2}s`,
                transform: hasAnimated ? "translateY(0)" : "translateY(30px)",
                opacity: hasAnimated ? 1 : 0,
              }}
            >
              <div
                className="p-3 rounded-3 shadow-sm d-flex flex-column align-items-center"
                style={{
                  minHeight: 140,
                  background: "rgba(255,255,255,0.05)",
                }}
              >
                {/* Icon */}
                <div style={{ color: accent, marginBottom: 8 }}>{stat.icon}</div>

                {/* Counter */}
                <div
                  className="fw-bold"
                  style={{ fontSize: "2.2rem", color: accent }}
                >
                  {stat.label === "Support"
                    ? `${counters.support}/7`
                    : formatNumber(stat.value)}
                </div>

                {/* Label */}
                <div className="fw-bold mt-1" style={{ fontSize: "1.2rem", color: "#555" }}>
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export default StatsSection;
