import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { Menu, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import './Sidebar.scss';

const Sidebar = (props) => {
  const { menulist } = props;
  // Use `menulist` when provided (even empty). If undefined/null, render empty menu.
  const menuToRender = Array.isArray(menulist) ? menulist : [];
  const [collapsed, setCollapsed] = useState(false);
  const [openGroup, setOpenGroup] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* <button
        className="app-sidebar-toggle"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Open sidebar"
      >
        <Menu size={22} />
      </button> */}
      <aside
        className={`app-sidebar ${collapsed ? 'collapsed' : ''} ${
          mobileOpen ? 'visible-mobile' : ''
        }`}
        aria-expanded={!collapsed}
      >
        <div className="app-sidebar-header">
          {!collapsed && <h1>App Panel</h1>}
          <button
            className="collapse-btn"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>
        <nav>
          {menuToRender.map((item) => {
            // Resolve icon component: menu data may provide a string name (from db.json)
            const resolveIcon = (icon) => {
              if (!icon) return null;
              // If icon is a string (e.g. "Activity"), look up in Icons
              if (typeof icon === 'string') return Icons[icon] || null;
              // If it's already a component, return it
              return icon;
            };

            if (item.type === 'collapse') {
              const isOpen = openGroup === item.id;
              return (
                <div key={item.id} className="app-nav-group">
                  <button
                    className="app-nav-group-header"
                    onClick={() => setOpenGroup(isOpen ? null : item.id)}
                    aria-expanded={isOpen}
                  >
                    <span className="icon">{resolveIcon(item.icon) ? React.createElement(resolveIcon(item.icon), { size: 18 }) : null}</span>
                    {!collapsed && <span>{item.title}</span>}
                    {!collapsed && (
                      <span className={`caret${isOpen ? ' open' : ''}`}>
                        <ChevronDown size={16} />
                      </span>
                    )}
                  </button>
                  <div
                    className={`app-nav-children${
                      isOpen && !collapsed ? ' expanded' : ' collapsed'
                    }`}
                  >
                    {item.children?.map((child) => (
                      <NavLink
                        key={child.id}
                        to={child.path}
                        className={({ isActive }) =>
                          `app-nav-item${isActive ? ' active' : ''}`
                        }
                      >
                        {child.icon && <span className="icon">{resolveIcon(child.icon) ? React.createElement(resolveIcon(child.icon), { size: 14 }) : null}</span>}
                        <span>{child.title}</span>
                      </NavLink>
                    ))}
                  </div>
                </div>
              );
            }
            return (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) =>
                  `app-nav-item${isActive ? ' active' : ''}`
                }
              >
                <span className="icon">{resolveIcon(item.icon) ? React.createElement(resolveIcon(item.icon), { size: 18 }) : null}</span>
                {!collapsed && <span>{item.title}</span>}
              </NavLink>
            );
          })}
        </nav>
        <div className="app-sidebar-footer">
          {!collapsed && <p>© 2025 App Panel</p>}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
