import React from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';

const SidebarItem = ({ item, collapsed, activeCollapse, onToggle }) => {
  const Icon = item.icon;

  if (item.type === 'collapse') {
    const isActive = activeCollapse === item.id;
    return (
      <div>
        <button
          onClick={() => onToggle(item.id)}
          className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 transition-colors"
        >
          <div className="flex items-center gap-3">
            {Icon && <Icon size={18} />}
            {!collapsed && <span>{item.title}</span>}
          </div>
          {!collapsed && (
            <span>
              {isActive ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </span>
          )}
        </button>

        {/* Children */}
        {isActive && !collapsed && (
          <div className="ml-8 border-l border-gray-700 pl-3">
            {item.children.map((child) => (
              <NavLink
                key={child.id}
                to={child.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-1.5 text-sm rounded-md 
                  ${isActive ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`
                }
              >
                {child.icon && <child.icon size={16} />}
                <span>{child.title}</span>
              </NavLink>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2 text-sm rounded-md transition-colors 
        ${isActive ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800'}`
      }
    >
      {Icon && <Icon size={18} />}
      {!collapsed && <span>{item.title}</span>}
    </NavLink>
  );
};

export default SidebarItem;
