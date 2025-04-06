import type { UserLabel, UserLabelResponse } from './types';
import { useAppwriteAuth } from './account/auth';
import { useAppwriteError } from '../utils/error';
import { useValidation } from '../utils/validation';

/**
 * 用户标签管理功能
 * 提供添加和删除用户标签的功能
 */
export const useUserLabels = () => {
  const { handleError } = useAppwriteError();
  const { isValidString } = useValidation();
  
  /**
   * 验证标签是否为有效值
   * @param label 标签值
   * @returns 是否为有效的标签
   */
  const isValidLabel = (label: string): label is UserLabel => {
    return ['admin', 'developer', 'user', 'guest'].includes(label);
  };
  
  /**
   * 添加用户标签
   * @param userId 用户ID
   * @param label 要添加的标签
   * @returns 添加标签的结果
   */
  const addUserLabel = async (userId: string, label: UserLabel): Promise<UserLabelResponse> => {
    // 验证参数
    if (!isValidString(userId)) {
      throw new Error('用户ID不能为空');
    }
    
    if (!isValidLabel(label)) {
      throw new Error(`无效的标签值: ${label}`);
    }
    
    try {
      const response = await $fetch('/api/users/labels', {
        method: 'POST',
        body: {
          userId,
          action: 'add',
          label
        }
      }) as UserLabelResponse;
      
      return response;
    } catch (error) {
      const appError = handleError(error, '添加用户标签', `添加标签 ${label} 失败`);
      throw new Error(appError.message);
    }
  };
  
  /**
   * 删除用户标签
   * @param userId 用户ID
   * @param label 要删除的标签
   * @returns 删除标签的结果
   */
  const removeUserLabel = async (userId: string, label: UserLabel): Promise<UserLabelResponse> => {
    // 验证参数
    if (!isValidString(userId)) {
      throw new Error('用户ID不能为空');
    }
    
    if (!isValidLabel(label)) {
      throw new Error(`无效的标签值: ${label}`);
    }
    
    try {
      const response = await $fetch('/api/users/labels', {
        method: 'POST',
        body: {
          userId,
          action: 'remove',
          label
        }
      }) as UserLabelResponse;
      
      return response;
    } catch (error) {
      const appError = handleError(error, '删除用户标签', `删除标签 ${label} 失败`);
      throw new Error(appError.message);
    }
  };
  
  /**
   * 为当前用户添加开发者权限
   * @returns 添加标签结果
   */
  const becomeDevUser = async (): Promise<UserLabelResponse> => {
    try {
      const auth = useAppwriteAuth();
      const currentUser = await auth.getCurrentUser();
      
      if (!currentUser) {
        throw new Error('用户未登录');
      }
      
      return await addUserLabel(currentUser.$id, 'developer');
    } catch (error) {
      const appError = handleError(error, '添加开发者权限', '添加开发者权限失败');
      throw new Error(appError.message);
    }
  };
  
  /**
   * 为当前用户添加管理员权限
   * @returns 添加标签结果
   */
  const becomeAdminUser = async (): Promise<UserLabelResponse> => {
    try {
      const auth = useAppwriteAuth();
      const currentUser = await auth.getCurrentUser();
      
      if (!currentUser) {
        throw new Error('用户未登录');
      }
      
      return await addUserLabel(currentUser.$id, 'admin');
    } catch (error) {
      const appError = handleError(error, '添加管理员权限', '添加管理员权限失败');
      throw new Error(appError.message);
    }
  };
  
  /**
   * 检查用户是否有指定标签
   * @param userId 用户ID
   * @param label 标签
   * @returns 是否有指定标签
   */
  const hasUserLabel = async (userId: string, label: UserLabel): Promise<boolean> => {
    try {
      const response = await $fetch(`/api/users/${userId}/labels`) as { labels: UserLabel[] };
      return response.labels.includes(label);
    } catch (error) {
      handleError(error, '检查用户标签', `检查标签 ${label} 失败`);
      return false;
    }
  };
  
  return {
    addUserLabel,
    removeUserLabel,
    becomeDevUser,
    becomeAdminUser,
    hasUserLabel,
    isValidLabel
  };
};