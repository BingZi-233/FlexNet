# FlexNet Composables 优化指南

## 当前问题

通过对现有 Composables 的分析，我们发现以下需要改进的地方：

1. **结构不一致**：部分 Composables 位于根目录，部分在子目录中
2. **错误处理不统一**：各个 Composables 处理错误的方式不同
3. **类型定义不完整**：存在使用 `any` 的情况，类型安全有待加强
4. **缺乏缓存机制**：频繁请求的数据未实现缓存
5. **代码复用性不足**：存在重复逻辑

## 优化目标

1. 统一目录结构和命名规范
2. 实现标准化的错误处理机制
3. 增强类型安全
4. 优化性能（添加缓存、减少不必要的渲染）
5. 提高代码可维护性和可测试性

## 详细优化方案

### 1. 目录结构优化

```
composables/
├── index.ts                # 主入口
├── utils/                  # 工具函数
│   ├── error.ts            # 错误处理
│   ├── cache.ts            # 缓存管理
│   └── validation.ts       # 参数验证
├── appwrite/               # Appwrite 相关
│   ├── index.ts            # 子模块入口
│   ├── account/            # 账户管理
│   ├── avatar.ts           # 头像服务（从根目录迁移）
│   ├── database.ts         # 数据库操作
│   ├── storage/            # 存储相关
│   ├── server.ts           # 服务端功能
│   ├── user-labels.ts      # 用户标签
│   └── types.ts            # 类型定义
├── api/                    # API 请求
├── menu/                   # 菜单管理
└── layout/                 # 布局相关
```

**实施步骤**：

1. 创建 `utils` 目录和相关工具文件
2. 将 `useAppwriteAvatar.ts` 移动到 `appwrite/avatar.ts`
3. 将 `useAppwriteServer.ts` 移动到 `appwrite/server.ts`
4. 将 `useUserLabels.ts` 移动到 `appwrite/user-labels.ts`（注意已存在同名文件）
5. 更新导入路径和引用

### 2. 错误处理优化

**创建通用错误处理工具**：

```typescript
// composables/utils/error.ts
import { Notification } from 'arco-design-nuxt-module';

export interface AppError {
  message: string;
  code: string;
  original: any;
}

export const useAppwriteError = () => {
  /**
   * 处理错误并返回规范化的错误对象
   * @param error 原始错误
   * @param context 错误上下文
   * @param fallbackMessage 默认错误消息
   * @returns 规范化的错误对象
   */
  const handleError = (
    error: any, 
    context: string, 
    fallbackMessage = '操作失败'
  ): AppError => {
    console.error(`${context}:`, error);
    
    return {
      message: error.message || fallbackMessage,
      code: error.code || 'UNKNOWN_ERROR',
      original: error
    };
  };
  
  /**
   * 处理错误并显示通知
   * @param error 原始错误
   * @param context 错误上下文
   * @param fallbackMessage 默认错误消息 
   * @returns 规范化的错误对象
   */
  const handleErrorWithNotification = (
    error: any,
    context: string,
    fallbackMessage = '操作失败'
  ): AppError => {
    const appError = handleError(error, context, fallbackMessage);
    
    Notification.error({
      title: '错误',
      content: appError.message,
      duration: 5000
    });
    
    return appError;
  };
  
  return {
    handleError,
    handleErrorWithNotification
  };
};
```

**使用示例**：

```typescript
// 使用优化后的错误处理
const { handleErrorWithNotification } = useAppwriteError();

try {
  await appwrite.createDocument('collectionId', data);
} catch (error) {
  handleErrorWithNotification(error, '创建文档', '文档创建失败');
  return null;
}
```

### 3. 类型安全增强

**扩展类型定义文件**：

```typescript
// composables/appwrite/types.ts
import type { Models } from 'appwrite';

// 用户标签类型
export type UserLabel = 'admin' | 'developer' | 'moderator';

// 数据库文档类型
export interface DatabaseDocument extends Models.Document {
  [key: string]: any;
}

// 文件存储权限
export type StoragePermission = 'read' | 'write' | 'delete';

// 查询参数类型
export interface QueryParams {
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderType?: 'ASC' | 'DESC';
}

// 扩展请求头类型
export interface HeaderOptions {
  'Content-Type'?: string;
  'X-Appwrite-Response-Format'?: 'chunked';
  [key: string]: string | undefined;
}

// 服务端Appwrite实例类型
export interface AppwriteServerInstance {
  client: any;
  account: any;
  databases: any;
  storage: any;
  teams: any;
  functions: any;
}
```

**应用类型增强**：

```typescript
// 使用具体类型替换any
// 之前
const addUserLabel = async (userId: string, label: string) => {...}

// 优化后
import { UserLabel } from './types';
const addUserLabel = async (userId: string, label: UserLabel) => {...}
```

### 4. 缓存机制实现

**创建通用缓存工具**：

