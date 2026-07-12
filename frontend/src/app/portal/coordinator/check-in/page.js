'use client';

import { useState } from 'react';
import styles from './page.module.css';
import { useToast } from '@/components/ui/Toast';

export default function CoordinatorCheckInPage() {
  const toast = useToast();
  const [participants, setParticipants] = useState([
    { id: 1, name: 'Ananya Sharma', usn: '1EW22CS014', team: 'EcoSavers', paid: true, checkedIn: false },
    { id: 2, name: 'Rohit Kumar', usn: '1EW22IS089', team: 'EcoSavers', paid: true, checkedIn: true },
    { id: 3, name: 'Sneha Patel', usn: '1EW22EC056', team: 'SmartTraffic', paid: false, checkedIn: false }
  ]);

  const handleCheckIn = (id) => {
    setParticipants(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, checkedIn: true };
      }
      return p;
    }));
    toast.success('Check-In Confirmed', 'Participant entry checked in successfully!');
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Event Check-In Desk</h2>
        <p className={styles.cardSubtitle}>Mark registrations check-ins and verify student paid credentials.</p>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Participant Name</th>
                <th>USN</th>
                <th>Team Name</th>
                <th>Payment Tally</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {participants.map(p => (
                <tr key={p.id}>
                  <td><strong>{p.name}</strong></td>
                  <td>{p.usn}</td>
                  <td>{p.team}</td>
                  <td>
                    <span className={p.paid ? styles.paidText : styles.unpaidText}>
                      {p.paid ? 'PAID' : 'UNPAID'}
                    </span>
                  </td>
                  <td>
                    {p.checkedIn ? (
                      <span className={styles.checkedInBadge}>✓ Checked In</span>
                    ) : (
                      <button
                        onClick={() => handleCheckIn(p.id)}
                        className="btn btn-primary btn-sm"
                        disabled={!p.paid}
                      >
                        Check-In Entry
                      </button>
                    )}
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
