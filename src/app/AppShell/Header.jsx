import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../common/contexts/AuthContext';
import styles from './Header.module.scss';

export const Header = () => {
  const user = useSelector(state => state.user.user);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link to="/">Boilerplate App</Link>
      </div>
      <nav className={styles.nav}>
        {user ? (
          <>
            <div className={styles.userInfo}>
              Welcome, {user.name || 'User'}
            </div>
            {/* <Link to="/profile" className={styles.navLink}>Profile</Link> */}
            <button 
              onClick={handleLogout}
              className={`${styles.logoutButton} ${isLoading ? styles.loading : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Logging out...' : 'Logout'}
            </button>
          </>
        ) : (
          <Link to="/login" className={styles.loginButton}>Login</Link>
        )}
      </nav>
    </header>
  );
};