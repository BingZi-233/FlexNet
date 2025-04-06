import type { ApiResponse, RequestOptions, HttpMethods, MenuApi, ApiService } from './types';

/**
 * API核心功能，提供基本的API请求功能
 */
export const useApiCore = (): ApiService => {
  const config = useRuntimeConfig();
  
  /**
   * 通用API请求函数
   * @param url 请求地址
   * @param options 请求选项
   */
  const request = async <T>(url: string, options: RequestOptions = {}) => {
    try {
      const { data, error } = await useFetch<ApiResponse<T>>(url, {
        // 使用时间戳作为缓存键，确保请求不走缓存
        key: `${url}-${Date.now()}`,
        // 禁用缓存
        cache: 'no-cache',
        // 合并自定义选项
        ...options
      });
      
      if (error.value) {
        throw error.value;
      }
      
      // 检查业务状态码
      if (data.value && data.value.code !== 200) {
        throw new Error(data.value.message || `服务器返回错误: 状态码 ${data.value.code}`);
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
  const http: HttpMethods = {
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

  /**
   * 菜单相关API
   */
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