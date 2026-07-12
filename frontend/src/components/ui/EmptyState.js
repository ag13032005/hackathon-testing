import styles from './EmptyState.module.css';

/**
 * EmptyState - Placeholder panel for empty data views.
 *
 * @param {string} icon - Emoji or icon
 * @param {string} title - Headline
 * @param {string} description - Supporting text
 * @param {React.ReactNode} action - Optional CTA button
 */
export default function EmptyState({ icon = '📭', title, description, action, className = '' }) {
  return (
    <div className={`${styles.emptyState} ${className}`}>
      <div className={styles.iconCircle}>{icon}</div>
      {title && <h3 className={styles.title}>{title}</h3>}
      {description && <p className={styles.description}>{description}</p>}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}
