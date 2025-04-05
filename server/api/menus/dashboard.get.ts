import { MenuService } from '~/server/utils/menuService';

export default defineEventHandler(async (event) => {
  try {
    // 获取菜单数据
    const menuData = await MenuService.getDashboardMenu();
    
    // 返回与mock数据相同结构的响应
    return {
      code: 200,
      data: menuData,
      message: '获取用户仪表盘菜单成功'
    };
  } catch (error) {
    console.error('获取用户仪表盘菜单失败:', error);
    
    // 返回错误响应
    return {
      code: 500,
      data: null,
      message: '获取用户仪表盘菜单失败'
    };
  }
}); 