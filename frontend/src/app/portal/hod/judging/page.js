'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

const DEFAULT_TEAMS = [
  {
    id: '1',
    name: 'EcoCoders',
    track: 'Sustainability & Green Tech',
    judge: 'Dr. Srinivas',
    scores: { innovation: 9, technical: 8, impact: 9, presentation: 8 },
    locked: true,
    lastUpdated: 'Jul 12, 10:45 PM'
  },
  {
    id: '2',
    name: 'AquaTrack',
    track: 'Sustainability & Green Tech',
    judge: 'Dr. Srinivas',
    scores: { innovation: 8, technical: 9, impact: 8, presentation: 9 },
    locked: true,
    lastUpdated: 'Jul 12, 11:15 PM'
  },
  {
    id: '3',
    name: 'NeuralHealth',
    track: 'HealthTech & Wellness',
    judge: 'Dr. Asha',
    scores: { innovation: 7, technical: 8, impact: 7, presentation: 8 },
    locked: true,
    lastUpdated: 'Jul 12, 11:30 PM'
  },
  {
    id: '4',
    name: 'IoT Traffic',
    track: 'Smart Cities & IoT',
    judge: 'Prof. Harish',
    scores: { innovation: 8, technical: 8, impact: 9, presentation: 9 },
    locked: true,
    lastUpdated: 'Jul 12, 11:45 PM'
  }
];

export default function HodJudgingPage() {
  const [judgeProgress] = useState([
    { track: 'AI & Automation', graded: 18, total: 24, progress: 75, leadJudge: 'Dr. Ann' },
    { track: 'Sustainability & Green Tech', graded: 20, total: 22, progress: 90, leadJudge: 'Dr. Srinivas' },
    { track: 'Smart Cities & IoT', graded: 9, total: 18, progress: 50, leadJudge: 'Prof. Harish' },
    { track: 'HealthTech & Wellness', graded: 3, total: 15, progress: 20, leadJudge: 'Dr. Asha' },
    { track: 'Open Innovation', graded: 12, total: 19, progress: 63, leadJudge: 'Prof. Ram' }
  ]);

  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('ewit_teams_scores');
    const teamsList = saved ? JSON.parse(saved) : DEFAULT_TEAMS;

    // Calculate averages and sort for leaderboard
    const computedLeaderboard = teamsList.map(t => {
      const avg = ((t.scores.innovation + t.scores.technical + t.scores.impact + t.scores.presentation) / 4);
      return {
        team: t.name,
        track: t.track,
        score: avg.toFixed(1)
      };
    });

    // Sort descending
    computedLeaderboard.sort((a, b) => parseFloat(b.score) - parseFloat(a.score));

    // Map ranks
    const rankedLeaderboard = computedLeaderboard.map((item, idx) => ({
      rank: idx + 1,
      ...item
    }));

    setLeaderboard(rankedLeaderboard);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        
        {/* Track Progression Overview */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Track Judging Progression</h2>
          <p className={styles.cardSubtitle}>Real-time monitoring of round scorecard locks by assigned panel judges.</p>
          
          <div className={styles.progressList}>
            {judgeProgress.map((item, i) => (
              <div key={i} className={styles.progressItem}>
                <div className={styles.progressMeta}>
                  <div>
                    <strong>{item.track}</strong>
                    <span className={styles.leadJudge}>Lead: {item.leadJudge}</span>
                  </div>
                  <span>{item.graded}/{item.total} graded ({item.progress}%)</span>
                </div>
                <div className={styles.progressBarBg}>
                  <div
                    className={styles.progressBarFill}
                    style={{ width: `${item.progress}%`, background: 'var(--success)' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Standings / Leaderboard Preview */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Standings Preview</h2>
          <p className={styles.cardSubtitle}>Live rank indicators based on finalized averages (Scoring Lock Active).</p>
          
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Team</th>
                  <th>Track</th>
                  <th>Average Score</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((item) => (
                  <tr key={item.rank}>
                    <td><strong>#{item.rank}</strong></td>
                    <td><strong>{item.team}</strong></td>
                    <td><span className={styles.trackBadge}>{item.track}</span></td>
                    <td className={styles.scoreVal}>{item.score} / 10</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
