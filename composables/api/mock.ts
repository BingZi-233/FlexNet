import { adminMenuConfig, dashboardMenuConfig, developerMenuConfig } from '~/mock/data/menuConfig';

/**
 * 模拟API服务
 * 直接返回本地Mock数据
 */
export const useApiMock = () => {
  // 模拟请求延迟
  const mockDelay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

  /**
   * 通用API请求函数
   * @param url 请求地址
   * @param mockData mock数据
   * @param options 请求选项
   */
  const request = async <T>(url: string, mockData: T, options: any = {}) => {
    try {
      // 模拟网络延迟
      await mockDelay(options.delay || 300);
      
      return {
        code: 200,
        data: mockData,
        message: '操作成功'
      };
    } catch (error) {
      console.error(`Mock请求 ${url} 失败:`, error);
      throw error;
    }
  };
  
  /**
   * 模拟的HTTP方法封装
   */
  const http = {
    /**
     * 模拟GET请求
     * @param url 请求地址
     * @param mockData 模拟数据
     * @param options 其他选项
     */
    get: <T>(url: string, mockData: T, options?: any) => {
      return request<T>(url, mockData, {
        method: 'GET',
        ...options
      });
    },
    
    /**
     * 模拟POST请求
     * @param url 请求地址
     * @param mockData 模拟数据
     * @param options 其他选项
     */
    post: <T>(url: string, mockData: T, options?: any) => {
      return request<T>(url, mockData, {
        method: 'POST',
        ...options
      });
    },
    
    /**
     * 模拟PUT请求
     * @param url 请求地址
     * @param mockData 模拟数据
     * @param options 其他选项
     */
    put: <T>(url: string, mockData: T, options?: any) => {
      return request<T>(url, mockData, {
        method: 'PUT',
        ...options
      });
    },
    
    /**
     * 模拟DELETE请求
     * @param url 请求地址
     * @param mockData 模拟数据
     * @param options 其他选项
     */
    delete: <T>(url: string, mockData: T, options?: any) => {
      return request<T>(url, mockData, {
        method: 'DELETE',
        ...options
      });
    }
  };

  // 菜单相关API
  const menuApi = {
    // 获取管理员菜单
    getAdminMenu: () => http.get('/api/menus/admin', adminMenuConfig),
    
    // 获取用户仪表盘菜单
    getDashboardMenu: () => http.get('/api/menus/dashboard', dashboardMenuConfig),
    
    // 获取开发者菜单
    getDeveloperMenu: () => http.get('/api/menus/developer', developerMenuConfig)
  };

  return {
    request,
    http,
    menu: menuApi
    // 可以在这里扩展其他API模块
  };
}; 