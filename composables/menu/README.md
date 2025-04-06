# 菜单模块文档

## 概述

菜单模块提供了统一的菜单UI状态管理和数据获取功能，用于在应用中管理和呈现菜单。该模块分为以下几个部分：

1. `core.ts` - 提供核心菜单UI状态管理和交互功能
2. `data.ts` - 提供菜单数据获取功能，支持多种菜单类型
3. `types.ts` - 定义菜单相关的类型
4. `index.ts` - 模块入口，组合上述功能并提供统一的API

## 使用方法

### 基本用法

```typescript
import { useMenu } from '~/composables/menu';

// 使用默认配置
const menu = useMenu();

// 访问菜单状态
const { selectedKeys, openKeys } = menu;

// 更新选中的菜单项
menu.updateSelectedKeys(['1']);

// 更新展开的菜单项
menu.updateOpenKeys(['sub1']);
```

### 获取菜单数据

```typescript
import { useMenu } from '~/composables/menu';

const menu = useMenu();

// 获取管理员菜单
const adminMenu = await menu.getAdminMenu();

// 获取用户仪表盘菜单
const dashboardMenu = await menu.getDashboardMenu();

// 获取开发者菜单
const developerMenu = await menu.getDeveloperMenu();

// 强制刷新菜单数据
const freshData = await menu.refreshMenu('admin');
```

### 快速初始化

```typescript
import { useMenu } from '~/composables/menu';

// 初始化管理员菜单
const adminMenu = await useMenu().initAdminMenu();

// 初始化用户仪表盘菜单并设置默认选中项
const dashboardMenu = await useMenu().initDashboardMenu(['dashboard']);

// 初始化开发者菜单并设置默认选中项和展开项
const devMenu = await useMenu().initDeveloperMenu(['api'], ['services']);
```

## API 文档

### useMenu

```typescript
function useMenu(
  defaultMenuConfig?: MenuItem[],
  defaultSelectedKeys?: string[],
  defaultOpenKeys?: string[]
): MenuInstance
```

创建一个菜单实例，可以指定默认菜单配置和默认选中/展开状态。

### useMenuCore

```typescript
function useMenuCore(
  menuConfig?: MenuItem[],
  defaultSelectedKeys?: string[],
  defaultOpenKeys?: string[]
): MenuCoreInstance
```

创建一个只包含UI状态管理功能的菜单实例，不包含数据获取功能。

### useMenuData

```typescript
function useMenuData(): MenuDataInstance
```

创建一个只包含数据获取功能的菜单实例，不包含UI状态管理功能。

## 类型定义

### MenuItem

```typescript
interface MenuItem {
  key: string;
  title: string;
  icon?: string;
  route?: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  disabled?: boolean;
  children?: MenuItem[];
  roles?: string[];
  [key: string]: any;
}
```

### MenuType

```typescript
type MenuType = 'admin' | 'dashboard' | 'developer';
```

## 注意事项

1. 菜单数据会默认缓存5分钟，可以通过 `refreshMenu` 方法强制刷新
2. 菜单UI状态会自动根据当前路由更新
3. 建议在布局组件中初始化菜单，然后通过状态管理共享给子组件 