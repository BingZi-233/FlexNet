# FlexNet Composables 指南

## 概述

Composables 是 FlexNet 项目中用于封装和复用逻辑的组合式函数，基于 Vue 3 的组合式 API 设计。本文档提供了项目中 Composables 的详细说明、使用方法和最佳实践。

## 目录结构

```
composables/
├── appwrite/               # Appwrite 相关功能
│   ├── account/            # 用户账户管理
│   │   ├── auth.ts         # 认证功能
│   │   ├── profile.ts      # 用户资料管理
│   │   ├── session.ts      # 会话管理
│   │   └── index.ts        # 账户模块入口
│   ├── storage/            # 存储相关功能
│   ├── database.ts         # 数据库操作
│   ├── server.ts           # 服务端功能
│   ├── user-labels.ts      # 用户标签管理
│   ├── types.ts            # 类型定义
│   └── index.ts            # Appwrite 模块入口
├── api/                    # API 请求封装
├── menu/                   # 菜单管理
├── layout/                 # 布局相关
├── useAppwriteServer.ts    # 服务端 Appwrite 功能
├── useUserLabels.ts        # 用户标签管理
└── useAppwriteAvatar.ts    # Appwrite 头像服务
```

## 核心 Composables

### Appwrite 服务

#### 1. useAppwrite

主入口 Composable，提供统一的 Appwrite 服务接口。

```typescript
// 基本用法
const appwrite = useAppwrite();

// 获取当前用户
const currentUser = await appwrite.getCurrentUser();

// 登录
await appwrite.login('user@example.com', 'password');

// 上传文件
const file = await appwrite.uploadFile(fileInput.files[0]);

// 创建文档
const doc = await appwrite.createDocument('collectionId', { title: 'Hello' });
```

#### 2. useAppwriteAccount

用户账户管理，包含认证、资料和会话功能。

```typescript
const account = useAppwriteAccount();

// 登录
await account.loginWithEmail('user@example.com', 'password');

// OAuth 登录
await account.loginWithGithub();

// 更新用户资料
await account.updateName('新用户名');

// 退出登录
await account.logout();
```

#### 3. useAppwriteDatabase

数据库操作功能。

```typescript
const database = useAppwriteDatabase();

// 创建文档
const document = await database.createDocument(
  'collectionId',
  { title: '标题', content: '内容' }
);

// 查询文档列表
const documents = await database.listDocuments(
  'collectionId',
  [Query.equal('status', 'published')]
);

// 更新文档
await database.updateDocument(
  'collectionId',
  'documentId',
  { title: '新标题' }
);

// 删除文档
await database.deleteDocument('collectionId', 'documentId');
```

#### 4. useAppwriteStorage

文件存储功能。

```typescript
const storage = useAppwriteStorage();

// 上传文件
const file = await storage.uploadFile(fileInput.files[0]);

// 获取文件预览 URL
const previewUrl = storage.getFilePreviewUrl(fileId, 400, 300);

// 下载文件
await storage.downloadFile(fileId);

// 删除文件
await storage.deleteFile(fileId);
```

#### 5. useAppwriteAvatar

Appwrite 头像服务封装。

```typescript
const avatar = useAppwriteAvatar();

// 获取基于用户名首字母的头像
const initialsUrl = avatar.getInitialsAvatar('用户名', 100, 100);

// 获取国旗图标
const flagUrl = avatar.getFlag('CN', 100, 100);

// 获取二维码
const qrUrl = avatar.getQR('https://example.com', 200);
```

#### 6. useUserLabels

用户标签管理功能。

```typescript
const labels = useUserLabels();

// 添加标签
await labels.addUserLabel('userId', 'developer');

// 删除标签
await labels.removeUserLabel('userId', 'developer');

// 为当前用户添加开发者权限
await labels.becomeDevUser();
```

## 最佳实践

### 1. 命名规范

- Composable 函数名使用 `camelCase` 并以 `use` 前缀开头
- 函数内部方法使用动词开头，表示操作
- 常量使用 `UPPER_SNAKE_CASE`

### 2. 类型安全

- 始终为 Composable 的参数和返回值提供类型注解
- 使用 TypeScript 类型别名和接口定义复杂类型
- 避免使用 `any` 类型，尽量使用更具体的类型

### 3. 错误处理

- 使用 try/catch 捕获并处理错误
- 提供有意义的错误消息
- 在错误发生时保持应用状态一致性

```typescript
try {
  await appwrite.createDocument('collectionId', data);
} catch (error) {
  // 提供有意义的错误消息
  Message.error(`创建文档失败: ${error.message}`);
  // 记录详细错误信息
  console.error('创建文档错误:', error);
}
```

### 4. 状态管理

- 使用 `useState` 存储可共享的状态
- 使用 `computed` 派生计算属性
- 避免直接修改导入的状态，使用提供的更新方法

### 5. 组合与复用

- 将大型 Composable 拆分为更小的独立功能
- 使用组合模式组合多个 Composable
- 避免重复代码，提取共用逻辑为独立函数

## 优化建议

1. **统一错误处理**：创建通用的错误处理函数，确保一致的错误报告和处理

2. **添加缓存机制**：为频繁请求的数据添加缓存，减少网络请求

3. **模块化改进**：将根目录下的 Composables 移至适当的子目录

4. **参数校验**：增强输入参数验证，提前捕获潜在问题

5. **类型增强**：使用更具体的类型代替通用类型，提高代码的类型安全性

## 示例：优化后的 Composable

```typescript
// composables/utils/error.ts
export const useAppwriteError = () => {
  const handleError = (error: any, context: string, fallbackMessage = '操作失败') => {
    console.error(`${context}:`, error);
    return {
      message: error.message || fallbackMessage,
      code: error.code || 'UNKNOWN_ERROR',
      original: error
    };
  };
  
  return { handleError };
};

// 使用优化后的错误处理
const { handleError } = useAppwriteError();

try {
  await appwrite.createDocument('collectionId', data);
} catch (error) {
  const { message } = handleError(error, '创建文档', '文档创建失败');
  Message.error(message);
}
```

## 常见问题

### 服务端渲染 (SSR) 注意事项

- 避免在 SSR 阶段访问仅客户端可用的 API (如 window, document)
- 使用 `process.client` 检查运行环境
- 对于客户端特定功能，使用 `<ClientOnly>` 组件或延迟执行

```typescript
if (process.client) {
  // 仅在客户端执行的代码
}
```

### 状态持久化

- 使用 `useStorage` 实现状态持久化
- 敏感数据使用加密存储
- 确保在用户登出时清除持久化状态

## 结论

FlexNet 项目的 Composables 提供了一种强大、灵活的方式来组织和复用业务逻辑。通过遵循本文档中的最佳实践和优化建议，可以提高代码质量、开发效率和用户体验。 