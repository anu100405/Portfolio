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
        <div className="wrap">
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
            <h2 className="section-title">Projects</h2>
            <span className="section-rule" />
          </div>
          <div className="proj-list">
            {site.projects.map((p, i) => (
              <div className="proj reveal" key={p.title}>
                <span className="proj-idx">{String(i + 1).padStart(2, '0')}</span>
                <div className="proj-body">
                  <h3>{p.title}</h3>
                  {p.body ? <p>{p.body}</p> : null}
                  {p.bullets ? (
                    <ul className="log-bullets">
                      {p.bullets.map((b) => (
                        <li key={b}>
                          <RichText text={b} />
                        </li>
                      ))}
                    </ul>
                  ) : null}
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
        © {new Date().getFullYear()} {site.name}
      </footer>
    </>
  )
}

export default App
