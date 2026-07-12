'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import styles from './layout.module.css';

/* ─── Role-Based Siderbar Configs ─── */
const SIDEBAR_MENUS = {
  TECH_HEAD: [
    { label: 'Dashboard', path: '/portal/tech-head' },
    { label: 'Manage Module', path: '/portal/tech-head/manage' },
    { label: 'Event Mode Settings', path: '/portal/tech-head/settings' },
    { label: 'Announcements', path: '/portal/tech-head/announcements' },
    { label: 'Database & Backups', path: '/portal/tech-head/backups' },
    { label: 'Score Overrides', path: '/portal/tech-head/scores' }
  ],
  HOD: [
    { label: 'Dashboard Overview', path: '/portal/hod' },
    { label: 'View Analytics', path: '/portal/hod/analytics' },
    { label: 'Manage Schedule', path: '/portal/hod/schedule' },
    { label: 'Announcements', path: '/portal/hod/announcements' },
    { label: 'Judging Progress', path: '/portal/hod/judging' },
    { label: 'Generate Reports', path: '/portal/hod/reports' }
  ],
  JUDGE: [
    { label: 'Dashboard Overview', path: '/portal/judge' },
    { label: 'Assigned Teams', path: '/portal/judge/teams' },
    { label: 'Scoring Board', path: '/portal/judge/scoring' }
  ],
  COORDINATOR: [
    { label: 'Dashboard Overview', path: '/portal/coordinator' },
    { label: 'Scan Participant QR', path: '/portal/coordinator/scan' },
    { label: 'Meal & Kit Coupons', path: '/portal/coordinator/coupons' },
    { label: 'Check-in Desk', path: '/portal/coordinator/check-in' },
    { label: 'Raise Support Request', path: '/portal/coordinator/support' }
  ],
  PARTICIPANT: [
    { label: 'Dashboard', path: '/portal/participant' },
    { label: 'Team Workspace', path: '/portal/participant/team' },
    { label: 'Submit Project', path: '/portal/participant/submission' },
    { label: 'Event Pass & QR', path: '/portal/participant/pass' }
  ]
};

export default function PortalLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState('dark');

  // Verify Role and Route Alignment (RBAC)
  useEffect(() => {
    const userStr = localStorage.getItem('ewit_current_user');
    
    if (!userStr) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(userStr);
    setCurrentUser(user);
    setLoading(false);

    // Strict path checks based on roles
    if (pathname.startsWith('/portal/tech-head') && user.role !== 'TECH_HEAD') {
      router.push('/portal/' + user.role.toLowerCase().replace('_', '-'));
    } else if (pathname.startsWith('/portal/hod') && user.role !== 'HOD') {
      router.push('/portal/' + user.role.toLowerCase().replace('_', '-'));
    } else if (pathname.startsWith('/portal/judge') && user.role !== 'JUDGE') {
      router.push('/portal/' + user.role.toLowerCase().replace('_', '-'));
    } else if (pathname.startsWith('/portal/coordinator') && user.role !== 'COORDINATOR') {
      router.push('/portal/' + user.role.toLowerCase().replace('_', '-'));
    } else if (pathname.startsWith('/portal/participant') && user.role !== 'PARTICIPANT') {
      router.push('/portal/' + user.role.toLowerCase().replace('_', '-'));
    }

  }, [pathname, router]);

  // Load and apply theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('ewit-theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('ewit_current_user');
    router.push('/login');
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('ewit-theme', nextTheme);
  };

  if (loading || !currentUser) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.spinner}></div>
        <p>Loading Workspace...</p>
      </div>
    );
  }

  const menuItems = SIDEBAR_MENUS[currentUser.role] || [];
  const displayRoleName = currentUser.role.replace('_', ' ');

  return (
    <div className={styles.layout}>
      {/* ─── Sidebar ─── */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoIcon}>⬡</span>
            <div>
              <span className={styles.logoText}>EWIT Portal</span>
              <span className={styles.logoSub}>Earth & Innovation</span>
            </div>
          </Link>
        </div>

        {/* User Card */}
        <div className={styles.userCard}>
          <div className={styles.userAvatar}>
            {currentUser.fullName ? currentUser.fullName[0].toUpperCase() : 'U'}
          </div>
          <div className={styles.userInfo}>
            <div className={styles.userName}>{currentUser.fullName}</div>
            <div className={styles.userRoleBadge}>{displayRoleName}</div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className={styles.navMenu}>
          {menuItems.map((item, index) => {
            const isActive = pathname === item.path || pathname.startsWith(item.path + '/');
            return (
              <Link
                key={index}
                href={item.path}
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className={styles.sidebarFooter}>
          <button onClick={toggleTheme} className={styles.footerBtn}>
            {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
          <button onClick={handleLogout} className={`${styles.footerBtn} ${styles.logoutBtn}`}>
            🚪 Log Out
          </button>
        </div>
      </aside>

      {/* ─── Main Content Wrapper ─── */}
      <div className={styles.mainWrapper}>
        {/* Top Header */}
        <header className={styles.topHeader}>
          <div className={styles.headerTitle}>
            {currentUser.role === 'TECH_HEAD' && '⚙️ Tech Head Administrative Console'}
            {currentUser.role === 'HOD' && '🏢 Departmental Portal'}
            {currentUser.role === 'JUDGE' && '⚖️ Evaluation Workspace'}
            {currentUser.role === 'COORDINATOR' && '🎟️ Event Operations Desk'}
            {currentUser.role === 'PARTICIPANT' && '🚀 Hacking Workspace'}
          </div>
          <div className={styles.systemStatus}>
            <span className={styles.statusDot}></span>
            <span>System Active</span>
          </div>
        </header>

        {/* Actual Content of Child Routes */}
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
}
