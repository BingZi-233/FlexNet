import { useAppwriteAuth } from './auth';
import { useAppwriteProfile } from './profile';
import { useAppwriteSession } from './session';
import type { Models } from 'appwrite';

/**
 * Appwrite 账户模块入口
 * 整合认证、资料和会话管理功能
 */
export const useAppwriteAccount = () => {
  // 获取各个子模块
  const auth = useAppwriteAuth();
  const profile = useAppwriteProfile();
  const session = useAppwriteSession();
  
  // 重新导出常用的认证方法
  const { 
    user, 
    isLoggedIn,
    getCurrentUser,
    createAccount,
    loginWithEmail,
    loginWithOAuth,
    loginWithGithub,
    loginWithGoogle,
    logout,
    resetPassword,
    confirmPasswordReset
  } = auth;
  
  // 重新导出常用的资料管理方法
  const {
    updateName,
    updateEmail,
    updatePhone,
    updatePassword,
    updatePrefs,
    getPrefs
  } = profile;
  
  // 重新导出常用的会话管理方法
  const {
    getSessions,
    getCurrentSession,
    deleteSession,
    deleteAllSessions
  } = session;
  
  return {
    // 从各个子模块获取的API
    auth,
    profile,
    session,
    
    // 认证相关
    user,
    isLoggedIn,
    getCurrentUser,
    createAccount,
    loginWithEmail,
    loginWithOAuth,
    loginWithGithub,
    loginWithGoogle,
    logout,
    resetPassword,
    confirmPasswordReset,
    
    // 资料管理相关
    updateName,
    updateEmail,
    updatePhone,
    updatePassword,
    updatePrefs,
    getPrefs,
    
    // 会话管理相关
    getSessions,
    getCurrentSession,
    deleteSession,
    deleteAllSessions
  };
};

// 重新导出子模块
export { useAppwriteAuth, useAppwriteProfile, useAppwriteSession };