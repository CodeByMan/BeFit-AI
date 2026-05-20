import React, { useState } from "react";
import footerBg from "../../../assets/images/footer-bg.png";
import clockImg from "../../../assets/images/footer-clock.png";

export default function Footer() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const email = e.target.email_address.value;

    // get existing emails or empty array
    const storedEmails = JSON.parse(localStorage.getItem("fitlife_emails")) || [];

    // avoid duplicates
    if (!storedEmails.includes(email)) {
      storedEmails.push(email);
      localStorage.setItem("fitlife_emails", JSON.stringify(storedEmails));
    }

    setSubmitted(true);
    e.target.reset();
  };

  return (
    <footer className="footer">
      <div
        className="section footer-top bg-dark has-bg-image"
        style={{ backgroundImage: `url(${footerBg})` }}
      >
        <div className="container">
          <div className="footer-brand">
            <a href="#" className="logo">
              <ion-icon name="barbell-sharp"></ion-icon>
              <span>BeFit</span>
            </a>
            <p className="footer-brand-text">
              BeFit helps you track workouts, monitor progress, and build healthier habits through a simple fitness dashboard.
              BeFit gives you clear insights into your activity, performance, and daily goals so you can improve over time without complexity.
            </p>

          </div>

          <ul className="footer-list">
            <li><p className="footer-list-title has-before">Our Links</p></li>
            <li><a href="#home" className="footer-link">Home</a></li>
            <li><a href="#about" className="footer-link">About</a></li>
            <li><a href="#features" className="footer-link">Features</a></li>
            <li><a href="#blog" className="footer-link">Blog</a></li>
            <li><a href="#testimonials" className="footer-link">Testimonials</a></li>
          </ul>

          <ul className="footer-list">
            <li><p className="footer-list-title has-before">Contact Us</p></li>
            <li className="footer-list-item">
              <div className="icon"><ion-icon name="location"></ion-icon></div>
              <address className="address footer-link">
                North Nazimabad, Karachi, Pakistan
              </address>
            </li>
            <li className="footer-list-item">
              <div className="icon"><ion-icon name="call"></ion-icon></div>
              <div>
                <a href="tel:11112223333" className="footer-link">1111-222-3333</a>
                <a href="tel:+92112223334444" className="footer-link">+9211 222 333-4444</a>
              </div>
            </li>
            <li className="footer-list-item">
              <div className="icon"><ion-icon name="mail"></ion-icon></div>
              <div>
                <a href="mailto:info@befit.com" className="footer-link">info@befit.com</a>
                <a href="mailto:services@befit.com" className="footer-link">services@befit.com</a>
              </div>
            </li>
          </ul>

          <ul className="footer-list">
            <li>
              <p className="footer-list-title has-before">
                Get Fitness Updates
              </p>
            </li>

            <li>
              {!submitted ? (
                <form className="footer-form" onSubmit={handleSubmit}>
                  <input
                    type="email"
                    name="email_address"
                    placeholder="Email us for updates"
                    required
                    className="input-field"
                  />
                  <button type="submit" className="btn btn-primary" style={{
                      borderColor: "#ff3e1d",
                      borderWidth: "2px",
                      borderStyle: "solid"
                    }}>
                    <ion-icon name="chevron-forward-sharp"></ion-icon>
                  </button>
                </form>
              ) : (
                <p className="footer-link">Thanks! You’re on the list 💪</p>
              )}
            </li>

            <li>
              <ul className="social-list">
                <li className="social-link"><ion-icon name="logo-facebook"></ion-icon></li>
                <li className="social-link"><ion-icon name="logo-instagram"></ion-icon></li>
                <li className="social-link"><ion-icon name="logo-twitter"></ion-icon></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
          <p className="copyright">
            &copy; 2025 BeFit. Rights Reserved By {" "}
            <a
              href="https://github.com/CodeByMan"
              target="_blank"
              className="copyright-link"
              rel="noreferrer"
            >
              CodeByMan
            </a>
          </p>
        </div>
    </footer>
  );
}
