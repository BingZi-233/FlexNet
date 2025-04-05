# FlexNet Composables 重构实施计划

## 背景

当前 composables 目录下的文件组织结构存在重复、冗余和不一致的问题。这个重构计划旨在提高代码组织质量，使代码更加模块化、可维护和可复用。

## 重构目标

1. 减少代码重复
2. 提高代码组织结构
3. 统一代码风格和模式
4. 增强模块化和可复用性
5. 改善开发体验和代码可读性

## 重构策略

采用渐进式重构策略，分阶段进行，保证项目功能在重构过程中不受影响。

## 详细实施计划

### 第一阶段：模块化目录结构创建

1. 在 composables 目录下创建以下子目录：
   - `api` - API服务相关功能
   - `menu` - 菜单相关功能
   - `appwrite` - Appwrite服务相关功能
   - `layout` - 布局相关功能

2. 创建各模块的基础文件：

```
composables/
├── api/
│   ├── index.ts       # 主入口
│   ├── core.ts        # 核心API功能
│   ├── mock.ts        # Mock数据实现
│   └── msw.ts         # MSW实现
├── menu/
│   ├── index.ts       # 主入口
│   ├── core.ts        # 核心菜单功能
│   ├── data.ts        # 菜单数据获取
│   └── types.ts       # 菜单类型定义
├── appwrite/
│   ├── index.ts       # 主入口
│   ├── account/
│   │   ├── index.ts   # 账户主入口
│   │   ├── auth.ts    # 认证相关
│   │   ├── profile.ts # 用户资料相关
│   │   └── session.ts # 会话管理
│   ├── database.ts    # 数据库功能
│   ├── storage.ts     # 存储功能
│   ├── avatar.ts      # 头像功能
│   ├── server.ts      # 服务端功能
│   ├── user-labels.ts # 用户标签功能
│   └── types.ts       # 类型定义
└── layout/
    └── responsive.ts  # 响应式布局
```

### 第二阶段：API服务模块化

1. 在 `api` 目录中实现核心 API 服务：

```typescript
// composables/api/core.ts
export const useApiCore = () => {
  const config = useRuntimeConfig();
  
  /**
   * 通用API请求函数
   */
  const request = async <T>(url: string, options: any = {}) => {
    try {
      const { data, error } = await useFetch<{
        code: number;
        data: T;
        message: string;
      }>(url, {
        key: `${url}-${Date.now()}`,
        cache: 'no-cache',
        ...options
      });
      
      if (error.value) {
        throw error.value;
      }
      
      return data.value;
    } catch (error) {
      console.error(`请求 ${url} 失败:`, error);
      throw error;
    }
  };
  
  return { request };
};
```

2. 实现 mock 模式和 msw 模式，保持与原有功能一致

3. 在 `index.ts` 中根据环境自动选择合适的实现：

```typescript
// composables/api/index.ts
import { useApiCore } from './core';
import { useApiMock } from './mock';
import { useApiMsw } from './msw';

export const useApi = () => {
  const config = useRuntimeConfig();
  const isDev = import.meta.dev;
  const useMock = isDev || config.public.useMock;
  const useMsw = config.public.useMsw;
  
  // 根据配置选择合适的API实现
  if (useMsw) {
    return useApiMsw();
  } else if (useMock) {
    return useApiMock();
  } else {
    return useApiCore();
  }
};
```

### 第三阶段：菜单模块化

1. 在 `menu/core.ts` 中实现核心菜单UI功能：

```typescript
// composables/menu/core.ts
import type { MenuItem } from './types';

export function useMenuCore(
  menuConfig: MenuItem[] = [],
  defaultSelectedKeys: string[] = ['1'],
  defaultOpenKeys: string[] = []
) {
  // 菜单状态
  const selectedKeys = useState<string[]>('menu-selected-keys', () => defaultSelectedKeys);
  const openKeys = useState<string[]>('menu-open-keys', () => defaultOpenKeys);
  const route = useRoute();

  // 根据路由查找菜单项
  const findMenuItemByRoute = (items: MenuItem[], path: string): MenuItem | null => {
    // 实现查找逻辑...
  };

  // 设置当前选中的菜单项
  const setActiveMenuItem = (path: string) => {
    // 实现激活菜单项逻辑...
  };

  // 监听路由变化
  watch(() => route.path, (newPath) => {
    setActiveMenuItem(newPath);
  }, { immediate: true });

  // 更新选择的菜单
  const updateSelectedKeys = (keys: string[]) => {
    selectedKeys.value = keys;
  };

  // 更新打开的菜单
  const updateOpenKeys = (keys: string[]) => {
    openKeys.value = keys;
  };

  return {
    menuConfig,
    selectedKeys,
    openKeys,
    updateSelectedKeys,
    updateOpenKeys,
    setActiveMenuItem
  };
}
```

