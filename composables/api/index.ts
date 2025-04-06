import { useApiCore } from './core';
import { useApiMock } from './mock';
import { useApiMsw } from './msw';

/**
 * API服务主入口
 * 根据环境和配置自动选择合适的API实现
 */
export const useApi = () => {
  const config = useRuntimeConfig();
  const isDev = import.meta.dev;
  
  // 环境变量控制是否使用mock数据
  const useMock = isDev || config.public.useMock;
  // 环境变量控制是否使用MSW
  const useMsw = config.public.useMsw;
  
  // 根据配置选择合适的API实现
  if (useMsw) {
    return useApiMsw();
  } else if (useMock) {
    return useApiMock();
  } else {
    return useApiCore();
  }
};

// 重新导出子模块，方便直接使用
export { useApiCore, useApiMock, useApiMsw }; 