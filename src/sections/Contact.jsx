const CONTACT_LINKS = [
  {
    label: "GitHub",
    value: "github.com/sonalpriyanshi529",
    href: "https://github.com/sonalpriyanshi529",
    external: true,
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/priyanshi-sahu-0251b9371",
    href: "https://www.linkedin.com/in/priyanshi-sahu-0251b9371/",
    external: true,
  },
  {
    label: "Email",
    value: "sonalpriyanshi529@gmail.com",
    href: "mailto:sonalpriyanshi529@gmail.com",
    external: false,
  },
];

function ArrowIcon({ external }) {
  return (
    <svg
      className="contact-link__arrow"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {external ? (
        <path d="M7 17 17 7M8 7h9v9" />
      ) : (
        <path d="M5 12h14M13 6l6 6-6 6" />
      )}
    </svg>
  );
}

export default function Contact() {
  return (
    <section id="contact" className="section contact" aria-labelledby="contact-title">
      <div className="section__inner contact__grid">
        <h2 id="contact-title" className="contact__title" data-reveal>
          I reply faster than my code compiles. Reach out!
        </h2>

        <ul className="contact__links">
          {CONTACT_LINKS.map((link, i) => (
            <li key={link.label} data-reveal style={{ "--i": i + 1 }}>
              <a
                className="contact-link"
                href={link.href}
                {...(link.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                <span className="contact-link__label">{link.label}</span>
                <span className="contact-link__value">{link.value}</span>
                {link.external && (
                  <span className="visually-hidden"> (opens in a new tab)</span>
                )}
                <ArrowIcon external={link.external} />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
