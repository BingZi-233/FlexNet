<template>
  <DashboardLayout 
    :userData="userData as Record<string, any>"
    :layoutConfig="{
      headerTitle: '开发者平台',
      breadcrumbTitle: '开发者',
      homeRoute: '/developer',
      currentPageTitle: currentPageTitle,
      showNotifications: true,
      showSettings: true,
      showUserProfile: true
    }"
    :menuConfig="developerMenuConfig"
    :defaultSelectedKeys="activeMenu"
    :defaultOpenKeys="['api', 'docs']"
    @collapse="handleLayoutCollapse"
    @update:mobile="handleMobileChange"
  >
    <template #user-dropdown>
      <a-doption @click="goTo('/developer/profile')">
        <template #icon><IconUser /></template>
        开发者资料
      </a-doption>
      <a-doption @click="goTo('/developer/settings')">
        <template #icon><IconSettings /></template>
        开发者设置
      </a-doption>
      <a-divider style="margin: 4px 0" />
      <!-- 角色切换器 -->
      <a-doption @click="goTo('/dashboard')">
        <template #icon><IconDashboard /></template>
        切换到用户面板
      </a-doption>
      <a-doption @click="goTo('/admin')" v-if="canAccessAdmin">
        <template #icon><IconSettings /></template>
        切换到管理控制台
      </a-doption>
      <a-divider style="margin: 4px 0" />
      <!-- 插槽允许在其他组件中扩展用户菜单 -->
      <slot name="user-menu-items"></slot>
      <a-doption @click="handleLogout">
        <template #icon><IconExport /></template>
        退出登录
      </a-doption>
    </template>
    
    <slot />
  </DashboardLayout>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAppwrite } from '~/composables/appwrite';
import { useMenu, useMenuData } from '~/composables/menu';
import { UserRole } from '~/types/user';
import DashboardLayout from '~/components/layout/DashboardLayout.vue';
import { Message } from '@arco-design/web-vue';
import type { MenuItem } from '~/types/layout';
import {
  IconDashboard,
  IconUser,
  IconSettings,
  IconNotification,
  IconEdit,
  IconCode,
  IconBook,
  IconInfoCircle,
  IconApps,
  IconSafe,
  IconExport,
  IconMenu,
  IconClose,
  IconHistory,
  IconFile,
  IconImage
} from '@arco-design/web-vue/es/icon';
import { getDeveloperMenu } from '~/mock/api/menu';
import { useMenuSimple } from '~/composables/useMenuSimple';
import { useMenuWithMsw } from '~/composables/useMenuWithMsw';

// 路由
const route = useRoute();
const router = useRouter();

// 使用Appwrite服务
const appwrite = useAppwrite();
const account = appwrite.account;

// 获取头像函数
const getInitialsAvatar = (name: string) => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=165DFF&color=fff`;
};

// 使用hasAdminPermission函数（从account中获取）
const hasAdminPermission = async () => {
  const user = await account.getCurrentUser();
  return user?.labels?.includes('admin') || false;
};

// 用于侧边菜单组件通信
const collapsed = ref(false);

// 菜单配置及加载状态
const developerMenuConfig = ref<MenuItem[]>([]);
const menuLoading = ref(true);
const menuHandler = ref<any>(null);

// 获取菜单数据
const fetchMenuData = async () => {
  try {
    menuLoading.value = true;
    
    // 使用新的菜单数据API
    const menuApi = useMenuData();
    const result = await menuApi.getDeveloperMenu();
    
    if (result && result.menuData) {
      developerMenuConfig.value = result.menuData.value;
    } else {
      console.error('获取开发者菜单失败: 无数据返回');
    }
    
    menuLoading.value = false;
  } catch (error) {
    console.error('获取开发者菜单出错:', error);
    menuLoading.value = false;
  }
};

// 监听DashboardLayout的收起/展开事件
const handleLayoutCollapse = (isCollapsed: boolean) => {
  collapsed.value = isCollapsed;
};

// 监听移动设备状态变化
const handleMobileChange = (isMobile: boolean) => {
  // 可以在这里处理移动设备适配的其他逻辑
  console.log('移动设备状态变化:', isMobile);
};

// 用户数据
const userData = ref<{
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  nameInitial: string;
  labels?: string[];
} | null>(null);
const isLoading = ref(true);

// 角色权限控制
const canAccessAdmin = ref(false);

// 获取用户信息
const fetchUserData = async () => {
  try {
    isLoading.value = true;
    const user = await account.getCurrentUser();
    
    if (user) {
      // 处理用户头像
      let avatarUrl = user.prefs?.avatarUrl || null;
      const userName = user.name || '未知用户';
      const nameInitial = userName.charAt(0).toUpperCase();
      const labels = user.labels || [];
      
      // 检查用户角色权限
      canAccessAdmin.value = await hasAdminPermission();
      
      // 设置用户数据对象
      userData.value = {
        id: user.$id,
        name: userName,
        email: user.email,
        avatarUrl,
        nameInitial,
        labels
      };
    } else {
      // 未登录，跳转到登录页
      router.push('/auth/login');
    }
  } catch (error) {
    console.error('获取用户信息出错:', error);
  } finally {
    isLoading.value = false;
  }
};

// 开发者菜单配置
// ... existing code ...

// 路由导航函数
const goTo = (path: string) => {
  router.push(path);
};

// 退出登录
const handleLogout = async () => {
  try {
    await account.logout();
    // 退出后重定向到登录页面
    router.push('/auth/login');
  } catch (error) {
    console.error('退出登录失败:', error);
  }
};

// 当前页面标题
const currentPageTitle = computed(() => {
  const path = route.path;
  if (path === '/developer') return '开发者中心';
  if (path === '/developer/api/keys') return 'API 密钥';
  if (path === '/developer/api/endpoints') return 'API 端点';
  if (path === '/developer/api/logs') return '请求日志';
  if (path === '/developer/docs/reference') return 'API 文档';
  if (path === '/developer/docs/guides') return '开发指南';
  if (path === '/developer/docs/examples') return '示例代码';
  if (path === '/developer/settings') return '开发设置';
  if (path === '/developer/support') return '技术支持';
  return '开发者中心';
});

// 当前激活的菜单
const activeMenu = computed(() => {
  const path = route.path;
  if (path === '/developer') return ['1'];
  if (path === '/developer/api/keys') return ['2'];
  if (path === '/developer/api/endpoints') return ['3'];
  if (path === '/developer/api/logs') return ['4'];
  if (path === '/developer/docs/reference') return ['5'];
  if (path === '/developer/docs/guides') return ['6'];
  if (path === '/developer/docs/examples') return ['7'];
  if (path === '/developer/settings') return ['8'];
  if (path === '/developer/support') return ['9'];
  return ['1'];
});

// 监听路由变化，当路由变化时重新获取数据
onMounted(() => {
  fetchMenuData();
});

// 初始化
fetchUserData();
</script> 