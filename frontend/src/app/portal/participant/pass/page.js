'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

export default function ParticipantPassPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [qrUrl, setQrUrl] = useState('');

  useEffect(() => {
    const userStr = localStorage.getItem('ewit_current_user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setCurrentUser(user);
      
      // Generate a real QR code pointing to a verification string/json
      const payload = {
        id: user.usn || '1EW22CS014',
        name: user.fullName,
        usn: user.usn || '1EW22CS014',
        college: user.college
      };
      
      const qrDataString = encodeURIComponent(JSON.stringify(payload));
      setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${qrDataString}`);
    }
  }, []);

  if (!currentUser) return null;

  return (
    <div className={styles.container}>
      <div className={styles.passCard}>
        <div className={styles.passHeader}>
          <div className={styles.passTitle}>EWIT Digital Event Pass</div>
          <div className={styles.passTrack}>Sustainability Track</div>
        </div>
        
        <div className={styles.passBody}>
          <div className={styles.passInfo}>
            <div className={styles.passField}>
              <span className={styles.passLabel}>Participant Name</span>
              <span className={styles.passValue}>{currentUser.fullName}</span>
            </div>
            <div className={styles.passField}>
              <span className={styles.passLabel}>USN / Roll Number</span>
              <span className={styles.passValue}>{currentUser.usn || '1EW22CS014'}</span>
            </div>
            <div className={styles.passField}>
              <span className={styles.passLabel}>College Location</span>
              <span className={styles.passValue}>{currentUser.college}</span>
            </div>
            <div className={styles.passField}>
              <span className={styles.passLabel}>Pass State</span>
              <span className={styles.passStatusActive}>Verified & Checked-In</span>
            </div>
          </div>
          
          <div className={styles.qrContainer}>
            {qrUrl ? (
              <div className={styles.qrCodeWrapper}>
                <img
                  src={qrUrl}
                  alt="Real QR Code Pass"
                  className={styles.realQrImage}
                />
              </div>
            ) : (
              <div className={styles.mockQr}>Generating QR...</div>
            )}
            <span className={styles.qrLabel}>SCAN AT GATE / MEALS</span>
          </div>
        </div>

        <div className={styles.passFooter}>
          <div className={styles.couponBadge}>🎫 Breakfast Coupon: Unused</div>
          <div className={styles.couponBadge}>🎫 Lunch Coupon: Unused</div>
          <div className={styles.couponBadge}>🎫 Dinner Coupon: Unused</div>
        </div>
      </div>
    </div>
  );
}
