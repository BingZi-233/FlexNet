import type { MenuItem } from './types';

/**
 * 菜单核心功能
 * 处理菜单UI状态（选中项、展开项等）
 */
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
    for (const item of items) {
      if (item.route === path) {
        return item;
      }
      if (item.children?.length) {
        const found = findMenuItemByRoute(item.children, path);
        if (found) return found;
      }
    }
    return null;
  };

  // 设置当前选中的菜单项
  const setActiveMenuItem = (path: string) => {
    const menuItem = findMenuItemByRoute(menuConfig, path);
    if (menuItem) {
      selectedKeys.value = [menuItem.key];
      
      // 查找父级菜单并展开
      const findParentKeys = (items: MenuItem[], targetKey: string, parents: string[] = []): string[] => {
        for (const item of items) {
          if (item.children?.length) {
            if (item.children.some(child => child.key === targetKey)) {
              return [...parents, item.key];
            }
            const result = findParentKeys(item.children, targetKey, [...parents, item.key]);
            if (result.length) return result;
          }
        }
        return [];
      };
      
      const parentKeys = findParentKeys(menuConfig, menuItem.key);
      if (parentKeys.length) {
        openKeys.value = parentKeys;
      }
    }
  };

  // 监听路由变化，更新选中的菜单项
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
    setActiveMenuItem,
    findMenuItemByRoute
  };
} 