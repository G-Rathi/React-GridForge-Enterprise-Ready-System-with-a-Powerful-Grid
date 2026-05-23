import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/**
 * AuthGuard component to protect routes that require authentication
 */
export const AuthGuard = ({ children }) => {
  const { isAuthenticated, userRoles } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    navigate('/login', {
      replace: true,
      state: { from: location.pathname }
    });
    return null;
  }

  return children;
};

/**
 * HOC to protect routes based on roles
 * @param {React.Component} Component - Component to protect
 * @param {string[]} requiredRoles - Required roles for access
 * @returns {React.Component} Protected component
 */
export const withRoleGuard = (Component, requiredRoles = []) => {
  return function WrappedComponent(props) {
    const { userRoles } = useAuth();
    const navigate = useNavigate();

    // Check if user has required roles
    const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));

    if (!hasRequiredRole) {
      navigate('/unauthorized');
      return null;
    }

    return <Component {...props} />;
  };
};

/**
 * Route guard utilities
 */
export const RouteGuard = {
  /**
   * Check if route is public
   * @param {string} path - Route path
   * @returns {boolean} Is public route
   */
  isPublicRoute(path) {
    const publicPaths = [
      '/login',
      '/register',
      '/forgot-password',
      '/reset-password',
    ];
    return publicPaths.includes(path);
  },

  /**
   * Check if user has permission for route
   * @param {string} path - Route path
   * @param {string[]} userRoles - User's roles
   * @returns {boolean} Has permission
   */
  hasRoutePermission(path, userRoles) {
    // Add your route permission logic here
    // Example: Map routes to required roles
    const routePermissions = {
      '/admin': ['admin'],
      '/dashboard': ['user', 'admin'],
      '/settings': ['user', 'admin'],
    };

    const requiredRoles = routePermissions[path];
    if (!requiredRoles) return true; // No specific roles required

    return userRoles.some(role => requiredRoles.includes(role));
  },
};