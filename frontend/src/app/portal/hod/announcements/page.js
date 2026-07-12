'use client';

import { useState } from 'react';
import styles from './page.module.css';
import { useToast } from '@/components/ui/Toast';

export default function HodAnnouncementsPage() {
  const toast = useToast();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [target, setTarget] = useState('ALL');
  const [announcements, setAnnouncements] = useState([
    { id: 1, title: 'Department Lab Access Hours', content: 'CSE Project Labs will remain open 24 hours starting tonight for registered teams.', target: 'PARTICIPANTS', date: 'Jul 12, 2026' },
    { id: 2, title: 'Mentors Assignment List', content: 'Each team is mapped to an internal academic advisor. Check lists on notice board.', target: 'ALL', date: 'Jul 11, 2026' }
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
    toast.success('Notice Published', 'Department notice broadcasted successfully!');
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this notice?')) {
      setAnnouncements(prev => prev.filter(ann => ann.id !== id));
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        
        {/* Post notice */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Write Department Circular</h2>
          <p className={styles.cardSubtitle}>Broadcast alerts directly to department portals.</p>
          
          <form onSubmit={handlePost} className={styles.form}>
            <div className="form-group">
              <label className="form-label" htmlFor="title">Notice Title</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Lab 3 AC issue resolved..."
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="target">Target Audience</label>
              <select
                id="target"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="form-input"
              >
                <option value="ALL">Everyone in Department</option>
                <option value="PARTICIPANTS">Participants Only</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="content">Notice Details</label>
              <textarea
                id="content"
                rows="4"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Describe details..."
                className="form-input"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Post Department Notice
            </button>
          </form>
        </div>

        {/* History */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Active Department Circulars</h2>
          <p className={styles.cardSubtitle}>List of notifications published to current department students.</p>
          
          <div className={styles.noticeList}>
            {announcements.map(ann => (
              <div key={ann.id} className={styles.noticeItem}>
                <div className={styles.noticeHeader}>
                  <strong>{ann.title}</strong>
                  <span className={styles.targetBadge}>{ann.target}</span>
                </div>
                <p className={styles.noticeContent}>{ann.content}</p>
                <div className={styles.noticeFooter}>
                  <span>Date: {ann.date}</span>
                  <button onClick={() => handleDelete(ann.id)} className={styles.deleteLink}>Remove Notice</button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
