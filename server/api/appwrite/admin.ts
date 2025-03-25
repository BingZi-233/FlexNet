import { serverAppwrite } from '../../../plugins/serverAppwrite';

export default defineEventHandler(async (event) => {
  const { action, data } = await readBody(event);

  // 用户管理方法
  const users = {
    create: async (payload) => {
      return await serverAppwrite.users.create(payload);
    },
    get: async (userId) => {
      return await serverAppwrite.users.get(userId);
    }
  };

  // 数据库操作方法  
  const database = {
    query: async (collectionId, queries) => {
      return await serverAppwrite.database.listDocuments(collectionId, queries);
    },
    create: async (collectionId, documentId, data) => {
      return await serverAppwrite.database.createDocument(collectionId, documentId, data);
    }
  };

  return { action, data };
});