/**
 * Collection of validator functions for common use cases
 */

/**
 * Validate email address format
 * @param {string} email - Email address to validate
 * @returns {boolean} True if valid email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @param {Object} options - Validation options
 * @returns {Object} Validation result with details
 */
export const validatePassword = (password, options = {}) => {
  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSpecial = true
  } = options;

  const result = {
    isValid: true,
    errors: []
  };

  if (password.length < minLength) {
    result.errors.push(`Password must be at least ${minLength} characters long`);
  }

  if (requireUppercase && !/[A-Z]/.test(password)) {
    result.errors.push('Password must contain at least one uppercase letter');
  }

  if (requireLowercase && !/[a-z]/.test(password)) {
    result.errors.push('Password must contain at least one lowercase letter');
  }

  if (requireNumbers && !/\d/.test(password)) {
    result.errors.push('Password must contain at least one number');
  }

  if (requireSpecial && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    result.errors.push('Password must contain at least one special character');
  }

  result.isValid = result.errors.length === 0;
  return result;
};

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @param {boolean} [requireHttps=false] - Whether to require HTTPS
 * @returns {boolean} True if valid URL format
 */
export const isValidUrl = (url, requireHttps = false) => {
  try {
    const urlObj = new URL(url);
    if (requireHttps && urlObj.protocol !== 'https:') {
      return false;
    }
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate phone number format
 * @param {string} phone - Phone number to validate
 * @param {string} [country='US'] - Country code for validation
 * @returns {boolean} True if valid phone format
 */
export const isValidPhone = (phone, country = 'US') => {
  // Remove all non-numeric characters
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Basic validation patterns for different countries
  const patterns = {
    US: /^1?\d{10}$/, // USA: optional 1 + 10 digits
    UK: /^44?\d{10}$/, // UK: optional 44 + 10 digits
    // Add more country patterns as needed
  };

  return patterns[country] ? patterns[country].test(cleanPhone) : false;
};

/**
 * Validate credit card number using Luhn algorithm
 * @param {string} cardNumber - Credit card number to validate
 * @returns {boolean} True if valid card number
 */
export const isValidCreditCard = (cardNumber) => {
  const cleanNumber = cardNumber.replace(/\D/g, '');
  if (!/^\d{13,19}$/.test(cleanNumber)) return false;

  let sum = 0;
  let isEven = false;

  // Luhn algorithm
  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber[i]);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

/**
 * Validate date format and range
 * @param {string} date - Date string to validate
 * @param {Object} options - Validation options
 * @returns {boolean} True if valid date
 */
export const isValidDate = (date, options = {}) => {
  const {
    format = 'YYYY-MM-DD',
    minDate,
    maxDate
  } = options;

  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return false;

  if (minDate && dateObj < new Date(minDate)) return false;
  if (maxDate && dateObj > new Date(maxDate)) return false;

  return true;
};