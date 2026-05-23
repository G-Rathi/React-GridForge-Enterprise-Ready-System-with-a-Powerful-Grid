import React from 'react';
import styles from './Button.module.scss';

export const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  const buttonClasses = `${styles.button} ${styles[variant]} ${styles[size]} ${className}`;

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <span className={styles.loading}>Loading...</span>
      ) : (
        children
      )}
    </button>
  );
};