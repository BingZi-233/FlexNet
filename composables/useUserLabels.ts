/**
 * 用户标签管理composable
 * 提供添加和删除用户标签的功能
 */
export const useUserLabels = () => {
  /**
   * 添加用户标签
   * @param userId 用户ID
   * @param label 要添加的标签
   * @returns 添加标签的结果
   */
  const addUserLabel = async (userId: string, label: string) => {
    try {
      const response = await $fetch('/api/users/labels', {
        method: 'POST',
        body: {
          userId,
          action: 'add',
          label
        }
      });
      
      return response;
    } catch (error: any) {
      console.error('添加用户标签失败:', error);
      throw new Error(error.message || '添加用户标签失败');
    }
  };
  
  /**
   * 删除用户标签
   * @param userId 用户ID
   * @param label 要删除的标签
   * @returns 删除标签的结果
   */
  const removeUserLabel = async (userId: string, label: string) => {
    try {
      const response = await $fetch('/api/users/labels', {
        method: 'POST',
        body: {
          userId,
          action: 'remove',
          label
        }
      });
      
      return response;
    } catch (error: any) {
      console.error('删除用户标签失败:', error);
      throw new Error(error.message || '删除用户标签失败');
    }
  };
  
  /**
   * 为当前用户添加开发者权限
   * @returns 添加标签结果
   */
  const becomeDevUser = async () => {
    try {
      const { getCurrentUser } = useAppwriteAccount();
      const currentUser = await getCurrentUser();
      
      if (!currentUser) {
        throw new Error('用户未登录');
      }
      
      return await addUserLabel(currentUser.$id, 'developer');
    } catch (error: any) {
      console.error('添加开发者权限失败:', error);
      throw new Error(error.message || '添加开发者权限失败');
    }
  };
  
  /**
   * 为当前用户添加管理员权限
   * @returns 添加标签结果
   */
  const becomeAdminUser = async () => {
    try {
      const { getCurrentUser } = useAppwriteAccount();
      const currentUser = await getCurrentUser();
      
      if (!currentUser) {
        throw new Error('用户未登录');
      }
      
      return await addUserLabel(currentUser.$id, 'admin');
    } catch (error: any) {
      console.error('添加管理员权限失败:', error);
      throw new Error(error.message || '添加管理员权限失败');
    }
  };
  
  return {
    addUserLabel,
    removeUserLabel,
    becomeDevUser,
    becomeAdminUser
  };
}; 