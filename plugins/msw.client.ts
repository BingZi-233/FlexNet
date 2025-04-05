import { worker } from '~/mocks/browser';

export default defineNuxtPlugin({
  name: 'msw',
  enforce: 'pre', // 确保在其他网络请求之前运行
  async setup() {
    const config = useRuntimeConfig();
    
    // 仅在客户端和开发环境/启用mock的环境中运行
    if (import.meta.client && (import.meta.dev || config.public.useMock)) {
      try {
        // 启动MSW服务工作者
        await worker.start({
          onUnhandledRequest: 'bypass', // 忽略未处理的请求
          serviceWorker: {
            url: '/mockServiceWorker.js',
            options: {
              scope: '/'
            }
          }
        });
        console.log('[MSW] 模拟服务已启动');
      } catch (error) {
        console.error('[MSW] 启动失败:', error);
      }
    }
  }
}); 