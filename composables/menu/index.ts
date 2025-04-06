import { useMenuCore } from './core';
import { useMenuData } from './data';
import type { MenuItem, MenuType } from './types';

// 重新导出类型和子模块
export { type MenuItem, type MenuType };
export { useMenuCore, useMenuData };

/**
 * 菜单模块主入口
 * 集成了菜单UI状态管理和数据获取功能
 */
export function useMenu(
  defaultMenuConfig: MenuItem[] = [],
  defaultSelectedKeys: string[] = ['1'],
  defaultOpenKeys: string[] = []
) {
  // 获取菜单数据
  const { 
    menuData, 
    loading, 
    error, 
    getAdminMenu, 
    getDashboardMenu, 
    getDeveloperMenu,
    refreshMenu
  } = useMenuData();
  
  // 获取菜单核心功能
  const {
    selectedKeys,
    openKeys,
    updateSelectedKeys,
    updateOpenKeys,
    setActiveMenuItem,
    findMenuItemByRoute
  } = useMenuCore(
    defaultMenuConfig,
    defaultSelectedKeys,
    defaultOpenKeys
  );
  
  // 初始化菜单并应用核心功能
  const initMenu = async (type: MenuType, selectedKeys: string[] = ['1'], openKeys: string[] = []) => {
    try {
      let result;
      switch (type) {
        case 'admin':
          result = await getAdminMenu();
          break;
        case 'dashboard':
          result = await getDashboardMenu();
          break;
        case 'developer':
          result = await getDeveloperMenu();
          break;
      }
      return useMenuCore(result.menuData.value, selectedKeys, openKeys);
    } catch (err) {
      console.error(`初始化${type}菜单失败:`, err);
      return useMenuCore([], selectedKeys, openKeys);
    }
  };
  
  // 快捷初始化方法
  const initAdminMenu = (selectedKeys?: string[], openKeys?: string[]) => 
    initMenu('admin', selectedKeys, openKeys);
  
  const initDashboardMenu = (selectedKeys?: string[], openKeys?: string[]) => 
    initMenu('dashboard', selectedKeys, openKeys);
  
  const initDeveloperMenu = (selectedKeys?: string[], openKeys?: string[]) => 
    initMenu('developer', selectedKeys, openKeys);
  
  return {
    // 菜单UI状态
    menuData,
    selectedKeys,
    openKeys,
    loading,
    error,
    
    // 操作方法
    updateSelectedKeys,
    updateOpenKeys,
    setActiveMenuItem,
    findMenuItemByRoute,
    
    // 数据获取
    getAdminMenu,
    getDashboardMenu,
    getDeveloperMenu,
    refreshMenu,
    
    // 初始化方法
    initMenu,
    initAdminMenu,
    initDashboardMenu,
    initDeveloperMenu
  };
} 