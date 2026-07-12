'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

export default function ParticipantTeamPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [team, setTeam] = useState(null);
  const [teamName, setTeamName] = useState('');
  const [track, setTrack] = useState('AI & Automation');
  const [joinCode, setJoinCode] = useState('');
  const [joinRequests, setJoinRequests] = useState([
    { id: 1, name: 'Siddharth R (1EW22IS045)', dept: 'ISE' },
    { id: 2, name: 'Nikitha G (1EW22EC012)', dept: 'ECE' }
  ]);

  useEffect(() => {
    const userStr = localStorage.getItem('ewit_current_user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setCurrentUser(user);
      
      const savedTeam = localStorage.getItem(`ewit_team_${user.email}`);
      if (savedTeam) {
        setTeam(JSON.parse(savedTeam));
      }
    }
  }, []);

  const saveTeamState = (updatedTeam) => {
    setTeam(updatedTeam);
    if (currentUser) {
      if (updatedTeam) {
        localStorage.setItem(`ewit_team_${currentUser.email}`, JSON.stringify(updatedTeam));
      } else {
        localStorage.removeItem(`ewit_team_${currentUser.email}`);
      }
    }
  };

  const handleCreateTeam = (e) => {
    e.preventDefault();
    if (!teamName) return;

    const newTeam = {
      name: teamName,
      track: track,
      code: 'EWIT-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      leader: currentUser.fullName,
      members: [currentUser.fullName],
      isLocked: false,
      isPaid: false
    };

    saveTeamState(newTeam);
  };

  const handleJoinTeam = (e) => {
    e.preventDefault();
    if (!joinCode) return;

    const joinedTeam = {
      name: 'EcoCoders',
      track: 'Sustainability & Green Tech',
      code: joinCode.toUpperCase(),
      leader: 'Deepak Kumar',
      members: ['Deepak Kumar', currentUser.fullName],
      isLocked: false,
      isPaid: false
    };

    saveTeamState(joinedTeam);
  };

  const handleAcceptRequest = (req) => {
    if (!team) return;
    const updatedMembers = [...team.members, req.name.split(' (')[0]];
    const updatedTeam = { ...team, members: updatedMembers };
    
    setJoinRequests(prev => prev.filter(r => r.id !== req.id));
    saveTeamState(updatedTeam);
  };

  const handleLockTeam = () => {
    if (!team) return;
    const updatedTeam = { ...team, isLocked: true };
    saveTeamState(updatedTeam);
    alert('Team composition locked! No further edits can be made unless unlocked by HOD.');
  };

  return (
    <div className={styles.container}>
      {!team ? (
        <div className={styles.setupGrid}>
          {/* Create Team */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Form a New Team</h2>
            <p className={styles.cardSubtitle}>You will become the Team Leader. Standard size: 2-4 members.</p>
            
            <form onSubmit={handleCreateTeam} className={styles.form}>
              <div className="form-group">
                <label className="form-label" htmlFor="teamName">Team Name</label>
                <input
                  type="text"
                  id="teamName"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="EcoCoders"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="trackSelect">Select Innovation Track</label>
                <select
                  id="trackSelect"
                  value={track}
                  onChange={(e) => setTrack(e.target.value)}
                  className="form-input"
                >
                  <option value="AI & Automation">AI & Automation</option>
                  <option value="HealthTech & Wellness">HealthTech & Wellness</option>
                  <option value="Sustainability & Green Tech">Sustainability & Green Tech</option>
                  <option value="Smart Cities & IoT">Smart Cities & IoT</option>
                  <option value="Open Innovation">Open Innovation</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                Create Team
              </button>
            </form>
          </div>

          {/* Join Team */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Join an Existing Team</h2>
            <p className={styles.cardSubtitle}>Ask your leader for the group code.</p>
            
            <form onSubmit={handleJoinTeam} className={styles.form}>
              <div className="form-group">
                <label className="form-label" htmlFor="codeSelect">Group Code</label>
                <input
                  type="text"
                  id="codeSelect"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  placeholder="EWIT-XXXXXX"
                  className="form-input"
                  required
                />
              </div>

              <button type="submit" className="btn btn-secondary" style={{ width: '100%' }}>
                Join Team
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* Team Details Workspace */
        <div className={styles.card}>
          <div className={styles.teamHeader}>
            <div>
              <h2 className={styles.cardTitle}>{team.name} Team Workspace</h2>
              <span className={styles.trackLabel}>{team.track}</span>
            </div>
            {!team.isLocked && (
              <button onClick={() => saveTeamState(null)} className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }}>
                Disband Team
              </button>
            )}
          </div>

          <div className={styles.groupCodeBox}>
            <span>Group Code: </span>
            <strong>{team.code}</strong>
          </div>

          <div className={styles.membersList}>
            <h3>Team Members ({team.members.length}/4)</h3>
            <div className={styles.members}>
              {team.members.map((m, i) => (
                <div key={i} className={styles.memberRow}>
                  <span>● {m}</span>
                  {i === 0 && <span className={styles.leaderBadge}>Leader</span>}
                </div>
              ))}
            </div>
          </div>

          {!team.isLocked ? (
            <div className={styles.lockBlock}>
              <p>⚠️ Once locked, team membership cannot be edited unless overridden by HOD.</p>
              <button onClick={handleLockTeam} className="btn btn-primary">
                Lock Team Composition
              </button>
            </div>
          ) : (
            <div className={styles.lockedBadge}>🔒 Composition Locked</div>
          )}

          {/* Requests for Leader */}
          {!team.isLocked && team.leader === currentUser.fullName && joinRequests.length > 0 && (
            <div className={styles.requestsSection}>
              <h3>Pending Requests</h3>
              <div className={styles.requests}>
                {joinRequests.map(req => (
                  <div key={req.id} className={styles.requestCard}>
                    <div>
                      <strong>{req.name}</strong>
                      <span>Dept: {req.dept}</span>
                    </div>
                    <button onClick={() => handleAcceptRequest(req)} className="btn btn-primary btn-sm">
                      Approve
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
