import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import SEOHelmet from '../../common/SEO/SEOHelmet';
import { useAuth } from '../../common/contexts/AuthContext';
import styles from './Login.module.scss';

// Login form validation schema
const schema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
});

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError('');

      await login(data.email, data.password);
      // Redirect is handled by auth context
    } catch (err) {
      setError(err.message || 'Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  console.log('Login page useForm register', register);

  return (
    <>
      <SEOHelmet title="Login" description="Login to access your account" />
      <div className={styles['login-container']}>
        <div className={styles['login-box']}>
          {/* Header */}
          <div className={styles.header}>
            <img
              className={styles.logo}
              src="/assets/LoginPageLogo.png"
              alt="Logo"
            />
            <h2 className={styles.title}>Welcome</h2>
            {/* <p className={styles.subtitle}>
              Don't have an account? <Link to="/register">Sign up</Link>
            </p> */}
          </div>

          {/* Form */}
          <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <div className={styles['form-group']}>
              <label htmlFor="email">Email address</label>
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

            <div className={styles['form-group']}>
              <label htmlFor="password">Password</label>
              <input
                {...register('password')}
                id="password"
                type="password"
                autoComplete="current-password"
                className={errors.password ? styles.error : ''}
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className={styles['error-message']}>
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember me & Forgot password */}
            <div className={styles['flex-row']}>
              <div className={styles['remember-me']}>
                <input id="remember-me" name="remember-me" type="checkbox" />
                <label htmlFor="remember-me">Remember me</label>
              </div>

              {/* <Link to="/forgot-password" className={styles['forgot-password']}>
                Forgot your password?
              </Link> */}
            </div>

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
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
            <div className={styles['login-note']}>
              Note: Please login with random credentials for demo purposes.
            </div>
          </form>

          {/* Social Login Options */}
          <div className={styles.divider}>
            <span>Or continue with</span>
          </div>

          <div className={styles['social-buttons']}>
            <button type="button">
              <span className="sr-only">Sign in with Google</span>
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
              </svg>
            </button>

            <button type="button">
              <span className="sr-only">Sign in with GitHub</span>
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

export default Login;
