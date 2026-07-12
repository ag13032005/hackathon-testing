'use client';

import { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import styles from './page.module.css';
import { useToast } from '@/components/ui/Toast';

export default function CoordinatorScanPage() {
  const toast = useToast();
  const [selectedUser, setSelectedUser] = useState('');
  const [scannedResult, setScannedResult] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const scannerRef = useRef(null);

  // Mock participant database for lookups
  const PARTICIPANTS = [
    { id: '1EW22CS014', name: 'Ananya Sharma', usn: '1EW22CS014', team: 'EcoSavers', track: 'Sustainability & Green Tech', status: 'PAID & APPROVED' },
    { id: '1EW22IS089', name: 'Rohit Kumar', usn: '1EW22IS089', team: 'EcoSavers', track: 'Sustainability & Green Tech', status: 'PAID & APPROVED' },
    { id: '1EW22EC056', name: 'Sneha Patel', usn: '1EW22EC056', team: 'SmartTraffic', track: 'Smart Cities & IoT', status: 'UNPAID (Pending HOD Review)' }
  ];

  // Initialize and clean up Html5QrcodeScanner
  useEffect(() => {
    if (isCameraActive) {
      const scanner = new Html5QrcodeScanner(
        'reader',
        {
          fps: 10,
          qrbox: { width: 220, height: 220 },
          rememberLastUsedCamera: true
        },
        /* verbose= */ false
      );

      scanner.render(
        (decodedText) => {
          try {
            const payload = JSON.parse(decodedText);
            
            // Check if user is in our participant list
            const match = PARTICIPANTS.find(p => p.usn.toLowerCase() === (payload.usn || payload.id).toLowerCase());
            
            if (match) {
              setScannedResult(match);
            } else {
              setScannedResult({
                name: payload.name || 'Unknown Participant',
                usn: payload.usn || payload.id || 'N/A',
                team: payload.college || 'External College',
                track: 'Verification Passed',
                status: 'VALID QR (Not In Local List)'
              });
            }
          } catch (e) {
            // Fallback for raw text QR codes
            setScannedResult({
              name: 'Raw QR Scanned',
              usn: decodedText,
              team: 'N/A',
              track: 'N/A',
              status: 'UNRECOGNIZED FORMAT'
            });
          }
          
          // Stop camera after successful scan
          scanner.clear().catch(err => console.error(err));
          setIsCameraActive(false);
          toast.success('QR Scanned', 'QR Pass scanned successfully!');
        },
        (error) => {
          // Silent callback for qr frame scanning failures
        }
      );

      scannerRef.current = scanner;
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => console.error(err));
      }
    };
  }, [isCameraActive]);

  // Dropdown fallback selection handler
  const handleSimulateScan = () => {
    if (!selectedUser) return;
    const match = PARTICIPANTS.find(p => p.id === selectedUser);
    setScannedResult(match);
    toast.success('Simulation Complete', 'Simulated QR Pass scanned successfully!');
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>QR Scanner Console</h2>
        <p className={styles.cardSubtitle}>Scan participant passes using your device camera or select a pass to simulate.</p>

        {/* Camera Scanner Container */}
        <div className={styles.scanControls}>
          <button
            onClick={() => setIsCameraActive(!isCameraActive)}
            className={`btn ${isCameraActive ? 'btn-secondary' : 'btn-primary'}`}
            style={{ width: '100%', marginBottom: '16px' }}
          >
            {isCameraActive ? '⏹ Turn Off Camera' : '📷 Open Camera Scanner'}
          </button>

          {isCameraActive && (
            <div className={styles.readerWrapper}>
              <div id="reader" style={{ width: '100%' }}></div>
            </div>
          )}
        </div>

        {/* Dropdown Fallback Simulation */}
        {!isCameraActive && (
          <div className={styles.scannerInterface}>
            <div className="form-group">
              <label className="form-label" htmlFor="userSelect">Manual QR Selector Fallback</label>
              <select
                id="userSelect"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="form-input"
              >
                <option value="" disabled>-- Select a participant's QR pass --</option>
                {PARTICIPANTS.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.usn})</option>
                ))}
              </select>
            </div>
            
            <button onClick={handleSimulateScan} className="btn btn-secondary" style={{ marginTop: '16px', width: '100%' }}>
              Simulate Scan Input
            </button>
          </div>
        )}

        {/* Display Scanned/Simulated Profile */}
        {scannedResult && (
          <div className={styles.resultBox}>
            <div className={styles.resultHeader}>
              <h3 className={styles.resultName}>{scannedResult.name}</h3>
              <span className={scannedResult.status.includes('PAID') || scannedResult.status.includes('VALID') ? styles.paidText : styles.unpaidText}>
                {scannedResult.status}
              </span>
            </div>
            <span className={styles.resultUsn}>USN: {scannedResult.usn}</span>
            <span className={styles.resultTeam}>Team: {scannedResult.team} ({scannedResult.track})</span>
          </div>
        )}
      </div>
    </div>
  );
}
