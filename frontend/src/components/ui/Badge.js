import styles from './Badge.module.css';

/**
 * Badge - Semantic status pill indicator.
 *
 * @param {'success'|'warning'|'danger'|'info'|'neutral'|'primary'} variant
 * @param {string} size - 'sm' | 'md'
 * @param {boolean} dot - Show a pulsing status dot
 */
export default function Badge({ children, variant = 'neutral', size = 'md', dot = false, className = '' }) {
  return (
    <span className={`${styles.badge} ${styles[variant]} ${styles[size]} ${className}`}>
      {dot && <span className={styles.dot} />}
      {children}
    </span>
  );
}
