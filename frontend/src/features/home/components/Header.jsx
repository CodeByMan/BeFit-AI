import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Header() {
  const [navbarActive, setNavbarActive] = useState(false);
  const [scrollActive, setScrollActive] = useState(false);

  // Toggle Navbar
  const toggleNavbar = () => setNavbarActive(!navbarActive);
  const closeNavbar = () => setNavbarActive(false);

  // Scroll effects: header background + back-to-top
  useEffect(() => {
    const handleScroll = () => {
      setScrollActive(window.scrollY >= 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className={`header ${scrollActive ? "active" : ""}`} data-header>
        <div className="container">
          <a href="#" className="logo">
            <ion-icon name="barbell-sharp" aria-hidden="true"></ion-icon>
            <span className="span">BeFit</span>
          </a>

          <nav className={`navbar ${navbarActive ? "active" : ""}`} data-navbar>
            <button className="nav-close-btn" aria-label="close menu" onClick={toggleNavbar} data-nav-toggler>
              <ion-icon name="close-sharp" aria-hidden="true"></ion-icon>
            </button>

            <ul className="navbar-list">
              {["Home", "About", "Features", "Blog", "Testimonials"].map((item, index) => (
                <li key={index}>
                  <a href={`#${item.toLowerCase().replace(/\s+/g, "")}`} className="navbar-link" onClick={closeNavbar} data-nav-link>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <Link to="/register" className="btn btn-secondary">
  Join Now
</Link>
          <button className="nav-open-btn" aria-label="open menu" onClick={toggleNavbar} data-nav-toggler>
            <span className="line"></span>
            <span className="line"></span>
            <span className="line"></span>
          </button>
        </div>
      </header>

      {scrollActive && (
        <a href="#top" className="back-top-btn active" aria-label="back to top" data-back-top-btn style={{
              borderColor: "#a11800ff",
              color: "#fff",
            }}>
          <ion-icon name="caret-up-sharp" aria-hidden="true" ></ion-icon>
        </a>
      )}
    </>
  );
}
