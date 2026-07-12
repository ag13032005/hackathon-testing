'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

export default function EventModeSettingsPage() {
  const [eventMode, setEventMode] = useState('REGISTRATION_OPEN');
  const [mockPayment, setMockPayment] = useState(true);
  const [teamSizeMin, setTeamSizeMin] = useState(2);
  const [teamSizeMax, setTeamSizeMax] = useState(4);
  const [fee, setFee] = useState(1000);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Load initial settings
    const savedMode = localStorage.getItem('ewit_event_mode') || 'REGISTRATION_OPEN';
    const savedMockPay = localStorage.getItem('ewit_mock_payment') !== 'false';
    setEventMode(savedMode);
    setMockPayment(savedMockPay);
  }, []);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    localStorage.setItem('ewit_event_mode', eventMode);
    localStorage.setItem('ewit_mock_payment', String(mockPayment));
    setIsSaved(true);
    
    setTimeout(() => {
      setIsSaved(false);
    }, 2000);

    alert('System settings updated successfully!');
  };

  const EVENT_MODES = [
    { key: 'PRE_REGISTRATION', label: 'Pre Registration', desc: 'Landing website live, registration forms closed.' },
    { key: 'REGISTRATION_OPEN', label: 'Registration Open', desc: 'Allows registrations, team creation, and payments.' },
    { key: 'REGISTRATION_CLOSED', label: 'Registration Closed', desc: 'Disables new signups, locks unfinalized teams.' },
    { key: 'PAYMENT_VERIFICATION', label: 'Payment Verification', desc: 'Finalizing pending Razorpay exceptions.' },
    { key: 'EVENT_DAY', label: 'Event Day / Check-In', desc: 'QR scanning activated for attendance and check-in.' },
    { key: 'ROUND_1', label: 'Round 1 (Ideation)', desc: 'Judging scorecards open for initial concept evaluation.' },
    { key: 'DEVELOPMENT_PHASE', label: 'Development Phase', desc: 'Coding active. Participants submit Github repositories.' },
    { key: 'ROUND_2', label: 'Round 2 (Prototype)', desc: 'Judging scorecards open for working model review.' },
    { key: 'FINAL_ROUND', label: 'Final Round', desc: 'Top 10 teams pitch. Scoring open for Grand Prizes.' },
    { key: 'RESULT_PROCESSING', label: 'Result Processing', desc: 'Scores locked. Admins audit final ranks.' },
    { key: 'CERTIFICATES', label: 'Certificates & Wrap-up', desc: 'Digital certificates activated for downloads.' },
    { key: 'ARCHIVE', label: 'Archive', desc: 'Data frozen, read-only mode for historical lookup.' }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.settingsGrid}>
        
        {/* Main Settings Form */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Global System Configurations</h2>
          <p className={styles.cardSubtitle}>Set constraints, payment configurations, and global constants.</p>
          
          <form onSubmit={handleSaveSettings} className={styles.form}>
            
            {/* Razorpay Mock Toggle */}
            <div className={styles.toggleRow}>
              <div className={styles.toggleLabel}>
                <strong>Razorpay Sandbox Mode</strong>
                <span>Allows checking out teams using mock signatures (Testing only).</span>
              </div>
              <input
                type="checkbox"
                checked={mockPayment}
                onChange={(e) => setMockPayment(e.target.checked)}
                className={styles.toggleSwitch}
              />
            </div>

            {/* Constraints */}
            <div className={styles.formGrid}>
              <div className="form-group">
                <label className="form-label" htmlFor="minSize">Minimum Team Size</label>
                <input
                  type="number"
                  id="minSize"
                  value={teamSizeMin}
                  onChange={(e) => setTeamSizeMin(parseInt(e.target.value) || 2)}
                  className="form-input"
                  min="1"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="maxSize">Maximum Team Size</label>
                <input
                  type="number"
                  id="maxSize"
                  value={teamSizeMax}
                  onChange={(e) => setTeamSizeMax(parseInt(e.target.value) || 4)}
                  className="form-input"
                  min="1"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="fee">Registration Fee (₹)</label>
                <input
                  type="number"
                  id="fee"
                  value={fee}
                  onChange={(e) => setFee(parseInt(e.target.value) || 1000)}
                  className="form-input"
                  min="0"
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '12px' }}>
              Save Core Settings
            </button>

            {isSaved && <div className={styles.successToast}>Core Configuration Synced!</div>}
          </form>
        </div>

        {/* Phase Settings Selector */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Active Event Phase</h2>
          <p className={styles.cardSubtitle}>Directly configures system actions based on active event stage.</p>
          
          <div className={styles.modesContainer}>
            {EVENT_MODES.map(mode => {
              const isSelected = eventMode === mode.key;
              return (
                <button
                  key={mode.key}
                  onClick={() => { setEventMode(mode.key); localStorage.setItem('ewit_event_mode', mode.key); }}
                  className={`${styles.modeButton} ${isSelected ? styles.modeActive : ''}`}
                >
                  <div className={styles.modeCheck}>{isSelected ? '✓' : ''}</div>
                  <div className={styles.modeInfo}>
                    <strong>{mode.label}</strong>
                    <span>{mode.desc}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
