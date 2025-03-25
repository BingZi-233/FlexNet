// 会话管理工具
const SESSION_KEY = 'appwrite_session';

export const useAppwriteSession = () => {
  const cookie = useCookie(SESSION_KEY);
  
  return {
    getSession: () => {
      try {
        return cookie.value ? JSON.parse(atob(cookie.value)) : null;
      } catch {
        return null;
      }
    },
    setSession: (jwt: string) => {
      cookie.value = btoa(JSON.stringify({ 
        token: jwt,
        expires: Date.now() + 3600_000 
      }));
    },
    clearSession: () => {
      cookie.value = null;
    }
  }
};

// 错误处理工具
export class AppwriteError extends Error {
  constructor(
    public code: number,
    message: string,
    public details?: Record<string, any>
  ) {
    super(message);
    
    // 自动上报错误
    useNuxtApp().$captureException(this);
  }

  static handle(error: any) {
    if (error instanceof AppwriteError) {
      throw createError({
        statusCode: error.code,
        message: error.message,
        data: error.details
      });
    }
    throw createError('未知的服务器错误');
  }
}