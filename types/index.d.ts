import { Client, Account, Databases, Storage, Teams, Functions, Avatars } from 'appwrite';
import { Client as ServerClient, Account as ServerAccount, Databases as ServerDatabases, Storage as ServerStorage, Teams as ServerTeams, Functions as ServerFunctions } from 'node-appwrite';

// 客户端Appwrite实例接口
export interface AppwriteInstance {
  client: Client;
  account: Account;
  databases: Databases;
  storage: Storage;
  teams: Teams;
  functions: Functions;
  avatars: Avatars;
}

// 服务端Appwrite实例接口
export interface AppwriteServerInstance {
  client: ServerClient;
  account: ServerAccount;
  databases: ServerDatabases;
  storage: ServerStorage;
  teams: ServerTeams;
  functions: ServerFunctions;
}

// 扩展Nuxt应用实例
declare module '#app' {
  interface NuxtApp {
    $appwrite: AppwriteInstance;
    $appwriteServer: AppwriteServerInstance;
  }
}

// 扩展Vue组件实例
declare module 'vue' {
  interface ComponentCustomProperties {
    $appwrite: AppwriteInstance;
    $appwriteServer: AppwriteServerInstance;
  }
}

export {}; 