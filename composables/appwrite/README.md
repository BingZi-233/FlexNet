# Appwrite 服务模块文档

## 概述

Appwrite 服务模块提供了对 Appwrite 云服务的封装，提供了用户认证、数据库操作、文件存储等功能。该模块采用模块化的设计，将不同功能分离到不同子模块，便于维护和使用。模块结构如下：

1. `account` - 用户账户相关功能
   - `auth.ts` - 用户认证（登录、注册、OAuth 等）
   - `profile.ts` - 用户资料管理（更新名称、邮箱等）
   - `session.ts` - 会话管理（获取、删除会话等）
   - `index.ts` - 账户模块入口
2. `database.ts` - 数据库操作功能
3. `storage.ts` - 文件存储功能
4. `server.ts` - 服务端专用功能
5. `user-labels.ts` - 用户标签功能
6. `types.ts` - 类型定义
7. `index.ts` - 主入口，组合所有子模块并提供统一的 API

## 使用方法

### 基本用法

```typescript
import { useAppwrite } from '~/composables/appwrite';

// 创建 Appwrite 服务实例
const appwrite = useAppwrite();

// 获取当前用户信息
const user = await appwrite.getCurrentUser();

// 登录
await appwrite.login('user@example.com', 'password');

// 上传文件
const file = await appwrite.uploadFile(fileInput.files[0]);

// 创建文档
const document = await appwrite.database.createDocument('collectionId', { title: 'Hello' });
```

### 使用特定子模块

```typescript
import { 
  useAppwriteAccount, 
  useAppwriteStorage, 
  useAppwriteDatabase 
} from '~/composables/appwrite';

// 账户功能
const account = useAppwriteAccount();
await account.loginWithEmail('user@example.com', 'password');

// 存储功能
const storage = useAppwriteStorage();
await storage.uploadFile(fileInput.files[0]);

// 数据库功能
const database = useAppwriteDatabase();
await database.createDocument('collectionId', { title: 'Hello' });
```

### 使用账户子模块

```typescript
import { useAppwriteAccount } from '~/composables/appwrite';

const account = useAppwriteAccount();

// 使用子模块分组功能
const { auth, profile, session } = account;

// 认证功能
await auth.loginWithEmail('user@example.com', 'password');

// 资料管理功能
await profile.updateName('New Name');

// 会话管理功能
await session.deleteAllSessions();
```

## API 文档

### 账户服务 (useAppwriteAccount)

#### 认证功能

- `getCurrentUser()` - 获取当前登录用户信息
- `loginWithEmail(email, password)` - 使用邮箱密码登录
- `loginWithGithub()` - 使用 GitHub 登录
- `loginWithGoogle()` - 使用 Google 登录
- `logout()` - 登出
- `createAccount(email, password, name, userId)` - 创建新账户

#### 资料管理功能

- `updateName(name)` - 更新用户名
- `updateEmail(email, password)` - 更新邮箱
- `updatePhone(phone, password)` - 更新手机号
- `updatePassword(newPassword, oldPassword)` - 更新密码
- `updatePrefs(prefs)` - 更新用户偏好设置
- `getPrefs()` - 获取用户偏好设置

#### 会话管理功能

- `getSessions()` - 获取所有会话
- `getCurrentSession()` - 获取当前会话
- `deleteSession(sessionId)` - 删除指定会话
- `deleteAllSessions()` - 删除所有会话

### 数据库服务 (useAppwriteDatabase)

#### 客户端操作

- `createDocument(collectionId, data, permissions, databaseId)` - 创建文档
- `getDocument(collectionId, documentId, databaseId)` - 获取文档
- `listDocuments(collectionId, queries, databaseId)` - 列出文档
- `updateDocument(collectionId, documentId, data, permissions, databaseId)` - 更新文档
- `deleteDocument(collectionId, documentId, databaseId)` - 删除文档

#### 服务端操作

- `createDocumentServer(collectionId, data, permissions, databaseId)` - 在服务端创建文档
- `getDocumentServer(collectionId, documentId, databaseId)` - 在服务端获取文档
- `listDocumentsServer(collectionId, queries, databaseId)` - 在服务端列出文档
- `updateDocumentServer(collectionId, documentId, data, permissions, databaseId)` - 在服务端更新文档
- `deleteDocumentServer(collectionId, documentId, databaseId)` - 在服务端删除文档

### 存储服务 (useAppwriteStorage)

- `uploadFile(file, permissions, bucketId)` - 上传文件
- `getFile(fileId, bucketId)` - 获取文件信息
- `getFilePreviewUrl(fileId, width, height, bucketId)` - 获取文件预览 URL
- `downloadFile(fileId, bucketId)` - 下载文件
- `deleteFile(fileId, bucketId)` - 删除文件
- `listFiles(queries, bucketId)` - 列出文件

## 配置

Appwrite 服务使用以下环境变量进行配置：

- `APPWRITE_ENDPOINT` - Appwrite 服务端点 URL
- `APPWRITE_PROJECT_ID` - Appwrite 项目 ID
- `APPWRITE_API_KEY` - Appwrite API 密钥（仅服务端使用）
- `APPWRITE_DATABASE_ID` - 默认数据库 ID
- `APPWRITE_STORAGE_BUCKET_ID` - 默认存储桶 ID

这些配置可以在 `.env` 文件中设置，也可以在部署环境中设置。

## 注意事项

1. 客户端操作和服务端操作区别：
   - 客户端操作使用客户端 SDK，受到权限限制
   - 服务端操作使用 API 密钥，具有完全权限，只能在服务端使用
2. 权限控制：
   - 使用 `getPermissions` 辅助方法创建权限规则
   - 为文档和文件设置适当的权限
3. 文件类型：
   - 上传文件时注意文件大小和类型限制
   - 使用预览功能时注意支持的文件类型
4. 错误处理：
   - 所有方法都会在发生错误时抛出异常
   - 建议使用 try/catch 进行错误处理 