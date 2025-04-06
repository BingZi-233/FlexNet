export interface AppError {
  message: string;
  code: string;
  original: any;
}

/**
 * 错误处理工具composable
 * 提供统一的错误处理机制和用户通知
 */
export const useAppwriteError = () => {
  /**
   * 处理错误并返回规范化的错误对象
   * @param error 原始错误
   * @param context 错误上下文
   * @param fallbackMessage 默认错误消息
   * @returns 规范化的错误对象
   */
  const handleError = (
    error: any, 
    context: string, 
    fallbackMessage = '操作失败'
  ): AppError => {
    console.error(`${context}:`, error);
    
    return {
      message: error.message || fallbackMessage,
      code: error.code || 'UNKNOWN_ERROR',
      original: error
    };
  };
  
  /**
   * 处理错误并显示通知
   * @param error 原始错误
   * @param context 错误上下文
   * @param fallbackMessage 默认错误消息 
   * @returns 规范化的错误对象
   */
  const handleErrorWithNotification = (
    error: any,
    context: string,
    fallbackMessage = '操作失败'
  ): AppError => {
    const appError = handleError(error, context, fallbackMessage);
    
    // 使用全局Message组件（由Arco插件提供）
    if (process.client) {
      window.$message?.error?.(appError.message);
    }
    
    return appError;
  };
  
  return {
    handleError,
    handleErrorWithNotification
  };
}; 