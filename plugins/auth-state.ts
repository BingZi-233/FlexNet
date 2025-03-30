import { useAppwriteAccount } from '@/composables/useAppwriteAccount';
import type { Models } from 'appwrite';

/**
 * 认证状态管理插件
 * 在应用启动时检查用户登录状态，并提供全局状态共享
 */
export default defineNuxtPlugin(async (nuxtApp) => {
  // 创建全局状态
  const isLoggedIn = useState('isLoggedIn', () => false);
  const user = useState<Models.User<Models.Preferences> | null>('user', () => null);
  
  // 检查认证状态的函数
  const checkAuthStatus = async () => {
    const { isLoggedIn: checkLoggedIn, getCurrentUser } = useAppwriteAccount();
    
    try {
      // 检查用户是否已登录
      const loggedIn = await checkLoggedIn();
      isLoggedIn.value = loggedIn;
      
      // 如果已登录，获取用户信息
      if (loggedIn) {
        user.value = await getCurrentUser();
      } else {
        user.value = null;
      }
      
      return { isLoggedIn: isLoggedIn.value, user: user.value };
    } catch (error) {
      console.error('检查认证状态失败:', error);
      isLoggedIn.value = false;
      user.value = null;
      
      return { isLoggedIn: false, user: null };
    }
  };
  
  // 首次检查登录状态
  await checkAuthStatus();
  
  // 为模板提供辅助函数
  nuxtApp.provide('checkAuthStatus', checkAuthStatus);
}); 