import React from 'react';
import styles from './FormField.module.scss';

const FormField = ({
  label,
  name,
  type = 'text',
  error,
  touched,
  required = false,
  helperText,
  className = '',
  inputProps = {},
  ...props
}) => {
  const inputId = `field-${name}`;
  const errorId = `error-${name}`;
  const helperId = `helper-${name}`;
  
  const hasError = touched && error;
  const fieldClassName = `
    ${styles.formField}
    ${hasError ? styles.error : ''}
    ${className}
  `.trim();

  return (
    <div className={fieldClassName}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      
      <div className={styles.inputWrapper}>
        <input
          id={inputId}
          type={type}
          name={name}
          className={styles.input}
          aria-invalid={hasError ? 'true' : 'false'}
          aria-describedby={`${hasError ? errorId : ''} ${helperText ? helperId : ''}`}
          {...inputProps}
          {...props}
        />
      </div>

      {hasError && (
        <div id={errorId} className={styles.errorText} role="alert">
          {error}
        </div>
      )}

      {helperText && !hasError && (
        <div id={helperId} className={styles.helperText}>
          {helperText}
        </div>
      )}
    </div>
  );
};

export default FormField;