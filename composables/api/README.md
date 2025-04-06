# API 服务模块文档

## 概述

API 服务模块提供了统一的 API 请求功能，封装了网络请求的细节，并支持不同的环境（生产环境、开发环境）和不同的数据来源（真实 API、Mock 数据、MSW）。该模块分为以下几个部分：

1. `core.ts` - 提供核心 API 请求功能，用于生产环境中与真实后端交互
2. `mock.ts` - 提供本地 Mock 数据实现，用于开发和测试
3. `msw.ts` - 提供基于 MSW（Mock Service Worker）的实现，用于高级 Mock 场景
4. `types.ts` - 定义 API 相关的类型
5. `index.ts` - 模块入口，根据环境自动选择合适的实现

## 使用方法

### 基本用法

```typescript
import { useApi } from '~/composables/api';

// 创建 API 服务实例，会根据环境自动选择合适的实现
const api = useApi();

// 使用通用请求函数
const data = await api.request('/api/users');

// 使用 HTTP 方法封装
const userList = await api.http.get('/api/users');
const newUser = await api.http.post('/api/users', { name: 'Alice', email: 'alice@example.com' });
const updatedUser = await api.http.put('/api/users/123', { name: 'Bob' });
await api.http.delete('/api/users/123');
```

### 使用预定义的 API 集合

```typescript
import { useApi } from '~/composables/api';

const api = useApi();

// 获取菜单数据
const adminMenu = await api.menu.getAdminMenu();
const dashboardMenu = await api.menu.getDashboardMenu();
const developerMenu = await api.menu.getDeveloperMenu();
```

### 直接使用特定实现

```typescript
import { useApiCore, useApiMock, useApiMsw } from '~/composables/api';

// 使用核心 API 实现（真实后端）
const coreApi = useApiCore();

// 使用 Mock 数据实现
const mockApi = useApiMock();

// 使用 MSW 实现
const mswApi = useApiMsw();
```

## API 文档

### useApi

```typescript
function useApi(): ApiService
```

创建一个 API 服务实例，会根据当前环境和配置自动选择合适的实现。

### useApiCore

```typescript
function useApiCore(): ApiService
```

创建一个核心 API 服务实例，使用真实后端 API。

### useApiMock

```typescript
function useApiMock(): ApiService
```

创建一个 Mock 数据 API 服务实例，直接返回本地 Mock 数据。

### useApiMsw

```typescript
function useApiMsw(): ApiService
```

创建一个基于 MSW 的 API 服务实例，使用 MSW 拦截请求并返回 Mock 数据。

## 类型定义

### ApiResponse

```typescript
interface ApiResponse<T> {
  code: number;
  data: T;
  message: string;
}
```

### RequestOptions

```typescript
interface RequestOptions {
  method?: string;
  params?: Record<string, any>;
  body?: any;
  headers?: Record<string, string>;
  cache?: string;
  [key: string]: any;
}
```

### HttpMethods

```typescript
interface HttpMethods {
  get: <T>(url: string, params?: Record<string, any>, options?: RequestOptions) => Promise<ApiResponse<T>>;
  post: <T>(url: string, body?: any, options?: RequestOptions) => Promise<ApiResponse<T>>;
  put: <T>(url: string, body?: any, options?: RequestOptions) => Promise<ApiResponse<T>>;
  delete: <T>(url: string, body?: any, options?: RequestOptions) => Promise<ApiResponse<T>>;
}
```

## 配置

API 服务会根据以下配置自动选择合适的实现：

- `import.meta.dev` - 是否为开发环境
- `config.public.useMock` - 是否使用 Mock 数据（环境变量：`USE_MOCK`）
- `config.public.useMsw` - 是否使用 MSW（环境变量：`USE_MSW`）

配置优先级：MSW > Mock > 核心实现

## 注意事项

1. 生产环境中应关闭 Mock 和 MSW 功能，使用真实 API
2. 开发环境中可以使用 Mock 数据加速开发
3. 测试环境中可以使用 MSW 进行高级 Mock 场景
4. API 响应应符合 `ApiResponse` 格式，否则需要进行转换 