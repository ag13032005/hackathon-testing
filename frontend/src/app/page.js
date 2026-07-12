'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './page.module.css';

/* ─── Icons (inline SVGs to avoid dependencies) ─── */
const Icons = {
  Menu: () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 12h18M3 6h18M3 18h18"/></svg>,
  X: () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>,
  Sun: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="10" cy="10" r="4"/><path d="M10 1v2M10 17v2M1 10h2M17 10h2M3.9 3.9l1.4 1.4M14.7 14.7l1.4 1.4M3.9 16.1l1.4-1.4M14.7 5.3l1.4-1.4"/></svg>,
  Moon: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 13a7 7 0 1 1-8-11 7 7 0 0 0 8 11z"/></svg>,
  ChevronDown: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 6l4 4 4-4"/></svg>,
  ArrowRight: () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 9h8M9 5l4 4-4 4"/></svg>,
  Brain: () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M12 2a7 7 0 0 1 7 7c0 2.5-1.3 4.7-3.3 5.9L12 17l-3.7-2.1A7 7 0 0 1 12 2z"/><path d="M12 17v5"/><path d="M8 22h8"/></svg>,
  Heart: () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  Leaf: () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M17 8C8 10 5.9 16.2 3.5 20.5M2 21c1-3 5-9 13-11 2-.5 4.5-.5 6.5.5-1 2-3.5 4.5-6.5 5C8 17 5 19.5 2 21z"/></svg>,
  Cpu: () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3"/></svg>,
  Lightbulb: () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M9 18h6M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg>,
  Trophy: () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 19.24 7 20v2M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 19.24 17 20v2"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg>,
  Users: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Clock: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
  MapPin: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  Mail: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="M22 6l-10 7L2 6"/></svg>,
  Phone: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  Check: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>,
  Star: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
  Globe: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  Shield: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Award: () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="8" r="7"/><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12"/></svg>,
};

/* ─── Track Data ─── */
const TRACKS = [
  { icon: Icons.Brain, title: 'AI & Automation', desc: 'Build intelligent systems that learn, adapt, and automate real-world processes.', color: 'var(--primary-500)' },
  { icon: Icons.Heart, title: 'HealthTech & Wellness', desc: 'Innovate solutions for healthcare accessibility, mental wellness, and diagnostics.', color: '#ef4444' },
  { icon: Icons.Leaf, title: 'Sustainability & Green Tech', desc: 'Create technology that preserves and protects our planet for future generations.', color: '#22c55e' },
  { icon: Icons.Cpu, title: 'Smart Cities & IoT', desc: 'Design interconnected urban solutions using sensors, data, and automation.', color: '#3b82f6' },
  { icon: Icons.Lightbulb, title: 'Open Innovation', desc: 'Any problem, any domain. Bring your boldest, most creative idea to life.', color: 'var(--accent-500)' },
];

/* ─── Timeline Data ─── */
const TIMELINE = [
  { date: 'Aug 1', title: 'Registration Opens', desc: 'Create your account, form teams, and select your track.' },
  { date: 'Aug 20', title: 'Registration Closes', desc: 'Final deadline for team formation and payment.' },
  { date: 'Aug 25', title: 'Team Verification', desc: 'All registrations verified. Digital passes issued.' },
  { date: 'Sep 1', title: 'Hackathon Day — Inauguration', desc: 'Opening ceremony, problem statements revealed, coding begins.' },
  { date: 'Sep 1', title: 'Round 1 — Ideation Review', desc: 'Present your idea. Judges evaluate feasibility and innovation.' },
  { date: 'Sep 1', title: 'Development Phase', desc: '12+ hours of uninterrupted building, mentoring, and hacking.' },
  { date: 'Sep 2', title: 'Round 2 — Progress Check', desc: 'Demonstrate your working prototype and technical depth.' },
  { date: 'Sep 2', title: 'Final Round & Judging', desc: 'Final presentations. Winners announced. Certificates distributed.' },
];

/* ─── FAQ Data ─── */
const FAQS = [
  { q: 'Who can participate?', a: 'Any undergraduate or postgraduate student from any recognized institution across India can participate.' },
  { q: 'What is the team size?', a: 'Teams must have 2 to 4 members. Solo participation is also allowed.' },
  { q: 'Is the registration fee refundable?', a: 'No, the ₹1,000 registration fee is non-refundable once payment is completed.' },
  { q: 'Can I change my team after registration?', a: 'No. Once the team is locked and payment is made, team composition cannot be changed. Only the HOD or Tech Head can unlock a team in exceptional cases.' },
  { q: 'What should I bring?', a: 'Your laptop, charger, student ID, and any hardware you might need. Food and refreshments will be provided.' },
  { q: 'Will there be mentors?', a: 'Yes! Industry and faculty mentors will be available throughout the hackathon to guide teams.' },
  { q: 'How are projects judged?', a: 'Projects are evaluated on Innovation, Technical Complexity, Impact & Relevance, and Presentation Quality across multiple rounds.' },
  { q: 'Can I participate from multiple tracks?', a: 'No, each team selects one track during registration and must build their solution within that track.' },
];

