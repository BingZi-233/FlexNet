import type { Models } from 'appwrite';
import { Query } from 'appwrite';

/**
 * Appwrite 会话管理功能
 * 提供获取、管理会话信息的功能
 */
export const useAppwriteSession = () => {
  // 使用Nuxt的useNuxtApp访问通过插件注册的Appwrite实例
  const { $appwrite } = useNuxtApp();
  
  /**
   * 获取用户所有会话
   */
  const getSessions = async (): Promise<Models.SessionList> => {
    return await $appwrite.account.listSessions();
  };
  
  /**
   * 获取当前会话
   */
  const getCurrentSession = async (): Promise<Models.Session> => {
    return await $appwrite.account.getSession('current');
  };
  
  /**
   * 删除指定会话
   */
  const deleteSession = async (sessionId: string): Promise<void> => {
    await $appwrite.account.deleteSession(sessionId);
  };
  
  /**
   * 删除所有会话（除了当前会话）
   */
  const deleteAllSessions = async (): Promise<void> => {
    const sessions = await getSessions();
    const currentSession = await getCurrentSession();
    
    // 删除除当前会话外的所有会话
    for (const session of sessions.sessions) {
      if (session.$id !== currentSession.$id) {
        await deleteSession(session.$id);
      }
    }
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
        // 添加其他查询条件
        ...queries
      ];
      
      return await $appwrite.account.listLogs(queryParams);
    } catch (error) {
      console.error('获取会话日志出错:', error);
      throw error;
    }
  };
  
  return {
    getSessions,
    getCurrentSession,
    deleteSession,
    deleteAllSessions,
    getSessionLogs
  };
}; 