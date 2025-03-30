import { useAppwriteAccount } from '@/composables/useAppwriteAccount';

/**
 * guest 中间件
 * 用于限制已登录用户访问登录/注册页面
 * 如果用户已登录，将重定向到首页
 */
export default defineNuxtRouteMiddleware(async (to, from) => {
  // 使用 Appwrite 账户服务检查登录状态
  const { isLoggedIn } = useAppwriteAccount();
  
  try {
    // 检查用户是否已登录
    const loggedIn = await isLoggedIn();
    
    // 如果用户已登录，重定向到首页
    if (loggedIn) {
      return navigateTo('/');
    }
  } catch (error) {
    console.error('中间件检查登录状态失败:', error);
    // 出错时假设用户未登录，允许访问
  }
}); 