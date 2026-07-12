'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function BackupsPage() {
  const [backups, setBackups] = useState([
    { id: 1, filename: 'ewit_hackathon_backup_2026_07_12.sql', size: '1.24 GB', date: 'Jul 12, 2026 11:30 PM', type: 'Auto Snapshot', status: 'Success' },
    { id: 2, filename: 'ewit_hackathon_backup_2026_07_11.sql', size: '1.21 GB', date: 'Jul 11, 2026 11:30 PM', type: 'Auto Snapshot', status: 'Success' },
    { id: 3, filename: 'ewit_hackathon_setup_final.sql', size: '245 MB', date: 'Jul 05, 2026 04:15 PM', type: 'Manual Backup', status: 'Success' }
  ]);

  const [loading, setLoading] = useState(false);
  const [dbStatus, setDbStatus] = useState('DATABASE: ONLINE (99.9% health, 24 active pools)');

  const handleCreateBackup = () => {
    setLoading(true);
    
    setTimeout(() => {
      const newBackup = {
        id: Date.now(),
        filename: `ewit_hackathon_backup_manual_${Math.random().toString(36).substring(2, 6)}.sql`,
        size: '1.25 GB',
        date: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }),
        type: 'Manual Backup',
        status: 'Success'
      };

      setBackups(prev => [newBackup, ...prev]);
      setLoading(false);
      alert('PostgreSQL database backup snapshot created successfully!');
    }, 2000);
  };

  const handleRestore = (filename) => {
    if (confirm(`CRITICAL WARNING: Restoring backup "${filename}" will overwrite all current participant tables. Are you sure you want to proceed?`)) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        alert('Database tables restored successfully from backup ' + filename);
      }, 3000);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.backGrid}>
        
        {/* Operations Control Desk */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>PostgreSQL Backup Operations</h2>
          <p className={styles.cardSubtitle}>Trigger snapshots, verify tables checksums, and manage recovery points.</p>
          
          <div className={styles.dbStatusBox}>
            <span className={styles.statusDot}></span>
            <strong>{dbStatus}</strong>
          </div>

          <div className={styles.actionButtons}>
            <button
              onClick={handleCreateBackup}
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%' }}
            >
              {loading ? 'Creating snapshot...' : '📷 Create Instant Backup Snapshot'}
            </button>

            <button
              onClick={() => {
                setLoading(true);
                setTimeout(() => {
                  setLoading(false);
                  setDbStatus('DATABASE: ONLINE (100% health, 0 locks, 0 corruptions)');
                  alert('Database integrity check completed. All tables healthy.');
                }, 1500);
              }}
              className="btn btn-secondary"
              disabled={loading}
              style={{ width: '100%' }}
            >
              🩺 Check Database Health Integrity
            </button>
          </div>
          
          {loading && (
            <div className={styles.spinnerRow}>
              <div className={styles.spinner}></div>
              <span>Processing database transaction...</span>
            </div>
          )}
        </div>

        {/* Backups logs */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Backup Snapshot Repositories</h2>
          <p className={styles.cardSubtitle}>List of recovery snapshots available for system restorals.</p>
          
          <div className={styles.backupsList}>
            {backups.map(b => (
              <div key={b.id} className={styles.backupItem}>
                <div className={styles.backupHeader}>
                  <strong className={styles.filename}>{b.filename}</strong>
                  <span className={styles.size}>{b.size}</span>
                </div>
                <div className={styles.backupMeta}>
                  <span>{b.date} · {b.type}</span>
                  <span className={styles.successLabel}>{b.status}</span>
                </div>
                <div className={styles.backupActions}>
                  <button onClick={() => alert('Download initiated for ' + b.filename)} className="btn btn-secondary btn-sm" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                    📥 Download SQL
                  </button>
                  <button onClick={() => handleRestore(b.filename)} className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)', padding: '4px 10px', fontSize: '0.75rem' }}>
                    ↺ Restore Snapshot
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
