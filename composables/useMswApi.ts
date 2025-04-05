/**
 * 简化的API服务
 * 使用MSW处理mock数据，无需手动判断环境
 */
export const useMswApi = () => {
  /**
   * 通用API请求函数
   * @param url 请求地址
   * @param options 请求选项
   */
  const request = async <T>(url: string, options: any = {}) => {
    try {
      // 所有请求都通过useFetch发送，
      // 如果启用了MSW，它会自动拦截请求并返回mock数据
      const { data, error } = await useFetch<{
        code: number;
        data: T;
        message: string;
      }>(url, {
        key: `${url}-${Date.now()}`,
        cache: 'no-cache',
        ...options
      });
      
      if (error.value) {
        throw error.value;
      }
      
      return data.value;
    } catch (error) {
      console.error(`请求 ${url} 失败:`, error);
      throw error;
    }
  };

  // 菜单相关API
  const menuApi = {
    // 获取管理员菜单
    getAdminMenu: () => request('/api/menus/admin'),
    
    // 获取用户仪表盘菜单
    getDashboardMenu: () => request('/api/menus/dashboard'),
    
    // 获取开发者菜单
    getDeveloperMenu: () => request('/api/menus/developer')
  };

  return {
    menu: menuApi
    // 可以在这里扩展其他API模块
  };
}; 