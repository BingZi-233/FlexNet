import { ref } from 'vue';
import type { MenuItem } from '~/mock/data/menuConfig';
import { useApi } from './useApi';

// 定义API响应类型
interface ApiResponse<T> {
  code: number;
  data: T;
  message: string;
}

/**
 * 简化的菜单数据获取hook
 */
export function useMenuSimple() {
  const menuData = ref<MenuItem[]>([]);
  const loading = ref(false);
  const error = ref<Error | null>(null);
  
  // 获取API服务
  const api = useApi();
  
  // 缓存
  const cache = {
    data: {} as Record<string, MenuItem[]>,
    timestamp: {} as Record<string, number>,
    // 缓存有效期(5分钟)
    expiryTime: 5 * 60 * 1000
  };

  /**
   * 通用菜单获取函数
   */
  const fetchMenu = async (
    type: 'admin' | 'dashboard' | 'developer', 
    useCache: boolean = true
  ) => {
    // 如果启用缓存且缓存有效，直接使用缓存数据
    const now = Date.now();
    if (useCache && 
        cache.data[type] && 
        now - cache.timestamp[type] < cache.expiryTime) {
      menuData.value = cache.data[type];
      return { menuData, loading, error };
    }
    
    loading.value = true;
    error.value = null;
    
    try {
      let result: ApiResponse<MenuItem[]> | undefined;
      
      // 根据类型调用对应的API
      switch (type) {
        case 'admin':
          result = await api.menu.getAdminMenu() as ApiResponse<MenuItem[]>;
          break;
        case 'dashboard':
          result = await api.menu.getDashboardMenu() as ApiResponse<MenuItem[]>;
          break;
        case 'developer':
          result = await api.menu.getDeveloperMenu() as ApiResponse<MenuItem[]>;
          break;
      }
      
      // 处理响应数据
      if (result && result.code === 200) {
        menuData.value = result.data;
        // 更新缓存
        cache.data[type] = [...result.data];
        cache.timestamp[type] = Date.now();
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
  
  // 获取不同类型的菜单
  const getAdminMenu = (useCache = true) => fetchMenu('admin', useCache);
  const getDashboardMenu = (useCache = true) => fetchMenu('dashboard', useCache);
  const getDeveloperMenu = (useCache = true) => fetchMenu('developer', useCache);
  
  // 刷新菜单(强制不使用缓存)
  const refreshMenu = (type: 'admin' | 'dashboard' | 'developer') => fetchMenu(type, false);
  
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