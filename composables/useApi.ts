import { adminMenuConfig, dashboardMenuConfig, developerMenuConfig } from '~/mock/data/menuConfig';

// 获取配置
const config = useRuntimeConfig();

// 获取环境变量，判断是否使用mock数据
const useMockData = () => import.meta.dev || config.public.useMock;

// 模拟请求延迟
const mockDelay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * 简化的API服务
 * 根据环境自动切换mock数据或真实API
 */
export const useApi = () => {
  /**
   * 通用API请求函数
   * @param url 请求地址
   * @param mockData mock数据
   * @param options 请求选项
   */
  const request = async <T>(url: string, mockData: T, options: any = {}) => {
    try {
      // 如果使用mock数据，直接返回
      if (useMockData()) {
        await mockDelay();
        return {
          code: 200,
          data: mockData,
          message: '操作成功'
        };
      } 
      
      // 否则使用真实API
      const { data } = await useFetch(url, {
        key: `${url}-${Date.now()}`,
        cache: 'no-cache',
        ...options
      });
      
      return data.value;
    } catch (error) {
      console.error(`请求 ${url} 失败:`, error);
      throw error;
    }
  };

  // 菜单相关API
  const menuApi = {
    // 获取管理员菜单
    getAdminMenu: () => request('/api/menus/admin', adminMenuConfig),
    
    // 获取用户仪表盘菜单
    getDashboardMenu: () => request('/api/menus/dashboard', dashboardMenuConfig),
    
    // 获取开发者菜单
    getDeveloperMenu: () => request('/api/menus/developer', developerMenuConfig)
  };

  return {
    menu: menuApi
    // 可以在这里扩展其他API模块
  };
}; 