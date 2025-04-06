import { Account, Client, ID } from 'node-appwrite';
import type { Models } from 'appwrite';
import { H3Event } from 'h3';
import { useAppwriteError } from '../utils/error';

/**
 * 服务端Appwrite操作composable
 * 提供服务端获取当前会话等功能
 */
export const useAppwriteServer = () => {
  const config = useRuntimeConfig();
  const nuxtApp = useNuxtApp();
  const { handleError } = useAppwriteError();

  /**
   * 获取当前服务端会话
   * @param retry 重试次数
   * @param retryDelay 重试延迟(毫秒)
   * @returns 当前会话或null
   */
  const getSession = async (
    retry: number = 1,
    retryDelay: number = 500
  ): Promise<Models.Session | null> => {
    // 确保只在服务端调用
    if (!process.server) {
      console.warn('getSession只能在服务端调用');
      return null;
    }

    try {
      // 获取请求上下文中的cookie
      const event = useRequestEvent();
      if (!event) {
        throw new Error('无法获取请求事件');
      }
      
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
      // 处理错误
      handleError(error, '获取服务端会话', '获取服务端会话失败');
      
      // 重试逻辑
      if (retry > 0) {
        // 等待指定时间后重试
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        return getSession(retry - 1, retryDelay);
      }
      
      return null;
    }
  };
  
  /**
   * 解析请求事件中的cookie
   * @param event 请求事件
   * @returns cookie对象
   */
  const parseCookies = (event: H3Event): Record<string, string> => {
    // 获取cookie头
    const cookieHeader = event.node?.req?.headers?.cookie || '';
    
    // 如果没有cookie头，返回空对象
    if (!cookieHeader) return {};
    
    // 解析cookies
    return cookieHeader.split(';')
      .reduce((cookies: Record<string, string>, cookie: string) => {
        const [name, value] = cookie.trim().split('=');
        if (name) cookies[name] = value || '';
        return cookies;
      }, {});
  };
  
  /**
   * 获取当前服务端用户
   * @returns 当前用户或null
   */
  const getCurrentUser = async (): Promise<Models.User<Models.Preferences> | null> => {
    try {
      // 获取当前会话
      const session = await getSession();
      if (!session) return null;
      
      // 使用已初始化的Appwrite服务端实例获取用户
      const { account } = nuxtApp.$appwriteServer;
      
      // 获取当前用户
      return await account.get();
    } catch (error) {
      handleError(error, '获取服务端用户', '获取服务端用户失败');
      return null;
    }
  };
  
  return {
    getSession,
    getCurrentUser,
    parseCookies
  };
}; 