2. 在 `menu/data.ts` 中实现菜单数据获取功能：

```typescript
// composables/menu/data.ts
import type { MenuItem, MenuType } from './types';
import { useApi } from '../api';

// 缓存管理
const CACHE_EXPIRE_TIME = 5 * 60 * 1000; // 5分钟
const menuCache = new Map<string, { data: MenuItem[], timestamp: number }>();

export function useMenuData() {
  const menuData = ref<MenuItem[]>([]);
  const loading = ref(false);
  const error = ref<Error | null>(null);
  
  // 获取API服务
  const api = useApi();
  
  // 缓存机制实现...
  
  // 获取菜单数据的统一方法
  const fetchMenu = async (type: MenuType, useCache: boolean = true) => {
    // 实现获取菜单数据逻辑...
  };
  
  // 快捷方法
  const getAdminMenu = (useCache = true) => fetchMenu('admin', useCache);
  const getDashboardMenu = (useCache = true) => fetchMenu('dashboard', useCache);
  const getDeveloperMenu = (useCache = true) => fetchMenu('developer', useCache);
  
  // 刷新菜单
  const refreshMenu = (type: MenuType) => fetchMenu(type, false);
  
  return {
    menuData,
    loading,
    error,
    getAdminMenu,
    getDashboardMenu,
    getDeveloperMenu,
    refreshMenu
  };
}
```

3. 在 `menu/index.ts` 中导出组合的菜单功能：

```typescript
// composables/menu/index.ts
import { useMenuCore } from './core';
import { useMenuData } from './data';
import type { MenuItem, MenuType } from './types';

export { type MenuItem, type MenuType };

export function useMenu(
  defaultMenuConfig: MenuItem[] = [],
  defaultSelectedKeys: string[] = ['1'],
  defaultOpenKeys: string[] = []
) {
  // 获取菜单数据
  const { 
    menuData, 
    loading, 
    error, 
    getAdminMenu, 
    getDashboardMenu, 
    getDeveloperMenu,
    refreshMenu
  } = useMenuData();
  
  // 获取菜单核心功能
  const {
    selectedKeys,
    openKeys,
    updateSelectedKeys,
    updateOpenKeys,
    setActiveMenuItem
  } = useMenuCore(
    defaultMenuConfig,
    defaultSelectedKeys,
    defaultOpenKeys
  );
  
  // 提供便捷的初始化方法
  const initAdminMenu = async () => {
    const result = await getAdminMenu();
    return useMenuCore(result.menuData.value, defaultSelectedKeys, defaultOpenKeys);
  };
  
  const initDashboardMenu = async () => {
    const result = await getDashboardMenu();
    return useMenuCore(result.menuData.value, defaultSelectedKeys, defaultOpenKeys);
  };
  
  const initDeveloperMenu = async () => {
    const result = await getDeveloperMenu();
    return useMenuCore(result.menuData.value, defaultSelectedKeys, defaultOpenKeys);
  };
  
  return {
    // 菜单UI状态
    menuData,
    selectedKeys,
    openKeys,
    loading,
    error,
    
    // 操作方法
    updateSelectedKeys,
    updateOpenKeys,
    setActiveMenuItem,
    
    // 数据获取
    getAdminMenu,
    getDashboardMenu,
    getDeveloperMenu,
    refreshMenu,
    
    // 初始化快捷方法
    initAdminMenu,
    initDashboardMenu,
    initDeveloperMenu
  };
}
```

### 第四阶段：Appwrite服务模块化

1. 将 `useAppwriteAccount.ts` 拆分为更小的功能模块：

```typescript
// composables/appwrite/account/auth.ts
import { ID, Account, OAuthProvider } from 'appwrite';
import type { Models } from 'appwrite';

export const useAppwriteAuth = () => {
  const { $appwrite } = useNuxtApp();
  
  // 登录、注册相关功能...
  const loginWithEmail = async (email: string, password: string): Promise<Models.Session> => {
    return await $appwrite.account.createEmailPasswordSession(email, password);
  };
  
  const createAccount = async (
    email: string, 
    password: string, 
    name?: string, 
    userId: string = ID.unique()
  ): Promise<Models.User<Models.Preferences>> => {
    return await $appwrite.account.create(
      userId,
      email,
      password,
      name
    );
  };
  
  // 其他认证相关功能...
  
  return {
    loginWithEmail,
    createAccount,
    // 其他认证方法...
  };
};
```

2. 提供统一的 Appwrite 入口：

