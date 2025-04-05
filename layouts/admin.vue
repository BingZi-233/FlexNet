<template>
  <DashboardLayout 
    :userData="userData as Record<string, any>"
    :layoutConfig="{
      headerTitle: '管理控制台',
      breadcrumbTitle: '管理控制台',
      homeRoute: '/admin',
      currentPageTitle: currentPageTitle,
      showNotifications: true,
      showSettings: true,
      showUserProfile: true
    }"
    :menuConfig="adminMenuConfig"
    :defaultSelectedKeys="activeMenu"
    :defaultOpenKeys="['system', 'users', 'content']"
    @collapse="handleLayoutCollapse"
    @update:mobile="handleMobileChange"
  >
    <!-- 用户下拉菜单选项，现在使用插槽 -->
    <template #user-dropdown>
      <a-doption @click="goTo('/admin/profile')">
        <template #icon><IconUser /></template>
        管理员资料
      </a-doption>
      <a-doption @click="goTo('/admin/system/general')">
        <template #icon><IconSettings /></template>
        系统设置
      </a-doption>
      <a-divider style="margin: 4px 0" />
      <!-- 角色切换器(移动端) -->
      <a-doption @click="goTo('/developer')" v-if="canAccessDeveloper">
        <template #icon><IconCode /></template>
        切换到开发者中心
      </a-doption>
      <a-doption @click="goTo('/dashboard')">
        <template #icon><IconDashboard /></template>
        切换到用户面板
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
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAppwriteAccount } from '~/composables/useAppwriteAccount';
import { useAppwriteAvatar } from '~/composables/useAppwriteAvatar';
import { UserRole } from '~/types/user';
import DashboardLayout from '~/components/layout/DashboardLayout.vue';
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
import { getAdminMenu } from '~/mock/api/menu';
import type { MenuItem } from '~/mock/data/menuConfig';
import { useMenu } from '~/composables/useMenu';

// 路由
const route = useRoute();
const router = useRouter();

// 使用Appwrite账户服务
const { getCurrentUser, logout, hasDevPermission } = useAppwriteAccount();

// 使用Appwrite头像服务
const { getInitialsAvatar, getFavicon } = useAppwriteAvatar();

// 用于侧边菜单组件通信
const collapsed = ref(false);

// 菜单配置
const adminMenuConfig = ref<MenuItem[]>([]);
const menuLoading = ref(true);

// 获取菜单数据
const fetchMenuData = async () => {
  try {
    menuLoading.value = true;
    // 使用组合式函数获取菜单数据
    const { menuData, loading, error } = await useMenu().fetchAdminMenu();
    
    // 如果获取成功，更新菜单数据
    if (!error.value) {
      adminMenuConfig.value = menuData.value;
    } else {
      console.error('获取管理员菜单失败:', error.value);
    }
  } catch (error) {
    console.error('获取管理员菜单出错:', error);
  } finally {
    menuLoading.value = false;
  }
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
const canAccessDeveloper = ref(false);

// 获取用户信息
const fetchUserData = async () => {
  try {
    isLoading.value = true;
    const user = await getCurrentUser();
    
    if (user) {
      // 处理用户头像
      let avatarUrl = user.prefs?.avatarUrl || null;
      const userName = user.name || '未知用户';
      const nameInitial = userName.charAt(0).toUpperCase();
      const labels = user.labels || [];
      
      // 检查用户角色权限
      canAccessDeveloper.value = await hasDevPermission();
      
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

// 路由导航函数
const goTo = (path: string) => {
  router.push(path);
};

// 退出登录
const handleLogout = async () => {
  try {
    await logout();
    // 退出后重定向到登录页面
    router.push('/auth/login');
  } catch (error) {
    console.error('退出登录失败:', error);
  }
};

// 当前页面标题
const currentPageTitle = computed(() => {
  const path = route.path;
  if (path === '/admin') return '控制面板';
  if (path === '/admin/users/list') return '用户列表';
  if (path === '/admin/users/roles') return '角色权限';
  if (path === '/admin/users/activity') return '用户活动';
  if (path === '/admin/content/pages') return '页面管理';
  if (path === '/admin/content/blogs') return '博客文章';
  if (path === '/admin/content/media') return '媒体库';
  if (path === '/admin/system/general') return '通用设置';
  if (path === '/admin/system/security') return '安全设置';
  if (path === '/admin/system/logs') return '系统日志';
  if (path === '/admin/system/backups') return '备份恢复';
  if (path === '/admin/notifications') return '消息通知';
  if (path === '/admin/security') return '安全中心';
  if (path === '/admin/profile') return '管理员资料';
  return '控制面板';
});

// 当前激活的菜单
const activeMenu = computed(() => {
  const path = route.path;
  if (path === '/admin') return ['1'];
  if (path === '/admin/users/list') return ['2'];
  if (path === '/admin/users/roles') return ['3'];
  if (path === '/admin/users/activity') return ['4'];
  if (path === '/admin/content/pages') return ['5'];
  if (path === '/admin/content/blogs') return ['6'];
  if (path === '/admin/content/media') return ['7'];
  if (path === '/admin/system/general') return ['8'];
  if (path === '/admin/system/security') return ['9'];
  if (path === '/admin/system/logs') return ['10'];
  if (path === '/admin/system/backups') return ['11'];
  if (path === '/admin/notifications') return ['12'];
  if (path === '/admin/security') return ['13'];
  return ['1'];
});

// 监听DashboardLayout的收起/展开事件
const handleLayoutCollapse = (isCollapsed: boolean) => {
  collapsed.value = isCollapsed;
};

// 监听移动设备状态变化
const handleMobileChange = (isMobile: boolean) => {
  // 可以在这里处理移动设备适配的其他逻辑
  console.log('移动设备状态变化:', isMobile);
};

// 初始化
fetchUserData();
fetchMenuData();
</script> 