'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function HodReportsPage() {
  const [loading, setLoading] = useState(false);

  const triggerDownload = (reportName) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert(`Report compilation completed! Downloaded file: ${reportName}`);
    }, 1500);
  };

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        
        {/* Reports Download desk */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Academic Reports Compiler</h2>
          <p className={styles.cardSubtitle}>Generate verified Excel/CSV spreadsheets directly from database tables.</p>
          
          <div className={styles.reportsSection}>
            <div className={styles.reportRow}>
              <div className={styles.reportInfo}>
                <strong>Participant Check-In Sheets</strong>
                <span>CSV list containing USN, check-in timestamps, and registration statuses.</span>
              </div>
              <button
                onClick={() => triggerDownload('ewit_checkin_sheets_2026.csv')}
                className="btn btn-secondary btn-sm"
                disabled={loading}
              >
                Compile & Export
              </button>
            </div>

            <div className={styles.reportRow}>
              <div className={styles.reportInfo}>
                <strong>Track Leaderboards Ranking</strong>
                <span>Scoring lists including innovation and technical complexity scorecard statistics.</span>
              </div>
              <button
                onClick={() => triggerDownload('ewit_scoring_ranks_2026.csv')}
                className="btn btn-secondary btn-sm"
                disabled={loading}
              >
                Compile & Export
              </button>
            </div>

            <div className={styles.reportRow}>
              <div className={styles.reportInfo}>
                <strong>Meal & Kit Redemption Logs</strong>
                <span>Verified counts of redeemed digital coupons by food coordinators.</span>
              </div>
              <button
                onClick={() => triggerDownload('ewit_coupon_redemptions_2026.csv')}
                className="btn btn-secondary btn-sm"
                disabled={loading}
              >
                Compile & Export
              </button>
            </div>
          </div>

          {loading && (
            <div className={styles.loadingRow}>
              <div className={styles.spinner}></div>
              <span>Processing export request...</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