```typescript
// composables/appwrite/index.ts
import { useAppwriteAuth } from './account/auth';
import { useAppwriteProfile } from './account/profile';
import { useAppwriteSession } from './account/session';
import { useAppwriteDatabase } from './database';
import { useAppwriteStorage } from './storage';
import { useAppwriteAvatar } from './avatar';
import { useAppwriteServer } from './server';
import { useUserLabels } from './user-labels';

// 主Appwrite组合式函数
export const useAppwrite = () => {
  // 获取各模块功能
  const auth = useAppwriteAuth();
  const profile = useAppwriteProfile();
  const session = useAppwriteSession();
  const database = useAppwriteDatabase();
  const storage = useAppwriteStorage();
  const avatar = useAppwriteAvatar();
  const server = useAppwriteServer();
  const labels = useUserLabels();
  
  // 简化的获取当前用户方法
  const getCurrentUser = async () => {
    return await auth.getCurrentUser();
  };
  
  // 返回统一的API接口
  return {
    // 各模块
    auth,
    profile,
    session,
    database,
    storage,
    avatar,
    server,
    labels,
    
    // 常用方法直接暴露在顶层
    getCurrentUser,
    
    // 常用状态
    user: auth.user,
    isLoggedIn: auth.isLoggedIn
  };
};

// 重新导出子模块，方便直接使用
export {
  useAppwriteAuth,
  useAppwriteProfile,
  useAppwriteSession,
  useAppwriteDatabase,
  useAppwriteStorage,
  useAppwriteAvatar,
  useAppwriteServer,
  useUserLabels
};
```

### 第五阶段：兼容层和迁移

1. 创建兼容层，保持原有API可用：

```typescript
// composables/useApi.ts
import { useApi as useNewApi } from './api';

export const useApi = () => {
  console.warn('useApi 已被弃用，请使用 composables/api 中的新版API');
  return useNewApi();
};
```

2. 逐步更新项目中的引用，使用新的模块化API

3. 在完成迁移后，移除兼容层

### 第六阶段：文档和测试

1. 为每个模块编写文档，详细说明用法和示例

2. 编写测试用例，确保功能正常工作

3. 更新项目的README，说明重构的变化

## 迁移指南

### 菜单功能迁移

原代码:
```typescript
import { useMenu } from '~/composables/useMenu';

// 页面中使用
const { selectedKeys, openKeys, updateSelectedKeys } = useMenu(menuItems, ['1'], []);
```

新代码:
```typescript
import { useMenu } from '~/composables/menu';

// 页面中使用
const { selectedKeys, openKeys, updateSelectedKeys } = useMenu(menuItems, ['1'], []);
```

### API服务迁移

原代码:
```typescript
import { useApi } from '~/composables/useApi';

// 使用API
const api = useApi();
const menuData = await api.menu.getAdminMenu();
```

新代码:
```typescript
import { useApi } from '~/composables/api';

// 使用API
const api = useApi();
const menuData = await api.menu.getAdminMenu();
```

### Appwrite服务迁移

原代码:
```typescript
import { useAppwriteAccount } from '~/composables/useAppwriteAccount';
import { useAppwriteStorage } from '~/composables/useAppwriteStorage';

// 使用Appwrite
const { loginWithEmail } = useAppwriteAccount();
const { uploadFile } = useAppwriteStorage();
```

新代码:
```typescript
import { useAppwrite } from '~/composables/appwrite';
// 或者直接导入特定模块
// import { useAppwriteAuth, useAppwriteStorage } from '~/composables/appwrite';

// 统一API
const appwrite = useAppwrite();
await appwrite.auth.loginWithEmail(email, password);
await appwrite.storage.uploadFile(file);

// 或者使用特定模块
// const { loginWithEmail } = useAppwriteAuth();
// const { uploadFile } = useAppwriteStorage();
```

## 时间规划

1. 第一阶段：模块化目录结构创建 - 1天
2. 第二阶段：API服务模块化 - 2天
3. 第三阶段：菜单模块化 - 2天
4. 第四阶段：Appwrite服务模块化 - 3天
5. 第五阶段：兼容层和迁移 - 2天
6. 第六阶段：文档和测试 - 2天

总计：12天

## 风险分析与缓解措施

1. **风险**: 重构过程中可能引入新的bug
   **缓解**: 编写充分的测试用例，保持功能与原来一致

2. **风险**: 项目其他部分依赖于当前实现
   **缓解**: 添加兼容层，渐进式更新引用

3. **风险**: 新的API设计可能不符合所有使用场景
   **缓解**: 在设计阶段充分考虑现有使用场景，确保新API能满足所有需求

4. **风险**: 重构可能导致性能下降
   **缓解**: 进行性能测试，确保重构后的代码性能不低于原有实现

## 结论

这个重构计划旨在提高FlexNet项目composables部分的代码质量和可维护性。通过模块化和统一API设计，可以使代码更易于理解、扩展和维护。渐进式的重构策略可以最小化对现有功能的影响，平稳过渡到新的代码组织结构。 