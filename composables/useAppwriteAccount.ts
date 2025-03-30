import { ID, OAuthProvider, AppwriteException } from 'appwrite';

/**
 * Appwrite 账户服务 Composable
 * 封装用户账户相关操作
 */
export const useAppwriteAccount = () => {
  // 获取 Nuxt 应用实例以访问插件提供的服务
  const nuxtApp = useNuxtApp();
  const { $appwrite } = nuxtApp;
  
  // 如果插件未正确加载，显示错误
  if (!$appwrite) {
    console.error('Appwrite 插件未正确加载');
    throw new Error('Appwrite 插件未正确加载');
  }
  
  // 获取 account 实例
  const account = $appwrite.account;
  
  /**
   * 获取当前登录用户信息
   */
  const getCurrentUser = async () => {
    try {
      return await account.get();
    } catch (error) {
      console.error('获取当前用户信息失败', error);
      return null;
    }
  };
  
  /**
   * 检查用户是否已登录
   */
  const isLoggedIn = async () => {
    try {
      await account.get();
      return true;
    } catch (error) {
      return false;
    }
  };
  
  /**
   * 创建新用户（邮箱、密码注册）
   */
  const createAccount = async (email: string, password: string, name?: string) => {
    try {
      return await account.create(ID.unique(), email, password, name);
    } catch (error) {
      console.error('创建账户失败', error);
      throw error;
    }
  };
  
  /**
   * 邮箱密码登录
   */
  const loginWithEmail = async (email: string, password: string) => {
    try {
      return await account.createEmailPasswordSession(email, password);
    } catch (error) {
      console.error('邮箱登录失败', error);
      throw error;
    }
  };
  
  /**
   * OAuth 登录
   * @param provider OAuth 提供商
   * @param successUrl 成功回调地址
   * @param failureUrl 失败回调地址
   */
  const loginWithOAuth = (
    provider: OAuthProvider,
    successUrl?: string,
    failureUrl?: string
  ) => {
    try {
      return account.createOAuth2Session(
        provider,
        successUrl,
        failureUrl
      );
    } catch (error) {
      console.error('OAuth 登录失败', error);
      throw error;
    }
  };
  
  /**
   * 退出登录（删除当前会话）
   */
  const logout = async () => {
    try {
      await account.deleteSession('current');
      return true;
    } catch (error) {
      console.error('退出登录失败', error);
      return false;
    }
  };
  
  /**
   * 退出所有设备的登录（删除所有会话）
   */
  const logoutAll = async () => {
    try {
      await account.deleteSessions();
      return true;
    } catch (error) {
      console.error('退出所有登录失败', error);
      return false;
    }
  };
  
  /**
   * 发送密码重置邮件
   */
  const sendPasswordRecovery = async (email: string, url: string) => {
    try {
      return await account.createRecovery(email, url);
    } catch (error) {
      console.error('发送密码重置邮件失败', error);
      throw error;
    }
  };
  
  /**
   * 完成密码重置
   */
  const confirmPasswordRecovery = async (
    userId: string,
    secret: string,
    password: string
  ) => {
    try {
      return await account.updateRecovery(userId, secret, password);
    } catch (error) {
      console.error('密码重置失败', error);
      throw error;
    }
  };
  
  /**
   * 发送邮箱验证邮件
   */
  const sendVerificationEmail = async (url: string) => {
    try {
      return await account.createVerification(url);
    } catch (error) {
      console.error('发送验证邮件失败', error);
      throw error;
    }
  };
  
  /**
   * 确认邮箱验证
   */
  const confirmVerification = async (userId: string, secret: string) => {
    try {
      return await account.updateVerification(userId, secret);
    } catch (error) {
      console.error('邮箱验证失败', error);
      throw error;
    }
  };
  
  /**
   * 更新用户名
   */
  const updateName = async (name: string) => {
    try {
      return await account.updateName(name);
    } catch (error) {
      console.error('更新用户名失败', error);
      throw error;
    }
  };
  
  /**
   * 更新邮箱
   */
  const updateEmail = async (email: string, password: string) => {
    try {
      return await account.updateEmail(email, password);
    } catch (error) {
      console.error('更新邮箱失败', error);
      throw error;
    }
  };
  
  /**
   * 更新密码
   */
  const updatePassword = async (password: string, oldPassword: string) => {
    try {
      return await account.updatePassword(password, oldPassword);
    } catch (error) {
      console.error('更新密码失败', error);
      throw error;
    }
  };
  
  /**
   * 获取会话列表
   */
  const getSessions = async () => {
    try {
      return await account.listSessions();
    } catch (error) {
      console.error('获取会话列表失败', error);
      throw error;
    }
  };
  
  /**
   * 获取用户偏好设置
   */
  const getPreferences = async () => {
    try {
      return await account.getPrefs();
    } catch (error) {
      console.error('获取用户偏好设置失败', error);
      return {};
    }
  };
  
  /**
   * 更新用户偏好设置
   */
  const updatePreferences = async (prefs: object) => {
    try {
      return await account.updatePrefs(prefs);
    } catch (error) {
      console.error('更新用户偏好设置失败', error);
      throw error;
    }
  };
  
  /**
   * 创建魔术链接（免密码登录）
   */
  const createMagicURLToken = async (
    email: string,
    url: string
  ) => {
    try {
      return await account.createMagicURLToken(ID.unique(), email, url);
    } catch (error) {
      console.error('创建魔术链接失败', error);
      throw error;
    }
  };
  
  /**
   * 验证魔术链接
   */
  const updateMagicURLSession = async (
    userId: string,
    secret: string
  ) => {
    try {
      return await account.updateMagicURLSession(userId, secret);
    } catch (error) {
      console.error('验证魔术链接失败', error);
      throw error;
    }
  };

  // 返回所有可用的方法
  return {
    getCurrentUser,
    isLoggedIn,
    createAccount,
    loginWithEmail,
    loginWithOAuth,
    logout,
    logoutAll,
    sendPasswordRecovery,
    confirmPasswordRecovery,
    sendVerificationEmail,
    confirmVerification,
    updateName,
    updateEmail,
    updatePassword,
    getSessions,
    getPreferences,
    updatePreferences,
    createMagicURLToken,
    updateMagicURLSession
  };
}; 