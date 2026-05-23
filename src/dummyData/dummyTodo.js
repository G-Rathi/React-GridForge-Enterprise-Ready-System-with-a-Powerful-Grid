/**
 * Dummy Todo Data for JSON Server
 * This file contains sample todo data that will be used by json-server
 */

export const todos = [
  {
    id: 1,
    userId: 1,
    title: 'Complete project documentation',
    completed: false,
    description: 'Write comprehensive documentation for the project including API docs, user guide, and deployment instructions',
    priority: 'high',
    dueDate: '2025-01-20',
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
    tags: ['documentation', 'project'],
  },
  {
    id: 2,
    userId: 1,
    title: 'Review pull requests',
    completed: true,
    description: 'Review and merge pending pull requests from the team',
    priority: 'medium',
    dueDate: '2025-01-18',
    createdAt: '2025-01-14T09:30:00Z',
    updatedAt: '2025-01-16T14:20:00Z',
    tags: ['code-review', 'team'],
  },
  {
    id: 3,
    userId: 1,
    title: 'Set up CI/CD pipeline',
    completed: false,
    description: 'Configure continuous integration and deployment pipeline for the project',
    priority: 'high',
    dueDate: '2025-01-22',
    createdAt: '2025-01-13T11:15:00Z',
    updatedAt: '2025-01-13T11:15:00Z',
    tags: ['devops', 'ci-cd'],
  },
  {
    id: 4,
    userId: 2,
    title: 'Design user dashboard',
    completed: false,
    description: 'Create mockups and design the user dashboard interface',
    priority: 'medium',
    dueDate: '2025-01-19',
    createdAt: '2025-01-12T08:45:00Z',
    updatedAt: '2025-01-12T08:45:00Z',
    tags: ['design', 'ui'],
  },
  {
    id: 5,
    userId: 2,
    title: 'Implement authentication',
    completed: true,
    description: 'Implement user authentication and authorization system',
    priority: 'high',
    dueDate: '2025-01-17',
    createdAt: '2025-01-10T13:20:00Z',
    updatedAt: '2025-01-15T16:30:00Z',
    tags: ['auth', 'security'],
  },
  {
    id: 6,
    userId: 1,
    title: 'Write unit tests',
    completed: false,
    description: 'Write comprehensive unit tests for all components and utilities',
    priority: 'high',
    dueDate: '2025-01-21',
    createdAt: '2025-01-11T10:00:00Z',
    updatedAt: '2025-01-11T10:00:00Z',
    tags: ['testing', 'quality'],
  },
  {
    id: 7,
    userId: 2,
    title: 'Optimize database queries',
    completed: false,
    description: 'Review and optimize database queries for better performance',
    priority: 'medium',
    dueDate: '2025-01-23',
    createdAt: '2025-01-09T14:30:00Z',
    updatedAt: '2025-01-09T14:30:00Z',
    tags: ['database', 'performance'],
  },
  {
    id: 8,
    userId: 1,
    title: 'Update dependencies',
    completed: true,
    description: 'Update all project dependencies to their latest versions',
    priority: 'low',
    dueDate: '2025-01-16',
    createdAt: '2025-01-08T09:00:00Z',
    updatedAt: '2025-01-14T11:45:00Z',
    tags: ['maintenance', 'dependencies'],
  },
  {
    id: 9,
    userId: 2,
    title: 'Fix responsive design issues',
    completed: false,
    description: 'Fix responsive design issues on mobile and tablet devices',
    priority: 'medium',
    dueDate: '2025-01-20',
    createdAt: '2025-01-07T15:20:00Z',
    updatedAt: '2025-01-07T15:20:00Z',
    tags: ['responsive', 'mobile'],
  },
  {
    id: 10,
    userId: 1,
    title: 'Prepare presentation',
    completed: false,
    description: 'Prepare presentation for the upcoming client meeting',
    priority: 'high',
    dueDate: '2025-01-19',
    createdAt: '2025-01-06T10:30:00Z',
    updatedAt: '2025-01-06T10:30:00Z',
    tags: ['presentation', 'client'],
  },
];

/**
 * Default todo structure for creating new todos
 */
export const defaultTodo = {
  userId: 1,
  title: '',
  completed: false,
  description: '',
  priority: 'medium',
  dueDate: '',
  tags: [],
};

/**
 * Todo priorities
 */
export const todoPriorities = ['low', 'medium', 'high'];

/**
 * Todo filter options
 */
export const todoFilters = {
  all: 'All',
  active: 'Active',
  completed: 'Completed',
  high: 'High Priority',
  medium: 'Medium Priority',
  low: 'Low Priority',
};

