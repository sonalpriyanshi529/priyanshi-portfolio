const FEATURED_PROJECTS = [
  {
    title: "House Price Prediction System",
    description:
      "A machine learning app that predicts house prices from key features, wrapped in a simple Streamlit interface so anyone can play with the model.",
    tech: ["Python", "Machine Learning", "Streamlit"],
    github: "https://github.com/sonalpriyanshi529/House-Price-Prediction-System",
    demo: "http://sonalpriyanshi529-house-price-predictio-streamlit-appapp-vcaapd.streamlit.app/",
  },
  {
    title: "Loan Approval Prediction System",
    description:
      "A classification model that predicts whether a loan application is likely to be approved, deployed as an interactive Streamlit app.",
    tech: ["Python", "Machine Learning", "Streamlit"],
    github: "https://github.com/sonalpriyanshi529/LoanApprovalPrediction",
    demo: "https://sonalpriyanshi529-loanapprovalpredictio-streamlit-appapp-7g07t0.streamlit.app/",
  },
  {
    title: "Slice & Sip",
    description:
      "A stylish front-end web project built to practice layout, styling and interaction design outside of a Python-only comfort zone.",
    tech: ["HTML", "CSS", "JavaScript"],
    github: "https://github.com/sonalpriyanshi529/Slice-and-Sip",
    demo: "https://sonalpriyanshi529.github.io/Slice-and-Sip/",
  },
  {
    title: "Space Invaders",
    description:
      "A Space Invaders clone built with Pygame — sprites, collisions, score tracking, and a genuinely unreasonable number of playtests.",
    tech: ["Python", "Pygame"],
    github: "https://github.com/sonalpriyanshi529/Space-Invaders",
    demo: null,
  },
];

const MORE_PROJECTS = [
  {
    title: "Python Calculator",
    description:
      "A GUI calculator built with Tkinter — my first real project outside of a script that just ran top to bottom.",
    tech: ["Python", "Tkinter"],
    github: "https://github.com/sonalpriyanshi529/python-calculator",
    demo: null,
  },
  {
    title: "Binary Number System Converter",
    description:
      "Converts between binary, octal, decimal and hexadecimal, built while trying to actually understand number systems instead of memorising them.",
    tech: ["Python", "Tkinter"],
    github: "https://github.com/sonalpriyanshi529/binary-number-system-converter",
    demo: null,
  },
  {
    title: "Windows Shutdown Utility",
    description:
      "A small desktop utility that schedules shutdown, restart or sleep with a countdown timer.",
    tech: ["Python", "Tkinter", "OS"],
    github: "https://github.com/sonalpriyanshi529/windows-shutdown-utility",
    demo: null,
  },
  {
    title: "Rock Paper Scissors",
    description:
      "The classic game with a simple GUI and a scoreboard, because typing choices into a terminal got old fast.",
    tech: ["Python", "Tkinter"],
    github: "https://github.com/sonalpriyanshi529/python-rock-paper-scissors",
    demo: null,
  },
  {
    title: "Priyanshi Thoughts",
    description:
      "A personal space for notes and ideas — a small writing project built to practice putting together clean, functional interfaces.",
    tech: ["HTML", "CSS", "JavaScript"],
    github: "https://github.com/sonalpriyanshi529/Priyanshi-Thoughts",
    demo: "https://sonalpriyanshi529.github.io/Priyanshi-Thoughts/",
  },
];

function GithubIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

function ProjectLinks({ title, github, demo }) {
  return (
    <div className="project-card__links">
      <a
        className="project-card__link"
        href={github}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`GitHub: ${title} repository (opens in a new tab)`}
      >
        <GithubIcon />
        GitHub
      </a>
      {demo && (
        <a
          className="project-card__link project-card__link--demo"
          href={demo}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Live Demo: ${title} (opens in a new tab)`}
        >
          Live Demo
          <ExternalIcon />
        </a>
      )}
    </div>
  );
}

function TechTags({ tech }) {
  return (
    <ul className="project-card__tags" aria-label="Technologies used">
      {tech.map((t) => (
        <li key={t}>{t}</li>
      ))}
    </ul>
  );
}

export default function Work() {
  return (
    <section id="work" className="section work" aria-labelledby="work-title">
      <div className="section__inner">
        <div data-reveal>
          <p className="section__eyebrow">Work</p>
          <h2 id="work-title" className="section__title">Selected Work</h2>
        </div>

        <div className="work__featured">
          {FEATURED_PROJECTS.map((project, i) => (
            <article
              className="project-card project-card--featured"
              key={project.title}
              data-reveal
              style={{ "--i": i % 2 }}
            >
              <span className="project-card__index" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="project-card__title">{project.title}</h3>
              <p className="project-card__desc">{project.description}</p>
              <TechTags tech={project.tech} />
              <ProjectLinks
                title={project.title}
                github={project.github}
                demo={project.demo}
              />
            </article>
          ))}
        </div>

        <h3 className="work__more-heading" data-reveal>More Projects</h3>
        <div className="work__more">
          {MORE_PROJECTS.map((project, i) => (
            <article
              className="project-card project-card--compact"
              key={project.title}
              data-reveal
              style={{ "--i": i % 3 }}
            >
              <h4 className="project-card__title">{project.title}</h4>
              <p className="project-card__desc">{project.description}</p>
              <TechTags tech={project.tech} />
              <ProjectLinks
                title={project.title}
                github={project.github}
                demo={project.demo}
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
