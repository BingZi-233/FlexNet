import type { MenuItem } from '~/mock/data/menuConfig';

/**
 * 菜单数据类型
 */
export type MenuType = 'admin' | 'dashboard' | 'developer';

/**
 * 菜单数据响应类型
 */
interface MenuResponse {
  code: number;
  data: MenuItem[];
  message: string;
}

/**
 * 符合Nuxt最佳实践的菜单数据获取组合式函数
 */
export function useMenuData() {
  // 定义加载状态
  const loading = useState<boolean>('menu-loading', () => false);
  // 定义错误状态
  const error = useState<Error | null>('menu-error', () => null);
  
  /**
   * 获取菜单数据（泛型统一处理所有菜单类型）
   */
  const fetchMenu = async <T extends MenuType>(type: T) => {
    // 共享状态的菜单数据
    const menu = useState<MenuItem[]>(`menu-${type}`, () => []);
    
    // 设置加载状态
    loading.value = true;
    error.value = null;
    
    try {
      // 使用Nuxt的useFetch发送请求
      const { data, error: fetchError } = await useFetch<MenuResponse>(
        `/api/menus/${type}`,
        {
          key: `menu-${type}-${Date.now()}`,
          // 强制取消缓存保证数据最新
          cache: 'no-cache'
        }
      );
      
      // 处理请求错误
      if (fetchError.value) {
        throw new Error(fetchError.value.message);
      }
      
      // 处理业务错误
      if (!data.value) {
        throw new Error(`获取${type}菜单失败: 无响应数据`);
      }
      
      // 确保响应数据符合预期
      const response = data.value as MenuResponse;
      if (response.code !== 200) {
        throw new Error(response.message || `获取${type}菜单失败: 状态码 ${response.code}`);
      }
      
      // 更新菜单数据
      menu.value = response.data;
    } catch (err) {
      console.error(`获取${type}菜单出错:`, err);
      error.value = err as Error;
    } finally {
      loading.value = false;
    }
    
    return { menu, loading, error };
  };
  
  // 快捷方法
  const getAdminMenu = () => fetchMenu('admin');
  const getDashboardMenu = () => fetchMenu('dashboard');
  const getDeveloperMenu = () => fetchMenu('developer');
  
  // 刷新菜单数据（可在任何组件中调用）
  const refreshMenu = async (type: MenuType) => {
    return await fetchMenu(type);
  };
  
  return {
    loading,
    error,
    getAdminMenu,
    getDashboardMenu,
    getDeveloperMenu,
    refreshMenu
  };
} 