import type { MenuItem, MenuType, MenuResponse } from './types';
import { useApi } from '../api';

// 缓存管理
const CACHE_EXPIRE_TIME = 5 * 60 * 1000; // 5分钟缓存
const menuCache = new Map<string, { data: MenuItem[], timestamp: number }>();

/**
 * 菜单数据获取功能
 */
export function useMenuData() {
  const menuData = ref<MenuItem[]>([]);
  const loading = ref(false);
  const error = ref<Error | null>(null);
  
  // 获取API服务
  const api = useApi();
  
  /**
   * 检查缓存是否有效
   */
  const isCacheValid = (cacheKey: string): boolean => {
    if (!menuCache.has(cacheKey)) return false;
    
    const cache = menuCache.get(cacheKey)!;
    return Date.now() - cache.timestamp < CACHE_EXPIRE_TIME;
  };
  
  /**
   * 从缓存获取数据
   */
  const getFromCache = (cacheKey: string): MenuItem[] | null => {
    if (!isCacheValid(cacheKey)) return null;
    return menuCache.get(cacheKey)!.data;
  };
  
  /**
   * 更新缓存
   */
  const updateCache = (cacheKey: string, data: MenuItem[]) => {
    menuCache.set(cacheKey, {
      data: [...data],
      timestamp: Date.now()
    });
  };
  
  /**
   * 获取菜单数据
   * @param type 菜单类型
   * @param useCache 是否使用缓存
   */
  const fetchMenu = async (type: MenuType, useCache: boolean = true) => {
    const cacheKey = `menu_${type}`;
    
    // 如果启用缓存且缓存有效，直接使用缓存
    if (useCache) {
      const cachedData = getFromCache(cacheKey);
      if (cachedData) {
        menuData.value = cachedData;
        return { menuData, loading, error };
      }
    }
    
    loading.value = true;
    error.value = null;
    
    try {
      // 获取菜单数据
      let result: MenuResponse | undefined;
      switch (type) {
        case 'admin':
          result = await api.menu.getAdminMenu() as MenuResponse;
          break;
        case 'dashboard':
          result = await api.menu.getDashboardMenu() as MenuResponse;
          break;
        case 'developer':
          result = await api.menu.getDeveloperMenu() as MenuResponse;
          break;
      }
      
      if (result && result.code === 200) {
        menuData.value = result.data;
        // 更新缓存
        updateCache(cacheKey, result.data);
      } else {
        throw new Error(result?.message || '获取菜单数据失败');
      }
    } catch (err) {
      console.error(`获取${type}菜单失败:`, err);
      error.value = err as Error;
    } finally {
      loading.value = false;
    }
    
    return { menuData, loading, error };
  };
  
  // 获取不同类型的菜单快捷方法
  const getAdminMenu = (useCache = true) => fetchMenu('admin', useCache);
  const getDashboardMenu = (useCache = true) => fetchMenu('dashboard', useCache);
  const getDeveloperMenu = (useCache = true) => fetchMenu('developer', useCache);
  
  // 刷新菜单(强制不使用缓存)
  const refreshMenu = (type: MenuType) => fetchMenu(type, false);
  
  return {
    menuData,
    loading,
    error,
    getAdminMenu,
    getDashboardMenu,
    getDeveloperMenu,
    refreshMenu
  };
} 