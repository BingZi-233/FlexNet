import { ID, Account, Client, OAuthProvider, Query } from 'appwrite';
import type { Models } from 'appwrite';

/**
 * useAppwriteAccount composable
 * 
 * 提供Appwrite账户服务的封装，方便在应用中进行用户认证和账户管理
 */
export const useAppwriteAccount = () => {
  // 使用Nuxt的useNuxtApp访问通过插件注册的Appwrite实例
  const { $appwrite, $appwriteServer } = useNuxtApp();
  
  /**
   * 获取当前登录用户信息
   */
  const getCurrentUser = async (): Promise<Models.User<Models.Preferences> | null> => {
    try {
      // 尝试获取当前会话，如果有会话，获取并返回用户信息
      return await $appwrite.account.get();
    } catch (error) {
      // 如果出错（如未登录），返回null
      console.error('获取当前用户信息出错:', error);
      return null;
    }
  };
  
  /**
   * 检查用户是否已登录
   */
  const isLoggedIn = async (): Promise<boolean> => {
    try {
      const user = await getCurrentUser();
      return !!user;
    } catch (error) {
      console.error('检查登录状态出错:', error);
      return false;
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
    return await $appwrite.account.createEmailPasswordSession(email, password);
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
    } catch (error) {
      console.error('退出登录出错:', error);
      throw error;
    }
  };
  
  /**
   * 更新用户名
   * @param name 新的用户名，最多128个字符
   * @returns 返回更新后的用户对象
   */
  const updateName = async (name: string): Promise<Models.User<Models.Preferences>> => {
    try {
      return await $appwrite.account.updateName(name);
    } catch (error) {
      console.error('更新用户名出错:', error);
      throw error;
    }
  };
  
  /**
   * 更新用户手机号
   * @param phone 新的手机号码，包含国际区号（如+86）
   * @param password 用户当前密码
   * @returns 返回更新后的用户对象
   */
  const updatePhone = async (phone: string, password: string): Promise<Models.User<Models.Preferences>> => {
    try {
      return await $appwrite.account.updatePhone(phone, password);
    } catch (error) {
      console.error('更新手机号出错:', error);
      throw error;
    }
  };
  
  /**
   * 更新用户邮箱
   * @param email 新的电子邮箱
   * @param password 用户当前密码
   * @returns 返回更新后的用户对象
   */
  const updateEmail = async (email: string, password: string): Promise<Models.User<Models.Preferences>> => {
    try {
      return await $appwrite.account.updateEmail(email, password);
    } catch (error) {
      console.error('更新邮箱出错:', error);
      throw error;
    }
  };
  
  /**
   * 更新用户密码
   * @param newPassword 新密码，至少8个字符
   * @param oldPassword 当前密码（对于通过OAuth、邀请或Magic URL创建的用户，此参数可选）
   */
  const updatePassword = async (newPassword: string, oldPassword?: string): Promise<Models.User<Models.Preferences>> => {
    return await $appwrite.account.updatePassword(newPassword, oldPassword);
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
  
  /**
   * 获取用户所有会话
   */
  const getSessions = async (): Promise<Models.SessionList> => {
    return await $appwrite.account.listSessions();
  };
  
  /**
   * 删除指定会话
   */
  const deleteSession = async (sessionId: string): Promise<void> => {
    await $appwrite.account.deleteSession(sessionId);
  };
  
  /**
   * 获取会话日志
   * @param limit 限制返回的记录数量
   * @param offset 跳过的记录数量
   * @param queries 其他查询参数数组
   * @returns 返回会话日志列表
   */
  const getSessionLogs = async (limit?: number, offset?: number, queries: string[] = []): Promise<Models.LogList> => {
    try {
      // 构建查询参数
      const queryParams = [
        // 如果提供了limit，添加limit查询
        ...(limit ? [Query.limit(limit)] : []),
        // 如果提供了offset，添加offset查询
        ...(offset ? [Query.offset(offset)] : []),
        // 添加其他查询参数
        ...queries
      ];

      // 使用构建的查询参数获取日志
      return await $appwrite.account.listLogs(queryParams);
    } catch (error) {
      console.error('获取会话日志失败:', error);
      throw error;
    }
  };
  
  /**
   * 中断所有其他会话
   * @returns Promise<void>
   */
  const terminateAllOtherSessions = async (): Promise<void> => {
    try {
      const sessions = await $appwrite.account.listSessions();
      const currentSession = await $appwrite.account.getSession('current');
      
      // 删除所有非当前会话
      await Promise.all(
        sessions.sessions
          .filter(session => session.$id !== currentSession.$id)
          .map(session => $appwrite.account.deleteSession(session.$id))
      );
    } catch (error) {
      console.error('中断其他会话失败:', error);
      throw error;
    }
  };
  
  /**
   * 获取用户偏好设置
   */
  const getPreferences = async (): Promise<Models.Preferences> => {
    try {
      const user = await getCurrentUser();
      return user?.prefs || {};
    } catch (error) {
      console.error('获取用户偏好设置出错:', error);
      return {};
    }
  };
  
  /**
   * 更新用户偏好设置
   * @param prefs 要更新的偏好设置
   * @returns 返回更新后的用户对象
   */
  const updatePreferences = async (prefs: object): Promise<Models.User<Models.Preferences>> => {
    try {
      return await $appwrite.account.updatePrefs(prefs);
    } catch (error) {
      console.error('更新用户偏好设置出错:', error);
      throw error;
    }
  };
  
  /**
   * 更新用户角色
   * @param role 新的用户角色
   * @returns 返回更新后的用户对象
   */
  const updateUserRole = async (role: string): Promise<Models.User<Models.Preferences>> => {
    try {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        throw new Error('未登录用户无法更新角色');
      }
      
      const currentPrefs = currentUser.prefs || {};
      return await updatePreferences({
        ...currentPrefs,
        role
      });
    } catch (error) {
      console.error('更新用户角色出错:', error);
      throw error;
    }
  };
  
  /**
   * 发送验证邮件
   */
  const sendVerificationEmail = async (redirectUrl?: string): Promise<void> => {
    const url = redirectUrl || `${window.location.origin}/auth/verify-email`;
    await $appwrite.account.createVerification(url);
  };
  
  /**
   * 确认邮箱验证
   * 
   * 注意：该方法按文档返回类型应为void，但实际实现可能返回用户对象
   */
  const confirmVerification = async (userId: string, secret: string): Promise<void> => {
    await $appwrite.account.updateVerification(userId, secret);
  };
  
  /**
   * 创建JWT令牌
   * JWT有效期为15分钟，如果用户在此期间登出，令牌将失效
   */
  const createJWT = async (): Promise<Models.Jwt> => {
    return await $appwrite.account.createJWT();
  };
  
  /**
   * 在服务端创建JWT令牌
   * 注意：仅在服务端使用
   */
  const createServerJWT = async (): Promise<Models.Jwt> => {
    // 确保只在服务端调用
    if (process.server && $appwriteServer) {
      try {
        return await $appwriteServer.account.createJWT();
      } catch (error) {
        console.error('创建JWT出错:', error);
        throw error;
      }
    } else {
      throw new Error('createServerJWT只能在服务端调用');
    }
  };
  
  /**
   * 创建魔术链接令牌（Magic URL）
   * @param email 用户电子邮箱
   * @param redirectUrl 认证成功后的重定向URL
   * @returns 返回Token对象，包含userId和secret
   */
  const createMagicURLToken = async (email: string, redirectUrl?: string): Promise<Models.Token> => {
    const url = redirectUrl || `${window.location.origin}/auth/callback`;
    return await $appwrite.account.createMagicURLToken(ID.unique(), email, url);
  };
  
  /**
   * 更新魔术链接会话（确认Magic URL认证）
   * @param userId 用户ID
   * @param secret 认证密钥
   * @returns 返回Session对象
   */
  const updateMagicURLSession = async (userId: string, secret: string): Promise<Models.Session> => {
    return await $appwrite.account.updateMagicURLSession(userId, secret);
  };

  /**
   * 创建手机验证码令牌
   * @param phone 手机号码，包含国际区号（如+86）
   * @returns 返回Token对象，包含userId和secret
   */
  const createPhoneToken = async (phone: string): Promise<Models.Token> => {
    return await $appwrite.account.createPhoneToken(ID.unique(), phone);
  };
  
  /**
   * 更新手机验证码会话（确认SMS认证）
   * @param userId 用户ID
   * @param secret 短信验证码
   * @returns 返回Session对象
   */
  const updatePhoneSession = async (userId: string, secret: string): Promise<Models.Session> => {
    return await $appwrite.account.updatePhoneSession(userId, secret);
  };
  
  /**
   * 获取用户的所有身份信息
   * @returns 返回用户身份信息列表
   */
  const getIdentities = async (): Promise<Models.IdentityList> => {
    try {
      return await $appwrite.account.listIdentities();
    } catch (error) {
      console.error('获取用户身份信息出错:', error);
      throw error;
    }
  };

  /**
   * 删除指定的身份认证
   * @param identityId 要删除的身份ID
   * @returns Promise<void>
   */
  const deleteIdentity = async (identityId: string): Promise<void> => {
    try {
      await $appwrite.account.deleteIdentity(identityId);
    } catch (error) {
      console.error('删除身份认证出错:', error);
      throw error;
    }
  };
  
  /**
   * 获取用户的所有标签
   * @returns 返回用户标签列表
   */
  const getUserLabels = async (): Promise<string[]> => {
    try {
      const user = await getCurrentUser();
      if (!user) {
        return [];
      }
      return user.labels || [];
    } catch (error) {
      console.error('获取用户标签出错:', error);
      return [];
    }
  };

  /**
   * 检查用户是否有指定标签
   * @param label 要检查的标签
   * @returns 是否有该标签
   */
  const hasUserLabel = async (label: string): Promise<boolean> => {
    try {
      const labels = await getUserLabels();
      return labels.includes(label);
    } catch (error) {
      console.error('检查用户标签出错:', error);
      return false;
    }
  };

  /**
   * 检查用户是否有开发者权限
   * @returns 是否有开发者权限
   */
  const hasDevPermission = async (): Promise<boolean> => {
    return await hasUserLabel('developer') || await hasUserLabel('admin');
  };

  /**
   * 检查用户是否有管理员权限
   * @returns 是否有管理员权限
   */
  const hasAdminPermission = async (): Promise<boolean> => {
    return await hasUserLabel('admin');
  };
  
  // 返回所有方法
  return {
    getCurrentUser,
    isLoggedIn,
    createAccount,
    loginWithEmail,
    loginWithOAuth,
    loginWithGithub,
    loginWithGoogle,
    logout,
    updateName,
    updatePhone,
    updateEmail,
    updatePassword,
    resetPassword,
    confirmPasswordReset,
    getSessions,
    deleteSession,
    getSessionLogs,
    terminateAllOtherSessions,
    getPreferences,
    updatePreferences,
    updateUserRole,
    sendVerificationEmail,
    confirmVerification,
    createJWT,
    createServerJWT,
    createMagicURLToken,
    updateMagicURLSession,
    createPhoneToken,
    updatePhoneSession,
    getIdentities,
    deleteIdentity,
    getUserLabels,
    hasUserLabel,
    hasDevPermission,
    hasAdminPermission
  };
}; 