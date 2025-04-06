import { Client, Account, Databases, Storage, Teams, Functions } from 'appwrite';
import type { Models } from 'appwrite';

/**
 * Appwrite 服务端实例类型
 */
export interface AppwriteServerInstance {
  client: Client;
  account: Account;
  databases: Databases;
  storage: Storage;
  teams: Teams;
  functions: Functions;
}

/**
 * Appwrite 客户端实例类型
 */
export interface AppwriteClientInstance {
  client: Client;
  account: Account;
  databases: Databases;
  storage: Storage;
  teams: Teams;
  functions: Functions;
}

/**
 * API响应类型
 */
export interface ApiResponse<T> {
  code: number;
  data: T;
  message: string;
}

/**
 * 用户标签操作类型
 */
export type UserLabelAction = 'add' | 'remove';

/**
 * 用户角色类型
 */
export type UserRole = 'admin' | 'developer' | 'user' | 'guest';

/**
 * 用户标签类型
 */
export type UserLabel = UserRole;

/**
 * 用户标签请求类型
 */
export interface UserLabelRequest {
  userId: string;
  action: UserLabelAction;
  label: UserLabel;
}

/**
 * 用户标签响应类型
 */
export interface UserLabelResponse {
  success: boolean;
  message: string;
  labels?: UserLabel[];
}

/**
 * 数据库文档类型
 */
export interface DatabaseDocument extends Models.Document {
  [key: string]: any;
}

/**
 * 文件存储权限
 */
export type StoragePermission = 'read' | 'write' | 'delete';

/**
 * 查询参数类型
 */
export interface QueryParams {
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderType?: 'ASC' | 'DESC';
  search?: string;
}

/**
 * 扩展请求头类型
 */
export interface HeaderOptions {
  'Content-Type'?: string;
  'X-Appwrite-Response-Format'?: 'chunked';
  [key: string]: string | undefined;
}

/**
 * 文件上传选项
 */
export interface FileUploadOptions {
  permissions?: string[];
  bucketId?: string;
  onProgress?: (progress: number) => void;
  maxSize?: number; // 最大文件大小（字节）
  allowedTypes?: string[]; // 允许的文件类型
}

/**
 * 用户登录方法
 */
export type LoginMethod = 'email' | 'github' | 'google' | 'magic-url';

/**
 * 用户会话信息
 */
export interface SessionInfo {
  id: string;
  userId: string;
  createdAt: Date;
  expireAt: Date;
  provider: string;
  ip: string;
  userAgent: string;
  country: string;
  current: boolean;
}

/**
 * 用户偏好设置
 */
export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  language?: string;
  timezone?: string;
  notificationsEnabled?: boolean;
  [key: string]: any;
}

/**
 * 验证码类型
 */
export type CaptchaType = 'hcaptcha' | 'recaptcha' | 'turnstile'; 