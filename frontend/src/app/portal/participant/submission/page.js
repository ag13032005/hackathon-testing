'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function ParticipantSubmissionPage() {
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [presentationUrl, setPresentationUrl] = useState('');
  const [prototypeUrl, setPrototypeUrl] = useState('');
  const [isLocked, setIsLocked] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLocked(true);
    alert('Project details locked and submitted to judges successfully!');
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Project Submission Workspace</h2>
        <p className={styles.cardSubtitle}>Submit your repository, pitch deck, and working prototype link for evaluation rounds.</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className="form-group">
            <label className="form-label" htmlFor="titleInput">Project Title</label>
            <input
              type="text"
              id="titleInput"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              placeholder="e.g. Smart Compost IoT Monitor"
              className="form-input"
              required
              disabled={isLocked}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="descText">Brief Description</label>
            <textarea
              id="descText"
              rows="3"
              value={projectDesc}
              onChange={(e) => setProjectDesc(e.target.value)}
              placeholder="Explain what your prototype accomplishes..."
              className="form-input"
              required
              disabled={isLocked}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="gitInput">GitHub Repository URL</label>
            <input
              type="url"
              id="gitInput"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/your-username/repo-name"
              className="form-input"
              required
              disabled={isLocked}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="presInput">Presentation Pitch Deck Link</label>
            <input
              type="url"
              id="presInput"
              value={presentationUrl}
              onChange={(e) => setPresentationUrl(e.target.value)}
              placeholder="https://docs.google.com/presentation/d/your-presentation-id"
              className="form-input"
              required
              disabled={isLocked}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="protoInput">Live Prototype Link (Optional)</label>
            <input
              type="url"
              id="protoInput"
              value={prototypeUrl}
              onChange={(e) => setPrototypeUrl(e.target.value)}
              placeholder="https://your-app.vercel.app"
              className="form-input"
              disabled={isLocked}
            />
          </div>

          {!isLocked ? (
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '12px' }}>
              Lock and Submit Project Details
            </button>
          ) : (
            <div className={styles.lockedNotice}>
              🔒 Submission Locked (Judges reviewing details)
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
