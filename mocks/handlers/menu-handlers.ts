import { http, HttpResponse } from 'msw';
import { adminMenuConfig, dashboardMenuConfig, developerMenuConfig } from '~/mock/data/menuConfig';

// 模拟API响应封装
const mockResponse = <T>(data: T) => {
  return HttpResponse.json({
    code: 200,
    data,
    message: '操作成功'
  });
};

// 创建菜单处理器
export const menuHandlers = [
  // 管理员菜单
  http.get('/api/menus/admin', () => {
    return mockResponse(adminMenuConfig);
  }),
  
  // 用户仪表盘菜单
  http.get('/api/menus/dashboard', () => {
    return mockResponse(dashboardMenuConfig);
  }),
  
  // 开发者菜单
  http.get('/api/menus/developer', () => {
    return mockResponse(developerMenuConfig);
  })
]; 