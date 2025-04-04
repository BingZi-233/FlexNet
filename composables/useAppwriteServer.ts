import { Account, Client, ID } from 'node-appwrite';
import type { Models } from 'appwrite';

/**
 * 服务端Appwrite操作composable
 * 提供服务端获取当前会话等功能
 */
export const useAppwriteServer = () => {
  const config = useRuntimeConfig();
  const nuxtApp = useNuxtApp();

  /**
   * 获取当前服务端会话
   * @returns 当前会话或null
   */
  const getSession = async (): Promise<Models.Session | null> => {
    // 确保只在服务端调用
    if (!process.server) {
      console.warn('getSession只能在服务端调用');
      return null;
    }

    try {
      // 获取请求上下文中的cookie
      const event = useRequestEvent();
      const cookies = parseCookies(event);
      
      // 检查是否有Appwrite会话cookie
      const sessionName = `a_session_${config.public.appwriteProjectId.toLowerCase()}`;
      if (!cookies[sessionName]) {
        return null;
      }
      
      // 使用已初始化的Appwrite服务端实例
      const { account } = nuxtApp.$appwriteServer;
      
      // 获取当前会话
      return await account.getSession('current');
    } catch (error) {
      console.error('获取服务端会话失败:', error);
      return null;
    }
  };
  
  /**
   * 解析请求事件中的cookie
   * @param event 请求事件
   * @returns cookie对象
   */
  const parseCookies = (event: any): Record<string, string> => {
    const cookieHeader = event?.node?.req?.headers?.cookie || '';
    return cookieHeader.split(';')
      .reduce((cookies: Record<string, string>, cookie: string) => {
        const [name, value] = cookie.trim().split('=');
        if (name) cookies[name] = value || '';
        return cookies;
      }, {});
  };
  
  return {
    getSession
  };
}; 