'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function CoordinatorSupportPage() {
  const [category, setCategory] = useState('Wi-Fi');
  const [desc, setDesc] = useState('');
  const [tickets, setTickets] = useState([
    { id: 1, category: 'Wi-Fi', desc: 'Arena 2 hotspot speed dropped.', status: 'OPEN' },
    { id: 2, category: 'Power', desc: 'Requested multi-plug for table 15.', status: 'RESOLVED' }
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!desc) return;

    const newTicket = {
      id: Date.now(),
      category,
      desc,
      status: 'OPEN'
    };

    setTickets(prev => [newTicket, ...prev]);
    setDesc('');
    alert('Support ticket raised. Admins notified.');
  };

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        
        {/* Support Request Form */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Raise Support Issue</h2>
          <p className={styles.cardSubtitle}>File infrastructure reports to administrative desks.</p>
          
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className="form-group">
              <label className="form-label" htmlFor="categorySelect">Issue Category</label>
              <select
                id="categorySelect"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="form-input"
              >
                <option value="Wi-Fi">Wi-Fi & Internet</option>
                <option value="Power">Power Lines / Multiplugs</option>
                <option value="Food">Food / Water Refreshments</option>
                <option value="Hardware">Hardware Devices</option>
                <option value="Other">Other Problems</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="detailsText">Details Description</label>
              <textarea
                id="detailsText"
                rows="4"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Explain the problem..."
                className="form-input"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Raise Ticket
            </button>
          </form>
        </div>

        {/* Tickets History */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Active Support Tickets</h2>
          <p className={styles.cardSubtitle}>List of support issues raised by your desk during the event.</p>
          
          <div className={styles.ticketList}>
            {tickets.map(t => (
              <div key={t.id} className={styles.ticketItem}>
                <div className={styles.ticketHeader}>
                  <strong className={styles.ticketCategory}>{t.category}</strong>
                  <span className={t.status === 'OPEN' ? styles.openBadge : styles.closedBadge}>
                    {t.status}
                  </span>
                </div>
                <p className={styles.ticketDesc}>{t.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
