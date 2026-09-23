const EDUCATION = [
  {
    period: "2025 — 2029",
    title: "B.Tech in Computer Science Engineering",
    meta: "2nd Year · United College of Engineering and Research",
    desc: "Currently building my foundation in data structures, OOP, discrete mathematics, computer organization and other core computer science subjects while developing projects outside the classroom.",
  },
  {
    period: "Before 2025",
    title: "Science — PCM",
    meta: "Vidya Vahini",
    desc: "This is where I wrote my first Python script — a calculator, naturally.",
  },
];

export default function Education() {
  return (
    <section id="education" className="section education" aria-labelledby="education-title">
      <div className="section__inner">
        <div data-reveal>
          <p className="section__eyebrow">Education</p>
          <h2 id="education-title" className="section__title">Where I&rsquo;ve learned</h2>
        </div>

        <ol className="timeline">
          {EDUCATION.map((item, i) => (
            <li
              className="timeline__item"
              key={item.title}
              data-reveal
              style={{ "--i": i }}
            >
              <div className="timeline__marker" aria-hidden="true" />
              <div className="timeline__content">
                <span className="timeline__period">{item.period}</span>
                <h3 className="timeline__title">{item.title}</h3>
                <p className="timeline__meta">{item.meta}</p>
                <p className="timeline__desc">{item.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
