import { ref } from 'vue';
import type { MenuItem } from '~/mock/data/menuConfig';
import { getAdminMenu, getDashboardMenu, getDeveloperMenu } from '~/mock/api/menu';

// 定义API返回的数据结构
interface ApiResponse<T> {
  code: number;
  data: T;
  message: string;
}

// 定义菜单数据返回类型
interface MenuDataResult {
  menuData: Ref<MenuItem[]>;
  loading: Ref<boolean>;
  error: Ref<Error | null>;
  execute: () => Promise<MenuDataResult>;
  refresh: () => Promise<MenuDataResult>;
}

// 环境变量控制是否使用mock数据
const useMockData = process.env.NODE_ENV === 'development' || process.env.USE_MOCK === 'true';

// 菜单数据缓存
const menuCache = {
  admin: null as MenuItem[] | null,
  dashboard: null as MenuItem[] | null,
  developer: null as MenuItem[] | null,
  // 缓存过期时间 (毫秒)
  expiryTime: 5 * 60 * 1000, // 5分钟
  timestamps: {
    admin: 0,
    dashboard: 0,
    developer: 0
  }
};

/**
 * 菜单数据获取组合式函数
 * @param defaultData 默认数据，可用于初始显示
 */
export function useMenu(defaultData: MenuItem[] = []) {
  const menuData = ref<MenuItem[]>(defaultData);
  const loading = ref(false);
  const error = ref<Error | null>(null);

  /**
   * 检查缓存是否有效
   */
  const isCacheValid = (cacheType: 'admin' | 'dashboard' | 'developer'): boolean => {
    // 如果没有缓存数据，则无效
    if (!menuCache[cacheType]) return false;
    
    // 检查时间戳是否在有效期内
    const now = Date.now();
    return (now - menuCache.timestamps[cacheType]) < menuCache.expiryTime;
  };

  /**
   * 获取管理员菜单
   * @param immediate 是否立即执行，默认为true
   * @param forceRefresh 是否强制刷新数据，忽略缓存
   */
  async function fetchAdminMenu(immediate: boolean = true, forceRefresh: boolean = false): Promise<MenuDataResult> {
    // 从缓存获取数据
    if (!forceRefresh && isCacheValid('admin')) {
      menuData.value = menuCache.admin as MenuItem[];
      
      // 如果不立即执行，则直接返回
      if (!immediate) {
        return { 
          menuData, 
          loading, 
          error, 
          execute: () => fetchAdminMenu(true, false),
          refresh: () => fetchAdminMenu(true, true)
        };
      }
      
      return { 
        menuData, 
        loading, 
        error, 
        execute: () => fetchAdminMenu(true, false),
        refresh: () => fetchAdminMenu(true, true)
      };
    }

    // 如果不立即执行，则直接返回
    if (!immediate) {
      return { 
        menuData, 
        loading, 
        error, 
        execute: () => fetchAdminMenu(true, forceRefresh),
        refresh: () => fetchAdminMenu(true, true)
      };
    }

    loading.value = true;
    error.value = null;

    try {
      if (useMockData) {
        // 使用mock数据
        const response = await getAdminMenu();
        menuData.value = response.data;
        
        // 更新缓存
        menuCache.admin = [...response.data];
        menuCache.timestamps.admin = Date.now();
      } else {
        // 使用真实API
        const { data } = await useFetch<ApiResponse<MenuItem[]>>('/api/menus/admin', {
          key: 'admin-menu-' + Date.now(), // 添加时间戳防止缓存
          // 定义缓存策略
          cache: 'no-cache'
        });
        
        // 判断并处理API返回的数据格式
        if (data.value && data.value.code === 200) {
          menuData.value = data.value.data;
          
          // 更新缓存
          menuCache.admin = [...data.value.data];
          menuCache.timestamps.admin = Date.now();
        } else {
          throw new Error('获取数据失败');
        }
      }
    } catch (err) {
      console.error('获取管理员菜单失败:', err);
      error.value = err as Error;
    } finally {
      loading.value = false;
    }

    return { 
      menuData, 
      loading, 
      error, 
      execute: () => fetchAdminMenu(true, false),
      refresh: () => fetchAdminMenu(true, true)
    };
  }

  /**
   * 获取用户仪表盘菜单
   * @param immediate 是否立即执行，默认为true
   * @param forceRefresh 是否强制刷新数据，忽略缓存
   */
  async function fetchDashboardMenu(immediate: boolean = true, forceRefresh: boolean = false): Promise<MenuDataResult> {
    // 从缓存获取数据
    if (!forceRefresh && isCacheValid('dashboard')) {
      menuData.value = menuCache.dashboard as MenuItem[];
      
      // 如果不立即执行，则直接返回
      if (!immediate) {
        return { 
          menuData, 
          loading, 
          error, 
          execute: () => fetchDashboardMenu(true, false),
          refresh: () => fetchDashboardMenu(true, true) 
        };
      }
      
      return { 
        menuData, 
        loading, 
        error, 
        execute: () => fetchDashboardMenu(true, false),
        refresh: () => fetchDashboardMenu(true, true)
      };
    }
    
    // 如果不立即执行，则直接返回
    if (!immediate) {
      return { 
        menuData, 
        loading, 
        error, 
        execute: () => fetchDashboardMenu(true, forceRefresh),
        refresh: () => fetchDashboardMenu(true, true)
      };
    }
    
    loading.value = true;
    error.value = null;

    try {
      if (useMockData) {
        // 使用mock数据
        const response = await getDashboardMenu();
        menuData.value = response.data;
        
        // 更新缓存
        menuCache.dashboard = [...response.data];
        menuCache.timestamps.dashboard = Date.now();
      } else {
        // 使用真实API
        const { data } = await useFetch<ApiResponse<MenuItem[]>>('/api/menus/dashboard', {
          key: 'dashboard-menu-' + Date.now(), // 添加时间戳防止缓存
          cache: 'no-cache'
        });
        
        if (data.value && data.value.code === 200) {
          menuData.value = data.value.data;
          
          // 更新缓存
          menuCache.dashboard = [...data.value.data];
          menuCache.timestamps.dashboard = Date.now();
        } else {
          throw new Error('获取数据失败');
        }
      }
    } catch (err) {
      console.error('获取用户仪表盘菜单失败:', err);
      error.value = err as Error;
    } finally {
      loading.value = false;
    }

    return { 
      menuData, 
      loading, 
      error, 
      execute: () => fetchDashboardMenu(true, false),
      refresh: () => fetchDashboardMenu(true, true) 
    };
  }

  /**
   * 获取开发者菜单
   * @param immediate 是否立即执行，默认为true
   * @param forceRefresh 是否强制刷新数据，忽略缓存
   */
  async function fetchDeveloperMenu(immediate: boolean = true, forceRefresh: boolean = false): Promise<MenuDataResult> {
    // 从缓存获取数据
    if (!forceRefresh && isCacheValid('developer')) {
      menuData.value = menuCache.developer as MenuItem[];
      
      // 如果不立即执行，则直接返回
      if (!immediate) {
        return { 
          menuData, 
          loading, 
          error, 
          execute: () => fetchDeveloperMenu(true, false),
          refresh: () => fetchDeveloperMenu(true, true)
        };
      }
      
      return { 
        menuData, 
        loading, 
        error, 
        execute: () => fetchDeveloperMenu(true, false),
        refresh: () => fetchDeveloperMenu(true, true)
      };
    }
    
    // 如果不立即执行，则直接返回
    if (!immediate) {
      return { 
        menuData, 
        loading, 
        error, 
        execute: () => fetchDeveloperMenu(true, forceRefresh),
        refresh: () => fetchDeveloperMenu(true, true)
      };
    }
    
    loading.value = true;
    error.value = null;

    try {
      if (useMockData) {
        // 使用mock数据
        const response = await getDeveloperMenu();
        menuData.value = response.data;
        
        // 更新缓存
        menuCache.developer = [...response.data];
        menuCache.timestamps.developer = Date.now();
      } else {
        // 使用真实API
        const { data } = await useFetch<ApiResponse<MenuItem[]>>('/api/menus/developer', {
          key: 'developer-menu-' + Date.now(), // 添加时间戳防止缓存
          cache: 'no-cache'
        });
        
        if (data.value && data.value.code === 200) {
          menuData.value = data.value.data;
          
          // 更新缓存
          menuCache.developer = [...data.value.data];
          menuCache.timestamps.developer = Date.now();
        } else {
          throw new Error('获取数据失败');
        }
      }
    } catch (err) {
      console.error('获取开发者菜单失败:', err);
      error.value = err as Error;
    } finally {
      loading.value = false;
    }

    return { 
      menuData, 
      loading, 
      error, 
      execute: () => fetchDeveloperMenu(true, false),
      refresh: () => fetchDeveloperMenu(true, true)
    };
  }

  return {
    menuData,
    loading,
    error,
    fetchAdminMenu,
    fetchDashboardMenu,
    fetchDeveloperMenu
  };
} 