import { useCallback } from "react";

const LINKS = [
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#education", label: "Education" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const handleClick = useCallback((e, href) => {
    const target = document.querySelector(href);
    if (!target) return; // fall back to the browser's default anchor jump
    e.preventDefault();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    // Keep the URL hash in sync and move keyboard/screen-reader focus to the section.
    if (window.location.hash !== href) {
      window.history.pushState(null, "", href);
    }
    if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  }, []);

  return (
    <header className="navbar" role="banner">
      <nav className="navbar__pill" aria-label="Primary">
        <a
          className="navbar__brand"
          href="#top"
          aria-label="Priyanshi Sahu, back to top"
          onClick={(e) => handleClick(e, "#top")}
        >
          P.
        </a>
        <ul className="navbar__links">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} onClick={(e) => handleClick(e, link.href)}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
