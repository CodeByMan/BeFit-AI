import React, { forwardRef, useRef, useEffect, useState } from "react";
import API from "../../../api/Api";
import leftArrow from "../../../assets/leftArrow.png";
import rightArrow from "../../../assets/rightArrow.png";

const Testimonials = forwardRef((props, ref) => {
  const internalRef = ref ?? useRef();
  const rowRef = useRef();

  const [visible, setVisible] = useState(false);
  const [testimonials, setTestimonials] = useState([]);

  const renderStars = (rating) => {
  return "⭐".repeat(rating);
};

  // ===================== FETCH TESTIMONIALS + PROFILE AVATAR =====================
  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get("/testimonials");

        const list = await Promise.all(
          res.data.testimonials.map(async (t) => {
            const userId = t.userId?._id;
            let avatar = null;
            let fullName = t.userId?.name || "User";

            if (!userId) {
              return {
                text: t.message,
                rating: t.rating,
                name: fullName,
                image: null,
              };
            }

            try {
              const p = await API.get(`/profile/public/${userId}`);

              if (p.data.profile) {
                fullName = p.data.profile.full_name || fullName;

                if (p.data.profile.avatar_filename) {
                  avatar = `http://localhost:5000${p.data.profile.avatar_filename}?t=${Date.now()}`;
                }
                    if (p.data.profile.avatar_filename) {
                  avatar = p.data.profile.avatar_filename.startsWith("http")
                    ? p.data.profile.avatar_filename
                    : `http://localhost:5000${p.data.profile.avatar_filename}?t=${Date.now()}`;
                }
              }
            } catch (err) {
              console.error("Public profile fetch failed:", err);
            }

            return {
              text: t.message,
              rating: t.rating,
              name: fullName,
              image: avatar,
            };
          })
        );

        setTestimonials(list);
      } catch (err) {
        console.error("Failed to fetch testimonials:", err);
      }
    };

    load();
  }, []);

  // ===================== FADE-IN ANIMATION =====================
  useEffect(() => {
    const el = internalRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // ===================== AUTO SCROLL =====================
  useEffect(() => {
    const row = rowRef.current;
    if (!row || testimonials.length === 0) return;


    let scrollAmount = 0;
    const cardWidth =
      row.children[0].offsetWidth + parseInt(getComputedStyle(row).gap || 16);
    const totalScroll = row.scrollWidth - row.offsetWidth;

    const interval = setInterval(() => {
      scrollAmount += cardWidth;
      if (scrollAmount > totalScroll) scrollAmount = 0;

      row.scrollTo({ left: scrollAmount, behavior: "smooth" });
    }, 3000);

    return () => clearInterval(interval);
  }, [testimonials]);

  const scrollPrev = () => {
    const cardWidth =
      rowRef.current.children[0].offsetWidth +
      parseInt(getComputedStyle(rowRef.current).gap || 16);

    rowRef.current.scrollBy({ left: -cardWidth, behavior: "smooth" });
  };

  const scrollNext = () => {
    const cardWidth =
      rowRef.current.children[0].offsetWidth +
      parseInt(getComputedStyle(rowRef.current).gap || 16);

    rowRef.current.scrollBy({ left: cardWidth, behavior: "smooth" });
  };


  // ===================== UI =====================
  return (
    <section className="section testimonial" id="testimonials">
      <div className="container" ref={internalRef}>
        <p className="section-subtitle">Testimonials</p>
        <h2 className="h2 section-title text-center">What Our Users Say</h2>

        <div className={`testimonial-row ${visible ? "visible" : ""}`} ref={rowRef}>
          {testimonials.map((t, i) => (
            <div className="testimonial-card" key={i}>
              <div className="testimonial-text">
                <span className="quote-mark">“</span>
                {t.text}
                <span className="quote-mark quote-mark-end">”</span>
              </div>

              <div className="testimonial-user">
                <img
                  src={t.image || "https://via.placeholder.com/150"}
                  alt={t.name}
                  className="testimonial-img"
                  {...(t.image?.startsWith("http") ? {} : { crossOrigin: "use-credentials" })}
                />


                <div className="testimonial-info">
                  <h5>{t.name}</h5>
                  <p className="testimonial-stars">{renderStars(t.rating)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="testimonial-buttons-center">
          <button onClick={scrollPrev} className="btn-arrow">
            <img src={leftArrow} alt="Prev" />
          </button>
          <button onClick={scrollNext} className="btn-arrow">
            <img src={rightArrow} alt="Next" />
          </button>
        </div>
      </div>
    </section>
  );
});

export default Testimonials;
