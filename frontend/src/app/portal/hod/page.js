'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function HodDashboard() {
  const [announcements, setAnnouncements] = useState([
    { id: 1, title: 'Round 1 Submission Guidelines', date: 'Jul 12, 2026', author: 'HOD CSE' },
    { id: 2, title: 'Wi-Fi Credentials for EWIT Hacking Arenas', date: 'Jul 11, 2026', author: 'Tech Team' }
  ]);

  const [teams, setTeams] = useState([
    { id: 1, name: 'EcoCoders', track: 'Sustainability & Green Tech', leader: 'Deepak Kumar', members: 4, locked: true },
    { id: 2, name: 'IoT City Builders', track: 'Smart Cities & IoT', leader: 'Meghana R', members: 3, locked: true },
    { id: 3, name: 'MentalAI', track: 'HealthTech & Wellness', leader: 'Kiran K', members: 2, locked: false }
  ]);

  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [reportGenerated, setReportGenerated] = useState(false);

  const handlePostAnnouncement = (e) => {
    e.preventDefault();
    if (!newAnnTitle) return;

    const newAnn = {
      id: Date.now(),
      title: newAnnTitle,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      author: 'HOD (CSE Dept)'
    };

    setAnnouncements(prev => [newAnn, ...prev]);
    setNewAnnTitle('');
  };

  const handleUnlockTeam = (teamId) => {
    setTeams(prev => prev.map(t => {
      if (t.id === teamId) {
        return { ...t, locked: false };
      }
      return t;
    }));
    alert('Team unlocked. The Team Leader can now modify members.');
  };

  const handleExportReport = () => {
    setReportGenerated(true);
    setTimeout(() => {
      setReportGenerated(false);
      alert('Report exported successfully! (ewit_academic_analytics_2026.csv)');
    }, 1500);
  };

  return (
    <div className={styles.container}>
      {/* ─── Academic Statistics Row ─── */}
      <div className={styles.statsRow}>
        <div className={styles.card}>
          <span className={styles.statLabel}>Academic Registrations</span>
          <span className={styles.statValue}>152</span>
          <span className={styles.statTrend}>+12 this week</span>
        </div>
        <div className={styles.card}>
          <span className={styles.statLabel}>CSE Dept Teams</span>
          <span className={styles.statValue}>48</span>
          <span className={styles.statTrend}>38 Locked</span>
        </div>
        <div className={styles.card}>
          <span className={styles.statLabel}>Active Tracks</span>
          <span className={styles.statValue}>5</span>
          <span className={styles.statTrend}>All active</span>
        </div>
      </div>

      <div className={styles.mainGrid}>
        
        {/* Teams Management (Lock Override Control) */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Departmental Team Audits</h2>
          <p className={styles.cardSubtitle}>Audit status of enrolled teams. HODs can unlock teams to allow membership edits.</p>
          
          <div className={styles.teamsList}>
            {teams.map(team => (
              <div key={team.id} className={styles.teamRow}>
                <div className={styles.teamInfo}>
                  <strong>{team.name}</strong>
                  <span className={styles.trackBadge}>{team.track}</span>
                  <span className={styles.memberCount}>Members: {team.members}/4 · Leader: {team.leader}</span>
                </div>
                
                <div className={styles.teamActions}>
                  {team.locked ? (
                    <button
                      onClick={() => handleUnlockTeam(team.id)}
                      className="btn btn-secondary btn-sm"
                      style={{ color: 'var(--danger)', borderColor: 'rgba(239,68,68,0.2)' }}
                    >
                      🔓 Unlock Team
                    </button>
                  ) : (
                    <span className={styles.unlockedBadge}>Edit Mode Active</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side Column */}
        <div className={styles.sideColumn}>
          
          {/* Post Announcements */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Post HOD Announcement</h2>
            <p className={styles.cardSubtitle}>Sends notifications directly to student dashboard panels.</p>
            
            <form onSubmit={handlePostAnnouncement} className={styles.form}>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Enter notice title..."
                  value={newAnnTitle}
                  onChange={(e) => setNewAnnTitle(e.target.value)}
                  className="form-input"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary btn-sm">
                Publish Announcement
              </button>
            </form>

            <div className={styles.announcementsHistory}>
              <h3 className={styles.historyTitle}>Notice Archive</h3>
              <div className={styles.noticeList}>
                {announcements.map(ann => (
                  <div key={ann.id} className={styles.noticeItem}>
                    <strong>{ann.title}</strong>
                    <span className={styles.noticeMeta}>{ann.date} · By {ann.author}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Academic Report Desk */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Academic Report Desk</h2>
            <p className={styles.cardSubtitle}>Generate verified lists of attendees, college distributions, and check-in reports.</p>
            
            <button onClick={handleExportReport} className="btn btn-secondary" disabled={reportGenerated} style={{ width: '100%' }}>
              {reportGenerated ? 'Compiling Report...' : 'Download CSE Registrations (CSV)'}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
