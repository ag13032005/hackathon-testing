'use client';

import { useState } from 'react';
import styles from './page.module.css';
import { useToast } from '@/components/ui/Toast';

export default function JudgeDashboard() {
  const toast = useToast();
  const [selectedTeam, setSelectedTeam] = useState(null);
  
  const [teams, setTeams] = useState([
    {
      id: 1,
      name: 'EcoCoders',
      track: 'Sustainability & Green Tech',
      problem: 'Developing a zero-loss composting monitoring device using gas sensors and local IoT hubs.',
      github: 'https://github.com/example/ecocoders',
      presentation: 'https://docs.google.com/presentation/d/example',
      prototype: 'https://ecocoders-proto.ewit.edu.in',
      scored: false,
      scores: { innovation: 0, technical: 0, impact: 0, presentation: 0 }
    },
    {
      id: 2,
      name: 'AquaTrack',
      track: 'Sustainability & Green Tech',
      problem: 'Smart water leakage locator in municipal distribution lines using acoustical noise sensors.',
      github: 'https://github.com/example/aquatrack',
      presentation: 'https://docs.google.com/presentation/d/example2',
      prototype: 'https://aquatrack-proto.ewit.edu.in',
      scored: true,
      scores: { innovation: 8, technical: 9, impact: 8, presentation: 9 }
    }
  ]);

  const [scores, setScores] = useState({
    innovation: 5,
    technical: 5,
    impact: 5,
    presentation: 5,
    comments: ''
  });

  const handleScoreChange = (metric, val) => {
    const numericVal = parseInt(val) || 0;
    setScores(prev => ({
      ...prev,
      [metric]: Math.min(10, Math.max(0, numericVal))
    }));
  };

  const handleSelectTeam = (team) => {
    setSelectedTeam(team);
    if (team.scored) {
      setScores({
        innovation: team.scores.innovation,
        technical: team.scores.technical,
        impact: team.scores.impact,
        presentation: team.scores.presentation,
        comments: 'Graded in previous assessment'
      });
    } else {
      setScores({ innovation: 5, technical: 5, impact: 5, presentation: 5, comments: '' });
    }
  };

  const calculateTotal = () => {
    return ((scores.innovation + scores.technical + scores.impact + scores.presentation) / 4).toFixed(1);
  };

  const handleSubmitScores = () => {
    if (!selectedTeam) return;
    
    setTeams(prev => prev.map(t => {
      if (t.id === selectedTeam.id) {
        return {
          ...t,
          scored: true,
          scores: {
            innovation: scores.innovation,
            technical: scores.technical,
            impact: scores.impact,
            presentation: scores.presentation
          }
        };
      }
      return t;
    }));

    setSelectedTeam(prev => ({ ...prev, scored: true }));
    toast.success('Evaluation Submitted', `${selectedTeam.name} scored ${calculateTotal()}/10`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.workspaceGrid}>
        
        {/* Teams Queue Sidebar */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Assigned Teams</h2>
          <p className={styles.cardSubtitle}>Select a team below to begin the assessment.</p>
          
          <div className={styles.teamsList}>
            {teams.map(team => {
              const isSelected = selectedTeam && selectedTeam.id === team.id;
              return (
                <button
                  key={team.id}
                  onClick={() => handleSelectTeam(team)}
                  className={`${styles.teamButton} ${isSelected ? styles.teamActive : ''}`}
                >
                  <div className={styles.teamHeaderRow}>
                    <strong>{team.name}</strong>
                    {team.scored ? (
                      <span className={styles.gradedTag}>Graded</span>
                    ) : (
                      <span className={styles.pendingTag}>Pending</span>
                    )}
                  </div>
                  <span className={styles.trackLabel}>{team.track}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Evaluation Board Panel */}
        <div className={styles.card}>
          {selectedTeam ? (
            <div className={styles.gradingBoard}>
              <div className={styles.gradingHeader}>
                <h2 className={styles.cardTitle}>{selectedTeam.name} Submissions</h2>
                <span className={styles.trackLabel}>{selectedTeam.track}</span>
              </div>

              {/* Submissions Info */}
              <div className={styles.submissionDetails}>
                <div className={styles.detailField}>
                  <strong>Problem Statement:</strong>
                  <p>{selectedTeam.problem}</p>
                </div>
                
                <div className={styles.linksGrid}>
                  <a href={selectedTeam.github} target="_blank" rel="noopener noreferrer" className={styles.submitLink}>
                    🐙 GitHub Repository
                  </a>
                  <a href={selectedTeam.presentation} target="_blank" rel="noopener noreferrer" className={styles.submitLink}>
                    📊 Presentation Pitch
                  </a>
                  <a href={selectedTeam.prototype} target="_blank" rel="noopener noreferrer" className={styles.submitLink}>
                    🌐 Live Prototype Link
                  </a>
                </div>
              </div>

              {/* Scorecard Panel */}
              <div className={styles.scorecard}>
                <h3 className={styles.scorecardTitle}>Digital Scorecard</h3>
                
                <div className={styles.scoreInputs}>
                  <div className={styles.scoreRow}>
                    <div className={styles.scoreLabel}>
                      <strong>Innovation & Uniqueness</strong>
                      <span>Creative design, earth sustainability correlation (1-10)</span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={scores.innovation}
                      onChange={(e) => handleScoreChange('innovation', e.target.value)}
                      className={styles.scoreInput}
                      disabled={selectedTeam.scored}
                    />
                  </div>

                  <div className={styles.scoreRow}>
                    <div className={styles.scoreLabel}>
                      <strong>Technical Complexity</strong>
                      <span>Architecture, code quality, sensor interfaces (1-10)</span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={scores.technical}
                      onChange={(e) => handleScoreChange('technical', e.target.value)}
                      className={styles.scoreInput}
                      disabled={selectedTeam.scored}
                    />
                  </div>

                  <div className={styles.scoreRow}>
                    <div className={styles.scoreLabel}>
                      <strong>Impact & Relevance</strong>
                      <span>Feasibility, scalability, commercialization value (1-10)</span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={scores.impact}
                      onChange={(e) => handleScoreChange('impact', e.target.value)}
                      className={styles.scoreInput}
                      disabled={selectedTeam.scored}
                    />
                  </div>

                  <div className={styles.scoreRow}>
                    <div className={styles.scoreLabel}>
                      <strong>Presentation Quality</strong>
                      <span>Demeanor, time management, Q&A efficiency (1-10)</span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={scores.presentation}
                      onChange={(e) => handleScoreChange('presentation', e.target.value)}
                      className={styles.scoreInput}
                      disabled={selectedTeam.scored}
                    />
                  </div>
                </div>

                {/* Total Average */}
                <div className={styles.totalRow}>
                  <span>Average Score:</span>
                  <strong>{calculateTotal()} / 10</strong>
                </div>

                {/* Comments Box */}
                <div className="form-group" style={{ marginTop: '16px' }}>
                  <label className="form-label" htmlFor="comments">Judge's Comments</label>
                  <textarea
                    id="comments"
                    rows="3"
                    value={scores.comments}
                    onChange={(e) => setScores(prev => ({ ...prev, comments: e.target.value }))}
                    placeholder="Enter assessment remarks..."
                    className="form-input"
                    disabled={selectedTeam.scored}
                  />
                </div>

                {/* Submit action */}
                {!selectedTeam.scored ? (
                  <button onClick={handleSubmitScores} className="btn btn-primary" style={{ width: '100%', marginTop: '20px' }}>
                    Lock Scores & Submit
                  </button>
                ) : (
                  <div className={styles.lockedNotice}>
                    🔒 Scores Locked for this Evaluation Round
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className={styles.emptyGrading}>
              <span>Select a team from the left queue to begin scoring.</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
