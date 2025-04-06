import { useBreakpoints, useStorage } from '@vueuse/core';

/**
 * 响应式布局组合式函数
 * 处理移动端和桌面端布局切换
 * @param mobileBreakpoint 移动端断点
 */
export function useResponsiveLayout(mobileBreakpoint = 768) {
  // 响应式断点
  const breakpoints = useBreakpoints({
    mobile: mobileBreakpoint
  });
  
  // 是否为移动设备
  const isMobile = breakpoints.smaller('mobile');
  
  // 抽屉可见状态（用于移动端）
  const drawerVisible = ref(false);
  
  // 收起状态与备份状态
  let collapsed: Ref<boolean>;
  let wasCollapsedBeforeMobile: Ref<boolean>;
  
  // 在客户端使用localStorage，在服务端使用普通ref
  if (import.meta.client) {
    collapsed = useStorage('layout-sidebar-collapsed', false);
    wasCollapsedBeforeMobile = useStorage('layout-sidebar-collapsed-before-mobile', false);
  } else {
    collapsed = ref(false);
    wasCollapsedBeforeMobile = ref(false);
  }
  
  // 监听移动端状态变化
  watch(isMobile, (newIsMobile) => {
    if (newIsMobile) {
      // 记录之前的收起状态，并强制收起
      wasCollapsedBeforeMobile.value = collapsed.value;
      collapsed.value = true;
    } else {
      // 恢复之前的收起状态
      collapsed.value = wasCollapsedBeforeMobile.value;
    }
  });
  
  // 切换收起状态
  const toggleCollapse = () => {
    collapsed.value = !collapsed.value;
  };
  
  // 打开抽屉
  const openDrawer = () => {
    drawerVisible.value = true;
  };
  
  // 关闭抽屉
  const closeDrawer = () => {
    drawerVisible.value = false;
  };
  
  // 获取主内容区域类名
  const getMainClass = computed(() => 
    isMobile.value ? '' : (collapsed.value ? 'md:ml-16' : 'md:ml-60')
  );
  
  // 获取头部区域类名
  const getHeaderClass = computed(() => 
    isMobile.value ? 'left-0' : (collapsed.value ? 'md:left-16' : 'md:left-60')
  );
  
  // 监听路由变化关闭抽屉
  const route = useRoute();
  watch(() => route.path, () => {
    closeDrawer();
  });
  
  return {
    isMobile,
    drawerVisible,
    collapsed,
    toggleCollapse,
    openDrawer,
    closeDrawer,
    getMainClass,
    getHeaderClass
  };
} 