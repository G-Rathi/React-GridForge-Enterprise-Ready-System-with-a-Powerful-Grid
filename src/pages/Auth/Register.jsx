import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import SEOHelmet from '../../common/SEO/SEOHelmet';
import { useAuth } from '../../common/contexts/AuthContext';
import styles from './Register.module.scss';

// Registration form validation schema
const schema = yup.object().shape({
  firstName: yup
    .string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters'),
  lastName: yup
    .string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters'),
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
    ),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
  terms: yup
    .boolean()
    .oneOf([true], 'You must accept the terms and conditions')
});

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { register: registerUser } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError('');
      await registerUser(data);
      // Redirect is handled by auth context
    } catch (err) {
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SEOHelmet 
        title="Create Account"
        description="Create your account to get started"
      />
      <div className={styles['register-container']}>
        <div className={styles['register-box']}>
          {/* Header */}
          <div className={styles.header}>
            <img
              className={styles.logo}
              src="/assets/LoginPageLogo.png"
              alt="Your Logo"
            />
            <h2 className={styles.title}>
              Create your account
            </h2>
            <p className={styles.subtitle}>
              Already have an account?{' '}
              <Link to="/login">
                Sign in
              </Link>
            </p>
          </div>

          {/* Form */}
          <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            {/* Error Message */}
            {error && (
              <div className={styles['error-alert']}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <p>{error}</p>
              </div>
            )}

            {/* Name Fields */}
            <div className={styles['form-row']}>
              <div className={styles['form-group']}>
                <label htmlFor="firstName">First Name</label>
                <input
                  {...register('firstName')}
                  id="firstName"
                  type="text"
                  autoComplete="given-name"
                  className={errors.firstName ? styles.error : ''}
                  placeholder="Enter your first name"
                />
                {errors.firstName && (
                  <p className={styles['error-message']}>
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div className={styles['form-group']}>
                <label htmlFor="lastName">Last Name</label>
                <input
                  {...register('lastName')}
                  id="lastName"
                  type="text"
                  autoComplete="family-name"
                  className={errors.lastName ? styles.error : ''}
                  placeholder="Enter your last name"
                />
                {errors.lastName && (
                  <p className={styles['error-message']}>
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div className={styles['form-group']}>
              <label htmlFor="email">Email Address</label>
              <input
                {...register('email')}
                id="email"
                type="email"
                autoComplete="email"
                className={errors.email ? styles.error : ''}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className={styles['error-message']}>
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Fields */}
            <div className={styles['form-row']}>
              <div className={styles['form-group']}>
                <label htmlFor="password">Password</label>
                <input
                  {...register('password')}
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  className={errors.password ? styles.error : ''}
                  placeholder="Create a password"
                />
                {errors.password && (
                  <p className={styles['error-message']}>
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className={styles['form-group']}>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  {...register('confirmPassword')}
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  className={errors.confirmPassword ? styles.error : ''}
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && (
                  <p className={styles['error-message']}>
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className={styles.terms}>
              <label>
                <input
                  type="checkbox"
                  {...register('terms')}
                  className={errors.terms ? styles.error : ''}
                /> I agree to the{' '}
                <Link to="/terms">Terms of Service</Link> and{' '}
                <Link to="/privacy">Privacy Policy</Link>
              </label>
              {errors.terms && (
                <p className={styles['error-message']}>
                  {errors.terms.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={styles['submit-button']}
            >
              {isLoading ? (
                <>
                  <svg
                    className={styles.spinner}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      opacity="0.25"
                    />
                    <path
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      opacity="0.75"
                    />
                  </svg>
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Social Sign Up Options */}
          <div className={styles.divider}>
            <span>Or continue with</span>
          </div>

          <div className={styles['social-buttons']}>
            <button type="button">
              <span className="sr-only">Sign up with Google</span>
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
              </svg>
            </button>

            <button type="button">
              <span className="sr-only">Sign up with GitHub</span>
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;