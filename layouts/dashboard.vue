<template>
  <AdminLayout 
    :userData="userData as Record<string, any>"
    headerTitle="控制台"
    breadcrumbTitle="首页"
    homeRoute="/dashboard"
    :currentPageTitle="currentPageTitle"
    @collapse="handleLayoutCollapse"
    @update:mobile="handleMobileChange"
  >
    <template #menu>
      <a-menu
        :default-selected-keys="activeMenu"
        :default-open-keys="['sub1']"
        :collapsed="collapsed"
        class="border-0"
      >
        <a-menu-item key="1">
          <template #icon><IconDashboard /></template>
          <nuxt-link to="/dashboard">仪表台</nuxt-link>
        </a-menu-item>
        <a-menu-item key="2">
          <template #icon><IconUser /></template>
          <nuxt-link to="/dashboard/users">用户管理</nuxt-link>
        </a-menu-item>
        <a-menu-item key="3">
          <template #icon><IconSettings /></template>
          <nuxt-link to="/dashboard/settings">系统设置</nuxt-link>
        </a-menu-item>
        <a-sub-menu key="sub1">
          <template #icon><IconApps /></template>
          <template #title>数据分析</template>
          <a-menu-item key="4">数据概览</a-menu-item>
          <a-menu-item key="5">流量分析</a-menu-item>
          <a-menu-item key="6">用户行为</a-menu-item>
        </a-sub-menu>
      </a-menu>
    </template>
    
    <template #drawer-menu>
      <a-menu
        :default-selected-keys="activeMenu"
        :default-open-keys="['sub1']"
        class="border-0"
      >
        <a-menu-item key="1">
          <template #icon><IconDashboard /></template>
          <nuxt-link to="/dashboard">仪表台</nuxt-link>
        </a-menu-item>
        <a-menu-item key="2">
          <template #icon><IconUser /></template>
          <nuxt-link to="/dashboard/users">用户管理</nuxt-link>
        </a-menu-item>
        <a-menu-item key="3">
          <template #icon><IconSettings /></template>
          <nuxt-link to="/dashboard/settings">系统设置</nuxt-link>
        </a-menu-item>
        <a-sub-menu key="sub1">
          <template #icon><IconApps /></template>
          <template #title>数据分析</template>
          <a-menu-item key="4">数据概览</a-menu-item>
          <a-menu-item key="5">流量分析</a-menu-item>
          <a-menu-item key="6">用户行为</a-menu-item>
        </a-sub-menu>
      </a-menu>
    </template>
    
    <template #user-dropdown>
      <a-doption @click="goTo('/dashboard/profile')">
        <template #icon><IconUser /></template>
        个人信息
      </a-doption>
      <a-doption @click="goTo('/dashboard/settings?tab=account')">
        <template #icon><IconSettings /></template>
        账号设置
      </a-doption>
      <a-divider style="margin: 4px 0" />
      <!-- 角色切换器(移动端) -->
      <a-doption @click="goTo('/developer')" v-if="canAccessDeveloper">
        <template #icon><IconCode /></template>
        切换到开发者中心
      </a-doption>
      <a-doption @click="goTo('/admin')" v-if="canAccessAdmin">
        <template #icon><IconSettings /></template>
        切换到管理控制台
      </a-doption>
      <a-divider style="margin: 4px 0" v-if="canAccessDeveloper || canAccessAdmin" />
      <!-- 插槽允许在其他组件中扩展用户菜单 -->
      <slot name="user-menu-items"></slot>
      <a-doption @click="handleLogout">
        <template #icon><IconExport /></template>
        退出登录
      </a-doption>
    </template>
    
    <slot />
  </AdminLayout>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAppwriteAccount } from '~/composables/useAppwriteAccount';
import { useAppwriteAvatar } from '~/composables/useAppwriteAvatar';
import { UserRole } from '~/types/user';
import AdminLayout from '~/components/layout/AdminLayout.vue';

// 路由
const route = useRoute();
const router = useRouter();

// 使用Appwrite账户服务
const { getCurrentUser, logout, hasDevPermission, hasAdminPermission } = useAppwriteAccount();

// 使用Appwrite头像服务
const { getInitialsAvatar, getFavicon } = useAppwriteAvatar();

// 用于侧边菜单组件通信
const collapsed = ref(false);

// 监听AdminLayout的收起/展开事件
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
const initialsAvatarUrl = ref<string | null>(null);

// 角色权限控制
const canAccessDeveloper = ref(false);
const canAccessAdmin = ref(false);

// 路由导航函数
const goTo = (path: string) => {
  router.push(path);
};

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
  if (path === '/dashboard') return '仪表台';
  if (path === '/dashboard/users') return '用户管理';
  if (path === '/dashboard/settings') return '系统设置';
  return '仪表台';
});

// 当前激活的菜单
const activeMenu = computed(() => {
  const path = route.path;
  if (path === '/dashboard') return ['1'];
  if (path === '/dashboard/users') return ['2'];
  if (path === '/dashboard/settings') return ['3'];
  return ['1'];
});

// 初始化
fetchUserData();
</script> 