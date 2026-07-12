'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import styles from './Toast.module.css';

const ToastContext = createContext(null);

let toastIdCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ title, description, variant = 'success', duration = 4000 }) => {
    const id = ++toastIdCounter;
    const toast = { id, title, description, variant, exiting: false };
    setToasts(prev => [...prev, toast]);

    if (duration > 0) {
      setTimeout(() => dismissToast(id), duration);
    }

    return id;
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 300);
  }, []);

  const toast = useCallback({
    success: (title, description) => addToast({ title, description, variant: 'success' }),
    error: (title, description) => addToast({ title, description, variant: 'error' }),
    warning: (title, description) => addToast({ title, description, variant: 'warning' }),
    info: (title, description) => addToast({ title, description, variant: 'info' }),
  }, [addToast]);

  // Expose a simpler function-based API as well
  const toastFn = useCallback((title, description, variant) => {
    return addToast({ title, description, variant: variant || 'success' });
  }, [addToast]);

  // Attach variant methods to toastFn
  toastFn.success = (title, description) => addToast({ title, description, variant: 'success' });
  toastFn.error = (title, description) => addToast({ title, description, variant: 'error' });
  toastFn.warning = (title, description) => addToast({ title, description, variant: 'warning' });
  toastFn.info = (title, description) => addToast({ title, description, variant: 'info' });

  const VARIANT_ICONS = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  return (
    <ToastContext.Provider value={toastFn}>
      {children}
      {/* Toast Container */}
      <div className={styles.toastContainer} role="region" aria-label="Notifications">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`${styles.toast} ${styles[t.variant]} ${t.exiting ? styles.exiting : ''}`}
            role="alert"
          >
            <div className={styles.iconWrapper}>
              <span className={styles.icon}>{VARIANT_ICONS[t.variant]}</span>
            </div>
            <div className={styles.content}>
              {t.title && <div className={styles.title}>{t.title}</div>}
              {t.description && <div className={styles.description}>{t.description}</div>}
            </div>
            <button
              className={styles.closeBtn}
              onClick={() => dismissToast(t.id)}
              aria-label="Dismiss notification"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a <ToastProvider>');
  }
  return ctx;
}
