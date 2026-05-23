import React from 'react';
import styles from './LoadingSpinner.module.scss';

const LoadingSpinner = ({ 
  size = 'medium', 
  color = 'primary',
  fullScreen = false,
  overlay = false,
}) => {
  const spinnerClasses = `
    ${styles.spinner}
    ${styles[size]}
    ${styles[color]}
    ${fullScreen ? styles.fullScreen : ''}
    ${overlay ? styles.overlay : ''}
  `;

  const spinner = (
    <div className={spinnerClasses}>
      <div className={styles.spinnerInner}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <span className={styles.srOnly}>Loading...</span>
    </div>
  );

  if (fullScreen || overlay) {
    return (
      <div className={styles.container}>
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;