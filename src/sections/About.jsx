const ACHIEVEMENTS = [
  {
    title: "AIML Summer Internship",
    org: "MNNIT Allahabad",
  },
  {
    title: "Participant",
    org: "uHack Hackathon",
  },
];

export default function About() {
  return (
    <section id="about" className="section about" aria-labelledby="about-title">
      <div className="section__inner">
        <div data-reveal>
          <p className="section__eyebrow">About</p>
          <h2 id="about-title" className="section__title">A bit about me</h2>
        </div>

        <div className="about__grid">
          <div className="about__text" data-reveal>
            <p>
              I&rsquo;m a second-year B.Tech Computer Science Engineering
              student. I enjoy building software, web applications, and
              interactive projects, and I&rsquo;m steadily growing my skills
              in programming, problem solving, and machine learning.
            </p>
            <p>
              I like experimenting with different technologies rather than
              staying limited to one area &mdash; there&rsquo;s always
              something new worth trying.
            </p>
          </div>

          <div className="about__achievements">
            <h3 className="about__subheading" data-reveal>Experience &amp; Achievements</h3>
            <ul className="achievement-list">
              {ACHIEVEMENTS.map((item, i) => (
                <li
                  className="achievement-card"
                  key={item.title}
                  data-reveal
                  style={{ "--i": i + 1 }}
                >
                  <span className="achievement-card__title">{item.title}</span>
                  <span className="achievement-card__org">{item.org}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
