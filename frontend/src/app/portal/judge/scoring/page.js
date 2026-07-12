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

export default function JudgeScoringPage() {
  const toast = useToast();
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('1');
  const [scores, setScores] = useState({
    innovation: 5,
    technical: 5,
    impact: 5,
    presentation: 5,
    comments: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('ewit_teams_scores');
    const loadedTeams = saved ? JSON.parse(saved) : DEFAULT_TEAMS;
    setTeams(loadedTeams);

    // Initialize scores form fields from selected team
    const team = loadedTeams.find(t => t.id === selectedTeam);
    if (team) {
      setScores({
        innovation: team.scores.innovation,
        technical: team.scores.technical,
        impact: team.scores.impact,
        presentation: team.scores.presentation,
        comments: ''
      });
    }
  }, [selectedTeam]);

  const handleScoreChange = (metric, val) => {
    const numericVal = parseInt(val) || 0;
    setScores(prev => ({
      ...prev,
      [metric]: Math.min(10, Math.max(0, numericVal))
    }));
  };

  const calculateTotal = () => {
    return ((scores.innovation + scores.technical + scores.impact + scores.presentation) / 4).toFixed(1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Update local storage database
    const updated = teams.map(t => {
      if (t.id === selectedTeam) {
        return {
          ...t,
          scores: {
            innovation: scores.innovation,
            technical: scores.technical,
            impact: scores.impact,
            presentation: scores.presentation
          },
          lastUpdated: 'Just now (Judge Submitted)'
        };
      }
      return t;
    });

    setTeams(updated);
    localStorage.setItem('ewit_teams_scores', JSON.stringify(updated));

    const activeTeamName = teams.find(t => t.id === selectedTeam)?.name;
    toast.success('Scores Submitted', `Evaluation scores submitted successfully for ${activeTeamName}! Average: ${calculateTotal()}/10`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Scoring Board</h2>
        <p className={styles.cardSubtitle}>Submit numeric grades across Innovation, Technical Complexity, and Presentation metrics.</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className="form-group">
            <label className="form-label" htmlFor="teamSelect">Select Active Team</label>
            <select
              id="teamSelect"
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="form-input"
            >
              {teams.map(t => (
                <option key={t.id} value={t.id}>{t.name} ({t.track})</option>
              ))}
            </select>
          </div>

          <div className={styles.scoreRows}>
            <div className={styles.scoreRow}>
              <div className={styles.scoreLabel}>
                <strong>Innovation & Design</strong>
                <span>Creativity, sustainability alignment (1-10)</span>
              </div>
              <input
                type="number"
                min="0"
                max="10"
                value={scores.innovation}
                onChange={(e) => handleScoreChange('innovation', e.target.value)}
                className={styles.scoreInput}
                required
              />
            </div>

            <div className={styles.scoreRow}>
              <div className={styles.scoreLabel}>
                <strong>Technical Complexity</strong>
                <span>Architecture, sensors integrations (1-10)</span>
              </div>
              <input
                type="number"
                min="0"
                max="10"
                value={scores.technical}
                onChange={(e) => handleScoreChange('technical', e.target.value)}
                className={styles.scoreInput}
                required
              />
            </div>

            <div className={styles.scoreRow}>
              <div className={styles.scoreLabel}>
                <strong>Impact & Relevance</strong>
                <span>Scalability, commercialization value (1-10)</span>
              </div>
              <input
                type="number"
                min="0"
                max="10"
                value={scores.impact}
                onChange={(e) => handleScoreChange('impact', e.target.value)}
                className={styles.scoreInput}
                required
              />
            </div>

            <div className={styles.scoreRow}>
              <div className={styles.scoreLabel}>
                <strong>Presentation Quality</strong>
                <span>Pitch delivery, slide deck clarity (1-10)</span>
              </div>
              <input
                type="number"
                min="0"
                max="10"
                value={scores.presentation}
                onChange={(e) => handleScoreChange('presentation', e.target.value)}
                className={styles.scoreInput}
                required
              />
            </div>
          </div>

          <div className={styles.totalRow}>
            <span>Round Average Tally:</span>
            <strong>{calculateTotal()} / 10</strong>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }}>
            Submit & Lock Scores
          </button>
        </form>
      </div>
    </div>
  );
}
