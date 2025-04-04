import { Client, Users, ID, Query, Permission, Role } from 'node-appwrite';
import { useAppwriteServer } from '~/composables/useAppwriteServer';

// 定义请求体类型
interface RequestBody {
  userId: string;
  action: 'add' | 'remove';
  label: string;
}

export default defineEventHandler(async (event) => {
  try {
    // 获取请求体
    const body = await readBody<RequestBody>(event);
    const { userId, action, label } = body;

    if (!userId || !action || !label) {
      return createError({
        statusCode: 400,
        message: '缺少必要参数'
      });
    }

    // 获取当前登录用户
    const { getSession } = useAppwriteServer();
    const session = await getSession();

    // 检查权限 - 只有admin标签的用户才能管理标签
    // @ts-ignore - 类型问题，实际上Session对象包含labels属性
    if (!session?.labels?.includes('admin')) {
      return createError({
        statusCode: 403,
        message: '权限不足，只有管理员可以管理用户标签'
      });
    }

    // 获取Appwrite服务端配置
    const config = useRuntimeConfig();
    
    // 初始化Appwrite Client
    const client = new Client()
      .setEndpoint(config.public.appwriteEndpoint)
      .setProject(config.public.appwriteProjectId)
      .setKey(config.appwriteApiKey);

    // 初始化Users服务
    const users = new Users(client);

    // 获取当前用户标签
    const user = await users.get(userId);
    const currentLabels = user.labels || [];

    // 根据操作类型更新标签
    let updatedLabels: string[] = [];
    
    if (action === 'add') {
      // 添加标签（如果不存在）
      if (!currentLabels.includes(label)) {
        updatedLabels = [...currentLabels, label];
      } else {
        return { 
          success: true, 
          message: '标签已存在，无需添加',
          labels: currentLabels
        };
      }
    } else if (action === 'remove') {
      // 删除标签（如果存在）
      updatedLabels = currentLabels.filter((l: string) => l !== label);
      
      if (updatedLabels.length === currentLabels.length) {
        return {
          success: true,
          message: '标签不存在，无需删除',
          labels: currentLabels
        };
      }
    }

    // 更新用户标签
    const result = await users.updateLabels(userId, updatedLabels);

    return {
      success: true,
      message: action === 'add' ? '标签添加成功' : '标签删除成功',
      labels: result.labels
    };
  } catch (error: any) {
    console.error('管理用户标签失败:', error);
    
    return createError({
      statusCode: error.code || 500,
      message: error.message || '管理用户标签失败'
    });
  }
}); 