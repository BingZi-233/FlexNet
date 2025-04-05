import type { MenuItem } from '~/mock/data/menuConfig';
import { adminMenuConfig, dashboardMenuConfig, developerMenuConfig } from '~/mock/data/menuConfig';

/**
 * 菜单服务
 * 处理服务端菜单数据获取逻辑
 */
export const MenuService = {
  /**
   * 获取管理员菜单
   */
  async getAdminMenu(): Promise<MenuItem[]> {
    // 这里可以添加真实数据库查询逻辑
    // 例如: return await db.menus.find({ type: 'admin' });
    
    // 模拟延迟
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return adminMenuConfig;
  },
  
  /**
   * 获取用户仪表盘菜单
   */
  async getDashboardMenu(): Promise<MenuItem[]> {
    // 模拟延迟
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return dashboardMenuConfig;
  },
  
  /**
   * 获取开发者菜单
   */
  async getDeveloperMenu(): Promise<MenuItem[]> {
    // 模拟延迟
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return developerMenuConfig;
  }
}; 