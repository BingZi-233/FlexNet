import { ID, Query, Permission, Role } from 'appwrite';
import type { Models } from 'appwrite';

/**
 * Appwrite 数据库服务
 * 提供数据的增删改查操作，支持客户端和服务端操作
 */
export const useAppwriteDatabase = () => {
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
    data: any,
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
    data: any,
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
   * 创建Query查询条件
   */
  const createQuery = {
    equal: (attribute: string, value: any) => Query.equal(attribute, value),
    notEqual: (attribute: string, value: any) => Query.notEqual(attribute, value),
    lessThan: (attribute: string, value: any) => Query.lessThan(attribute, value),
    lessThanEqual: (attribute: string, value: any) => Query.lessThanEqual(attribute, value),
    greaterThan: (attribute: string, value: any) => Query.greaterThan(attribute, value),
    greaterThanEqual: (attribute: string, value: any) => Query.greaterThanEqual(attribute, value),
    search: (attribute: string, value: string) => Query.search(attribute, value),
    isNull: (attribute: string) => Query.isNull(attribute),
    isNotNull: (attribute: string) => Query.isNotNull(attribute),
    between: (attribute: string, start: any, end: any) => Query.between(attribute, start, end),
    startsWith: (attribute: string, value: string) => Query.startsWith(attribute, value),
    endsWith: (attribute: string, value: string) => Query.endsWith(attribute, value),
    select: (attributes: string[]) => Query.select(attributes),
    limit: (limit: number) => Query.limit(limit),
    offset: (offset: number) => Query.offset(offset),
    orderAsc: (attribute: string) => Query.orderAsc(attribute),
    orderDesc: (attribute: string) => Query.orderDesc(attribute),
    cursorAfter: (documentId: string) => Query.cursorAfter(documentId),
    cursorBefore: (documentId: string) => Query.cursorBefore(documentId)
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
    data: any,
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
    data: any,
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
  
  /**
   * 在服务端上获取文档（需要API密钥，只能在服务端使用）
   */
  const getDocumentServer = async <T = any>(
    collectionId: string,
    documentId: string,
    databaseId: string = defaultDatabaseId
  ): Promise<Models.Document & T> => {
    if (!process.server || !$appwriteServer) {
      throw new Error('getDocumentServer只能在服务端调用');
    }
    
    return await $appwriteServer.databases.getDocument(
      databaseId,
      collectionId,
      documentId
    );
  };
  
  /**
   * 在服务端上列出文档（需要API密钥，只能在服务端使用）
   */
  const listDocumentsServer = async <T = any>(
    collectionId: string,
    queries?: string[],
    databaseId: string = defaultDatabaseId
  ): Promise<Models.DocumentList<Models.Document & T>> => {
    if (!process.server || !$appwriteServer) {
      throw new Error('listDocumentsServer只能在服务端调用');
    }
    
    return await $appwriteServer.databases.listDocuments(
      databaseId,
      collectionId,
      queries
    );
  };
  
  /**
   * 在服务端上删除文档（需要API密钥，只能在服务端使用）
   */
  const deleteDocumentServer = async (
    collectionId: string,
    documentId: string,
    databaseId: string = defaultDatabaseId
  ): Promise<void> => {
    if (!process.server || !$appwriteServer) {
      throw new Error('deleteDocumentServer只能在服务端调用');
    }
    
    await $appwriteServer.databases.deleteDocument(
      databaseId,
      collectionId,
      documentId
    );
  };
  
  return {
    // 客户端操作
    createDocument,
    getDocument,
    listDocuments,
    updateDocument,
    deleteDocument,
    
    // 查询工具
    createQuery,
    getPermissions,
    
    // 服务端操作
    createDocumentServer,
    getDocumentServer,
    listDocumentsServer,
    updateDocumentServer,
    deleteDocumentServer
  };
}; 