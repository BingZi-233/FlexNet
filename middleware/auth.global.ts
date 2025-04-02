// 全局认证中间件
// 用于保护需要登录才能访问的路由
import { Message } from '@arco-design/web-vue';

export default defineNuxtRouteMiddleware(async (to) => {
  // 仅在客户端运行
  if (process.client) {
    console.log('[Auth中间件] 路由请求:', to.path);
    const { isLoggedIn } = useAppwriteAccount();
    
    try {
      // 检查用户是否已登录
      const loggedIn = await isLoggedIn();
      console.log('[Auth中间件] 用户登录状态:', loggedIn);
      
      // 如果用户未登录且尝试访问受保护的路由，重定向到登录页面
      if (!loggedIn && to.path.startsWith('/dashboard')) {
        console.log('[Auth中间件] 拦截未授权访问，重定向到登录页面');
        Message.error('请先登录后再访问此页面');
        // 记录当前尝试访问的URL，登录后可以重定向回来
        return navigateTo(`/auth/login?redirect=${encodeURIComponent(to.fullPath)}`);
      }
      
      console.log('[Auth中间件] 认证检查通过，允许访问:', to.path);
    } catch (error) {
      console.error('[Auth中间件] 认证检查失败:', error);
      Message.error('认证检查失败，请重新登录');
      return navigateTo('/auth/login');
    }
  }
}); 