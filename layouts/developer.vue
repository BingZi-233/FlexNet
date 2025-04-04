<template>
  <AdminLayout 
    :userData="userData as Record<string, any>"
    headerTitle="开发者平台"
    breadcrumbTitle="开发者"
    homeRoute="/developer"
    :currentPageTitle="currentPageTitle"
    @collapse="handleLayoutCollapse"
    @update:mobile="handleMobileChange"
  >
    <template #menu>
      <a-menu
        :default-selected-keys="activeMenu"
        :default-open-keys="['api', 'docs']"
        :collapsed="collapsed"
        class="border-0"
      >
        <a-menu-item key="1">
          <template #icon><IconDashboard /></template>
          <nuxt-link to="/developer">开发者中心</nuxt-link>
        </a-menu-item>
        
        <a-sub-menu key="api">
          <template #icon><IconCode /></template>
          <template #title>API 管理</template>
          <a-menu-item key="2">
            <nuxt-link to="/developer/api/keys">API 密钥</nuxt-link>
          </a-menu-item>
          <a-menu-item key="3">
            <nuxt-link to="/developer/api/endpoints">API 端点</nuxt-link>
          </a-menu-item>
          <a-menu-item key="4">
            <nuxt-link to="/developer/api/logs">请求日志</nuxt-link>
          </a-menu-item>
        </a-sub-menu>
        
        <a-sub-menu key="docs">
          <template #icon><IconBook /></template>
          <template #title>技术文档</template>
          <a-menu-item key="5">
            <nuxt-link to="/developer/docs/reference">API 文档</nuxt-link>
          </a-menu-item>
          <a-menu-item key="6">
            <nuxt-link to="/developer/docs/guides">开发指南</nuxt-link>
          </a-menu-item>
          <a-menu-item key="7">
            <nuxt-link to="/developer/docs/examples">示例代码</nuxt-link>
          </a-menu-item>
        </a-sub-menu>
        
        <a-menu-item key="8">
          <template #icon><IconSettings /></template>
          <nuxt-link to="/developer/settings">开发设置</nuxt-link>
        </a-menu-item>
        
        <a-menu-item key="9">
          <template #icon><IconInfoCircle /></template>
          <nuxt-link to="/developer/support">技术支持</nuxt-link>
        </a-menu-item>
      </a-menu>
    </template>
    
    <template #drawer-menu>
      <a-menu
        :default-selected-keys="activeMenu"
        :default-open-keys="['api', 'docs']"
        class="border-0"
      >
        <a-menu-item key="1">
          <template #icon><IconDashboard /></template>
          <nuxt-link to="/developer">开发者中心</nuxt-link>
        </a-menu-item>
        
        <a-sub-menu key="api">
          <template #icon><IconCode /></template>
          <template #title>API 管理</template>
          <a-menu-item key="2">
            <nuxt-link to="/developer/api/keys">API 密钥</nuxt-link>
          </a-menu-item>
          <a-menu-item key="3">
            <nuxt-link to="/developer/api/endpoints">API 端点</nuxt-link>
          </a-menu-item>
          <a-menu-item key="4">
            <nuxt-link to="/developer/api/logs">请求日志</nuxt-link>
          </a-menu-item>
        </a-sub-menu>
        
        <a-sub-menu key="docs">
          <template #icon><IconBook /></template>
          <template #title>技术文档</template>
          <a-menu-item key="5">
            <nuxt-link to="/developer/docs/reference">API 文档</nuxt-link>
          </a-menu-item>
          <a-menu-item key="6">
            <nuxt-link to="/developer/docs/guides">开发指南</nuxt-link>
          </a-menu-item>
          <a-menu-item key="7">
            <nuxt-link to="/developer/docs/examples">示例代码</nuxt-link>
          </a-menu-item>
        </a-sub-menu>
        
        <a-menu-item key="8">
          <template #icon><IconSettings /></template>
          <nuxt-link to="/developer/settings">开发设置</nuxt-link>
        </a-menu-item>
        
        <a-menu-item key="9">
          <template #icon><IconInfoCircle /></template>
          <nuxt-link to="/developer/support">技术支持</nuxt-link>
        </a-menu-item>
      </a-menu>
    </template>
    
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
const { getCurrentUser, logout, hasAdminPermission } = useAppwriteAccount();

// 使用Appwrite头像服务
const { getInitialsAvatar } = useAppwriteAvatar();

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

// 角色权限控制
const canAccessAdmin = ref(false);

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

// 初始化
fetchUserData();
</script> 