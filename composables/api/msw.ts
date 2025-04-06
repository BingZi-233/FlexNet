import type { RequestOptions, MenuApi } from './types';

/**
 * 使用MSW处理mock数据的API服务
 * MSW会自动拦截匹配的请求并返回模拟数据
 */
export const useApiMsw = () => {
  /**
   * 通用API请求函数
   * @param url 请求地址
   * @param options 请求选项
   */
  const request = async <T>(url: string, options: RequestOptions = {}) => {
    try {
      // 所有请求都通过useFetch发送，
      // 如果启用了MSW，它会自动拦截请求并返回mock数据
      const { data, error } = await useFetch(url, {
        key: `${url}-${Date.now()}`,
        cache: 'no-cache' as any,
        ...options
      });
      
      if (error.value) {
        throw error.value;
      }
      
      // 检查业务状态码
      if (data.value && (data.value as any).code !== 200) {
        throw new Error((data.value as any).message || `服务器返回错误: 状态码 ${(data.value as any).code}`);
      }
      
      return data.value;
    } catch (error) {
      console.error(`请求 ${url} 失败:`, error);
      throw error;
    }
  };
  
  /**
   * HTTP方法封装
   * 提供GET、POST、PUT、DELETE等方法的便捷封装
   */
  const http = {
    /**
     * GET请求
     * @param url 请求地址
     * @param params 查询参数
     * @param options 其他选项
     */
    get: <T>(url: string, params?: Record<string, any>, options?: RequestOptions) => {
      return request<T>(url, {
        method: 'GET',
        params,
        ...options
      });
    },
    
    /**
     * POST请求
     * @param url 请求地址
     * @param body 请求体
     * @param options 其他选项
     */
    post: <T>(url: string, body?: any, options?: RequestOptions) => {
      return request<T>(url, {
        method: 'POST',
        body,
        ...options
      });
    },
    
    /**
     * PUT请求
     * @param url 请求地址
     * @param body 请求体
     * @param options 其他选项
     */
    put: <T>(url: string, body?: any, options?: RequestOptions) => {
      return request<T>(url, {
        method: 'PUT',
        body,
        ...options
      });
    },
    
    /**
     * DELETE请求
     * @param url 请求地址
     * @param body 请求体
     * @param options 其他选项
     */
    delete: <T>(url: string, body?: any, options?: RequestOptions) => {
      return request<T>(url, {
        method: 'DELETE',
        body,
        ...options
      });
    }
  };

  // 菜单相关API
  const menuApi: MenuApi = {
    // 获取管理员菜单
    getAdminMenu: () => http.get('/api/menus/admin'),
    
    // 获取用户仪表盘菜单
    getDashboardMenu: () => http.get('/api/menus/dashboard'),
    
    // 获取开发者菜单
    getDeveloperMenu: () => http.get('/api/menus/developer')
  };

  return {
    request,
    http,
    menu: menuApi
    // 可以在这里扩展其他API模块
  };
}; 