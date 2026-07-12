'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    college: 'East West Institute of Technology',
    usn: '',
    branch: '',
    semester: '1',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
    participationMode: 'teamed'
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!formData.agreeTerms) {
      setError('You must agree to the Terms & Conditions');
      return;
    }

    setLoading(true);

    try {
      // Simulate API call for registration
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Store in local storage for mock authentication testing
      const existingUsers = JSON.parse(localStorage.getItem('ewit_mock_users') || '[]');
      const userExists = existingUsers.some(u => u.email.toLowerCase() === formData.email.toLowerCase());
      
      if (userExists || formData.email.toLowerCase() === 'echoplayzop@gmail.com') {
        setError('Email address is already registered');
        setLoading(false);
        return;
      }

      const newUser = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        college: formData.college,
        usn: formData.usn,
        branch: formData.branch,
        semester: formData.semester,
        password: formData.password,
        role: 'PARTICIPANT',
        participationMode: formData.participationMode,
        createdAt: new Date().toISOString()
      };

      existingUsers.push(newUser);
      localStorage.setItem('ewit_mock_users', JSON.stringify(existingUsers));

      setSuccess(true);
      setLoading(false);

      // Auto login and redirect to dashboard
      setTimeout(() => {
        localStorage.setItem('ewit_current_user', JSON.stringify(newUser));
        router.push('/portal/participant');
      }, 1500);

    } catch (err) {
      setError('An error occurred during registration. Please try again.');
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
          <span className={styles.badge}>Earth & Innovation</span>
          <h2 className={styles.heading}>Empower Your Ideas to Heal the Planet</h2>
          <p className={styles.subtext}>
            Join India's premium 24-hour national hackathon. Collaborate, innovate, and code solutions for sustainability, IoT, and AI.
          </p>
          
          <div className={styles.features}>
            <div className={styles.featureItem}>
              <span className={styles.checkIcon}>✓</span>
              <span>₹1,00,000 Grand Prize Pool</span>
            </div>
            <div className={styles.featureItem}>
              <span className={styles.checkIcon}>✓</span>
              <span>Exclusive Industry Mentorship</span>
            </div>
            <div className={styles.featureItem}>
              <span className={styles.checkIcon}>✓</span>
              <span>Fully Digital QR Event Pass & Coupons</span>
            </div>
          </div>
        </div>
        
        <div className={styles.footerText}>
          © 2026 East West Institute of Technology
        </div>
      </div>

      <div className={styles.rightPanel}>
        <div className={styles.formCard}>
          <div className={styles.formHeader}>
            <h1 className={styles.title}>Participant Registration</h1>
            <p className={styles.subtitle}>Create your individual account. Afterwards, you can join or form a team.</p>
          </div>

          {error && <div className={styles.errorMessage}>{error}</div>}
          {success && (
            <div className={styles.successMessage}>
              Registration Successful! Logging you in...
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGrid}>
              <div className="form-group">
                <label className="form-label" htmlFor="fullName">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="form-input"
                  required
                  disabled={loading || success}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="form-input"
                  required
                  disabled={loading || success}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="9876543210"
                  className="form-input"
                  required
                  disabled={loading || success}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="college">College Name</label>
                <input
                  type="text"
                  id="college"
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  placeholder="East West Institute of Technology"
                  className="form-input"
                  required
                  disabled={loading || success}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="usn">USN / Roll Number</label>
                <input
                  type="text"
                  id="usn"
                  name="usn"
                  value={formData.usn}
                  onChange={handleChange}
                  placeholder="1EW22CS001"
                  className="form-input"
                  required
                  disabled={loading || success}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="branch">Branch / Department</label>
                <input
                  type="text"
                  id="branch"
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  placeholder="Computer Science"
                  className="form-input"
                  required
                  disabled={loading || success}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="semester">Current Semester</label>
                <select
                  id="semester"
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  className="form-input"
                  required
                  disabled={loading || success}
                >
                  <option value="1">1st Semester</option>
                  <option value="2">2nd Semester</option>
                  <option value="3">3rd Semester</option>
                  <option value="4">4th Semester</option>
                  <option value="5">5th Semester</option>
                  <option value="6">6th Semester</option>
                  <option value="7">7th Semester</option>
                  <option value="8">8th Semester</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="participationMode">Participation Mode</label>
                <select
                  id="participationMode"
                  name="participationMode"
                  value={formData.participationMode}
                  onChange={handleChange}
                  className="form-input"
                  required
                  disabled={loading || success}
                >
                  <option value="teamed">Teamed (Form/Join a Team)</option>
                  <option value="solo">Solo (Hack Individually)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="form-input"
                  required
                  minLength={6}
                  disabled={loading || success}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="form-input"
                  required
                  disabled={loading || success}
                />
              </div>
            </div>

            <div className={styles.checkboxGroup}>
              <input
                type="checkbox"
                id="agreeTerms"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className={styles.checkbox}
                required
                disabled={loading || success}
              />
              <label htmlFor="agreeTerms" className={styles.checkboxLabel}>
                I agree to the <a href="#rules" className={styles.link}>rules and regulations</a> of the hackathon and confirm that all details are accurate.
              </label>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '16px' }}
              disabled={loading || success}
            >
              {loading ? 'Creating Account...' : 'Register & Log In'}
            </button>
          </form>

          <div className={styles.loginCta}>
            Already have an account? <Link href="/login" className={styles.link}>Login to Dashboard</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
