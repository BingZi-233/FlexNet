import { ID, Account, OAuthProvider } from 'appwrite';
import type { Models } from 'appwrite';

/**
 * Appwrite 认证功能
 * 提供登录、注册、OAuth等功能
 */
export const useAppwriteAuth = () => {
  // 使用Nuxt的useNuxtApp访问通过插件注册的Appwrite实例
  const { $appwrite } = useNuxtApp();
  
  // 用户状态
  const user = useState<Models.User<Models.Preferences> | null>('appwrite-user', () => null);
  const isLoggedIn = computed(() => !!user.value);
  
  /**
   * 获取当前登录用户信息
   */
  const getCurrentUser = async (): Promise<Models.User<Models.Preferences> | null> => {
    try {
      // 尝试获取当前会话，如果有会话，获取并返回用户信息
      const currentUser = await $appwrite.account.get();
      user.value = currentUser;
      return currentUser;
    } catch (error) {
      // 如果出错（如未登录），返回null
      console.error('获取当前用户信息出错:', error);
      user.value = null;
      return null;
    }
  };
  
  /**
   * 创建新用户账户
   * @param email 用户电子邮箱
   * @param password 用户密码(8-256字符)
   * @param name 用户名称(最多128字符)
   * @param userId 自定义用户ID，如果不提供则自动生成
   */
  const createAccount = async (
    email: string, 
    password: string, 
    name?: string, 
    userId: string = ID.unique()
  ): Promise<Models.User<Models.Preferences>> => {
    return await $appwrite.account.create(
      userId,
      email,
      password,
      name
    );
  };
  
  /**
   * 使用邮箱和密码登录
   */
  const loginWithEmail = async (email: string, password: string): Promise<Models.Session> => {
    const session = await $appwrite.account.createEmailPasswordSession(email, password);
    // 登录成功后更新用户状态
    await getCurrentUser();
    return session;
  };
  
  /**
   * 使用OAuth提供商登录（如GitHub、Google等）
   */
  const loginWithOAuth = async (provider: string, successUrl?: string, failureUrl?: string): Promise<void> => {
    // 将字符串provider转换为OAuthProvider枚举值
    const oauthProvider = provider as unknown as OAuthProvider;
    const success = successUrl || window.location.href;
    const failure = failureUrl || window.location.href;
    
    await $appwrite.account.createOAuth2Session(oauthProvider, success, failure);
  };

  /**
   * OAuth登录辅助方法 - GitHub
   */
  const loginWithGithub = async (successUrl?: string, failureUrl?: string): Promise<void> => {
    await loginWithOAuth(OAuthProvider.Github, successUrl, failureUrl);
  };
  
  /**
   * OAuth登录辅助方法 - Google
   */
  const loginWithGoogle = async (successUrl?: string, failureUrl?: string): Promise<void> => {
    await loginWithOAuth(OAuthProvider.Google, successUrl, failureUrl);
  };
  
  /**
   * 退出登录（销毁当前会话）
   */
  const logout = async (): Promise<void> => {
    try {
      await $appwrite.account.deleteSession('current');
      user.value = null;
    } catch (error) {
      console.error('退出登录出错:', error);
      throw error;
    }
  };
  
  /**
   * 发送密码重置邮件
   */
  const resetPassword = async (email: string, redirectUrl?: string): Promise<void> => {
    const url = redirectUrl || `${window.location.origin}/auth/reset-password`;
    await $appwrite.account.createRecovery(email, url);
  };
  
  /**
   * 确认密码重置并设置新密码
   */
  const confirmPasswordReset = async (userId: string, secret: string, password: string): Promise<void> => {
    await $appwrite.account.updateRecovery(userId, secret, password);
  };
  
  return {
    user,
    isLoggedIn,
    getCurrentUser,
    createAccount,
    loginWithEmail,
    loginWithOAuth,
    loginWithGithub,
    loginWithGoogle,
    logout,
    resetPassword,
    confirmPasswordReset
  };
}; 