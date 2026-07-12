'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function JudgeTeamsPage() {
  const [teams] = useState([
    {
      id: 1,
      name: 'EcoCoders',
      track: 'Sustainability & Green Tech',
      problem: 'Developing a zero-loss composting monitoring device using gas sensors and local IoT hubs.',
      github: 'https://github.com/example/ecocoders',
      presentation: 'https://docs.google.com/presentation/d/example',
      prototype: 'https://ecocoders-proto.ewit.edu.in',
      status: 'GRADED',
      leader: 'Deepak Kumar'
    },
    {
      id: 2,
      name: 'AquaTrack',
      track: 'Sustainability & Green Tech',
      problem: 'Smart water leakage locator in municipal distribution lines using acoustical noise sensors.',
      github: 'https://github.com/example/aquatrack',
      presentation: 'https://docs.google.com/presentation/d/example2',
      prototype: 'https://aquatrack-proto.ewit.edu.in',
      status: 'PENDING',
      leader: 'Meghana R'
    }
  ]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Assigned Teams</h2>
        <p className={styles.cardSubtitle}>List of teams assigned to your evaluation panel. Click links to review submissions.</p>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Team Name</th>
                <th>Leader</th>
                <th>Innovation Track</th>
                <th>Review Submissions</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {teams.map(team => (
                <tr key={team.id}>
                  <td><strong>{team.name}</strong></td>
                  <td>{team.leader}</td>
                  <td><span className={styles.trackBadge}>{team.track}</span></td>
                  <td>
                    <div className={styles.linksGrid}>
                      <a href={team.github} target="_blank" rel="noopener noreferrer" className={styles.link}>GitHub</a>
                      <span className={styles.divider}>|</span>
                      <a href={team.presentation} target="_blank" rel="noopener noreferrer" className={styles.link}>Slides</a>
                      <span className={styles.divider}>|</span>
                      <a href={team.prototype} target="_blank" rel="noopener noreferrer" className={styles.link}>Prototype</a>
                    </div>
                  </td>
                  <td>
                    <span className={team.status === 'GRADED' ? styles.gradedBadge : styles.pendingBadge}>
                      {team.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
