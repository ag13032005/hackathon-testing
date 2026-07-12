'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function AnnouncementsPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [target, setTarget] = useState('ALL');
  const [announcements, setAnnouncements] = useState([
    { id: 1, title: 'Final Phase Registrations Extended', content: 'In response to multiple college requests, registration is extended to August 24.', target: 'ALL', date: 'Jul 12, 2026' },
    { id: 2, title: 'Evaluation Criteria for Judges', content: 'Please review the 4 core scoring categories before evaluating presentations.', target: 'JUDGES', date: 'Jul 11, 2026' }
  ]);

  const handlePost = (e) => {
    e.preventDefault();
    if (!title || !content) return;

    const newAnn = {
      id: Date.now(),
      title,
      content,
      target,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    setAnnouncements(prev => [newAnn, ...prev]);
    setTitle('');
    setContent('');
    alert('Announcement published successfully to all portals!');
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this announcement?')) {
      setAnnouncements(prev => prev.filter(ann => ann.id !== id));
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.annGrid}>
        
        {/* Post Form */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Write Announcement</h2>
          <p className={styles.cardSubtitle}>Broadcast notifications immediately based on target credentials.</p>
          
          <form onSubmit={handlePost} className={styles.form}>
            <div className="form-group">
              <label className="form-label" htmlFor="title">Notice Title</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Wi-Fi Hotspots Active..."
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="target">Broadcast Audience Target</label>
              <select
                id="target"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="form-input"
              >
                <option value="ALL">Everyone (Public + Portal)</option>
                <option value="PARTICIPANTS">Participants Only</option>
                <option value="JUDGES">Judges Only</option>
                <option value="COORDINATORS">Coordinators Only</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="content">Content Message</label>
              <textarea
                id="content"
                rows="5"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write notice description..."
                className="form-input"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Publish Broadcast
            </button>
          </form>
        </div>

        {/* History / Active notices */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Published Notices History</h2>
          <p className={styles.cardSubtitle}>Active announcements distributed across the platform portals.</p>
          
          <div className={styles.noticeList}>
            {announcements.length === 0 ? (
              <div className={styles.emptyNotices}>No active notices published yet.</div>
            ) : (
              announcements.map(ann => (
                <div key={ann.id} className={styles.noticeItem}>
                  <div className={styles.noticeHeader}>
                    <strong>{ann.title}</strong>
                    <span className={styles.targetBadge}>{ann.target}</span>
                  </div>
                  <p className={styles.noticeContent}>{ann.content}</p>
                  <div className={styles.noticeFooter}>
                    <span>Published: {ann.date}</span>
                    <button onClick={() => handleDelete(ann.id)} className={styles.deleteLink}>Delete Notice</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
