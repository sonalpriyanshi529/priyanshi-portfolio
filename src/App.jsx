import { useRef } from "react";
import CharacterCanvas from "./components/CharacterCanvas.jsx";
import CustomCursor from "./components/CustomCursor.jsx";
import Navbar from "./components/Navbar.jsx";
import Work from "./sections/Work.jsx";
import About from "./sections/About.jsx";
import Skills from "./sections/Skills.jsx";
import Education from "./sections/Education.jsx";
import Contact from "./sections/Contact.jsx";
import Footer from "./components/Footer.jsx";
import useReveal from "./hooks/useReveal.js";

export default function App() {
  const heroRef = useRef(null);
  useReveal();

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <CustomCursor />
      <Navbar />

      <main id="main">
        <section
          className="hero"
          id="top"
          ref={heroRef}
          aria-label="Introduction"
        >
          <div className="hero__stage">
            <CharacterCanvas heroRef={heroRef} className="hero__canvas" />
          </div>

          <div className="hero__content">
            <p className="hero__hi">Hi, I&rsquo;m</p>
            <h1 className="hero__name">
              Priyanshi<span className="visually-hidden"> Sahu</span>
            </h1>
            <p className="hero__role">Full Stack Developer</p>
            <p className="hero__desc">
              I build full-stack products with a love for problem solving and a
              growing interest in AI/ML. I care about crafting interactive
              digital experiences that feel alive.
            </p>
            <a
              className="hero__prev-link"
              href="https://sonalpriyanshi529.github.io/portfolio/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Previous Portfolio ↗
            </a>
          </div>

          <a className="hero__scroll-cue" href="#work">
            <span>Scroll to explore</span>
            <span aria-hidden="true">↓</span>
          </a>
        </section>

        <Work />
        <About />
        <Skills />
        <Education />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
