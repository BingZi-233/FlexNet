import { Client, Account, Databases, Storage, Teams, Functions } from 'node-appwrite';
import type { AppwriteServerInstance } from '~/types';

export default defineNuxtPlugin({
  name: 'appwrite-server',
  enforce: 'pre', // 确保在其他插件之前加载
  parallel: true, // 允许并行加载
  setup(nuxtApp) {
    // 创建Appwrite服务端客户端实例
    const client = new Client();
    
    // 初始化服务端配置
    // 使用运行时配置获取环境变量
    const config = useRuntimeConfig();
    
    // 设置服务端配置
    client
      .setEndpoint(config.public.appwriteEndpoint)
      .setProject(config.public.appwriteProjectId)
      .setKey(config.appwriteApiKey); // 服务端需要API密钥
    
    // 创建各个服务实例
    const account = new Account(client);
    const databases = new Databases(client);
    const storage = new Storage(client);
    const teams = new Teams(client);
    const functions = new Functions(client);
    
    // 将服务暴露给全局使用
    return {
      provide: {
        appwriteServer: {
          client,
          account,
          databases,
          storage,
          teams,
          functions
        } as AppwriteServerInstance
      }
    };
  },
  hooks: {
    // 在应用创建时记录
    'app:created'() {
      console.log('Appwrite服务端插件已加载');
    }
  },
  env: {
    // 确保在服务器端组件渲染时也会运行
    islands: true
  }
}); 