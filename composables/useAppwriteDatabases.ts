import { ID, Query, Permission, Role } from 'appwrite';
import type { Models } from 'appwrite';

/**
 * useAppwriteDatabases composable
 * 
 * 提供Appwrite数据库服务的封装，方便在应用中进行数据的增删改查操作
 */
export const useAppwriteDatabases = () => {
  // 使用Nuxt的useNuxtApp访问通过插件注册的Appwrite实例
  const { $appwrite, $appwriteServer } = useNuxtApp();
  const config = useRuntimeConfig();
  
  // 默认数据库ID，从环境变量获取
  const defaultDatabaseId = config.public.appwriteDatabaseId || '';
  
  /**
   * 创建文档
   * @param collectionId 集合ID
   * @param data 文档数据
   * @param permissions 文档权限
   * @param databaseId 数据库ID，默认使用环境变量中的值
   */
  const createDocument = async <T = any>(
    collectionId: string,
    data: object,
    permissions?: string[],
    databaseId: string = defaultDatabaseId
  ): Promise<Models.Document & T> => {
    return await $appwrite.databases.createDocument(
      databaseId,
      collectionId,
      ID.unique(),
      data,
      permissions
    );
  };
  
  /**
   * 获取文档
   * @param collectionId 集合ID
   * @param documentId 文档ID
   * @param databaseId 数据库ID，默认使用环境变量中的值
   */
  const getDocument = async <T = any>(
    collectionId: string,
    documentId: string,
    databaseId: string = defaultDatabaseId
  ): Promise<Models.Document & T> => {
    return await $appwrite.databases.getDocument(
      databaseId,
      collectionId,
      documentId
    );
  };
  
  /**
   * 列出集合中的文档
   * @param collectionId 集合ID
   * @param queries 查询条件
   * @param databaseId 数据库ID，默认使用环境变量中的值
   */
  const listDocuments = async <T = any>(
    collectionId: string,
    queries?: string[],
    databaseId: string = defaultDatabaseId
  ): Promise<Models.DocumentList<Models.Document & T>> => {
    return await $appwrite.databases.listDocuments(
      databaseId,
      collectionId,
      queries
    );
  };
  
  /**
   * 更新文档
   * @param collectionId 集合ID
   * @param documentId 文档ID
   * @param data 要更新的数据
   * @param permissions 文档权限
   * @param databaseId 数据库ID，默认使用环境变量中的值
   */
  const updateDocument = async <T = any>(
    collectionId: string,
    documentId: string,
    data: object,
    permissions?: string[],
    databaseId: string = defaultDatabaseId
  ): Promise<Models.Document & T> => {
    return await $appwrite.databases.updateDocument(
      databaseId,
      collectionId,
      documentId,
      data,
      permissions
    );
  };
  
  /**
   * 删除文档
   * @param collectionId 集合ID
   * @param documentId 文档ID
   * @param databaseId 数据库ID，默认使用环境变量中的值
   */
  const deleteDocument = async (
    collectionId: string,
    documentId: string,
    databaseId: string = defaultDatabaseId
  ): Promise<void> => {
    await $appwrite.databases.deleteDocument(
      databaseId,
      collectionId,
      documentId
    );
  };
  
  /**
   * 创建查询的辅助方法
   */
  const createQuery = {
    // 等于
    equal: (attribute: string, value: any) => Query.equal(attribute, value),
    // 不等于
    notEqual: (attribute: string, value: any) => Query.notEqual(attribute, value),
    // 小于
    lessThan: (attribute: string, value: any) => Query.lessThan(attribute, value),
    // 小于等于
    lessThanEqual: (attribute: string, value: any) => Query.lessThanEqual(attribute, value),
    // 大于
    greaterThan: (attribute: string, value: any) => Query.greaterThan(attribute, value),
    // 大于等于
    greaterThanEqual: (attribute: string, value: any) => Query.greaterThanEqual(attribute, value),
    // 在数组中
    isIn: (attribute: string, value: any[]) => Query.isIn(attribute, value),
    // 不在数组中
    isNotIn: (attribute: string, value: any[]) => Query.isNotIn(attribute, value),
    // 包含数组
    contains: (attribute: string, value: any[]) => Query.contains(attribute, value),
    // 开始于
    startsWith: (attribute: string, value: string) => Query.startsWith(attribute, value),
    // 结束于
    endsWith: (attribute: string, value: string) => Query.endsWith(attribute, value),
    // 限制结果数量
    limit: (limit: number) => Query.limit(limit),
    // 跳过指定数量的结果
    offset: (offset: number) => Query.offset(offset),
    // 结果排序
    orderAsc: (attribute: string) => Query.orderAsc(attribute),
    orderDesc: (attribute: string) => Query.orderDesc(attribute),
    // 游标分页
    cursorAfter: (documentId: string) => Query.cursorAfter(documentId),
    cursorBefore: (documentId: string) => Query.cursorBefore(documentId),
    // 搜索
    search: (attribute: string, value: string) => Query.search(attribute, value)
  };
  
  /**
   * 获取常用权限
   */
  const getPermissions = {
    // 公开文档（任何人可读）
    read: {
      public: () => Permission.read(Role.any()),
      user: (userId: string) => Permission.read(Role.user(userId)),
      team: (teamId: string) => Permission.read(Role.team(teamId)),
      users: () => Permission.read(Role.users())
    },
    // 写入权限
    write: {
      public: () => Permission.write(Role.any()),
      user: (userId: string) => Permission.write(Role.user(userId)),
      team: (teamId: string) => Permission.write(Role.team(teamId)),
      users: () => Permission.write(Role.users())
    }
  };
  
  /**
   * 在服务端上创建文档（需要API密钥，只能在服务端使用）
   * @param collectionId 集合ID
   * @param data 文档数据
   * @param permissions 文档权限
   * @param databaseId 数据库ID，默认使用环境变量中的值
   */
  const createDocumentServer = async <T = any>(
    collectionId: string,
    data: object,
    permissions?: string[],
    databaseId: string = defaultDatabaseId
  ): Promise<Models.Document & T> => {
    if (!process.server || !$appwriteServer) {
      throw new Error('createDocumentServer只能在服务端调用');
    }
    
    return await $appwriteServer.databases.createDocument(
      databaseId,
      collectionId,
      ID.unique(),
      data,
      permissions
    );
  };
  
  /**
   * 在服务端上更新文档（需要API密钥，只能在服务端使用）
   * @param collectionId 集合ID
   * @param documentId 文档ID
   * @param data 要更新的数据
   * @param permissions 文档权限
   * @param databaseId 数据库ID，默认使用环境变量中的值
   */
  const updateDocumentServer = async <T = any>(
    collectionId: string,
    documentId: string,
    data: object,
    permissions?: string[],
    databaseId: string = defaultDatabaseId
  ): Promise<Models.Document & T> => {
    if (!process.server || !$appwriteServer) {
      throw new Error('updateDocumentServer只能在服务端调用');
    }
    
    return await $appwriteServer.databases.updateDocument(
      databaseId,
      collectionId,
      documentId,
      data,
      permissions
    );
  };
  
  return {
    createDocument,
    getDocument,
    listDocuments,
    updateDocument,
    deleteDocument,
    createQuery,
    getPermissions,
    createDocumentServer,
    updateDocumentServer
  };
}; 