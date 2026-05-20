import React from "react";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import About from "./components/About.jsx";
import StatsSection from "./components/StatsSection.jsx";
import Blog from "./components/Blog.jsx";
import Testimonials from "./components/Testimonials.jsx";
import Features from "./components/Features.jsx";
import Footer from "./components/Footer.jsx";
import useDynamicCSS from "../../hooks/useDynamicCSS";

export default function Home() {
  useDynamicCSS("/src/assets/css/style.css");

  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Features />
        <StatsSection />
        <Blog />
        <Testimonials />
      </main>
      <Footer />
    </>
  );
}
