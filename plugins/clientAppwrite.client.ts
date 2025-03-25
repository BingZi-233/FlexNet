import { Client, Account, Storage } from 'appwrite';

export default defineNuxtPlugin(() => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID);

  const account = new Account(client);
  const storage = new Storage(client);

  return {
    provide: {
      clientAppwrite: {
        // 用户认证
        auth: {
          login: (email: string, password: string) => account.createEmailSession(email, password),
          register: (email: string, password: string, name: string) => 
            account.create('unique()', email, password, name),
          logout: () => account.deleteSession('current'),
          getCurrent: () => account.get(),
        },
        // 文件操作
        storage: {
          upload: (bucketId: string, file: File) => 
            storage.createFile(bucketId, 'unique()', file),
          getPreview: (bucketId: string, fileId: string) =>
            storage.getFilePreview(bucketId, fileId),
          delete: (bucketId: string, fileId: string) =>
            storage.deleteFile(bucketId, fileId)
        }
      }
    }
  };
});