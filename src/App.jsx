import { useEffect, useState } from 'react'
import { site } from './data'

function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            observer.unobserve(e.target)
          }
        })
      },
      { threshold: 0.15 },
    )
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

function useTypewriter(text) {
  const [shown, setShown] = useState('')

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setShown(text)
      return
    }
    let i = 0
    const id = setInterval(() => {
      i += 1
      setShown(text.slice(0, i))
      if (i >= text.length) clearInterval(id)
    }, 45)
    return () => clearInterval(id)
  }, [text])

  return shown
}

function RichText({ text }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={i}>{part.slice(2, -2)}</strong>
    ) : (
      <span key={i}>{part}</span>
    ),
  )
}

function Branch() {
  return (
    <div className="branch-wrap">
      <svg viewBox="0 0 300 340" fill="none" aria-hidden="true">
        <path
          className="branch-path"
          d="M150 330 C150 260 110 240 120 180 C128 130 90 110 95 60 C98 30 130 10 150 5"
        />
        <path
          className="branch-path"
          style={{ animationDelay: '.5s' }}
          d="M120 180 C90 175 70 150 55 155"
        />
        <path
          className="branch-path"
          style={{ animationDelay: '.7s' }}
          d="M128 130 C158 122 175 100 195 105"
        />
        <path
          className="branch-path"
          style={{ animationDelay: '.9s' }}
          d="M98 60 C70 55 55 35 35 40"
        />
        <ellipse
          className="leaf"
          style={{ animationDelay: '1.2s' }}
          cx="52"
          cy="150"
          rx="16"
          ry="7"
          transform="rotate(-20 52 150)"
        />
        <ellipse
          className="leaf"
          style={{ animationDelay: '1.4s' }}
          cx="198"
          cy="100"
          rx="16"
          ry="7"
          transform="rotate(20 198 100)"
        />
        <ellipse
          className="leaf"
          style={{ animationDelay: '1.6s' }}
          cx="32"
          cy="36"
          rx="15"
          ry="7"
          transform="rotate(-15 32 36)"
        />
        <ellipse
          className="leaf"
          style={{ animationDelay: '1.8s' }}
          cx="150"
          cy="4"
          rx="15"
          ry="7"
        />
        <ellipse
          className="leaf"
          style={{ animationDelay: '2.0s' }}
          cx="118"
          cy="182"
          rx="14"
          ry="6"
          transform="rotate(-35 118 182)"
        />
        <ellipse
          className="leaf"
          style={{ animationDelay: '2.1s' }}
          cx="128"
          cy="128"
          rx="14"
          ry="6"
          transform="rotate(30 128 128)"
        />
      </svg>
    </div>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [sent, setSent] = useState(false)
  const typed = useTypewriter(site.whoami)
  useReveal()

  function closeMenu() {
    setMenuOpen(false)
  }

  function onSubmit(e) {
    e.preventDefault()
    const form = new FormData(e.target)
    const name = form.get('name')
    const email = form.get('email')
    const message = form.get('message')
    const subject = encodeURIComponent(`Portfolio message from ${name}`)
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`)
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`
    setSent(true)
  }

  return (
    <>
      <header>
        <nav className="wrap">
          <div className="brand">
            <span className="dot" />
            {site.brand}
          </div>
          <button
            className="navmenu-btn"
            type="button"
            aria-label="Menu"
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? '×' : '☰'}
          </button>
          <div className={`navlinks ${menuOpen ? 'open' : ''}`}>
            <a href="#about" onClick={closeMenu}>
              About
            </a>
            <a href="#skills" onClick={closeMenu}>
              Skills
            </a>
            <a href="#experience" onClick={closeMenu}>
              Experience
            </a>
            <a href="#projects" onClick={closeMenu}>
              Projects
            </a>
            <a href="#contact" onClick={closeMenu}>
              Contact
            </a>
          </div>
        </nav>
      </header>

      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <div className="eyebrow">
              <span className="bar" />
              {site.role}
            </div>
            <h1 className="display">
              {site.headline[0]}
              <br />
              {site.headline[1]}
              <em>{site.headline[2]}</em>
              <br />
              {site.headline[3]}
            </h1>
            <div className="hero-role">
              $ whoami {typed}
              <span className="cursor" />
            </div>
            <p className="hero-desc">{site.intro}</p>
            <div className="hero-cta">
              <a href="#projects" className="btn btn-solid">
                View my work
              </a>
              <a href="#contact" className="btn btn-ghost">
                Get in touch
              </a>
            </div>
          </div>
          <Branch />
        </div>
      </section>

      <section id="about">
        <div className="wrap">
          <div className="section-head reveal">
            <span className="section-num">01</span>
            <h2 className="section-title">About</h2>
            <span className="section-rule" />
          </div>
          <div className="about-grid">
            <div className="about-text reveal">
              {site.about.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <div className="stat-list reveal">
              {site.stats.map((s) => (
                <div className="stat" key={s.label}>
                  <span className="stat-num">{s.num}</span>
                  <span className="stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="skills">
        <div className="wrap">
          <div className="section-head reveal">
            <span className="section-num">02</span>
            <h2 className="section-title">Skills</h2>
            <span className="section-rule" />
          </div>
          <div className="skills-grid reveal">
            {site.skills.map((cat) => (
              <div className="skill-cat" key={cat.title}>
                <h3>{cat.title}</h3>
                <ul>
                  {cat.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="experience">
        <div className="wrap">
          <div className="section-head reveal">
            <span className="section-num">03</span>
            <h2 className="section-title">Experience</h2>
            <span className="section-rule" />
          </div>
          <div className="log reveal">
            {site.experience.map((job) => (
              <div className="log-item" key={`${job.company}-${job.title}`}>
                <div className="log-meta">
                  {job.dates}
                  {job.location ? <span>{job.location}</span> : null}
                </div>
                <h3>
                  {job.title} <span className="co">— {job.company}</span>
                </h3>
                {job.stack ? (
                  <div className="tag-row log-stack">
                    {job.stack.map((t) => (
                      <span className="tag" key={t}>
                        {t}
                      </span>
                    ))}
                  </div>
                ) : null}
                {job.body ? <p>{job.body}</p> : null}
                {job.bullets ? (
                  <ul className="log-bullets">
                    {job.bullets.map((b) => (
                      <li key={b}>
                        <RichText text={b} />
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="projects">
        <div className="wrap">
          <div className="section-head reveal">
            <span className="section-num">04</span>
            <h2 className="section-title">Selected work</h2>
            <span className="section-rule" />
          </div>
          <div className="proj-list">
            {site.projects.map((p, i) => (
              <div className="proj reveal" key={p.title}>
                <span className="proj-idx">{String(i + 1).padStart(2, '0')}</span>
                <div className="proj-body">
                  <h3>{p.title}</h3>
                  <p>{p.body}</p>
                  <div className="tag-row">
                    {p.tags.map((t) => (
                      <span className="tag" key={t}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <a
                  href={p.href}
                  className="proj-link"
                  target="_blank"
                  rel="noreferrer"
                >
                  View →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact">
        <div className="wrap">
          <div className="section-head reveal">
            <span className="section-num">05</span>
            <h2 className="section-title">Contact</h2>
            <span className="section-rule" />
          </div>
          <div className="contact-grid">
            <div className="contact-intro reveal">
              <p>
                Have a project in mind, or just want to say hello? My inbox is
                always open — I try to reply within a couple of days.
              </p>
              <div className="contact-links">
                <a href={`mailto:${site.email}`}>
                  Email <span>{site.email}</span>
                </a>
                <a href={site.github} target="_blank" rel="noreferrer">
                  GitHub <span>{site.githubLabel}</span>
                </a>
                <a href={site.linkedin} target="_blank" rel="noreferrer">
                  LinkedIn <span>{site.linkedinLabel}</span>
                </a>
              </div>
            </div>
            <form className="reveal" onSubmit={onSubmit}>
              <div className="field">
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your name"
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  placeholder="Tell me a bit about your project..."
                  required
                />
              </div>
              <button type="submit" className="form-submit" disabled={sent}>
                {sent ? 'Sent ✓' : 'Send message →'}
              </button>
            </form>
          </div>
        </div>
      </section>

      <footer>
        © {new Date().getFullYear()} {site.name}. Built with olive branches 🫒
      </footer>
    </>
  )
}

export default App
