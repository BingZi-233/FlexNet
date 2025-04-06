import type { Models } from 'appwrite';

/**
 * Appwrite 用户资料管理功能
 * 提供更新用户名、邮箱、密码等功能
 */
export const useAppwriteProfile = () => {
  // 使用Nuxt的useNuxtApp访问通过插件注册的Appwrite实例
  const { $appwrite } = useNuxtApp();
  
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
   * 更新用户偏好设置
   * @param prefs 用户偏好设置对象
   */
  const updatePrefs = async (prefs: object): Promise<Models.User<Models.Preferences>> => {
    return await $appwrite.account.updatePrefs(prefs);
  };
  
  /**
   * 获取用户偏好设置
   */
  const getPrefs = async (): Promise<Models.Preferences> => {
    const user = await $appwrite.account.get();
    return user.prefs;
  };
  
  return {
    updateName,
    updatePhone,
    updateEmail,
    updatePassword,
    updatePrefs,
    getPrefs
  };
}; 