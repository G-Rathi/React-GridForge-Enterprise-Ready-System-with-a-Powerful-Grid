import React, { Fragment, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './Breadcrumb.module.scss';

import UpperContainerWrapper from '../UpperContainerWrapper';
import UserProfileSection from '../UserProfileSection';
import { SVG_BellIcon } from '../../SVG_Icons';
import { normalizeSingleTrailingSlash } from '../../CommonUtilityFunctions';
import { GetIIsPath } from '../../../utils/constants/common';

const Breadcrumb = ({ menulist = [] }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [breadcrumbText, setBreadcrumbText] = useState('');
  const [childrenList, setChildrenList] = useState([]);

  // 🔥 flatten menu (if nested)
  const flattenMenu = (list = []) => {
    let result = [];
    list.forEach(item => {
      result.push(item);
      if (item.children) {
        result = result.concat(flattenMenu(item.children));
      }
    });
    return result;
  };

  const flatMenuList = flattenMenu(menulist);

  const setAllStatesTogether = (menu) => {
    localStorage.setItem('activePath', menu?.path || '/pagenotfound');

    setBreadcrumbText(menu?.menuDisplayName || '');

    let children = menu?.children || [];

    if (menu?.parentId) {
      const parentMenu = flatMenuList.find(el => el.id === menu.parentId);
      children = parentMenu?.children || [];
    }

    setChildrenList(children);
  };

  useEffect(() => {
    let path = location.pathname;

    let iisPath = GetIIsPath() || '';

    if (iisPath && path.startsWith(iisPath)) {
      path = path.slice(iisPath.length);
    }

    path = normalizeSingleTrailingSlash(path || '/');

    if (!path) path = '/';

    const currentMenu = flatMenuList.find(
      m => (m.path || '/').toLowerCase() === path.toLowerCase()
    );

    setAllStatesTogether(currentMenu);
  }, [location.pathname]);

  const handleChildMenuClick = (menu) => {
    localStorage.setItem('activePath', menu.path);
    navigate(menu.path, { state: menu });
  };

  return (
    <UpperContainerWrapper style={{ height: 'fit-content' }}>
      <div className={styles.BreadcrumbOuterContainer}>
        <div className={styles.leftContent}>
          <div className={styles.FrontText}>
            {breadcrumbText}

            {childrenList.length > 0 && (
              <div className={styles.childrenBreadcrumbContent}>
                {childrenList.map((child, index) => {
                  const isLast = index === childrenList.length - 1;

                  return (
                    <Fragment key={child.menuDisplayName + index}>
                      <span
                        className={styles.childMenuText}
                        onClick={() => handleChildMenuClick(child)}
                      >
                        {child.menuDisplayName}
                      </span>

                      {!isLast && (
                        <span className={styles.childNameseparator}>
                          {' | '}
                        </span>
                      )}
                    </Fragment>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className={styles.rightContent}>
          <SVG_BellIcon
            title="Notification"
            onClick={() => alert('coming soon')}
          />

          <UserProfileSection title="Profile" />
        </div>
      </div>
    </UpperContainerWrapper>
  );
};

export default Breadcrumb;