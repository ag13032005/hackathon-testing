'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function CoordinatorCouponsPage() {
  const [selectedUser, setSelectedUser] = useState('1');
  const [users, setUsers] = useState([
    { id: '1', name: 'Ananya Sharma', usn: '1EW22CS014', coupons: { breakfast: 'UNUSED', lunch: 'UNUSED', dinner: 'UNUSED' } },
    { id: '2', name: 'Rohit Kumar', usn: '1EW22IS089', coupons: { breakfast: 'REDEEMED', lunch: 'UNUSED', dinner: 'UNUSED' } }
  ]);

  const activeUser = users.find(u => u.id === selectedUser);

  const handleRedeem = (couponKey) => {
    if (!activeUser) return;
    
    setUsers(prev => prev.map(u => {
      if (u.id === activeUser.id) {
        return {
          ...u,
          coupons: {
            ...u.coupons,
            [couponKey]: 'REDEEMED'
          }
        };
      }
      return u;
    }));

    alert(`${couponKey.toUpperCase()} coupon redeemed successfully!`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Meal & Kit Coupons</h2>
        <p className={styles.cardSubtitle}>Redeem digital breakfast, lunch, dinner, or T-shirt coupons for checked-in participants.</p>

        <div className="form-group" style={{ marginBottom: '24px' }}>
          <label className="form-label" htmlFor="userSelect">Select Checked-In Student</label>
          <select
            id="userSelect"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="form-input"
          >
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.name} ({u.usn})</option>
            ))}
          </select>
        </div>

        {activeUser && (
          <div className={styles.couponsSection}>
            <h3 className={styles.sectionTitle}>Digital Coupons for {activeUser.name}</h3>
            
            <div className={styles.couponGrid}>
              {Object.keys(activeUser.coupons).map(couponKey => {
                const status = activeUser.coupons[couponKey];
                const isUnused = status === 'UNUSED';
                
                return (
                  <div key={couponKey} className={styles.couponRow}>
                    <span className={styles.couponName}>{couponKey.toUpperCase()}</span>
                    {isUnused ? (
                      <button
                        onClick={() => handleRedeem(couponKey)}
                        className="btn btn-accent btn-sm"
                      >
                        Redeem Coupon
                      </button>
                    ) : (
                      <span className={styles.redeemedBadge}>Redeemed & Locked</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
