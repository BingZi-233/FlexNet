import { useAppwriteAccount } from './account';
import { useAppwriteStorage } from './storage';
import { useAppwriteServer } from './server';
import { useAppwriteDatabase } from './database';
import { useUserLabels } from './user-labels';

// 导出类型和子模块
export * from './types';
export { 
  useAppwriteAccount,
  useAppwriteStorage,
  useAppwriteServer,
  useAppwriteDatabase,
  useUserLabels
};

/**
 * Appwrite主入口
 * 提供统一的Appwrite服务接口
 */
export const useAppwrite = () => {
  // 获取各模块功能
  const account = useAppwriteAccount();
  const storage = useAppwriteStorage();
  const server = useAppwriteServer();
  const database = useAppwriteDatabase();
  const labels = useUserLabels();
  
  // 返回统一的API接口
  return {
    // 各模块
    account,
    storage,
    server,
    database,
    labels,
    
    // 常用状态
    user: account.user,
    isLoggedIn: account.isLoggedIn,
    
    // 重新导出常用方法用于简化调用
    // 用户认证相关
    getCurrentUser: account.getCurrentUser,
    login: account.loginWithEmail,
    loginWithGithub: account.loginWithGithub,
    loginWithGoogle: account.loginWithGoogle,
    logout: account.logout,
    
    // 存储相关
    uploadFile: storage.uploadFile,
    getFilePreviewUrl: storage.getFilePreviewUrl,
    
    // 数据库相关
    createDocument: database.createDocument,
    getDocument: database.getDocument,
    listDocuments: database.listDocuments,
    updateDocument: database.updateDocument,
    deleteDocument: database.deleteDocument,
    
    // 标签相关
    addUserLabel: labels.addUserLabel,
    removeUserLabel: labels.removeUserLabel
  };
}; 