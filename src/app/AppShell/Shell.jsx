import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import styles from './Shell.module.scss';
import Sidebar from './Sidebar';
import { useCancelApiOnRouteChange } from '../../hooks/useCancelApiOnRouteChange';

const Shell = (props) => {
  const { menulist } = props;
  // ensure any pending API calls from previous route are cancelled on navigation
  useCancelApiOnRouteChange();
  return (
    <div className={styles.shell}>
      <Header />
      <div className={styles.content}>
        <Sidebar menulist={menulist} />
        <main className={styles.main}>
          <div className={styles.mainContent}>
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default Shell;
