'use client';

import { useState } from 'react';
import styles from './page.module.css';
import { useToast } from '@/components/ui/Toast';

export default function CoordinatorDashboard() {
  const toast = useToast();
  // Mock participant database for scanning simulation
  const MOCK_PARTICIPANTS = [
    {
      id: '1',
      name: 'Ananya Sharma',
      usn: '1EW22CS014',
      team: 'EcoSavers',
      track: 'Sustainability & Green Tech',
      paid: true,
      checkedIn: false,
      coupons: { breakfast: 'UNUSED', lunch: 'UNUSED', dinner: 'UNUSED' }
    },
    {
      id: '2',
      name: 'Rohit Kumar',
      usn: '1EW22IS089',
      team: 'EcoSavers',
      track: 'Sustainability & Green Tech',
      paid: true,
      checkedIn: true,
      coupons: { breakfast: 'REDEEMED', lunch: 'UNUSED', dinner: 'UNUSED' }
    },
    {
      id: '3',
      name: 'Sneha Patel',
      usn: '1EW22EC056',
      team: 'SmartTraffic',
      track: 'Smart Cities & IoT',
      paid: false,
      checkedIn: false,
      coupons: { breakfast: 'UNUSED', lunch: 'UNUSED', dinner: 'UNUSED' }
    }
  ];

  const [scannedUser, setScannedUser] = useState(null);
  const [supportCategory, setSupportCategory] = useState('Wi-Fi');
  const [supportDesc, setSupportDesc] = useState('');
  const [tickets, setTickets] = useState([
    { id: 1, category: 'Wi-Fi', desc: 'Arena 2 Wi-Fi connection dropping repeatedly.', status: 'OPEN' },
    { id: 2, category: 'Power', desc: 'extension board requested at Team 12 table.', status: 'RESOLVED' }
  ]);

  const handleSimulateScan = (userId) => {
    const user = MOCK_PARTICIPANTS.find(p => p.id === userId);
    setScannedUser(user ? { ...user } : null);
  };

  const handleCheckIn = () => {
    if (!scannedUser) return;
    const updated = { ...scannedUser, checkedIn: true };
    setScannedUser(updated);
    toast.success('Check-In Confirmed', `${scannedUser.name} has been checked in.`);
  };

  const handleRedeemCoupon = (couponKey) => {
    if (!scannedUser) return;
    const updatedCoupons = { ...scannedUser.coupons, [couponKey]: 'REDEEMED' };
    const updated = { ...scannedUser, coupons: updatedCoupons };
    setScannedUser(updated);
    toast.success('Coupon Redeemed', `${couponKey.toUpperCase()} coupon marked as used.`);
  };

  const handleRaiseTicket = (e) => {
    e.preventDefault();
    if (!supportDesc) return;

    const newTicket = {
      id: Date.now(),
      category: supportCategory,
      desc: supportDesc,
      status: 'OPEN'
    };

    setTickets(prev => [newTicket, ...prev]);
    setSupportDesc('');
    toast.info('Ticket Raised', 'Support ticket filed. Tech Head admin has been notified.');
  };

  return (
    <div className={styles.container}>
      <div className={styles.mainGrid}>
        
        {/* Left Side: Scan & Verify Desk */}
        <div className={styles.configColumn}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>QR Scanner Hub</h2>
            <p className={styles.cardSubtitle}>Verify check-in eligibility and redeem digital coupons.</p>
            
            {/* Mock Scanner Control */}
            <div className={styles.scannerSimulator}>
              <label className="form-label" htmlFor="scanSimulator">Simulate QR Pass Scan</label>
              <select
                id="scanSimulator"
                onChange={(e) => handleSimulateScan(e.target.value)}
                className="form-input"
                defaultValue=""
              >
                <option value="" disabled>-- Select a participant pass --</option>
                {MOCK_PARTICIPANTS.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.usn})</option>
                ))}
              </select>
            </div>

            {/* Scanned Participant Profile */}
            {scannedUser ? (
              <div className={styles.profileCard}>
                <div className={styles.profileHeader}>
                  <div>
                    <h3 className={styles.profileName}>{scannedUser.name}</h3>
                    <span className={styles.profileTeam}>Team: {scannedUser.team} · Track: {scannedUser.track}</span>
                  </div>
                  {scannedUser.paid ? (
                    <span className={styles.paidBadge}>Paid</span>
                  ) : (
                    <span className={styles.unpaidBadge}>Payment Unverified</span>
                  )}
                </div>

                <div className={styles.verificationActions}>
                  {/* Attendance Check-in */}
                  <div className={styles.actionBlock}>
                    <strong>Attendance Check-In:</strong>
                    {scannedUser.paid ? (
                      scannedUser.checkedIn ? (
                        <span className={styles.checkedInLabel}>✓ Attendance Checked In</span>
                      ) : (
                        <button onClick={handleCheckIn} className="btn btn-primary btn-sm">
                          Confirm Entry & Check-In
                        </button>
                      )
                    ) : (
                      <span className={styles.actionDenied}>Entry Denied (Verify Payment First)</span>
                    )}
                  </div>

                  {/* Coupon Redemption Desk */}
                  <div className={styles.couponBlock}>
                    <strong>Paperless Coupons Redemption:</strong>
                    <div className={styles.couponGrid}>
                      {Object.keys(scannedUser.coupons).map(couponKey => {
                        const status = scannedUser.coupons[couponKey];
                        const isUnused = status === 'UNUSED';
                        
                        return (
                          <div key={couponKey} className={styles.couponRow}>
                            <span className={styles.couponName}>{couponKey.toUpperCase()}</span>
                            {scannedUser.paid && scannedUser.checkedIn ? (
                              isUnused ? (
                                <button
                                  onClick={() => handleRedeemCoupon(couponKey)}
                                  className="btn btn-accent btn-sm"
                                  style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                                >
                                  Redeem
                                </button>
                              ) : (
                                <span className={styles.redeemedLabel}>Redeemed & Locked</span>
                              )
                            ) : (
                              <span className={styles.couponLocked}>Locked</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              </div>
            ) : (
              <div className={styles.emptyScanState}>
                <span>Scan a participant's QR code to pull up their verification card.</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Support Ticket Hub */}
        <div className={styles.configColumn}>
          {/* Help Desk Tickets */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Help Desk Operations</h2>
            <p className={styles.cardSubtitle}>File infrastructural reports directly to HOD and Tech Head control rooms.</p>
            
            <form onSubmit={handleRaiseTicket} className={styles.form}>
              <div className="form-group">
                <label className="form-label" htmlFor="ticketCategory">Issue Category</label>
                <select
                  id="ticketCategory"
                  value={supportCategory}
                  onChange={(e) => setSupportCategory(e.target.value)}
                  className="form-input"
                >
                  <option value="Wi-Fi">Wi-Fi & Internet</option>
                  <option value="Power">Power Source / Extension Boards</option>
                  <option value="Food">Food / Water Refreshments</option>
                  <option value="Hardware">Hardware / Lab Devices</option>
                  <option value="Other">Other Issues</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="ticketDetails">Details</label>
                <textarea
                  id="ticketDetails"
                  rows="3"
                  value={supportDesc}
                  onChange={(e) => setSupportDesc(e.target.value)}
                  placeholder="Describe the issue at hand..."
                  className="form-input"
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary btn-sm">
                Raise Support Issue
              </button>
            </form>

            <div className={styles.ticketsSection}>
              <h3 className={styles.ticketsSectionTitle}>Active Tickets</h3>
              <div className={styles.ticketsList}>
                {tickets.map(ticket => (
                  <div key={ticket.id} className={styles.ticketItem}>
                    <div className={styles.ticketMeta}>
                      <span className={styles.ticketCategoryBadge}>{ticket.category}</span>
                      {ticket.status === 'OPEN' ? (
                        <span className={styles.ticketOpenBadge}>Open</span>
                      ) : (
                        <span className={styles.ticketClosedBadge}>Resolved</span>
                      )}
                    </div>
                    <p className={styles.ticketDesc}>{ticket.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
