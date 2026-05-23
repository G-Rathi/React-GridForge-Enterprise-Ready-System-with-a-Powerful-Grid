export const users = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    avatar: 'https://example.com/avatars/1.jpg',
    role: 'Admin',
    department: 'IT',
    status: 'Active',
    joinDate: '2025-01-15',
    permissions: ['all']
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    avatar: 'https://example.com/avatars/2.jpg',
    role: 'Manager',
    department: 'Sales',
    status: 'Active',
    joinDate: '2025-03-20',
    permissions: ['view', 'edit']
  }
];

export const products = [
  {
    id: 1,
    name: 'Premium Plan',
    description: 'Enterprise level SaaS solution',
    price: 99.99,
    category: 'Subscription',
    features: ['24/7 Support', 'Custom Integration', 'API Access'],
    status: 'Available'
  },
  {
    id: 2,
    name: 'Basic Plan',
    description: 'Start your journey with basic features',
    price: 29.99,
    category: 'Subscription',
    features: ['Email Support', 'Basic Features', 'Limited API'],
    status: 'Available'
  }
];

export const notifications = [
  {
    id: 1,
    title: 'New Message',
    message: 'You have a new message from John Doe',
    type: 'message',
    status: 'unread',
    timestamp: '2025-11-05T10:30:00'
  },
  {
    id: 2,
    title: 'Meeting Reminder',
    message: 'Team meeting in 30 minutes',
    type: 'reminder',
    status: 'unread',
    timestamp: '2025-11-05T11:00:00'
  }
];

export const activities = [
  {
    id: 1,
    user: 'John Doe',
    action: 'created',
    target: 'Project X',
    timestamp: '2025-11-05T09:30:00'
  },
  {
    id: 2,
    user: 'Jane Smith',
    action: 'updated',
    target: 'Task Y',
    timestamp: '2025-11-05T10:15:00'
  }
];

export const settings = {
  theme: {
    primary: '#0066cc',
    secondary: '#6c757d',
    success: '#28a745',
    danger: '#dc3545',
    warning: '#ffc107',
    info: '#17a2b8'
  },
  notifications: {
    email: true,
    push: true,
    sms: false
  },
  security: {
    twoFactorAuth: true,
    passwordExpiry: 90,
    sessionTimeout: 30
  }
};