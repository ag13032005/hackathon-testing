'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import { useToast } from '@/components/ui/Toast';

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

export default function TechHeadScoreOverridesPage() {
  const toast = useToast();
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [editScores, setEditScores] = useState({
    innovation: 0,
    technical: 0,
    impact: 0,
    presentation: 0
  });

  useEffect(() => {
    const saved = localStorage.getItem('ewit_teams_scores');
    if (saved) {
      setTeams(JSON.parse(saved));
    } else {
      localStorage.setItem('ewit_teams_scores', JSON.stringify(DEFAULT_TEAMS));
      setTeams(DEFAULT_TEAMS);
    }
  }, []);

  const handleSelectTeam = (team) => {
    setSelectedTeam(team);
    setEditScores({
      innovation: team.scores.innovation,
      technical: team.scores.technical,
      impact: team.scores.impact,
      presentation: team.scores.presentation
    });
  };

  const calculateAverage = (sc) => {
    return ((sc.innovation + sc.technical + sc.impact + sc.presentation) / 4).toFixed(1);
  };

  const handleScoreChange = (metric, val) => {
    const num = Math.min(10, Math.max(0, parseInt(val) || 0));
    setEditScores(prev => ({ ...prev, [metric]: num }));
  };

  const handleOverrideSubmit = (e) => {
    e.preventDefault();
    if (!selectedTeam) return;

    const updatedTeams = teams.map(t => {
      if (t.id === selectedTeam.id) {
        return {
          ...t,
          scores: { ...editScores },
          lastUpdated: 'Just now (Tech Head Override)'
        };
      }
      return t;
    });

    setTeams(updatedTeams);
    localStorage.setItem('ewit_teams_scores', JSON.stringify(updatedTeams));

    // Log action to localStorage audit logs
    const existingLogs = JSON.parse(localStorage.getItem('ewit_audit_logs') || '[]');
    existingLogs.push({
      timestamp: new Date().toLocaleTimeString(),
      action: 'Score Override',
      details: `Tech Head overrode ${selectedTeam.name} marks: Innovation -> ${editScores.innovation}, Technical -> ${editScores.technical}`
    });
    localStorage.setItem('ewit_audit_logs', JSON.stringify(existingLogs));

    toast.success('Score Override Applied', `${selectedTeam.name} updated to ${calculateAverage(editScores)}/10`);
    setSelectedTeam(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        
        {/* Teams List Table */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Score Overrides</h2>
          <p className={styles.cardSubtitle}>List of evaluated teams with scoring lock active. Admins can bypass judge locks to adjust marks.</p>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Team</th>
                  <th>Track</th>
                  <th>Assign Judge</th>
                  <th>Average Score</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {teams.map(t => (
                  <tr key={t.id}>
                    <td><strong>{t.name}</strong></td>
                    <td><span className={styles.trackBadge}>{t.track}</span></td>
                    <td>{t.judge}</td>
                    <td className={styles.scoreText}>{calculateAverage(t.scores)} / 10</td>
                    <td>
                      <span className={styles.lockedBadge}>🔒 Locked</span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleSelectTeam(t)}
                        className="btn btn-secondary btn-sm"
                      >
                        ⚙️ Override Marks
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Override Editing Form */}
        {selectedTeam && (
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Bypass Judge Lock: {selectedTeam.name}</h2>
            <p className={styles.cardSubtitle}>Direct score correction form. Updates stats tables immediately.</p>

            <form onSubmit={handleOverrideSubmit} className={styles.form}>
              <div className={styles.scoreInputs}>
                <div className={styles.scoreRow}>
                  <div className={styles.scoreLabel}>
                    <strong>Innovation & Design</strong>
                    <span>Current score: {selectedTeam.scores.innovation}/10</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={editScores.innovation}
                    onChange={(e) => handleScoreChange('innovation', e.target.value)}
                    className={styles.scoreInput}
                    required
                  />
                </div>

                <div className={styles.scoreRow}>
                  <div className={styles.scoreLabel}>
                    <strong>Technical Complexity</strong>
                    <span>Current score: {selectedTeam.scores.technical}/10</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={editScores.technical}
                    onChange={(e) => handleScoreChange('technical', e.target.value)}
                    className={styles.scoreInput}
                    required
                  />
                </div>

                <div className={styles.scoreRow}>
                  <div className={styles.scoreLabel}>
                    <strong>Impact & Relevance</strong>
                    <span>Current score: {selectedTeam.scores.impact}/10</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={editScores.impact}
                    onChange={(e) => handleScoreChange('impact', e.target.value)}
                    className={styles.scoreInput}
                    required
                  />
                </div>

                <div className={styles.scoreRow}>
                  <div className={styles.scoreLabel}>
                    <strong>Presentation Quality</strong>
                    <span>Current score: {selectedTeam.scores.presentation}/10</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={editScores.presentation}
                    onChange={(e) => handleScoreChange('presentation', e.target.value)}
                    className={styles.scoreInput}
                    required
                  />
                </div>
              </div>

              <div className={styles.totalRow}>
                <span>New Average Tally:</span>
                <strong>{calculateAverage(editScores)} / 10</strong>
              </div>

              <div className={styles.actionButtons}>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  💾 Save & Bypass Judge Lock
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTeam(null)}
                  className="btn btn-secondary"
                  style={{ width: '100%' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
