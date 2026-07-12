'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

export default function ParticipantDashboard() {
  const [currentUser, setCurrentUser] = useState(null);
  const [hasProfile, setHasProfile] = useState(false);
  const [team, setTeam] = useState(null); // { name, code, members: [], isLocked: false, isPaid: false }
  const [joinCode, setJoinCode] = useState('');
  const [joinRequests, setJoinRequests] = useState([
    { id: 1, name: 'Siddharth R (1EW22IS045)', dept: 'ISE' },
    { id: 2, name: 'Nikitha G (1EW22EC012)', dept: 'ECE' }
  ]);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem('ewit_current_user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setCurrentUser(user);
      
      // Look up profile details
      if (user.usn && user.branch) {
        setHasProfile(true);
      }
      
      // Look up team state in localStorage
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
    const teamName = e.target.teamName.value;
    const track = e.target.track.value;
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

    // Mock join team success
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

  const handleRejectRequest = (reqId) => {
    setJoinRequests(prev => prev.filter(r => r.id !== reqId));
  };

  const handleLockTeam = () => {
    if (!team) return;
    const updatedTeam = { ...team, isLocked: true };
    saveTeamState(updatedTeam);
  };

  const handlePayment = () => {
    if (!team) return;
    setIsProcessingPayment(true);

    // Mock Razorpay payment
    setTimeout(() => {
      const updatedTeam = { ...team, isPaid: true };
      saveTeamState(updatedTeam);
      setIsProcessingPayment(false);
    }, 2000);
  };

  const handleLeaveTeam = () => {
    if (confirm('Are you sure you want to leave/disband this team?')) {
      saveTeamState(null);
    }
  };

  if (!currentUser) return null;

  return (
    <div className={styles.container}>
      {/* ─── Profile Status Alert ─── */}
      {!hasProfile && (
        <div className={styles.warningCard}>
          <div className={styles.warningIcon}>⚠️</div>
          <div className={styles.warningText}>
            <strong>Academic Profile Incomplete</strong>
            <p>Please enter your USN and department details in registration or contact the HOD desk to link your profile.</p>
          </div>
        </div>
      )}

      {/* ─── Hacking Pass & QR System (Post-Payment Only) ─── */}
      {team && team.isPaid && (
        <div className={styles.passCard}>
          <div className={styles.passHeader}>
            <div className={styles.passTitle}>EWIT Digital Event Pass</div>
            <div className={styles.passTrack}>{team.track}</div>
          </div>
          
          <div className={styles.passBody}>
            <div className={styles.passInfo}>
              <div className={styles.passField}>
                <span className={styles.passLabel}>Participant Name</span>
                <span className={styles.passValue}>{currentUser.fullName}</span>
              </div>
              <div className={styles.passField}>
                <span className={styles.passLabel}>Team Name</span>
                <span className={styles.passValue}>{team.name}</span>
              </div>
              <div className={styles.passField}>
                <span className={styles.passLabel}>USN / Roll Number</span>
                <span className={styles.passValue}>{currentUser.usn || 'Pending Link'}</span>
              </div>
              <div className={styles.passField}>
                <span className={styles.passLabel}>Pass Status</span>
                <span className={styles.passStatusActive}>Approved & Verified</span>
              </div>
            </div>
            
            <div className={styles.qrContainer}>
              <div className={styles.qrCodeWrapper}>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(JSON.stringify({
                    id: currentUser.usn || '1EW22CS014',
                    name: currentUser.fullName,
                    usn: currentUser.usn || '1EW22CS014',
                    college: currentUser.college
                  }))}`}
                  alt="Real QR Code Pass"
                  className={styles.realQrImage}
                />
              </div>
              <span className={styles.qrLabel}>SCAN FOR MEALS & CHECK-IN</span>
            </div>
          </div>

          <div className={styles.passFooter}>
            <div className={styles.couponBadge}>🎫 Breakfast Coupon: Unused</div>
            <div className={styles.couponBadge}>🎫 Lunch Coupon: Unused</div>
            <div className={styles.couponBadge}>🎫 Dinner Coupon: Unused</div>
          </div>
        </div>
      )}

      {/* ─── Team Selection / Setup ─── */}
      {!team ? (
        <div className={styles.setupGrid}>
          {/* Create Team Card */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Form a New Team</h2>
            <p className={styles.cardSubtitle}>You will become the Team Leader and pay the ₹1000 registration fee.</p>
            
            <form onSubmit={handleCreateTeam} className={styles.form}>
              <div className="form-group">
                <label className="form-label" htmlFor="teamName">Team Name</label>
                <input
                  type="text"
                  id="teamName"
                  name="teamName"
                  placeholder="EarthSavers"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="track">Select Track</label>
                <select id="track" name="track" className="form-input">
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

          {/* Join Team Card */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Join an Existing Team</h2>
            <p className={styles.cardSubtitle}>Ask your Team Leader for the generated group code.</p>
            
            <form onSubmit={handleJoinTeam} className={styles.form}>
              <div className="form-group">
                <label className="form-label" htmlFor="joinCode">Enter Group Code</label>
                <input
                  type="text"
                  id="joinCode"
                  placeholder="EWIT-XXXXXX"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
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
        /* ─── Active Team Status Workspace ─── */
        <div className={styles.setupGrid}>
          
          {/* Members & Details Workspace */}
          <div className={styles.card}>
            <div className={styles.teamHeader}>
              <div>
                <h2 className={styles.cardTitle}>{team.name} Workspace</h2>
                <span className={styles.trackLabel}>{team.track}</span>
              </div>
              <button onClick={handleLeaveTeam} className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }}>
                Leave Team
              </button>
            </div>
            
            <div className={styles.groupCodeBox}>
              <span className={styles.codeLabel}>Team Group Code:</span>
              <span className={styles.codeText}>{team.code}</span>
            </div>

            <div className={styles.memberListSection}>
              <h3 className={styles.memberListTitle}>Team Members (Size: {team.members.length}/4)</h3>
              <div className={styles.members}>
                {team.members.map((member, i) => (
                  <div key={i} className={styles.memberItem}>
                    <span className={styles.memberDot}>●</span>
                    <span className={styles.memberName}>
                      {member} {i === 0 ? <strong className={styles.leaderTag}>(Leader)</strong> : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Lock Action (For Leader Only) */}
            {!team.isLocked ? (
              <div className={styles.lockSection}>
                <p className={styles.lockWarning}>
                  ⚠️ <strong>Important</strong>: You must lock the team to confirm membership. After locking, members cannot be changed. Only the HOD or Tech Head can unlock.
                </p>
                <button onClick={handleLockTeam} className="btn btn-primary">
                  Lock Team Composition
                </button>
              </div>
            ) : (
              <div className={styles.lockedBadge}>
                🔒 Team Composition Locked
              </div>
            )}
          </div>

          {/* Payments & Check-in Steps */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Registration Progress</h2>
            
            <div className={styles.progressTimeline}>
              <div className={`${styles.progressStep} ${styles.stepComplete}`}>
                <div className={styles.progressMarker}>✓</div>
                <div className={styles.progressContent}>
                  <strong>Account Created</strong>
                  <p>Individual credentials verified.</p>
                </div>
              </div>

              <div className={`${styles.progressStep} ${team.isLocked ? styles.stepComplete : styles.stepActive}`}>
                <div className={styles.progressMarker}>{team.isLocked ? '✓' : '2'}</div>
                <div className={styles.progressContent}>
                  <strong>Lock Team Composition</strong>
                  <p>Confirm the final 2-4 members.</p>
                </div>
              </div>

              <div className={`${styles.progressStep} ${team.isPaid ? styles.stepComplete : (team.isLocked ? styles.stepActive : styles.stepDisabled)}`}>
                <div className={styles.progressMarker}>{team.isPaid ? '✓' : '3'}</div>
                <div className={styles.progressContent}>
                  <strong>Razorpay Registration Fee (₹1000)</strong>
                  <p>Auto-approves team credentials upon checkout.</p>
                  
                  {team.isLocked && !team.isPaid && (
                    <button
                      onClick={handlePayment}
                      className="btn btn-accent btn-sm"
                      style={{ marginTop: '10px' }}
                      disabled={isProcessingPayment}
                    >
                      {isProcessingPayment ? 'Processing Gateway...' : 'Pay ₹1000 via Razorpay'}
                    </button>
                  )}
                </div>
              </div>

              <div className={`${styles.progressStep} ${team.isPaid ? styles.stepComplete : styles.stepDisabled}`}>
                <div className={styles.progressMarker}>{team.isPaid ? '✓' : '4'}</div>
                <div className={styles.progressContent}>
                  <strong>Generate Digital Event Pass & QR</strong>
                  <p>Visible above for entry and digital coupons.</p>
                </div>
              </div>
            </div>

            {/* Pending Requests for Leaders */}
            {!team.isLocked && team.leader === currentUser.fullName && joinRequests.length > 0 && (
              <div className={styles.requestsSection}>
                <h3 className={styles.requestsTitle}>Pending Join Requests</h3>
                <div className={styles.requestsList}>
                  {joinRequests.map(req => (
                    <div key={req.id} className={styles.requestCard}>
                      <div className={styles.reqInfo}>
                        <strong>{req.name}</strong>
                        <span>Department: {req.dept}</span>
                      </div>
                      <div className={styles.reqActions}>
                        <button onClick={() => handleAcceptRequest(req)} className="btn btn-primary btn-sm">
                          Approve
                        </button>
                        <button onClick={() => handleRejectRequest(req.id)} className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }}>
                          Deny
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
