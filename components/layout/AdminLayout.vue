<template>
  <div class="min-h-screen flex flex-col md:flex-row bg-gray-50">
    <!-- 侧边栏 - 桌面版 -->
    <aside 
      v-if="!isMobile" 
      class="bg-white border-r border-gray-200 transition-all duration-300 h-screen overflow-y-auto fixed top-0 left-0 z-10"
      :class="[collapsed ? 'w-16' : 'w-60']"
    >
      <!-- Logo区域 -->
      <div class="h-16 border-b border-gray-100 p-4 flex items-center sticky top-0 bg-white z-10" :class="[collapsed ? 'justify-center' : 'justify-start']">
        <nuxt-link :to="homeRoute" class="flex items-center">
          <img src="/logo.svg" :class="[collapsed ? 'h-8' : 'h-8 mr-2']" alt="Logo">
          <span v-if="!collapsed && headerTitle" class="text-gray-800 font-bold text-base truncate">{{ headerTitle }}</span>
        </nuxt-link>
      </div>
      
      <!-- 折叠控制按钮 - 仅在非移动设备显示 -->
      <div v-if="!isMobile" class="px-4 py-2">
        <a-button 
          type="text" 
          class="w-full flex items-center h-10 transition-all duration-300 hover:bg-gray-50"
          :class="[
            collapsed ? 'justify-center' : 'justify-between', 
            'group'
          ]"
          @click="toggleCollapse"
        >
          <span class="flex items-center">
            <IconMenuFold v-if="!collapsed" class="transition-transform duration-300 group-hover:scale-110" />
            <IconMenuUnfold v-else class="transition-transform duration-300 group-hover:scale-110" />
            <span v-if="!collapsed" class="ml-2 text-sm">{{ collapseButtonText }}</span>
          </span>
        </a-button>
      </div>
      
      <!-- 菜单区域 -->
      <div class="flex flex-col">
        <div class="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
          <slot name="menu"></slot>
        </div>
        
        <!-- 底部信息 -->
        <div v-if="!collapsed" class="p-4 border-t border-gray-100 text-xs text-gray-500 sticky bottom-0 bg-white">
          <slot name="sider-footer">
            <div class="flex items-center justify-between">
              <span>© {{ new Date().getFullYear() }}</span>
              <span>v{{ appVersion || '1.0.0' }}</span>
            </div>
          </slot>
        </div>
      </div>
    </aside>

    <!-- 移动端抽屉菜单 -->
    <a-drawer
      v-model:visible="drawerVisible"
      placement="left"
      :width="240"
      :footer="false"
      :mask-closable="true"
      :body-style="{ padding: 0 }"
    >
      <!-- 抽屉头部 -->
      <div class="h-16 p-4 flex items-center justify-between border-b border-gray-200 sticky top-0 bg-white z-10">
        <nuxt-link :to="homeRoute" class="flex items-center" @click="drawerVisible = false">
          <img src="/logo.svg" class="h-8 mr-2" alt="Logo">
          <span class="text-gray-800 font-bold">{{ headerTitle }}</span>
        </nuxt-link>
        <a-button type="text" shape="circle" @click="drawerVisible = false">
          <template #icon><IconClose /></template>
        </a-button>
      </div>
      
      <!-- 抽屉菜单 -->
      <div class="overflow-y-auto overflow-x-hidden">
        <slot name="drawer-menu"></slot>
      </div>
      
      <!-- 抽屉底部 -->
      <div class="p-4 border-t border-gray-100 text-xs text-gray-500 sticky bottom-0 bg-white">
        <slot name="drawer-footer">
          <div class="flex items-center justify-between">
            <span>© {{ new Date().getFullYear() }}</span>
            <span>v{{ appVersion || '1.0.0' }}</span>
          </div>
        </slot>
      </div>
    </a-drawer>

    <!-- 顶部导航 - 固定在顶部 -->
    <header class="bg-white h-16 flex items-center px-4 fixed top-0 right-0 left-0 z-20 border-b border-gray-200 shadow-sm transition-all duration-300" :class="getHeaderClass">
      <div class="flex items-center justify-between w-full">
        <!-- 左侧移动端菜单按钮 -->
        <button 
          v-if="isMobile"
          class="flex items-center justify-center w-10 h-10 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors"
          @click="drawerVisible = true"
        >
          <IconMenu class="w-5 h-5" />
        </button>
        
        <!-- 中间内容 - 可以放置标题或自定义内容 -->
        <div class="flex-1 flex justify-center md:justify-start">
          <slot name="header-content">
            <h1 class="text-lg font-medium text-gray-800">{{ currentPageTitle }}</h1>
          </slot>
        </div>
        
        <!-- 右侧用户区 -->
        <div class="flex items-center space-x-3">
          <a-button v-if="showNotifications" shape="circle" type="text" class="hover:bg-gray-50 transition-colors">
            <template #icon><IconNotification /></template>
          </a-button>
          <a-button v-if="showSettings" shape="circle" type="text" class="hover:bg-gray-50 transition-colors hidden sm:flex">
            <template #icon><IconSettings /></template>
          </a-button>
          
          <!-- 用户下拉菜单 -->
          <a-dropdown v-if="showUserProfile" trigger="click">
            <div class="flex items-center cursor-pointer px-2 py-1 rounded-lg hover:bg-gray-50 transition-colors">
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
              <slot name="user-dropdown"></slot>
            </template>
          </a-dropdown>
        </div>
      </div>
    </header>

    <!-- 主内容区 -->
    <main class="flex-1 flex flex-col pt-16 transition-all duration-300" :class="getMainClass">
      <!-- 页面内容 -->
      <div class="flex-1 p-4 md:p-6 bg-gray-50">
        <div class="max-w-7xl mx-auto w-full">
          <slot />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, computed, useSlots, nextTick } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps({
  userData: {
    type: Object,
    default: () => null
  },
  headerTitle: {
    type: String,
    default: ''
  },
  breadcrumbTitle: {
    type: String,
    default: '首页'
  },
  homeRoute: {
    type: String,
    default: '/'
  },
  currentPageTitle: {
    type: String,
    default: ''
  },
  appVersion: {
    type: String,
    default: ''
  },
  showNotifications: {
    type: Boolean,
    default: true
  },
  showSettings: {
    type: Boolean,
    default: true
  },
  showUserProfile: {
    type: Boolean,
    default: true
  },
  defaultCollapsed: {
    type: Boolean,
    default: false
  },
  mobileBreakpoint: {
    type: Number,
    default: 768
  }
});

