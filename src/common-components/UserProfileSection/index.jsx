import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from './UserProfileSection.module.scss';
import { ClickOutside } from '../../CommonUtilityFunctions';
import moment from 'moment';

const UserProfileSection = ({ appConfig = {}, title = '' }) => {
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef(null);

  // ✅ username
  const userName = useMemo(() => {
    return (appConfig?.userName || '').trim();
  }, [appConfig?.userName]);

  // ✅ user details
  const userDetails = useMemo(() => {
    try {
      return appConfig?.lastLogin
        ? JSON.parse(appConfig.lastLogin)
        : {};
    } catch {
      return {};
    }
  }, [appConfig?.lastLogin]);

  const profileImage = userDetails?.img || '';
  const lastLogin = userDetails?.lastLogin || '';

  // ✅ initials
  const initials = useMemo(() => {
    if (!userName) return 'A';

    const parts = userName.split(' ').filter(Boolean);

    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }

    return parts[0][0].toUpperCase();
  }, [userName]);

  // ✅ formatted last login (optional but clean)
  const formattedLastLogin = useMemo(() => {
    if (!lastLogin) return 'N/A';

    const m = moment(lastLogin, [
      'M/D/YYYY h:mm:ss A',
      moment.ISO_8601
    ]);

    return m.isValid() ? m.format('DD-MMM-YYYY h:mm A') : 'N/A';
  }, [lastLogin]);

  // ✅ click outside
  useEffect(() => {
    const cleanup = ClickOutside(popupRef, setShowPopup);
    return cleanup;
  }, []);

  return (
    <div className={styles.UserProfileOuterContainer} ref={popupRef}>
      <div
        className={styles.UserProfileInnerContainer}
        onClick={() => setShowPopup(prev => !prev)}
        title={title}
      >
        {profileImage ? (
          <img
            src={profileImage}
            alt="profile"
            className={styles.UserProfileImage}
          />
        ) : (
          <span className={styles.initials}>{initials}</span>
        )}
      </div>

      {showPopup && (
        <div className={styles.ProfilePopup}>
          <div className={styles.ProfilePopupContent}>
            <p className={styles.profileName}>
              {userName || 'Unknown User'}
            </p>

            <p className={styles.profileLogin}>
              Last Login: <span>{formattedLastLogin}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileSection;