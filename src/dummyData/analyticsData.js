export const analyticsData = {
  revenue: {
    daily: [
      { date: '2025-11-01', value: 1200 },
      { date: '2025-11-02', value: 1400 },
      { date: '2025-11-03', value: 1100 },
      { date: '2025-11-04', value: 1600 },
      { date: '2025-11-05', value: 1800 }
    ],
    monthly: [
      { month: 'Jan 2025', value: 35000 },
      { month: 'Feb 2025', value: 38000 },
      { month: 'Mar 2025', value: 42000 },
      { month: 'Apr 2025', value: 40000 },
      { month: 'May 2025', value: 45000 }
    ]
  },
  userStats: {
    activeUsers: 1250,
    newUsers: 85,
    totalUsers: 5000,
    conversion: 2.5,
    retention: 85
  },
  performance: {
    cpu: [
      { time: '09:00', value: 45 },
      { time: '10:00', value: 52 },
      { time: '11:00', value: 49 },
      { time: '12:00', value: 47 },
      { time: '13:00', value: 53 }
    ],
    memory: [
      { time: '09:00', value: 65 },
      { time: '10:00', value: 68 },
      { time: '11:00', value: 62 },
      { time: '12:00', value: 70 },
      { time: '13:00', value: 65 }
    ]
  },
  traffic: {
    sources: [
      { source: 'Direct', value: 30 },
      { source: 'Organic', value: 25 },
      { source: 'Referral', value: 20 },
      { source: 'Social', value: 15 },
      { source: 'Email', value: 10 }
    ],
    pageViews: [
      { page: '/home', views: 12500 },
      { page: '/products', views: 8900 },
      { page: '/about', views: 5400 },
      { page: '/contact', views: 3200 },
      { page: '/blog', views: 6700 }
    ]
  }
};

export const dashboardWidgets = {
  summary: [
    {
      id: 'total-revenue',
      title: 'Total Revenue',
      value: '$156,000',
      change: '+12.5%',
      trend: 'up'
    },
    {
      id: 'active-users',
      title: 'Active Users',
      value: '1,250',
      change: '+5.2%',
      trend: 'up'
    },
    {
      id: 'conversion-rate',
      title: 'Conversion Rate',
      value: '2.5%',
      change: '-0.8%',
      trend: 'down'
    },
    {
      id: 'avg-response',
      title: 'Avg. Response Time',
      value: '1.2s',
      change: '-15%',
      trend: 'up'
    }
  ],
  recentTransactions: [
    {
      id: 1,
      customer: 'John Doe',
      amount: 199.99,
      status: 'completed',
      date: '2025-11-05T10:30:00'
    },
    {
      id: 2,
      customer: 'Jane Smith',
      amount: 149.99,
      status: 'pending',
      date: '2025-11-05T09:45:00'
    }
  ],
  alerts: [
    {
      id: 1,
      type: 'warning',
      message: 'Server load reaching threshold',
      timestamp: '2025-11-05T11:20:00'
    },
    {
      id: 2,
      type: 'success',
      message: 'Backup completed successfully',
      timestamp: '2025-11-05T10:00:00'
    }
  ]
};