// 提供自定义事件
const emit = defineEmits(['collapse', 'update:mobile']);

// 状态管理
const collapsed = ref(props.defaultCollapsed);
const isMobile = ref(false);
const wasCollapsedBeforeMobile = ref(props.defaultCollapsed);
const drawerVisible = ref(false);

// 路由
const route = useRoute();
const slots = useSlots();

// 计算属性 - 检查菜单插槽是否存在
const hasMenu = computed(() => !!slots.menu);
const hasDrawerMenu = computed(() => !!slots['drawer-menu']);

// 计算属性 - 根据状态获取头部类名
const getHeaderClass = computed(() => {
  if (isMobile.value) {
    return 'left-0';
  } else {
    return collapsed.value ? 'md:left-16' : 'md:left-60';
  }
});

// 计算属性 - 获取主内容区的类名
const getMainClass = computed(() => {
  if (isMobile.value) {
    return '';
  } else {
    return collapsed.value ? 'md:ml-16' : 'md:ml-60';
  }
});

// 计算属性 - 折叠按钮文本
const collapseButtonText = computed(() => {
  return collapsed.value ? '展开菜单' : '收起菜单';
});

// 切换折叠状态
const toggleCollapse = () => {
  setCollapsed(!collapsed.value);
};

// 设置折叠状态
const setCollapsed = (value) => {
  collapsed.value = value;
  emit('collapse', collapsed.value);
  saveCollapseState();
};

// 保存折叠状态到本地存储
const saveCollapseState = () => {
  if (process.client) {
    localStorage.setItem('admin-sidebar-collapsed', collapsed.value);
  }
};

// 从本地存储恢复状态
const restoreUserPreferences = () => {
  if (process.client) {
    const savedCollapsed = localStorage.getItem('admin-sidebar-collapsed');
    if (savedCollapsed !== null) {
      // 使用重构后的方法设置折叠状态
      setCollapsed(savedCollapsed === 'true');
      wasCollapsedBeforeMobile.value = collapsed.value;
    }
  }
};

// 响应式处理
const handleResize = () => {
  const windowWidth = window.innerWidth;
  const newIsMobile = windowWidth < props.mobileBreakpoint;
  
  // 如果移动状态发生变化
  if (newIsMobile !== isMobile.value) {
    if (newIsMobile) {
      // 进入移动模式时，记住之前的折叠状态
      wasCollapsedBeforeMobile.value = collapsed.value;
      // 移动设备强制折叠侧边栏
      setCollapsed(true);
    } else {
      // 退出移动模式时，恢复之前的折叠状态
      nextTick(() => {
        setCollapsed(wasCollapsedBeforeMobile.value);
      });
    }
    
    isMobile.value = newIsMobile;
    emit('update:mobile', isMobile.value);
  }
};

// 监听窗口大小变化
onMounted(() => {
  restoreUserPreferences();
  handleResize();
  window.addEventListener('resize', handleResize);
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
/* 自定义滚动条隐藏类 */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style> 