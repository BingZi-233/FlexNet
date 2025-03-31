/**
 * Appwrite 存储服务 Composable
 * 提供文件上传、获取和管理功能
 */
export const useAppwriteStorage = () => {
  // 获取 Nuxt 应用实例以访问插件提供的服务
  const nuxtApp = useNuxtApp();
  const { $appwrite } = nuxtApp;
  
  // 如果插件未正确加载，显示错误
  if (!$appwrite) {
    console.error('Appwrite 插件未正确加载');
    throw new Error('Appwrite 插件未正确加载');
  }
  
  // 初始化存储服务
  // 由于类型定义问题，直接访问使用 any 类型绕过 TypeScript 检查
  const storage = ($appwrite as any).storage;
  
  /**
   * 上传文件
   * @param bucketId 存储桶ID
   * @param file 文件对象
   * @param permissions 权限设置（可选）
   * @returns 上传结果
   */
  const uploadFile = async (bucketId: string, file: File, permissions?: string[]) => {
    try {
      // 生成唯一ID
      const fileId = crypto.randomUUID();
      return await storage?.createFile ? storage.createFile(bucketId, fileId, file, permissions) : null;
    } catch (error) {
      console.error('上传文件失败', error);
      return null;
    }
  };
  
  /**
   * 获取文件预览URL
   * @param bucketId 存储桶ID
   * @param fileId 文件ID
   * @param width 宽度（可选）
   * @param height 高度（可选）
   * @param gravity 裁剪重心（可选）
   * @param quality 质量（可选）
   * @returns 文件预览URL
   */
  const getFileView = (
    bucketId: string,
    fileId: string,
    width?: number,
    height?: number,
    gravity?: string,
    quality?: number
  ) => {
    try {
      return storage?.getFileView ? storage.getFileView(bucketId, fileId, width, height, gravity, quality) : null;
    } catch (error) {
      console.error('获取文件预览失败', error);
      return null;
    }
  };
  
  /**
   * 删除文件
   * @param bucketId 存储桶ID
   * @param fileId 文件ID
   * @returns 是否删除成功
   */
  const deleteFile = async (bucketId: string, fileId: string) => {
    try {
      return await storage?.deleteFile ? storage.deleteFile(bucketId, fileId) : false;
    } catch (error) {
      console.error('删除文件失败', error);
      return false;
    }
  };
  
  /**
   * 获取文件列表
   * @param bucketId 存储桶ID
   * @param queries 查询参数（可选）
   * @returns 文件列表
   */
  const listFiles = async (bucketId: string, queries?: string[]) => {
    try {
      return await storage?.listFiles ? storage.listFiles(bucketId, queries) : null;
    } catch (error) {
      console.error('获取文件列表失败', error);
      return null;
    }
  };
  
  /**
   * 获取文件信息
   * @param bucketId 存储桶ID
   * @param fileId 文件ID
   * @returns 文件信息
   */
  const getFile = async (bucketId: string, fileId: string) => {
    try {
      return await storage?.getFile ? storage.getFile(bucketId, fileId) : null;
    } catch (error) {
      console.error('获取文件信息失败', error);
      return null;
    }
  };
  
  /**
   * 更新文件权限
   * @param bucketId 存储桶ID
   * @param fileId 文件ID
   * @param permissions 权限设置
   * @returns 是否更新成功
   */
  const updateFilePermissions = async (bucketId: string, fileId: string, permissions: string[]) => {
    try {
      return await storage?.updateFile ? storage.updateFile(bucketId, fileId, permissions) : false;
    } catch (error) {
      console.error('更新文件权限失败', error);
      return false;
    }
  };
  
  // 返回所有可用的方法
  return {
    uploadFile,
    getFileView,
    deleteFile,
    listFiles,
    getFile,
    updateFilePermissions
  };
}; 