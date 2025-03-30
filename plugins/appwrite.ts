import { Client, Account } from 'appwrite';
import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  
  // 创建 Appwrite 客户端实例
  const client = new Client();
  
  // 只在客户端设置 Appwrite 配置，避免服务端渲染问题
  if (process.client) {
    client
      .setEndpoint(config.public.appwriteEndpoint as string)
      .setProject(config.public.appwriteProjectId as string);
  }
  
  // 创建 Appwrite 服务实例
  const account = new Account(client);
  
  // 将 Appwrite 服务提供给 Nuxt 应用
  return {
    provide: {
      appwrite: {
        client,
        account
      }
    }
  };
}); 