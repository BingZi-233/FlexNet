import { ID } from 'appwrite';
import type { Models } from 'appwrite';
import type { AppwriteServerInstance } from './types';

/**
 * Appwrite存储服务功能
 * 提供文件上传和管理功能
 */
export const useAppwriteStorage = () => {
  // 使用Nuxt的useNuxtApp访问通过插件注册的Appwrite实例
  const { $appwrite } = useNuxtApp();
  const config = useRuntimeConfig();
  
  // 默认存储桶ID，从环境变量获取
  const defaultBucketId = config.public.appwriteStorageBucketId || 'default';
  
  /**
   * 上传文件
   * @param file 要上传的文件
   * @param permissions 文件权限设置
   * @param bucketId 存储桶ID，默认使用环境变量中的值
   */
  const uploadFile = async (
    file: File,
    permissions?: string[],
    bucketId: string = defaultBucketId
  ): Promise<Models.File> => {
    return await $appwrite.storage.createFile(
      bucketId,
      ID.unique(),
      file,
      permissions
    );
  };
  
  /**
   * 获取文件信息
   * @param fileId 文件ID
   * @param bucketId 存储桶ID，默认使用环境变量中的值
   */
  const getFile = async (
    fileId: string,
    bucketId: string = defaultBucketId
  ): Promise<Models.File> => {
    return await $appwrite.storage.getFile(bucketId, fileId);
  };
  
  /**
   * 获取文件列表
   * @param queries 查询条件
   * @param bucketId 存储桶ID，默认使用环境变量中的值
   */
  const listFiles = async (
    queries?: string[],
    bucketId: string = defaultBucketId
  ): Promise<Models.FileList> => {
    return await $appwrite.storage.listFiles(bucketId, queries);
  };
  
  /**
   * 删除文件
   * @param fileId 文件ID
   * @param bucketId 存储桶ID，默认使用环境变量中的值
   */
  const deleteFile = async (
    fileId: string,
    bucketId: string = defaultBucketId
  ): Promise<void> => {
    await $appwrite.storage.deleteFile(bucketId, fileId);
  };
  
  /**
   * 获取文件预览URL
   * @param fileId 文件ID
   * @param width 预览宽度（可选）
   * @param height 预览高度（可选）
   * @param bucketId 存储桶ID，默认使用环境变量中的值
   */
  const getFilePreviewUrl = (
    fileId: string,
    width?: number,
    height?: number,
    bucketId: string = defaultBucketId
  ): string => {
    let url = $appwrite.storage.getFilePreview(bucketId, fileId);
    
    // 如果指定了宽度和高度，添加到URL
    if (width) {
      url += `?width=${width}`;
      if (height) {
        url += `&height=${height}`;
      }
    } else if (height) {
      url += `?height=${height}`;
    }
    
    return url;
  };
  
  /**
   * 获取文件下载URL
   * @param fileId 文件ID
   * @param bucketId 存储桶ID，默认使用环境变量中的值
   */
  const getFileDownloadUrl = (
    fileId: string,
    bucketId: string = defaultBucketId
  ): string => {
    return $appwrite.storage.getFileDownload(bucketId, fileId);
  };
  
  /**
   * 获取文件查看URL
   * @param fileId 文件ID
   * @param bucketId 存储桶ID，默认使用环境变量中的值
   */
  const getFileViewUrl = (
    fileId: string,
    bucketId: string = defaultBucketId
  ): string => {
    return $appwrite.storage.getFileView(bucketId, fileId);
  };
  
  /**
   * 在服务端上传文件（需要API密钥，只能在服务端使用）
   * 注意：此方法在不同版本的Appwrite中可能有不同的参数要求
   */
  const uploadFileServer = async (
    filePathOrInput: string | NodeJS.ReadableStream,
    permissions?: string[],
    bucketId: string = defaultBucketId
  ): Promise<Models.File> => {
    if (!process.server) {
      throw new Error('uploadFileServer只能在服务端调用');
    }
    
    // 获取全局注入的Appwrite服务端实例
    const nuxtApp = useNuxtApp();
    const appwriteServer = nuxtApp.$appwriteServer as unknown as AppwriteServerInstance;
    
    // 服务端API调用
    // 注意：不同版本的Appwrite SDK可能需要不同的参数
    // @ts-ignore - 忽略类型检查，因为服务端和客户端API可能有差异
    return await appwriteServer.storage.createFile(
      bucketId,
      ID.unique(),
      filePathOrInput,
      permissions
    );
  };
  
  return {
    uploadFile,
    getFile,
    listFiles,
    deleteFile,
    getFilePreviewUrl,
    getFileDownloadUrl,
    getFileViewUrl,
    uploadFileServer
  };
}; 