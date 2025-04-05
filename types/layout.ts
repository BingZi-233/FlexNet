/**
 * 用户数据类型
 */
export interface UserData {
  name?: string;
  avatarUrl?: string;
  [key: string]: any;
}

/**
 * 菜单项类型
 */
export interface MenuItem {
  key: string;
  title: string;
  icon?: any; // 图标组件
  route?: string;
  children?: MenuItem[];
  divider?: boolean;
}

/**
 * 布局配置类型
 */
export interface LayoutConfig {
  headerTitle: string;
  breadcrumbTitle: string;
  homeRoute: string;
  currentPageTitle: string;
  appVersion?: string;
  showNotifications?: boolean;
  showSettings?: boolean;
  showUserProfile?: boolean;
}

/**
 * 侧边栏配置类型
 */
export interface SidebarConfig {
  collapsed: boolean;
  headerTitle: string;
  homeRoute: string;
  collapseButtonText: string;
}

/**
 * 移动端配置类型
 */
export interface MobileConfig {
  headerTitle: string;
  homeRoute: string;
}

/**
 * 头部导航配置类型
 */
export interface HeaderConfig {
  isMobile: boolean;
  showNotifications: boolean;
  showSettings: boolean;
  showUserProfile: boolean;
  userData: UserData | null;
} 