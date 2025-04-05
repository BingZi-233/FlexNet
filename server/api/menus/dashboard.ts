import { dashboardMenuConfig } from '~/mock/data/menuConfig';

export default defineEventHandler(async (event) => {
  // 这里可以加入权限验证、数据库查询等实际业务逻辑
  
  // 模拟从数据库获取数据的延迟
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // 返回与mock数据相同结构的响应
  return {
    code: 200,
    data: dashboardMenuConfig,
    message: '获取用户仪表盘菜单成功'
  };
}); 