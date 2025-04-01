import { Client, Account, Databases, Storage, Teams, Functions, Avatars } from 'appwrite';
import type { AppwriteInstance } from '~/types';

export default defineNuxtPlugin({
  name: 'appwrite-client',
  enforce: 'pre', // 确保在其他插件之前加载
  parallel: true, // 允许并行加载
  setup(nuxtApp) {
    // 创建Appwrite客户端实例
    const client = new Client();
    
    // 初始化客户端配置
    // 通过运行时配置获取环境变量
    const config = useRuntimeConfig();
    
    // 设置客户端配置
    client
      .setEndpoint(config.public.appwriteEndpoint)
      .setProject(config.public.appwriteProjectId);
    
    // 创建各个服务实例
    const account = new Account(client);
    const databases = new Databases(client);
    const storage = new Storage(client);
    const teams = new Teams(client);
    const functions = new Functions(client);
    const avatars = new Avatars(client);
    
    // 将服务暴露给全局使用
    return {
      provide: {
        appwrite: {
          client,
          account,
          databases,
          storage,
          teams,
          functions,
          avatars
        } as AppwriteInstance
      }
    };
  },
  hooks: {
    // 在应用创建时记录
    'app:created'() {
      console.log('Appwrite客户端插件已加载');
    }
  }
}); 