/* ─── Rules Data ─── */
const RULES = [
  'Teams must consist of 2–4 members from any recognized institution.',
  'All code must be written during the hackathon. Pre-built projects are strictly prohibited.',
  'Use of open-source libraries and APIs is allowed and encouraged.',
  'Each team must select exactly one track during registration.',
  'Projects must be submitted before the final deadline. Late submissions will not be accepted.',
  'Plagiarism or copying will result in immediate disqualification.',
  'Judges\' decisions are final and binding.',
  'All participants must maintain respectful and professional conduct.',
  'Teams must present their project during each evaluation round.',
  'Participants must carry valid college ID for on-site verification.',
];

export default function HomePage() {
  const [theme, setTheme] = useState('dark');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('ewit-theme');
    if (saved) {
      setTheme(saved);
      document.documentElement.setAttribute('data-theme', saved);
    }
  }, []);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('ewit-theme', next);
  };

  const navLinks = [
    { href: '#about', label: 'About' },
    { href: '#tracks', label: 'Tracks' },
    { href: '#timeline', label: 'Timeline' },
    { href: '#prizes', label: 'Prizes' },
    { href: '#rules', label: 'Rules' },
    { href: '#faq', label: 'FAQ' },
    { href: '#contact', label: 'Contact' },
  ];

  return (
    <>
      {/* ═══════════════ NAVIGATION ═══════════════ */}
      <nav className={`${styles.nav} ${scrolled ? styles.navScrolled : ''}`}>
        <div className={`container ${styles.navInner}`}>
          <a href="#" className={styles.logo}>
            <span className={styles.logoIcon}>⬡</span>
            <div>
              <span className={styles.logoText}>EWIT</span>
              <span className={styles.logoSub}>Hackathon '26</span>
            </div>
          </a>

          <div className={styles.navLinks}>
            {navLinks.map(l => (
              <a key={l.href} href={l.href} className={styles.navLink}>{l.label}</a>
            ))}
          </div>

          <div className={styles.navActions}>
            <button onClick={toggleTheme} className={`btn btn-icon btn-ghost ${styles.themeToggle}`} aria-label="Toggle theme">
              {theme === 'dark' ? <Icons.Sun /> : <Icons.Moon />}
            </button>
            <a href="#register" className="btn btn-secondary btn-sm" style={{ display: 'none' }}>Login</a>
            <a href="#register" className="btn btn-primary btn-sm">Register Now</a>
            <button
              className={`${styles.mobileMenuBtn} btn btn-icon btn-ghost`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <Icons.X /> : <Icons.Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={styles.mobileMenu}>
            {navLinks.map(l => (
              <a key={l.href} href={l.href} className={styles.mobileMenuLink} onClick={() => setMobileMenuOpen(false)}>{l.label}</a>
            ))}
            <a href="#register" className="btn btn-primary" style={{ width: '100%', marginTop: 8 }}>Register Now</a>
          </div>
        )}
      </nav>

      <main>
        {/* ═══════════════ HERO ═══════════════ */}
        <section className={styles.hero} id="home">
          <div className={styles.heroBg}>
            <div className={styles.heroOrb1} />
            <div className={styles.heroOrb2} />
            <div className={styles.heroOrb3} />
            <div className={styles.heroGrid} />
          </div>
          <div className={`container ${styles.heroContent}`}>
            <div className={styles.heroBadge}>
              <span className={styles.heroBadgeDot} />
              National Level 24-Hour Hackathon
            </div>
            <h1 className={`heading-xl ${styles.heroTitle}`}>
              Where <span className={styles.heroGradient}>Earth</span> Meets<br />
              <span className={styles.heroGradient2}>Innovation</span>
            </h1>
            <p className={styles.heroDesc}>
              Build solutions that shape the future. 24 hours. 5 tracks. ₹1,00,000 in prizes.
              <br />Hosted by East West Institute of Technology.
            </p>
            <div className={styles.heroActions}>
              <a href="#register" className="btn btn-primary btn-lg">
                Register Your Team <Icons.ArrowRight />
              </a>
              <a href="#about" className="btn btn-secondary btn-lg">
                Learn More
              </a>
            </div>
            <div className={styles.heroStats}>
              <div className="stat"><div className="stat-value">₹1L+</div><div className="stat-label">Prize Pool</div></div>
              <div className={styles.heroStatDivider} />
              <div className="stat"><div className="stat-value">24h</div><div className="stat-label">Non-Stop Hacking</div></div>
              <div className={styles.heroStatDivider} />
              <div className="stat"><div className="stat-value">5</div><div className="stat-label">Innovation Tracks</div></div>
              <div className={styles.heroStatDivider} />
              <div className="stat"><div className="stat-value">2–4</div><div className="stat-label">Team Size</div></div>
            </div>
          </div>
        </section>

        {/* ═══════════════ ABOUT ═══════════════ */}
        <section className="section" id="about">
          <div className="container">
            <div className="section-header">
              <span className="badge badge-primary">About The Event</span>
              <h2 className="heading-lg">More Than Just a Hackathon</h2>
              <div className="divider" />
              <p>An immersive experience where innovation meets sustainability, and ideas transform into impactful solutions.</p>
            </div>
            <div className={`grid grid-3 ${styles.aboutGrid}`}>
              <div className="card card-interactive">
                <div className={styles.aboutIcon} style={{ background: 'linear-gradient(135deg, var(--primary-500), var(--primary-700))' }}>
                  <Icons.Globe />
                </div>
                <h3 className="heading-sm" style={{ marginTop: 20 }}>National Level</h3>
                <p className="text-muted" style={{ marginTop: 8 }}>Open to students from every recognized institution across India. Diverse teams. Diverse ideas.</p>
              </div>
              <div className="card card-interactive">
                <div className={styles.aboutIcon} style={{ background: 'linear-gradient(135deg, var(--accent-500), var(--accent-700))' }}>
                  <Icons.Clock />
                </div>
                <h3 className="heading-sm" style={{ marginTop: 20 }}>24 Hours Non-Stop</h3>
                <p className="text-muted" style={{ marginTop: 8 }}>A full day of building, learning, mentoring, and pushing your limits alongside the best minds.</p>
              </div>
              <div className="card card-interactive">
                <div className={styles.aboutIcon} style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
                  <Icons.Shield />
                </div>
                <h3 className="heading-sm" style={{ marginTop: 20 }}>100% Digital</h3>
                <p className="text-muted" style={{ marginTop: 8 }}>Paperless registration, digital passes, QR-based check-in, and automated judging. Zero friction.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ TRACKS ═══════════════ */}
        <section className="section section-alt" id="tracks">
          <div className="container">
            <div className="section-header">
              <span className="badge badge-accent">Innovation Tracks</span>
              <h2 className="heading-lg">Choose Your Arena</h2>
              <div className="divider" />
              <p>Five carefully curated tracks to channel your creativity. Pick the one that ignites your passion.</p>
            </div>
            <div className={`grid grid-5 ${styles.tracksGrid}`}>
              {TRACKS.map((track, i) => (
                <div key={i} className={`card card-interactive ${styles.trackCard}`}>
                  <div className={styles.trackIcon} style={{ color: track.color }}>
                    <track.icon />
                  </div>
                  <h3 className="heading-sm" style={{ marginTop: 16 }}>{track.title}</h3>
                  <p className="text-sm text-muted" style={{ marginTop: 8 }}>{track.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ TIMELINE ═══════════════ */}
        <section className="section" id="timeline">
          <div className="container">
            <div className="section-header">
              <span className="badge badge-primary">Event Timeline</span>
              <h2 className="heading-lg">The Journey</h2>
              <div className="divider" />
              <p>From registration to results — here's how the hackathon unfolds.</p>
            </div>
            <div className={styles.timeline}>
              {TIMELINE.map((item, i) => (
                <div key={i} className={styles.timelineItem}>
                  <div className={styles.timelineDot}>
                    <span className={styles.timelineDotInner} />
                  </div>
                  <div className={styles.timelineContent}>
                    <span className={styles.timelineDate}>{item.date}</span>
                    <h4 className="heading-sm">{item.title}</h4>
                    <p className="text-sm text-muted" style={{ marginTop: 4 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ PRIZES ═══════════════ */}
        <section className="section section-alt" id="prizes">
          <div className="container">
            <div className="section-header">
              <span className="badge badge-accent">Rewards</span>
              <h2 className="heading-lg">Prize Pool — ₹1,00,000</h2>
              <div className="divider" />
              <p>Outstanding work deserves outstanding recognition. Here's what's at stake.</p>
            </div>
            <div className={`grid grid-3 ${styles.prizeGrid}`}>
              {/* 2nd Place */}
              <div className={`card card-interactive ${styles.prizeCard}`} style={{ alignSelf: 'end' }}>
                <div className={styles.prizeRank} style={{ background: 'linear-gradient(135deg, #94a3b8, #64748b)' }}>
                  <Icons.Award />
                </div>
                <div className={styles.prizeMedal}>🥈</div>
                <h3 className="heading-sm">2nd Place</h3>
                <div className={styles.prizeAmount}>₹25,000</div>
                <p className="text-sm text-muted">Runner up team receives cash prize, certificates, and sponsor goodies.</p>
              </div>
              {/* 1st Place */}
              <div className={`card card-interactive ${styles.prizeCard} ${styles.prizeCardMain}`}>
                <div className={styles.prizeRank} style={{ background: 'linear-gradient(135deg, var(--accent-400), var(--accent-600))' }}>
                  <Icons.Trophy />
                </div>
                <div className={styles.prizeMedal}>🏆</div>
                <h3 className="heading-md">Grand Winner</h3>
                <div className={styles.prizeAmount} style={{ fontSize: '2.5rem' }}>₹50,000</div>
                <p className="text-sm text-muted">The winning team takes home the grand prize, a trophy, certificates, and exclusive opportunities.</p>
              </div>
              {/* 3rd Place */}
              <div className={`card card-interactive ${styles.prizeCard}`} style={{ alignSelf: 'end' }}>
                <div className={styles.prizeRank} style={{ background: 'linear-gradient(135deg, #c68a54, #92622d)' }}>
                  <Icons.Award />
                </div>
                <div className={styles.prizeMedal}>🥉</div>
                <h3 className="heading-sm">3rd Place</h3>
                <div className={styles.prizeAmount}>₹15,000</div>
                <p className="text-sm text-muted">Second runner up team receives cash prize, certificates, and sponsor goodies.</p>
              </div>
            </div>
            <p className="text-sm text-muted" style={{ textAlign: 'center', marginTop: 32 }}>
              + ₹10,000 in track-specific and special category awards
            </p>
          </div>
        </section>

        {/* ═══════════════ RULES ═══════════════ */}
        <section className="section" id="rules">
          <div className="container">
            <div className="section-header">
              <span className="badge badge-primary">Guidelines</span>
              <h2 className="heading-lg">Rules & Code of Conduct</h2>
              <div className="divider" />
              <p>Fair play ensures everyone has an equal chance. Please read carefully.</p>
            </div>
            <div className={styles.rulesContainer}>
              {RULES.map((rule, i) => (
                <div key={i} className={styles.ruleItem}>
                  <div className={styles.ruleNumber}>{String(i + 1).padStart(2, '0')}</div>
                  <p>{rule}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ FAQ ═══════════════ */}
        <section className="section section-alt" id="faq">
          <div className="container">
            <div className="section-header">
              <span className="badge badge-accent">Got Questions?</span>
              <h2 className="heading-lg">Frequently Asked Questions</h2>
              <div className="divider" />
            </div>
            <div className={styles.faqList}>
              {FAQS.map((faq, i) => (
                <div key={i} className={`${styles.faqItem} ${openFaq === i ? styles.faqOpen : ''}`}>
                  <button className={styles.faqQuestion} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    <span>{faq.q}</span>
                    <span className={`${styles.faqChevron} ${openFaq === i ? styles.faqChevronOpen : ''}`}>
                      <Icons.ChevronDown />
                    </span>
                  </button>
                  <div className={styles.faqAnswer} style={{ maxHeight: openFaq === i ? 200 : 0 }}>
                    <p>{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ VENUE ═══════════════ */}
        <section className="section" id="venue">
          <div className="container">
            <div className="section-header">
              <span className="badge badge-primary">Location</span>
              <h2 className="heading-lg">Venue</h2>
              <div className="divider" />
            </div>
            <div className={`card ${styles.venueCard}`}>
              <div className={styles.venueInfo}>
                <h3 className="heading-md">East West Institute of Technology</h3>
                <p className="text-muted" style={{ marginTop: 8 }}>Anjananagar, Bengaluru, Karnataka 560091</p>
                <div className={styles.venueFeatures}>
                  <div className={styles.venueFeature}><Icons.Check /> High-speed Wi-Fi</div>
                  <div className={styles.venueFeature}><Icons.Check /> 24/7 Power Backup</div>
                  <div className={styles.venueFeature}><Icons.Check /> Meals & Refreshments</div>
                  <div className={styles.venueFeature}><Icons.Check /> Dedicated Hacking Zones</div>
                  <div className={styles.venueFeature}><Icons.Check /> Mentoring Rooms</div>
                  <div className={styles.venueFeature}><Icons.Check /> Rest Areas</div>
                </div>
              </div>
              <div className={styles.venueMap}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.3!2d77.53!3d12.94!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU2JzI0LjAiTiA3N8KwMzEnNDguMCJF!5e0!3m2!1sen!2sin!4v1"
                  width="100%"
                  height="100%"
                  style={{ border: 0, borderRadius: 'var(--border-radius-md)' }}
                  allowFullScreen=""
                  loading="lazy"
                  title="EWIT Location"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ REGISTER CTA ═══════════════ */}
        <section className={styles.ctaSection} id="register">
          <div className={styles.ctaBg}>
            <div className={styles.ctaOrb1} />
            <div className={styles.ctaOrb2} />
          </div>
          <div className={`container ${styles.ctaContent}`}>
            <span className="badge badge-accent">Registrations Open</span>
            <h2 className="heading-lg" style={{ color: 'white', marginTop: 16 }}>Ready to Build the Future?</h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: 500, margin: '16px auto 0', fontSize: '1.1rem' }}>
              Register now, form your team, and get ready for 24 hours of innovation.
            </p>
            <div style={{ marginTop: 32, display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="/register" className="btn btn-accent btn-lg">Create Account</a>
              <a href="/login" className="btn btn-secondary btn-lg" style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'white' }}>Login to Dashboard</a>
            </div>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)', marginTop: 16 }}>
              ₹1,000 per team · 2–4 members · Payment via Razorpay
            </p>
          </div>
        </section>

        {/* ═══════════════ CONTACT ═══════════════ */}
        <section className="section" id="contact">
          <div className="container">
            <div className="section-header">
              <span className="badge badge-primary">Get in Touch</span>
              <h2 className="heading-lg">Contact Us</h2>
              <div className="divider" />
              <p>Have questions? Reach out to us and we'll respond as soon as possible.</p>
            </div>
            <div className={`grid grid-3 ${styles.contactGrid}`}>
              <div className="card" style={{ textAlign: 'center' }}>
                <div className={styles.contactIcon}><Icons.Mail /></div>
                <h4 className="heading-sm" style={{ marginTop: 16 }}>Email</h4>
                <p className="text-muted" style={{ marginTop: 8 }}>hackathon@ewit.edu.in</p>
              </div>
              <div className="card" style={{ textAlign: 'center' }}>
                <div className={styles.contactIcon}><Icons.Phone /></div>
                <h4 className="heading-sm" style={{ marginTop: 16 }}>Phone</h4>
                <p className="text-muted" style={{ marginTop: 8 }}>+91 98765 43210</p>
              </div>
              <div className="card" style={{ textAlign: 'center' }}>
                <div className={styles.contactIcon}><Icons.MapPin /></div>
                <h4 className="heading-sm" style={{ marginTop: 16 }}>Address</h4>
                <p className="text-muted" style={{ marginTop: 8 }}>EWIT, Anjananagar, Bengaluru, Karnataka 560091</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerInner}>
            <div className={styles.footerBrand}>
              <a href="#" className={styles.logo}>
                <span className={styles.logoIcon}>⬡</span>
                <div>
                  <span className={styles.logoText}>EWIT</span>
                  <span className={styles.logoSub}>Hackathon '26</span>
                </div>
              </a>
              <p className="text-sm text-muted" style={{ marginTop: 12, maxWidth: 320 }}>
                A National Level 24-Hour Hackathon by East West Institute of Technology. Building a sustainable future through innovation.
              </p>
            </div>
            <div className={styles.footerLinks}>
              <div>
                <h5 style={{ fontWeight: 600, marginBottom: 12 }}>Event</h5>
                <a href="#about">About</a>
                <a href="#tracks">Tracks</a>
                <a href="#timeline">Timeline</a>
                <a href="#prizes">Prizes</a>
              </div>
              <div>
                <h5 style={{ fontWeight: 600, marginBottom: 12 }}>Resources</h5>
                <a href="#rules">Rules</a>
                <a href="#faq">FAQ</a>
                <a href="#venue">Venue</a>
                <a href="#contact">Contact</a>
              </div>
              <div>
                <h5 style={{ fontWeight: 600, marginBottom: 12 }}>Portal</h5>
                <a href="/register">Register</a>
                <a href="/login">Login</a>
                <a href="/dashboard">Dashboard</a>
              </div>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p className="text-sm text-muted">© 2026 East West Institute of Technology. All rights reserved.</p>
            <p className="text-sm text-muted">Earth & Innovation — Hackathon Management Platform</p>
          </div>
        </div>
      </footer>
    </>
  );
}
