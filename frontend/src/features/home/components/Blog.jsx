import React, { useEffect, useState } from "react";
import API from "../../../api/Api";

import icon1 from "../../../assets/images/class-icon-1.png";
import icon2 from "../../../assets/images/class-icon-2.png";
import icon3 from "../../../assets/images/class-icon-3.png";
import icon4 from "../../../assets/images/class-icon-4.png";

import classesBg from "../../../assets/images/classes-bg.png";

// Icons stay static because backend does not provide them
const icons = [icon1, icon2, icon3, icon4];

export default function Blog() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        const res = await API.get("/blogs");
        setBlogs(res.data.blogs || []);
      } catch (err) {
        console.error("Blog fetch error:", err);
      }
    };

    loadBlogs();
  }, []);

  return (
    <section
      className="section blog bg-dark has-bg-image"
      id="blog"
      style={{ backgroundImage: `url(${classesBg})` }}
    >
      <div className="container">
        <p className="section-subtitle">Our News</p>
        <h2 className="h2 section-title text-center">Latest Blog Feed</h2>

        <ul className="blog-list has-scrollbar">
          {blogs.map((cls, index) => (
            <li className="scrollbar-item" key={cls._id}>
              <div className="blog-card">

                {/* SAME STRUCTURE - JUST USING BACKEND IMAGE */}
                <figure
                  className="card-banner img-holder"
                  style={{ "--width": 416, "--height": 240 }}
                >
                  <img
                    src={cls.image}
                    alt={cls.title}
                    className="img-cover"
                  />
                </figure>

                <div className="card-content">
                  <div className="title-wrapper">

                    {/* SAME STATIC ICONS */}
                    <img
                      src={icons[index % icons.length]}
                      alt=""
                      className="title-icon"
                    />

                    <h3 className="h3">
                      <a
                        href={cls.link}
                        className="card-title"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {cls.title}
                      </a>
                    </h3>
                  </div>

                  {/* SAME STATIC TEXT SLOT → NOW FROM BACKEND */}
                  <p className="card-text">{cls.intro}</p>

                  <a
                    href={cls.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-link has-before"
                    style={{
                      color: "#ff3e1d",
                    }}
                  >
                    Read More
                  </a>
                </div>

              </div>
            </li>
          ))}
        </ul>

      </div>
    </section>
  );
}
