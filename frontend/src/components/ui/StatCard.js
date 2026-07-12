import styles from './StatCard.module.css';

/**
 * StatCard - KPI dashboard metric card (Linear/Vercel style).
 *
 * @param {string} icon - Emoji or icon string
 * @param {string|number} value - The primary metric value
 * @param {string} label - Description label
 * @param {string} trend - Optional trend string (e.g. "+12 this week")
 * @param {'default'|'success'|'warning'|'danger'} accentColor
 */
export default function StatCard({ icon, value, label, trend, accentColor = 'default', className = '' }) {
  return (
    <div className={`${styles.statCard} ${styles[accentColor]} ${className}`}>
      {icon && <div className={styles.iconBox}>{icon}</div>}
      <div className={styles.body}>
        <span className={styles.value}>{value}</span>
        <span className={styles.label}>{label}</span>
        {trend && <span className={styles.trend}>{trend}</span>}
      </div>
    </div>
  );
}
