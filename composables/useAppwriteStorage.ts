import { ID } from 'appwrite';
import type { Models } from 'appwrite';

/**
 * useAppwriteStorage composable
 * 
 * 提供Appwrite存储服务的封装，方便在应用中进行文件上传、管理等操作
 */
export const useAppwriteStorage = () => {
  // 使用Nuxt的useNuxtApp访问通过插件注册的Appwrite实例
  const { $appwrite, $appwriteServer } = useNuxtApp();
  const config = useRuntimeConfig();
  
  // 默认存储桶ID，从环境变量获取
  const defaultBucketId = config.public.appwriteStorageBucketId || '';
  
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
   * @param filePath 服务器上的文件路径
   * @param permissions 文件权限设置
   * @param bucketId 存储桶ID，默认使用环境变量中的值
   */
  const uploadFileServer = async (
    filePath: string,
    permissions?: string[],
    bucketId: string = defaultBucketId
  ): Promise<Models.File> => {
    if (!process.server || !$appwriteServer) {
      throw new Error('uploadFileServer只能在服务端调用');
    }
    
    // 服务端API需要文件路径而非File对象
    return await $appwriteServer.storage.createFile(
      bucketId,
      ID.unique(),
      filePath, // 这里应该是服务器上的文件路径
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