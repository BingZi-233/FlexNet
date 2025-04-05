import { adminMenuConfig, dashboardMenuConfig, developerMenuConfig } from '../data/menuConfig';

// 模拟API延迟
const mockDelay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// 获取管理员菜单
export const getAdminMenu = async () => {
  await mockDelay();
  return { 
    code: 200, 
    data: adminMenuConfig,
    message: '获取管理员菜单成功'
  };
};

// 获取用户仪表盘菜单
export const getDashboardMenu = async () => {
  await mockDelay();
  return { 
    code: 200, 
    data: dashboardMenuConfig,
    message: '获取用户仪表盘菜单成功'
  };
};

// 获取开发者菜单
export const getDeveloperMenu = async () => {
  await mockDelay();
  return { 
    code: 200, 
    data: developerMenuConfig,
    message: '获取开发者菜单成功'
  };
}; 