```typescript
// composables/utils/cache.ts
interface CacheOptions {
  ttl?: number; // 过期时间（毫秒）
  staleWhileRevalidate?: boolean; // 过期后是否返回旧数据
}

export const useCache = () => {
  const cache = reactive(new Map<string, { data: any; timestamp: number }>());
  
  /**
   * 获取缓存数据
   * @param key 缓存键
   * @param fetcher 数据获取函数
   * @param options 缓存选项
   * @returns 缓存或新获取的数据
   */
  const getWithCache = async <T>(
    key: string,
    fetcher: () => Promise<T>,
    options: CacheOptions = {}
  ): Promise<T> => {
    const { ttl = 5 * 60 * 1000, staleWhileRevalidate = false } = options;
    const now = Date.now();
    
    // 检查缓存是否存在且未过期
    if (cache.has(key)) {
      const cached = cache.get(key)!;
      const isExpired = now - cached.timestamp > ttl;
      
      if (!isExpired) {
        return cached.data as T;
      }
      
      // 过期但配置了staleWhileRevalidate选项
      if (staleWhileRevalidate) {
        // 异步更新缓存
        fetcher().then(newData => {
          cache.set(key, { data: newData, timestamp: now });
        });
        
        // 返回过期数据
        return cached.data as T;
      }
    }
    
    // 缓存不存在或过期且不使用staleWhileRevalidate
    const data = await fetcher();
    cache.set(key, { data, timestamp: now });
    return data;
  };
  
  /**
   * 使特定缓存失效
   * @param key 缓存键
   */
  const invalidate = (key: string): void => {
    cache.delete(key);
  };
  
  /**
   * 清除所有缓存
   */
  const clear = (): void => {
    cache.clear();
  };
  
  return {
    getWithCache,
    invalidate,
    clear
  };
};
```

**应用到Avatar服务**：

```typescript
// composables/appwrite/avatar.ts
export const useAppwriteAvatar = () => {
  const { $appwrite } = useNuxtApp();
  const { getWithCache } = useCache();
  
  const getInitialsAvatar = async (
    name?: string,
    width: number = 100,
    height: number = 100,
    background?: string
  ): Promise<string> => {
    // 验证参数
    width = Math.max(0, Math.min(2000, Math.floor(width)));
    height = Math.max(0, Math.min(2000, Math.floor(height)));
    
    // 生成缓存键
    const cacheKey = `avatar:initials:${name}:${width}:${height}:${background}`;
    
    // 使用缓存
    return await getWithCache(
      cacheKey,
      () => $appwrite.avatars.getInitials(name, width, height, background),
      { ttl: 24 * 60 * 60 * 1000 } // 24小时缓存
    );
  };
  
  // 其他方法类似实现...
  
  return {
    getInitialsAvatar,
    // 其他方法...
  };
};
```

### 5. 代码重构案例：useUserLabels

**重构前**：

```typescript
// composables/useUserLabels.ts
export const useUserLabels = () => {
  const addUserLabel = async (userId: string, label: string) => {
    try {
      const response = await $fetch('/api/users/labels', {
        method: 'POST',
        body: {
          userId,
          action: 'add',
          label
        }
      });
      
      return response;
    } catch (error: any) {
      console.error('添加用户标签失败:', error);
      throw new Error(error.message || '添加用户标签失败');
    }
  };
  
  // 更多方法...
};
```

**重构后**：

```typescript
// composables/appwrite/user-labels.ts
import { UserLabel } from './types';
import { defineNuxtLink } from 'nuxt/app';

export const useUserLabels = () => {
  const { handleError } = useAppwriteError();
  
  /**
   * 验证标签是否为有效值
   */
  const isValidLabel = (label: string): label is UserLabel => {
    return ['admin', 'developer', 'moderator'].includes(label);
  };
  
  /**
   * 添加用户标签
   * @param userId 用户ID
   * @param label 要添加的标签
   * @returns 添加标签的结果
   */
  const addUserLabel = async (userId: string, label: UserLabel) => {
    // 验证参数
    if (!userId) throw new Error('用户ID不能为空');
    if (!isValidLabel(label)) throw new Error(`无效的标签值: ${label}`);
    
    try {
      const response = await $fetch('/api/users/labels', {
        method: 'POST',
        body: {
          userId,
          action: 'add',
          label
        }
      });
      
      return response;
    } catch (error) {
      throw handleError(error, '添加用户标签', `添加标签 ${label} 失败`).original;
    }
  };
  
  // 更多方法...
};
```

## 迁移策略

为了确保平稳过渡，我们建议分阶段实施优化：

### 第一阶段：准备工作（1-2天）

1. 创建 `utils` 目录和通用工具函数
2. 扩展 `types.ts` 文件
3. 确保所有单元测试正常运行

### 第二阶段：核心改进（3-5天）

1. 实现错误处理和缓存机制
2. 一次优化一个 Composable，确保向后兼容
3. 更新引用和依赖

### 第三阶段：目录结构调整（1-2天）

1. 将根目录 Composables 移至对应子目录
2. 更新导入路径
3. 为每个子目录添加 `index.ts` 导出文件

### 第四阶段：文档和测试（2-3天）

1. 更新文档
2. 补充单元测试
3. 进行性能测试

## 代码示例库

我们创建了以下示例以展示最佳实践：

### 1. 错误处理示例

```typescript
// 使用场景：数据库操作
try {
  const document = await appwrite.database.getDocument('collectionId', 'documentId');
  return document;
} catch (error) {
  const { message, code } = handleError(error, '获取文档');
  
  // 针对特定错误类型做不同处理
  if (code === 'document_not_found') {
    // 处理文档不存在的情况
    return null;
  }
  
  // 显示错误通知
  Message.error(message);
  throw error; // 或者返回null，取决于业务需求
}
```

### 2. 缓存使用示例

```typescript
// 使用场景：获取用户列表
const getUserList = async (query = {}) => {
  const cacheKey = `users:list:${JSON.stringify(query)}`;
  
  return await getWithCache(
    cacheKey,
    async () => {
      const response = await $fetch('/api/users', { query });
      return response.users;
    },
    { ttl: 5 * 60 * 1000 } // 5分钟缓存
  );
};
```

## 结论

通过这些优化，我们将显著提高 FlexNet 项目中 Composables 的可维护性、性能和类型安全。每项改进都遵循渐进式策略，确保现有功能不受影响的同时提升代码质量。 