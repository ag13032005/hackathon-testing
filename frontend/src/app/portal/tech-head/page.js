'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

export default function TechHeadDashboard() {
  // Mock live data that administrators need to monitor
  const [analytics, setAnalytics] = useState({
    registeredParticipants: 342,
    approvedParticipants: 296,
    pendingRegistrations: 40,
    rejectedRegistrations: 6,
    teamsFormed: 98,
    teamsLocked: 84,
    checkedIn: 210,
    qrScans: 1042,
    judgingProgress: 65,
    systemHealth: '100%',
    activeMode: 'REGISTRATION_OPEN'
  });

  const [activeMode, setActiveMode] = useState('REGISTRATION_OPEN');
  const [backupStatus, setBackupStatus] = useState('');
  const [logs, setLogs] = useState([]);

  // Mock Event Modes
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

  // Helper to add audit logs
  const logAction = (action, details) => {
    const newLog = {
      timestamp: new Date().toLocaleTimeString(),
      action,
      details
    };
    setLogs(prev => [newLog, ...prev.slice(0, 9)]);
  };

  useEffect(() => {
    logAction('System Init', 'Tech Head dashboard panel loaded successfully.');
  }, []);

  const handleModeChange = (modeKey) => {
    setActiveMode(modeKey);
    setAnalytics(prev => ({ ...prev, activeMode: modeKey }));
    logAction('Change Event Mode', `Active event mode updated to: ${modeKey}`);
  };

  const handleBackup = () => {
    setBackupStatus('Backing up Database...');
    logAction('Database Backup', 'System backup initiated manually by Super Admin.');
    
    setTimeout(() => {
      setBackupStatus('Backup Completed! (ewit_backup_2026.sql)');
      logAction('Database Backup', 'Backup file ewit_backup_2026.sql uploaded to secure store.');
    }, 2000);
  };

  return (
    <div className={styles.container}>
      {/* ─── Page Heading ─── */}
      <div className={styles.headingRow}>
        <div>
          <h1 className={styles.title}>System Analytics</h1>
          <p className={styles.subtitle}>Overview of the 24-Hour National Hackathon dashboard operations.</p>
        </div>
        <div className={styles.systemMetric}>
          <div className={styles.metricItem}>
            <span className={styles.metricLabel}>System Health</span>
            <span className={styles.metricValOk}>{analytics.systemHealth}</span>
          </div>
          <div className={styles.metricDivider} />
          <div className={styles.metricItem}>
            <span className={styles.metricLabel}>DB Connections</span>
            <span className={styles.metricValOk}>Active (Postgres)</span>
          </div>
        </div>
      </div>

      {/* ─── Analytics Grid ─── */}
      <div className={styles.analyticsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>👥</div>
          <div className={styles.statInfo}>
            <span className={styles.statNum}>{analytics.registeredParticipants}</span>
            <span className={styles.statLabel}>Registered Users</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>✓</div>
          <div className={styles.statInfo}>
            <span className={styles.statNum}>{analytics.approvedParticipants}</span>
            <span className={styles.statLabel}>Approved (Paid)</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>⏳</div>
          <div className={styles.statInfo}>
            <span className={styles.statNum}>{analytics.pendingRegistrations}</span>
            <span className={styles.statLabel}>Pending Verification</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>🛡️</div>
          <div className={styles.statInfo}>
            <span className={styles.statNum}>{analytics.teamsFormed}</span>
            <span className={styles.statLabel}>Teams Formed</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>🔒</div>
          <div className={styles.statInfo}>
            <span className={styles.statNum}>{analytics.teamsLocked}</span>
            <span className={styles.statLabel}>Locked Teams</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>🎫</div>
          <div className={styles.statInfo}>
            <span className={styles.statNum}>{analytics.checkedIn}</span>
            <span className={styles.statLabel}>Checked In</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>🖨️</div>
          <div className={styles.statInfo}>
            <span className={styles.statNum}>{analytics.qrScans}</span>
            <span className={styles.statLabel}>Total QR Scans</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>⚖️</div>
          <div className={styles.statInfo}>
            <span className={styles.statNum}>{analytics.judgingProgress}%</span>
            <span className={styles.statLabel}>Judging Done</span>
          </div>
        </div>
      </div>

      {/* ─── Control Center & Actions ─── */}
      <div className={styles.controlGrid}>
        
        {/* Event Mode Control Panel */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Event Phase Manager</h2>
          <p className={styles.cardSubtitle}>Directly configures the platform modes and active state permissions.</p>
          
          <div className={styles.modeList}>
            {EVENT_MODES.map((mode) => {
              const isSelected = activeMode === mode.key;
              return (
                <button
                  key={mode.key}
                  className={`${styles.modeButton} ${isSelected ? styles.modeActive : ''}`}
                  onClick={() => handleModeChange(mode.key)}
                >
                  <div className={styles.modeCheck}>
                    {isSelected ? '●' : '○'}
                  </div>
                  <div className={styles.modeText}>
                    <div className={styles.modeName}>{mode.label}</div>
                    <div className={styles.modeDesc}>{mode.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Configuration Actions & Audit Logs */}
        <div className={styles.configColumn}>
          {/* System Control Panel */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Super Admin Operations</h2>
            <p className={styles.cardSubtitle}>Sensitive configuration overrides and maintenance tasks.</p>
            
            <div className={styles.actionButtons}>
              <button onClick={handleBackup} className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                📁 Backup Postgres Database
              </button>
              <button onClick={() => logAction('Trigger Diagnostics', 'System diagnostic scripts completed with 0 warnings.')} className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                🩺 Run System Health Diagnostics
              </button>
              <button onClick={() => logAction('Generate Certificates', 'Digital certificates batch generation started.')} className="btn btn-primary" style={{ justifyContent: 'flex-start' }}>
                🎓 Batch Generate Certificates
              </button>
            </div>
            
            {backupStatus && <div className={styles.statusToast}>{backupStatus}</div>}
          </div>

          {/* Audit Logs */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Live Audit Logs</h2>
            <p className={styles.cardSubtitle}>Real-time logs of system operations (Role-Based Access).</p>
            
            <div className={styles.logList}>
              {logs.length === 0 ? (
                <div className={styles.emptyLogs}>No recent actions recorded.</div>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className={styles.logItem}>
                    <div className={styles.logMeta}>
                      <span className={styles.logTime}>{log.timestamp}</span>
                      <span className={styles.logTag}>{log.action}</span>
                    </div>
                    <div className={styles.logDetails}>{log.details}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
