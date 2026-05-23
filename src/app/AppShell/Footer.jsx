import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.scss';

const APP_VERSION = '1.0.0';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.section}>
          <p className={styles.copyright}>
            &copy; {currentYear} Boilerplate App. All rights reserved.
          </p>
          <span className={styles.version}>Version {APP_VERSION}</span>
        </div>
        
        <nav className={styles.links}>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
          <Link to="/contact">Contact Us</Link>
          <a 
            href="https://github.com/yourusername/your-repo" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </nav>
        
        <div className={styles.social}>
          <a 
            href="https://twitter.com/yourusername" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="Twitter"
          >
            𝕏
          </a>
          <a 
            href="https://github.com/yourusername" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            ◇
          </a>
          <a 
            href="https://linkedin.com/in/yourusername" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            in
          </a>
        </div>
      </div>
    </footer>
  );
};