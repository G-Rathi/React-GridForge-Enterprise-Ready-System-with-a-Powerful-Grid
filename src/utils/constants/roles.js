export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest',
};

export const ROLE_PERMISSIONS = {
  [USER_ROLES.ADMIN]: ['read', 'write', 'delete', 'manage_users'],
  [USER_ROLES.USER]: ['read', 'write'],
  [USER_ROLES.GUEST]: ['read'],
};