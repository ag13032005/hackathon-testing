'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Pre-seed mock accounts to make development & evaluation extremely easy
  const MOCK_ACCOUNTS = [
    { email: 'echoplayzop@gmail.com', password: '8520147963', role: 'TECH_HEAD', name: 'Super Admin (Tech Head)' },
    { email: 'hod.cse@ewit.edu.in', password: 'password123', role: 'HOD', name: 'HOD (CSE Dept)' },
    { email: 'judge.ann@ewit.edu.in', password: 'password123', role: 'JUDGE', name: 'Dr. Ann (AI Track Judge)' },
    { email: 'coordinator.rahul@ewit.edu.in', password: 'password123', role: 'COORDINATOR', name: 'Rahul (Food Desk Coordinator)' },
    { email: 'participant.test@ewit.edu.in', password: 'password123', role: 'PARTICIPANT', name: 'Ananya (Solo Participant)' }
  ];

  const handleQuickLogin = (acc) => {
    setEmail(acc.email);
    setPassword(acc.password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Simulate API verification
      await new Promise(resolve => setTimeout(resolve, 1000));

      const lowercaseEmail = email.toLowerCase();
      
      // 1. Check development/pre-seeded accounts
      const matchedMock = MOCK_ACCOUNTS.find(
        acc => acc.email.toLowerCase() === lowercaseEmail && acc.password === password
      );

      let userToLog = null;

      if (matchedMock) {
        userToLog = {
          fullName: matchedMock.name,
          email: matchedMock.email,
          role: matchedMock.role,
          college: 'East West Institute of Technology'
        };
      } else {
        // 2. Check users created in localStorage
        const registeredUsers = JSON.parse(localStorage.getItem('ewit_mock_users') || '[]');
        const matchedLocal = registeredUsers.find(
          u => u.email.toLowerCase() === lowercaseEmail && u.password === password
        );

        if (matchedLocal) {
          userToLog = {
            fullName: matchedLocal.fullName,
            email: matchedLocal.email,
            role: matchedLocal.role,
            college: matchedLocal.college,
            usn: matchedLocal.usn,
            branch: matchedLocal.branch,
            semester: matchedLocal.semester
          };
        }
      }

      if (!userToLog) {
        setError('Invalid email or password');
        setLoading(false);
        return;
      }

      // Save logged in user state
      localStorage.setItem('ewit_current_user', JSON.stringify(userToLog));

      // Role based redirection
      switch (userToLog.role) {
        case 'TECH_HEAD':
          router.push('/portal/tech-head');
          break;
        case 'HOD':
          router.push('/portal/hod');
          break;
        case 'JUDGE':
          router.push('/portal/judge');
          break;
        case 'COORDINATOR':
          router.push('/portal/coordinator');
          break;
        case 'PARTICIPANT':
        default:
          router.push('/portal/participant');
          break;
      }

    } catch (err) {
      setError('An error occurred during authentication.');
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftPanel}>
        <div className={styles.logoContainer}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoIcon}>⬡</span>
            <div>
              <span className={styles.logoText}>EWIT</span>
              <span className={styles.logoSub}>Hackathon '26</span>
            </div>
          </Link>
        </div>

        <div className={styles.infoContent}>
          <span className={styles.badge}>Security & Access</span>
          <h2 className={styles.heading}>Unified Role-Based Portal</h2>
          <p className={styles.subtext}>
            Log in to access your dashboard. Your account determines your permissions automatically.
          </p>

          <div className={styles.roleIndicators}>
            <div className={styles.roleBadge}>Participants</div>
            <div className={styles.roleBadge}>Coordinators</div>
            <div className={styles.roleBadge}>Judges</div>
            <div className={styles.roleBadge}>HODs</div>
            <div className={styles.roleBadge}>Tech Heads</div>
          </div>
        </div>

        <div className={styles.footerText}>
          © 2026 East West Institute of Technology
        </div>
      </div>

      <div className={styles.rightPanel}>
        <div className={styles.formCard}>
          <div className={styles.formHeader}>
            <h1 className={styles.title}>Welcome Back</h1>
            <p className={styles.subtitle}>Enter your credentials to log into your workspace.</p>
          </div>

          {error && <div className={styles.errorMessage}>{error}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="echoplayzop@gmail.com"
                className="form-input"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <div className={styles.passwordLabelRow}>
                <label className="form-label" htmlFor="password">Password</label>
                <a href="#" className={styles.forgotLink}>Forgot Password?</a>
              </div>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="form-input"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '8px' }}
              disabled={loading}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          {/* Quick Login Assist Panel for Evaluation */}
          <div className={styles.quickAccessSection}>
            <h3 className={styles.quickAccessTitle}>Developer Quick Access</h3>
            <p className={styles.quickAccessSubtitle}>Click any account below to auto-fill credentials for testing each portal role:</p>
            <div className={styles.quickAccessGrid}>
              {MOCK_ACCOUNTS.filter(acc => acc.role !== 'TECH_HEAD').map((acc, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickLogin(acc)}
                  className={styles.quickAccessButton}
                  type="button"
                >
                  <span className={styles.quickAccessRole}>{acc.role.replace('_', ' ')}</span>
                  <span className={styles.quickAccessEmail}>{acc.email}</span>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.registerCta}>
            Don't have an account yet? <Link href="/register" className={styles.link}>Register individually</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
