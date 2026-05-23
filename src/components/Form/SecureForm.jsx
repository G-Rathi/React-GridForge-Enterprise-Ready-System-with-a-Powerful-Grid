import React, { useRef, useEffect } from 'react';
import { sanitizeHtml } from '../../libs/dompurify';
import styles from './SecureForm.module.scss';

/**
 * SecureForm component adds security features to standard forms:
 * - CSRF protection
 * - XSS prevention
 * - Input sanitization
 * - Auto-disable on submit
 * - Honeypot fields
 */
const SecureForm = ({
  onSubmit,
  children,
  className = '',
  csrfToken,
  disableOnSubmit = true,
  sanitizeInputs = true,
  addHoneypot = true,
  ...props
}) => {
  const formRef = useRef(null);
  const submitButtonRef = useRef(null);
  const originalValues = useRef({});

  useEffect(() => {
    // Store original form values for comparison
    if (formRef.current) {
      const formElements = formRef.current.elements;
      for (let i = 0; i < formElements.length; i++) {
        const element = formElements[i];
        if (element.type !== 'submit') {
          originalValues.current[element.name] = element.value;
        }
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Disable form during submission if requested
    if (disableOnSubmit && submitButtonRef.current) {
      submitButtonRef.current.disabled = true;
    }

    try {
      const formData = new FormData(e.target);
      const data = {};

      // Convert FormData to object and sanitize if needed
      for (let [key, value] of formData.entries()) {
        if (key === 'honeypot' && value) {
          // If honeypot field is filled, silently reject the submission
          console.warn('Potential bot submission detected');
          return;
        }

        // Sanitize input values if enabled
        data[key] = sanitizeInputs ? sanitizeHtml(value) : value;
      }

      // Add CSRF token if provided
      if (csrfToken) {
        data._csrf = csrfToken;
      }

      await onSubmit(data, e);
    } catch (error) {
      console.error('Form submission error:', error);
      throw error;
    } finally {
      // Re-enable form after submission
      if (disableOnSubmit && submitButtonRef.current) {
        submitButtonRef.current.disabled = false;
      }
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className={`${styles.secureForm} ${className}`}
      {...props}
    >
      {csrfToken && (
        <input type="hidden" name="_csrf" value={csrfToken} />
      )}
      
      {addHoneypot && (
        <div className={styles.honeypot}>
          <input
            type="text"
            name="honeypot"
            autoComplete="off"
            tabIndex="-1"
            aria-hidden="true"
          />
        </div>
      )}

      {children}
    </form>
  );
};

export default SecureForm;