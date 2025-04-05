// 全局认证中间件
// 用于保护需要登录才能访问的路由
import { Message } from '@arco-design/web-vue';
import { UserRole } from '~/types/user';

export default defineNuxtRouteMiddleware(async (to) => {
  // 仅在客户端运行
  if (import.meta.client) {
    console.log('[Auth中间件] 路由请求:', to.path);
    const { isLoggedIn, getCurrentUser } = useAppwriteAccount();
    
    try {
      // 检查用户是否已登录
      const loggedIn = await isLoggedIn();
      console.log('[Auth中间件] 用户登录状态:', loggedIn);
      
      // 如果用户未登录且尝试访问受保护的路由，重定向到登录页面
      if (!loggedIn && (to.path.startsWith('/dashboard') || 
                        to.path.startsWith('/admin') || 
                        to.path.startsWith('/developer'))) {
        console.log('[Auth中间件] 拦截未授权访问，重定向到登录页面');
        Message.error('请先登录后再访问此页面');
        // 记录当前尝试访问的URL，登录后可以重定向回来
        return navigateTo(`/auth/login?redirect=${encodeURIComponent(to.fullPath)}`, {
          redirectCode: 302, // 临时重定向
          replace: true // 替换当前历史记录，而不是添加新记录
        });
      }
      
      // 如果用户已登录，检查角色权限
      if (loggedIn) {
        const user = await getCurrentUser();
        // 从用户的 Labels 获取角色，而不是从 prefs 获取
        const userRole = user?.labels?.includes('admin') ? UserRole.ADMIN :
                         user?.labels?.includes('developer') ? UserRole.DEVELOPER :
                         UserRole.USER;
        
        // 管理员路由权限验证
        if (to.path.startsWith('/admin') && userRole !== UserRole.ADMIN) {
          console.log('[Auth中间件] 非管理员尝试访问管理页面');
          Message.error('您没有权限访问管理页面');
          return navigateTo('/dashboard', {
            replace: true // 替换当前路由记录
          });
        }
        
        // 开发者路由权限验证
        if (to.path.startsWith('/developer') && 
            userRole !== UserRole.DEVELOPER && 
            userRole !== UserRole.ADMIN) {
          console.log('[Auth中间件] 非开发者尝试访问开发者页面');
          Message.error('您没有权限访问开发者页面');
          return navigateTo('/dashboard', {
            replace: true // 替换当前路由记录
          });
        }
      }
      
      console.log('[Auth中间件] 认证检查通过，允许访问:', to.path);
    } catch (error) {
      console.error('[Auth中间件] 认证检查失败:', error);
      Message.error('认证检查失败，请重新登录');
      return navigateTo('/auth/login', {
        redirectCode: 302,
        replace: true
      });
    }
  }
}); 