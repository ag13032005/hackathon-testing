'use client';

import { useState } from 'react';
import styles from './page.module.css';
import { useToast } from '@/components/ui/Toast';

export default function ManageModulePage() {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('Users');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Tab/Sub-sections required in the Manage Module
  const SECTIONS = [
    'Users', 'Roles', 'Permissions', 'Volunteers', 'Judges', 
    'Coordinators', 'Mentors', 'Organizers', 'Tracks', 'Venues', 
    'Devices', 'Certificates', 'Announcements', 'Payments', 
    'QR Codes', 'Schedule', 'Help Desk', 'Backups'
  ];

  // Mock database entries for each tab
  const [mockData, setMockData] = useState({
    Users: [
      { id: '1', name: 'Akash Kumar', email: 'akash@ewit.edu.in', role: 'PARTICIPANT', status: 'Active' },
      { id: '2', name: 'Dr. Ann', email: 'judge.ann@ewit.edu.in', role: 'JUDGE', status: 'Active' },
      { id: '3', name: 'Rahul S', email: 'coordinator.rahul@ewit.edu.in', role: 'COORDINATOR', status: 'Active' },
      { id: '4', name: 'Prof. Ram', email: 'hod.cse@ewit.edu.in', role: 'HOD', status: 'Active' }
    ],
    Roles: [
      { id: '1', name: 'Tech Head', desc: 'Super Administrator with global access to all systems and databases.', usersCount: 1 },
      { id: '2', name: 'HOD', desc: 'Department administrator with access to academic lists and override unlocks.', usersCount: 3 },
      { id: '3', name: 'Judge', desc: 'Evaluators with permissions to score assigned teams during hacking rounds.', usersCount: 8 },
      { id: '4', name: 'Coordinator', desc: 'Event volunteers running QR registrations and meal counters.', usersCount: 15 }
    ],
    Permissions: [
      { id: '1', permission: 'SYSTEM_SETTINGS_WRITE', role: 'TECH_HEAD', desc: 'Allows overriding active Event Mode.' },
      { id: '2', permission: 'TEAM_UNLOCK_WRITE', role: 'HOD, TECH_HEAD', desc: 'Unlocks team composition after locking.' },
      { id: '3', permission: 'SCORE_CARDS_WRITE', role: 'JUDGE', desc: 'Allows scoring teams in assigned tracks.' },
      { id: '4', permission: 'QR_CHECKIN_WRITE', role: 'COORDINATOR, TECH_HEAD', desc: 'Validates participant checks.' }
    ],
    Volunteers: [
      { id: '1', name: 'Pooja R', email: 'pooja.v@ewit.edu.in', task: 'Registration Desk Arena 1', duty: 'Morning Shift' },
      { id: '2', name: 'Vijay K', email: 'vijay.v@ewit.edu.in', task: 'Food Counter Lounge', duty: 'Night Shift' }
    ],
    Judges: [
      { id: '1', name: 'Dr. Ann', email: 'judge.ann@ewit.edu.in', track: 'AI & Automation', status: 'Assigned' },
      { id: '2', name: 'Dr. Srinivas', email: 'srinivas.j@ewit.edu.in', track: 'Sustainability & Green Tech', status: 'Assigned' }
    ],
    Coordinators: [
      { id: '1', name: 'Rahul S', email: 'coordinator.rahul@ewit.edu.in', desk: 'Meal Counters Desk A', status: 'On Duty' },
      { id: '2', name: 'Divya M', email: 'divya.c@ewit.edu.in', desk: 'Check-In Counter 2', status: 'On Duty' }
    ],
    Mentors: [
      { id: '1', name: 'Sanjay Dutt (Industry Expert)', company: 'Google Cloud India', track: 'AI & Automation', status: 'Available' },
      { id: '2', name: 'Sneha Rao (Alumni)', company: 'Infosys', track: 'Sustainability & Green Tech', status: 'Assigned' }
    ],
    Organizers: [
      { id: '1', name: 'Prof. Shanthi', dept: 'Information Science', role: 'Convener' },
      { id: '2', name: 'Prof. Harish', dept: 'Mechanical Dept', role: 'Co-convener' }
    ],
    Tracks: [
      { id: '1', title: 'AI & Automation', maxTeams: 30, activeTeams: 24 },
      { id: '2', title: 'HealthTech & Wellness', maxTeams: 20, activeTeams: 15 },
      { id: '3', title: 'Sustainability & Green Tech', maxTeams: 25, activeTeams: 22 },
      { id: '4', title: 'Smart Cities & IoT', maxTeams: 20, activeTeams: 18 },
      { id: '5', title: 'Open Innovation', maxTeams: 30, activeTeams: 19 }
    ],
    Venues: [
      { id: '1', name: 'EWIT Seminar Hall A', capacity: '150 Hacking seats', facilities: 'Wi-Fi Hubs, AC, Power lines' },
      { id: '2', name: 'EWIT CSE Main Lab', capacity: '200 Hacking seats', facilities: 'Ethernet ports, Power back' }
    ],
    Devices: [
      { id: '1', model: 'Honeywell Scanning Device A', mac: '00:1A:2B:3C:4D:5E', location: 'Gate check-in 1', status: 'Online' },
      { id: '2', model: 'Scanning Tablet B', mac: '00:1A:2B:3C:4D:6F', location: 'Meal Counter B', status: 'Online' }
    ],
    Certificates: [
      { id: '1', template: 'EWIT_Participant_Certificate_2026', type: 'Participation', status: 'Ready' },
      { id: '2', template: 'EWIT_Winner_Certificate_2026', type: 'Excellence', status: 'Ready' }
    ],
    Announcements: [
      { id: '1', title: 'Registration Extended', date: 'Jul 12, 2026', target: 'ALL' },
      { id: '2', title: 'Final Submission Guidelines', date: 'Jul 11, 2026', target: 'PARTICIPANTS' }
    ],
    Payments: [
      { id: '1', txId: 'pay_P123985', team: 'EcoSavers', amount: '₹1000', gateway: 'Razorpay', status: 'Captured' },
      { id: '2', txId: 'pay_P123986', team: 'IoTBuilders', amount: '₹1000', gateway: 'Razorpay', status: 'Captured' }
    ],
    'QR Codes': [
      { id: '1', qrData: 'ewit_qr_ananya_sharma', assignedTo: 'Ananya Sharma', status: 'Active' },
      { id: '2', qrData: 'ewit_qr_rohit_kumar', assignedTo: 'Rohit Kumar', status: 'Active' }
    ],
    Schedule: [
      { id: '1', event: 'Opening Ceremony', time: 'Sep 1, 09:00 AM', location: 'Seminar Hall' },
      { id: '2', event: 'Coding Commences', time: 'Sep 1, 10:00 AM', location: 'All Arenas' }
    ],
    'Help Desk': [
      { id: '1', category: 'Wi-Fi', desc: 'Arena 2 internet speed dropped.', status: 'OPEN' },
      { id: '2', category: 'Power', desc: 'Additional multi-plug requested.', status: 'RESOLVED' }
    ],
    Backups: [
      { id: '1', file: 'ewit_prod_backup_120726.sql', size: '1.2 GB', type: 'Auto Schedule', date: 'Jul 12, 2026' },
      { id: '2', file: 'ewit_prod_backup_110726.sql', size: '1.2 GB', type: 'Manual Trigger', date: 'Jul 11, 2026' }
    ]
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ field1: '', field2: '', field3: '' });

  const currentTabItems = mockData[activeTab] || [];
  
  const filteredItems = currentTabItems.filter(item => {
    const searchString = JSON.stringify(item).toLowerCase();
    return searchString.includes(searchQuery.toLowerCase());
  });

  const handleAddField = (e) => {
    e.preventDefault();
    if (!formData.field1) return;

    let newItem = {};
    if (activeTab === 'Users') {
      newItem = { id: String(currentTabItems.length + 1), name: formData.field1, email: formData.field2, role: formData.field3, status: 'Active' };
    } else if (activeTab === 'Tracks') {
      newItem = { id: String(currentTabItems.length + 1), title: formData.field1, maxTeams: parseInt(formData.field2) || 20, activeTeams: 0 };
    } else {
      newItem = { id: String(currentTabItems.length + 1), col1: formData.field1, col2: formData.field2, col3: formData.field3 };
    }

    setMockData(prev => ({
      ...prev,
      [activeTab]: [...prev[activeTab], newItem]
    }));

    setFormData({ field1: '', field2: '', field3: '' });
    setShowAddForm(false);
    toast.success('Item Added', `Successfully added new item to ${activeTab}!`);
  };

  const handleDeleteItem = (itemId) => {
    if (confirm('Are you sure you want to delete this configuration?')) {
      setMockData(prev => ({
        ...prev,
        [activeTab]: prev[activeTab].filter(item => item.id !== itemId)
      }));
    }
  };

  return (
    <div className={styles.container}>
      {/* ─── Manage Tabs Header Grid ─── */}
      <div className={styles.tabsGrid}>
        {SECTIONS.map((sec) => (
          <button
            key={sec}
            onClick={() => { setActiveTab(sec); setSearchQuery(''); setShowAddForm(false); }}
            className={`${styles.tabButton} ${activeTab === sec ? styles.tabActive : ''}`}
          >
            {sec}
          </button>
        ))}
      </div>

      {/* ─── Active Category Workspace ─── */}
      <div className={styles.card}>
        <div className={styles.workspaceHeader}>
          <div>
            <h2 className={styles.cardTitle}>{activeTab} Configurations</h2>
            <p className={styles.cardSubtitle}>Audit, search, create, or delete active {activeTab.toLowerCase()} properties.</p>
          </div>
          
          <button onClick={() => setShowAddForm(!showAddForm)} className="btn btn-primary btn-sm">
            {showAddForm ? 'Cancel Add' : `Add New ${activeTab.substring(0, activeTab.length - 1 || 1)}`}
          </button>
        </div>

        {/* Dynamic add form */}
        {showAddForm && (
          <form onSubmit={handleAddField} className={styles.addForm}>
            <div className={styles.formGrid}>
              <div className="form-group">
                <label className="form-label">
                  {activeTab === 'Users' ? 'Full Name' : (activeTab === 'Tracks' ? 'Track Title' : 'Property Name')}
                </label>
                <input
                  type="text"
                  value={formData.field1}
                  onChange={(e) => setFormData(prev => ({ ...prev, field1: e.target.value }))}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  {activeTab === 'Users' ? 'Email Address' : (activeTab === 'Tracks' ? 'Max Enrolled Teams' : 'Description / Value')}
                </label>
                <input
                  type="text"
                  value={formData.field2}
                  onChange={(e) => setFormData(prev => ({ ...prev, field2: e.target.value }))}
                  className="form-input"
                />
              </div>

              {activeTab === 'Users' && (
                <div className="form-group">
                  <label className="form-label">Select System Role</label>
                  <select
                    value={formData.field3}
                    onChange={(e) => setFormData(prev => ({ ...prev, field3: e.target.value }))}
                    className="form-input"
                  >
                    <option value="PARTICIPANT">PARTICIPANT</option>
                    <option value="COORDINATOR">COORDINATOR</option>
                    <option value="JUDGE">JUDGE</option>
                    <option value="HOD">HOD</option>
                  </select>
                </div>
              )}
            </div>
            <button type="submit" className="btn btn-accent btn-sm" style={{ marginTop: '12px' }}>
              Confirm Configuration Entry
            </button>
          </form>
        )}

        {/* Search filter bar */}
        <div className={styles.searchBarRow}>
          <input
            type="text"
            placeholder={`Search ${activeTab.toLowerCase()}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            style={{ width: '100%', maxWidth: '360px' }}
          />
        </div>

        {/* Configuration Data Tables */}
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                {activeTab === 'Users' && (
                  <>
                    <th>Name</th>
                    <th>Email</th>
                    <th>System Role</th>
                    <th>Status</th>
                  </>
                )}
                {activeTab === 'Tracks' && (
                  <>
                    <th>Track Title</th>
                    <th>Max Cap</th>
                    <th>Currently Enrolled</th>
                  </>
                )}
                {activeTab === 'Roles' && (
                  <>
                    <th>Role Title</th>
                    <th>Description</th>
                    <th>Enrolled Users Count</th>
                  </>
                )}
                {activeTab === 'Permissions' && (
                  <>
                    <th>Permission String</th>
                    <th>Granted Roles</th>
                    <th>Description</th>
                  </>
                )}
                {/* Fallback formatting for remaining lists */}
                {activeTab !== 'Users' && activeTab !== 'Tracks' && activeTab !== 'Roles' && activeTab !== 'Permissions' && (
                  <>
                    <th>Field 1</th>
                    <th>Field 2</th>
                    <th>Field 3</th>
                  </>
                )}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan="6" className={styles.emptyTable}>No matching configuration elements found.</td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    {activeTab === 'Users' && (
                      <>
                        <td><strong>{item.name}</strong></td>
                        <td>{item.email}</td>
                        <td><span className={styles.roleBadge}>{item.role}</span></td>
                        <td><span className={styles.activeBadge}>{item.status}</span></td>
                      </>
                    )}
                    {activeTab === 'Tracks' && (
                      <>
                        <td><strong>{item.title}</strong></td>
                        <td>{item.maxTeams} teams</td>
                        <td>{item.activeTeams} teams</td>
                      </>
                    )}
                    {activeTab === 'Roles' && (
                      <>
                        <td><strong>{item.name}</strong></td>
                        <td>{item.desc}</td>
                        <td>{item.usersCount} active users</td>
                      </>
                    )}
                    {activeTab === 'Permissions' && (
                      <>
                        <td><code>{item.permission}</code></td>
                        <td>{item.role}</td>
                        <td>{item.desc}</td>
                      </>
                    )}
                    {/* General listing parser for secondary tabs */}
                    {activeTab !== 'Users' && activeTab !== 'Tracks' && activeTab !== 'Roles' && activeTab !== 'Permissions' && (
                      <>
                        <td>{Object.values(item)[1] || '---'}</td>
                        <td>{Object.values(item)[2] || '---'}</td>
                        <td>{Object.values(item)[3] || '---'}</td>
                      </>
                    )}
                    <td>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className={styles.deleteButton}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
