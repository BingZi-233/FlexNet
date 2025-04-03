<template>
  <div>
    <a-config-provider>
      <a-layout class="min-h-screen dashboard-layout">
        <!-- 侧边导航 - 大屏幕显示 -->
        <a-layout-sider
          v-show="!isMobile"
          :collapsed="collapsed"
          collapsible
          :width="240"
          :collapsed-width="64"
          breakpoint="lg"
          @collapse="collapsed = $event"
          class="border-r border-gray-200 transition-all duration-300 dashboard-sider"
        >
          <div class="p-4 flex items-center justify-center">
            <nuxt-link to="/dashboard" class="flex items-center justify-center">
              <img src="/logo.svg" :class="[collapsed ? 'h-8' : 'h-8 mr-2']" alt="Logo">
            </nuxt-link>
          </div>
          <div class="dashboard-menu-container">
            <a-menu
              :default-selected-keys="activeMenu"
              :default-open-keys="['sub1']"
              :collapsed="collapsed"
              show-collapse-button
              @collapse="collapsed = $event"
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
          </div>
        </a-layout-sider>
        
        <!-- 移动端抽屉菜单 -->
        <a-drawer
          v-model:visible="drawerVisible"
          placement="left"
          :width="240"
          :footer="false"
          :mask-closable="true"
          :body-style="{ padding: 0 }"
        >
          <div class="p-4 flex items-center justify-center border-b border-gray-200">
            <nuxt-link to="/dashboard" class="flex items-center justify-center" @click="drawerVisible = false">
              <img src="/logo.svg" class="h-8 mr-2" alt="Logo">
            </nuxt-link>
          </div>
          
          <a-menu
            :default-selected-keys="activeMenu"
            :default-open-keys="['sub1']"
            class="border-0"
          >
            <a-menu-item key="1">
              <template #icon><IconDashboard /></template>
              <nuxt-link to="/dashboard" @click="drawerVisible = false">仪表台</nuxt-link>
            </a-menu-item>
            <a-menu-item key="2">
              <template #icon><IconUser /></template>
              <nuxt-link to="/dashboard/users" @click="drawerVisible = false">用户管理</nuxt-link>
            </a-menu-item>
            <a-menu-item key="3">
              <template #icon><IconSettings /></template>
              <nuxt-link to="/dashboard/settings" @click="drawerVisible = false">系统设置</nuxt-link>
            </a-menu-item>
            <a-sub-menu key="sub1">
              <template #icon><IconApps /></template>
              <template #title>数据分析</template>
              <a-menu-item key="4">数据概览</a-menu-item>
              <a-menu-item key="5">流量分析</a-menu-item>
              <a-menu-item key="6">用户行为</a-menu-item>
            </a-sub-menu>
          </a-menu>
        </a-drawer>

        <a-layout class="dashboard-content-layout" :style="{ marginLeft: isMobile ? '0' : (collapsed ? '64px' : '240px') }">
          <!-- 头部工具栏 -->
          <a-layout-header class="bg-white flex items-center justify-between border-b border-gray-200 shadow-sm dashboard-header">
            <div class="flex items-center">
              <a-button
                type="text"
                shape="circle"
                @click="isMobile ? (drawerVisible = true) : (collapsed = !collapsed)"
                class="mr-4 hover:bg-gray-50"
              >
                <template #icon>
                  <IconMenu v-if="isMobile" />
                  <IconMenuFold v-else-if="!collapsed" />
                  <IconMenuUnfold v-else />
                </template>
              </a-button>
              <a-breadcrumb>
                <a-breadcrumb-item>首页</a-breadcrumb-item>
                <a-breadcrumb-item>{{ currentPageTitle }}</a-breadcrumb-item>
              </a-breadcrumb>
            </div>
            <div class="flex items-center">
              <a-space>
                <a-button shape="circle" type="text" class="hover:bg-gray-50">
                  <template #icon><IconNotification /></template>
                </a-button>
                <a-button shape="circle" type="text" class="hover:bg-gray-50 hidden sm:flex">
                  <template #icon><IconSettings /></template>
                </a-button>
                <a-dropdown trigger="click">
                  <div class="flex items-center cursor-pointer px-2 py-1 rounded-lg hover:bg-gray-50">
                    <a-avatar :size="32" v-if="userData">
                      <template v-if="userData.avatarUrl">
                        <img :src="userData.avatarUrl" alt="用户头像" />
                      </template>
                      <template v-else>
                        <IconUser />
                      </template>
                    </a-avatar>
                    <a-avatar :size="32" v-else>
                      <IconUser />
                    </a-avatar>
                    <span class="ml-2 text-sm hidden sm:inline">{{ userData ? userData.name : '加载中...' }}</span>
                    <IconDown class="ml-1 text-xs hidden sm:inline" />
                  </div>
                  <template #content>
                    <a-doption @click="$router.push('/dashboard/profile')">
                      <template #icon><IconUser /></template>
                      个人信息
                    </a-doption>
                    <a-doption @click="$router.push('/dashboard/settings?tab=account')">
                      <template #icon><IconSettings /></template>
                      账号设置
                    </a-doption>
                    <a-divider style="margin: 4px 0" />
                    <!-- 插槽允许在其他组件中扩展用户菜单 -->
                    <slot name="user-menu-items"></slot>
                    <a-doption @click="handleLogout">
                      <template #icon><IconExport /></template>
                      退出登录
                    </a-doption>
                  </template>
                </a-dropdown>
              </a-space>
            </div>
          </a-layout-header>

          <!-- 主要内容 -->
          <a-layout-content class="bg-gray-50 dashboard-content">
            <div class="dashboard-content-inner">
              <slot />
            </div>
          </a-layout-content>
        </a-layout>
      </a-layout>
    </a-config-provider>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAppwriteAccount } from '~/composables/useAppwriteAccount';
