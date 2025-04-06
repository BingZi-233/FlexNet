/**
 * 菜单项类型
 */
export interface MenuItem {
  key: string;
  title: string;
  icon?: string;
  route?: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  disabled?: boolean;
  children?: MenuItem[];
  roles?: string[];
  [key: string]: any;
}

/**
 * 菜单类型
 */
export type MenuType = 'admin' | 'dashboard' | 'developer';

/**
 * 菜单数据响应类型
 */
export interface MenuResponse {
  code: number;
  data: MenuItem[];
  message: string;
} 