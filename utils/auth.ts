import { OAuthProvider } from 'appwrite';
import { useAppwriteAccount } from '@/composables/useAppwriteAccount';

/**
 * GitHub 登录
 * 重定向到 GitHub OAuth 登录页面
 */
export const loginWithGithub = () => {
  const { loginWithOAuth } = useAppwriteAccount();
  const currentUrl = window.location.origin;
  
  // 使用当前URL作为回调地址
  loginWithOAuth(
    OAuthProvider.Github,
    `${currentUrl}/auth/callback`,
    `${currentUrl}/auth/login`
  );
};

/**
 * Google 登录
 * 重定向到 Google OAuth 登录页面
 */
export const loginWithGoogle = () => {
  const { loginWithOAuth } = useAppwriteAccount();
  const currentUrl = window.location.origin;
  
  // 使用当前URL作为回调地址
  loginWithOAuth(
    OAuthProvider.Google,
    `${currentUrl}/auth/callback`,
    `${currentUrl}/auth/login`
  );
};

// 提供一个 useAuth composable 以兼容现有代码
export const useAuth = () => {
  const { 
    createAccount: appwriteCreateAccount, 
    loginWithEmail: appwriteLoginWithEmail,
    logout: appwriteLogout,
    getCurrentUser: appwriteGetCurrentUser
  } = useAppwriteAccount();
  
  // 注册方法
  const register = async (email: string, password: string, name?: string) => {
    try {
      await appwriteCreateAccount(email, password, name);
      return { success: true };
    } catch (error: any) {
      console.error('注册失败:', error);
      return { 
        success: false, 
        error: error.message || '注册失败，请稍后再试' 
      };
    }
  };
  
  // 登录方法
  const login = async (email: string, password: string) => {
    try {
      await appwriteLoginWithEmail(email, password);
      return { success: true };
    } catch (error: any) {
      console.error('登录失败:', error);
      return { 
        success: false, 
        error: error.message || '登录失败，请检查用户名和密码' 
      };
    }
  };
  
  // 退出登录方法
  const logout = async () => {
    try {
      await appwriteLogout();
      return { success: true };
    } catch (error: any) {
      console.error('退出登录失败:', error);
      return { 
        success: false, 
        error: error.message || '退出登录失败' 
      };
    }
  };
  
  // 获取当前用户方法
  const getUser = async () => {
    try {
      const user = await appwriteGetCurrentUser();
      return user;
    } catch (error) {
      console.error('获取用户信息失败:', error);
      return null;
    }
  };
  
  return {
    register,
    login,
    logout,
    getUser,
    loginWithGithub,
    loginWithGoogle
  };
}; 