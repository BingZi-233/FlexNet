import { ref } from 'vue';
import type { MenuItem } from '~/mock/data/menuConfig';
import { getAdminMenu, getDashboardMenu, getDeveloperMenu } from '~/mock/api/menu';

// 定义API返回的数据结构
interface ApiResponse<T> {
  code: number;
  data: T;
  message: string;
}

// 环境变量控制是否使用mock数据
const useMockData = process.env.NODE_ENV === 'development' || process.env.USE_MOCK === 'true';

/**
 * 菜单数据获取组合式函数
 */
export function useMenu() {
  const menuData = ref<MenuItem[]>([]);
  const loading = ref(false);
  const error = ref<Error | null>(null);

  /**
   * 获取管理员菜单
   */
  async function fetchAdminMenu() {
    loading.value = true;
    error.value = null;

    try {
      if (useMockData) {
        // 使用mock数据
        const response = await getAdminMenu();
        menuData.value = response.data;
      } else {
        // 使用真实API
        const { data } = await useFetch<ApiResponse<MenuItem[]>>('/api/menus/admin', {
          key: 'admin-menu',
          // 定义缓存策略
          cache: 'no-cache'
        });
        
        // 判断并处理API返回的数据格式
        if (data.value && data.value.code === 200) {
          menuData.value = data.value.data;
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

    return { menuData, loading, error };
  }

  /**
   * 获取用户仪表盘菜单
   */
  async function fetchDashboardMenu() {
    loading.value = true;
    error.value = null;

    try {
      if (useMockData) {
        // 使用mock数据
        const response = await getDashboardMenu();
        menuData.value = response.data;
      } else {
        // 使用真实API
        const { data } = await useFetch<ApiResponse<MenuItem[]>>('/api/menus/dashboard', {
          key: 'dashboard-menu',
          cache: 'no-cache'
        });
        
        if (data.value && data.value.code === 200) {
          menuData.value = data.value.data;
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

    return { menuData, loading, error };
  }

  /**
   * 获取开发者菜单
   */
  async function fetchDeveloperMenu() {
    loading.value = true;
    error.value = null;

    try {
      if (useMockData) {
        // 使用mock数据
        const response = await getDeveloperMenu();
        menuData.value = response.data;
      } else {
        // 使用真实API
        const { data } = await useFetch<ApiResponse<MenuItem[]>>('/api/menus/developer', {
          key: 'developer-menu',
          cache: 'no-cache'
        });
        
        if (data.value && data.value.code === 200) {
          menuData.value = data.value.data;
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

    return { menuData, loading, error };
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