import { useAppwriteAvatar } from '~/composables/useAppwriteAvatar';

// 路由
const route = useRoute();
const router = useRouter();

// 侧边栏折叠状态
const collapsed = ref(false);
const isMobile = ref(false);
const drawerVisible = ref(false);

// 使用Appwrite账户服务
const { getCurrentUser, logout } = useAppwriteAccount();

// 使用Appwrite头像服务
const { getInitialsAvatar, getFavicon } = useAppwriteAvatar();

// 用户数据
const userData = ref<{
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  nameInitial: string;
} | null>(null);
const isLoading = ref(true);
const initialsAvatarUrl = ref<string | null>(null);

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
      
      // 设置用户数据对象
      userData.value = {
        id: user.$id,
        name: userName,
        email: user.email,
        avatarUrl,
        nameInitial,
      };
    } else {
      userData.value = null;
      console.log('用户未登录或会话已过期');
      // 不主动重定向，由auth中间件处理登录状态
    }
  } catch (error) {
    userData.value = null;
    console.error('获取用户数据失败:', error);
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

// 响应式处理
const handleResize = () => {
  isMobile.value = window.innerWidth < 768;
  if (isMobile.value) {
    collapsed.value = true;
  }
};

// 监听窗口大小变化
onMounted(() => {
  handleResize();
  window.addEventListener('resize', handleResize);
  fetchUserData();
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});

// 监听路由变化关闭抽屉
watch(
  () => route.path,
  () => {
    if (drawerVisible.value) {
      drawerVisible.value = false;
    }
  }
);
</script>

<style>
/* 整体布局 */
.dashboard-layout {
  height: 100vh;
  display: flex;
  overflow: hidden;
}

/* 侧边栏样式 */
.dashboard-sider {
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 100;
  background-color: white;
}

.dashboard-sider .arco-layout-sider-children {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.dashboard-menu-container {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

/* 内容区布局 */
.dashboard-content-layout {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  transition: margin-left 0.2s;
}

/* 头部样式 */
.dashboard-header {
  height: 64px;
  line-height: normal;
  padding: 0 16px;
  position: sticky;
  top: 0;
  z-index: 99;
}

/* 内容区域 */
.dashboard-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.dashboard-content-inner {
  max-width: 1600px;
  margin: 0 auto;
}

/* 页脚 */
.dashboard-footer {
  padding: 16px;
}

/* 菜单样式 */
.arco-menu {
  height: 100%;
}

.arco-menu-item a {
  color: inherit;
  text-decoration: none;
  display: block;
}

.arco-menu-dark .arco-menu-item.arco-menu-selected {
  background-color: rgba(var(--primary-6), 0.2);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .dashboard-header {
    height: 56px;
    padding: 0 12px;
  }
  
  .dashboard-content {
    padding: 16px;
  }
}
</style> 