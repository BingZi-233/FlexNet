import { ID } from 'appwrite';
import type { Models } from 'appwrite';

/**
 * Appwrite存储服务功能
 * 提供文件上传和管理功能
 */
export const useAppwriteStorage = () => {
  // 使用Nuxt的useNuxtApp访问通过插件注册的Appwrite实例
  const { $appwrite } = useNuxtApp();
  const config = useRuntimeConfig();
  
  // 默认存储桶ID，从环境变量获取
  const defaultBucketId = config.public.appwriteStorageBucketId as string || '';
  
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
    const baseUrl = $appwrite.storage.getFilePreview(bucketId, fileId).toString();
    
    // 构建查询参数
    const params = new URLSearchParams();
    if (width) {
      params.append('width', width.toString());
    }
    if (height) {
      params.append('height', height.toString());
    }
    
    // 如果有参数，添加到URL
    const queryString = params.toString();
    if (queryString) {
      return `${baseUrl}?${queryString}`;
    }
    
    return baseUrl;
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
    return $appwrite.storage.getFileDownload(bucketId, fileId).toString();
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
    return $appwrite.storage.getFileView(bucketId, fileId).toString();
  };
  
  return {
    uploadFile,
    getFile,
    listFiles,
    deleteFile,
    getFilePreviewUrl,
    getFileDownloadUrl,
    getFileViewUrl
  };
}; 