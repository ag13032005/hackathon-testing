'use client';

import { useState } from 'react';
import styles from './page.module.css';
import { useToast } from '@/components/ui/Toast';

export default function HodSchedulePage() {
  const toast = useToast();
  const [schedule, setSchedule] = useState([
    { id: 1, event: 'Team Registrations Desk Open', time: 'Sep 1, 08:00 AM', location: 'EWIT Lobby Entrance' },
    { id: 2, event: 'Inauguration Ceremony', time: 'Sep 1, 09:30 AM', location: 'Main Seminar Hall' },
    { id: 3, event: 'Hackathon Commences (Round 1)', time: 'Sep 1, 10:30 AM', location: 'EWIT Lab Arenas' },
    { id: 4, event: 'Lunch Break & Mentoring Round', time: 'Sep 1, 01:30 PM', location: 'EWIT Food Court' }
  ]);

  const [newEvent, setNewEvent] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newLoc, setNewLoc] = useState('');

  const handleAddSchedule = (e) => {
    e.preventDefault();
    if (!newEvent || !newTime) return;

    const newSched = {
      id: Date.now(),
      event: newEvent,
      time: newTime,
      location: newLoc || 'EWIT Campus'
    };

    setSchedule(prev => [...prev, newSched]);
    setNewEvent('');
    setNewTime('');
    setNewLoc('');
    toast.success('Schedule Updated', 'Timeline schedule slot updated!');
  };

  const handleDeleteSchedule = (id) => {
    if (confirm('Are you sure you want to remove this schedule slot?')) {
      setSchedule(prev => prev.filter(s => s.id !== id));
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        
        {/* Add Schedule Slot */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Manage Event Schedule</h2>
          <p className={styles.cardSubtitle}>Configure event day schedule timelines for EWIT Hackathon Day.</p>
          
          <form onSubmit={handleAddSchedule} className={styles.form}>
            <div className="form-group">
              <label className="form-label" htmlFor="event">Event Name</label>
              <input
                type="text"
                id="event"
                value={newEvent}
                onChange={(e) => setNewEvent(e.target.value)}
                placeholder="Mentoring Session 2..."
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="time">Time Slot</label>
              <input
                type="text"
                id="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                placeholder="Sep 1, 04:00 PM..."
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="location">Location Room</label>
              <input
                type="text"
                id="location"
                value={newLoc}
                onChange={(e) => setNewLoc(e.target.value)}
                placeholder="CSE Project Lab..."
                className="form-input"
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Add Schedule Milestone
            </button>
          </form>
        </div>

        {/* Schedule List */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Event Timeline Schedule</h2>
          <p className={styles.cardSubtitle}>Current schedule timeline as published to student portals.</p>
          
          <div className={styles.timelineList}>
            {schedule.map((item) => (
              <div key={item.id} className={styles.timelineItem}>
                <div className={styles.timelineContent}>
                  <strong>{item.event}</strong>
                  <span className={styles.time}>{item.time}</span>
                  <span className={styles.loc}>📍 {item.location}</span>
                </div>
                <button
                  onClick={() => handleDeleteSchedule(item.id)}
                  className={styles.deleteLink}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
