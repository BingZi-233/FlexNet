export enum UserRole {
  USER = 'user',     // 普通用户
  DEVELOPER = 'developer', // 开发者
  ADMIN = 'admin'    // 管理员
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  prefs?: Record<string, any>;
  status?: 'active' | 'inactive' | 'blocked';
  createdAt?: string;
  updatedAt?: string;
}

export interface UserSession {
  id: string;
  userId: string;
  device: string;
  ip: string;
  location?: string;
  createdAt: string;
  updatedAt?: string;
  current: boolean;
} 