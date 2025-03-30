import { useAppwriteAccount } from '@/composables/useAppwriteAccount';

/**
 * auth 中间件
 * 用于保护需要登录才能访问的页面
 * 如果用户未登录，将重定向到登录页面
 */
export default defineNuxtRouteMiddleware(async (to, from) => {
  // 使用 Appwrite 账户服务检查登录状态
  const { isLoggedIn } = useAppwriteAccount();
  
  try {
    // 检查用户是否已登录
    const loggedIn = await isLoggedIn();
    
    // 如果用户未登录，重定向到登录页面
    if (!loggedIn) {
      return navigateTo('/auth/login');
    }
  } catch (error) {
    console.error('中间件检查登录状态失败:', error);
    // 出错时假设用户未登录，重定向到登录页面
    return navigateTo('/auth/login');
  }
}); 