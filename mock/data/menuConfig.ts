import {
  IconDashboard,
  IconUser,
  IconSettings,
  IconNotification,
  IconEdit,
  IconCode,
  IconBook,
  IconInfoCircle,
  IconApps,
  IconSafe,
  IconExport,
  IconHistory,
  IconFile,
  IconImage
} from '@arco-design/web-vue/es/icon';

export interface MenuItem {
  key: string;
  title: string;
  icon: any;
  route?: string;
  children?: MenuItem[];
}

// 管理员菜单配置
export const adminMenuConfig: MenuItem[] = [
  {
    key: '1',
    title: '控制面板',
    icon: IconDashboard,
    route: '/admin'
  },
  {
    key: 'users',
    title: '用户管理',
    icon: IconUser,
    children: [
      {
        key: '2',
        title: '用户列表',
        icon: IconUser,
        route: '/admin/users/list'
      },
      {
        key: '3',
        title: '角色权限',
        icon: IconSafe,
        route: '/admin/users/roles'
      },
      {
        key: '4',
        title: '用户活动',
        icon: IconHistory,
        route: '/admin/users/activity'
      }
    ]
  },
  {
    key: 'content',
    title: '内容管理',
    icon: IconEdit,
    children: [
      {
        key: '5',
        title: '页面管理',
        icon: IconFile,
        route: '/admin/content/pages'
      },
      {
        key: '6',
        title: '博客文章',
        icon: IconBook,
        route: '/admin/content/blogs'
      },
      {
        key: '7',
        title: '媒体库',
        icon: IconImage,
        route: '/admin/content/media'
      }
    ]
  },
  {
    key: 'system',
    title: '系统设置',
    icon: IconSettings,
    children: [
      {
        key: '8',
        title: '通用设置',
        icon: IconSettings,
        route: '/admin/system/general'
      },
      {
        key: '9',
        title: '安全设置',
        icon: IconSafe,
        route: '/admin/system/security'
      },
      {
        key: '10',
        title: '系统日志',
        icon: IconFile,
        route: '/admin/system/logs'
      },
      {
        key: '11',
        title: '备份恢复',
        icon: IconHistory,
        route: '/admin/system/backups'
      }
    ]
  },
  {
    key: '12',
    title: '消息通知',
    icon: IconNotification,
    route: '/admin/notifications'
  },
  {
    key: '13',
    title: '安全中心',
    icon: IconSafe,
    route: '/admin/security'
  }
];

// 用户面板菜单配置
export const dashboardMenuConfig: MenuItem[] = [
  {
    key: '1',
    title: '仪表台',
    icon: IconDashboard,
    route: '/dashboard'
  },
  {
    key: '2',
    title: '用户管理',
    icon: IconUser,
    route: '/dashboard/users'
  },
  {
    key: '3',
    title: '系统设置',
    icon: IconSettings,
    route: '/dashboard/settings'
  },
  {
    key: 'sub1',
    title: '数据分析',
    icon: IconApps,
    children: [
      {
        key: '4',
        title: '数据概览',
        icon: IconDashboard,
        route: '/dashboard/analytics/overview'
      },
      {
        key: '5',
        title: '流量分析',
        icon: IconHistory,
        route: '/dashboard/analytics/traffic'
      },
      {
        key: '6',
        title: '用户行为',
        icon: IconUser,
        route: '/dashboard/analytics/behavior'
      }
    ]
  }
];

// 开发者菜单配置
export const developerMenuConfig: MenuItem[] = [
  {
    key: '1',
    title: '开发者中心',
    icon: IconDashboard,
    route: '/developer'
  },
  {
    key: 'api',
    title: 'API 管理',
    icon: IconCode,
    children: [
      {
        key: '2',
        title: 'API 密钥',
        icon: IconSafe,
        route: '/developer/api/keys'
      },
      {
        key: '3',
        title: 'API 端点',
        icon: IconCode,
        route: '/developer/api/endpoints'
      },
      {
        key: '4',
        title: '请求日志',
        icon: IconFile,
        route: '/developer/api/logs'
      }
    ]
  },
  {
    key: 'docs',
    title: '技术文档',
    icon: IconBook,
    children: [
      {
        key: '5',
        title: 'API 文档',
        icon: IconFile,
        route: '/developer/docs/reference'
      },
      {
        key: '6',
        title: '开发指南',
        icon: IconInfoCircle,
        route: '/developer/docs/guides'
      },
      {
        key: '7',
        title: '示例代码',
        icon: IconCode,
        route: '/developer/docs/examples'
      }
    ]
  },
  {
    key: '8',
    title: '开发设置',
    icon: IconSettings,
    route: '/developer/settings'
  },
  {
    key: '9',
    title: '技术支持',
    icon: IconInfoCircle,
    route: '/developer/support'
  }
]; 