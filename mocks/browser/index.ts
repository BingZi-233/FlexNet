import { setupWorker } from 'msw/browser';
import { handlers } from '../handlers';

// 创建MSW服务工作者
export const worker = setupWorker(...handlers);

// 导出worker启动函数，方便在启动应用时初始化MSW
export const setupMockServiceWorker = async () => {
  // 仅在开发环境下启用MSW
  if (process.env.NODE_ENV === 'development' || process.env.USE_MOCK === 'true') {
    await worker.start({
      onUnhandledRequest: 'bypass', // 忽略未处理的请求
    });
    console.log('[MSW] Mock服务已启动');
  }
}; 