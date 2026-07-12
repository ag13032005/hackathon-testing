import styles from './Alert.module.css';

/**
 * Alert - Contextual banner notification.
 *
 * @param {string} title - Bold headline text
 * @param {string} description - Secondary text
 * @param {'warning'|'info'|'success'|'danger'} variant
 * @param {React.ReactNode} action - Optional action element (button, link)
 */
export default function Alert({ title, description, variant = 'warning', action, className = '' }) {
  const ICONS = {
    warning: '⚠️',
    info: 'ℹ️',
    success: '✅',
    danger: '🚨',
  };

  return (
    <div className={`${styles.alert} ${styles[variant]} ${className}`} role="alert">
      <div className={styles.iconArea}>
        <span className={styles.icon}>{ICONS[variant]}</span>
      </div>
      <div className={styles.body}>
        {title && <div className={styles.title}>{title}</div>}
        {description && <div className={styles.description}>{description}</div>}
      </div>
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}
