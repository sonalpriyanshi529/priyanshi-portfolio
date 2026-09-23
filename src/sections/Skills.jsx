// Skills are grouped qualitatively on purpose: no scores, no percentages, no years.
const SKILL_GROUPS = [
  {
    key: "comfortable",
    title: "More comfortable",
    note: "The tools I feel most at home with.",
    skills: ["Python", "Tkinter", "GitHub", "C"],
  },
  {
    key: "developing",
    title: "Developing",
    note: "Still learning, and improving with every project.",
    skills: ["HTML", "CSS", "JavaScript", "Pygame", "React", "C++"],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="section skills" aria-labelledby="skills-title">
      <div className="section__inner">
        <div data-reveal>
          <h2 id="skills-title" className="section__title">
            Skills
          </h2>
        </div>

        <div className="skills__groups">
          {SKILL_GROUPS.map((group, i) => (
            <div
              className={`skills-group skills-group--${group.key}`}
              key={group.key}
              data-reveal
              style={{ "--i": i }}
            >
              <h3 className="skills-group__title">{group.title}</h3>
              <p className="skills-group__note">{group.note}</p>
              <ul className="skills-group__list">
                {group.skills.map((skill) => (
                  <li className="skill-chip" key={skill}>
                    <span className="skill-chip__dot" aria-hidden="true" />
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
