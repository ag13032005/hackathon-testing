'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function HodAnalyticsPage() {
  const [deptStats] = useState([
    { dept: 'Computer Science & Engineering', teams: 45, participants: 168, paid: 40 },
    { dept: 'Information Science & Engineering', teams: 32, participants: 118, paid: 28 },
    { dept: 'Electronics & Communication', teams: 15, participants: 52, paid: 12 },
    { dept: 'Mechanical Engineering', teams: 6, participants: 22, paid: 4 }
  ]);

  const [trackStats] = useState([
    { name: 'AI & Automation', count: 32, percentage: 33 },
    { name: 'Sustainability & Green Tech', count: 25, percentage: 26 },
    { name: 'Smart Cities & IoT', count: 18, percentage: 18 },
    { name: 'HealthTech & Wellness', count: 13, percentage: 13 },
    { name: 'Open Innovation', count: 10, percentage: 10 }
  ]);

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        
        {/* Departmental Registrations */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Department Wise Registrations</h2>
          <p className={styles.cardSubtitle}>Total participant breakdown across departments at East West Institute of Technology.</p>
          
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Teams Formed</th>
                  <th>Total Participants</th>
                  <th>Approved (Paid)</th>
                </tr>
              </thead>
              <tbody>
                {deptStats.map((stat, i) => (
                  <tr key={i}>
                    <td><strong>{stat.dept}</strong></td>
                    <td>{stat.teams}</td>
                    <td>{stat.participants}</td>
                    <td>{stat.paid}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Track Selection Stats */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Track Distribution</h2>
          <p className={styles.cardSubtitle}>Distribution of team allocations across the 5 innovation hackathon tracks.</p>
          
          <div className={styles.tracksStatsList}>
            {trackStats.map((track, i) => (
              <div key={i} className={styles.trackStatItem}>
                <div className={styles.trackMeta}>
                  <strong>{track.name}</strong>
                  <span>{track.count} Teams ({track.percentage}%)</span>
                </div>
                <div className={styles.progressBarBg}>
                  <div
                    className={styles.progressBarFill}
                    style={{ width: `${track.percentage}%`, background: 'var(--primary-500)' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
