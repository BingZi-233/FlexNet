<template>
  <div class="min-h-screen flex flex-col md:flex-row bg-gray-50">
    <!-- 侧边栏 - 桌面版 -->
    <DesktopSidebar 
      v-if="!isMobile" 
      :config="sidebarConfig"
      @toggle-collapse="toggleCollapse"
    >
      <template #menu>
        <a-menu
          :default-selected-keys="defaultSelectedKeys"
          :default-open-keys="defaultOpenKeys"
          :collapsed="collapsed"
          class="border-0"
        >
          <template v-for="item in menuConfig" :key="item.key">
            <!-- 使用三个独立的 template 块，每个对应一种类型 -->
            <template v-if="item.children && item.children.length > 0">
              <a-sub-menu :key="item.key">
                <template #icon v-if="item.icon">
                  <component :is="item.icon" />
                </template>
                <template #title>{{ item.title }}</template>
                <template v-for="child in item.children" :key="child.key">
                  <!-- 子菜单项也使用独立的 template -->
                  <template v-if="child.divider">
                    <a-divider :key="`${child.key}-divider`" style="margin: 4px 0" />
                  </template>
                  
                  <template v-else>
                    <a-menu-item :key="child.key">
                      <nuxt-link v-if="child.route" :to="child.route">{{ child.title }}</nuxt-link>
                      <span v-else>{{ child.title }}</span>
                    </a-menu-item>
                  </template>
                </template>
              </a-sub-menu>
            </template>
            
            <template v-else-if="item.divider">
              <a-divider :key="`${item.key}-divider`" style="margin: 4px 0" />
            </template>
            
            <template v-else>
              <a-menu-item :key="item.key">
                <template #icon v-if="item.icon">
                  <component :is="item.icon" />
                </template>
                <nuxt-link v-if="item.route" :to="item.route">{{ item.title }}</nuxt-link>
                <span v-else>{{ item.title }}</span>
              </a-menu-item>
            </template>
          </template>
        </a-menu>
      </template>
      
      <template #sider-footer>
        <slot name="sider-footer"></slot>
      </template>
    </DesktopSidebar>

    <!-- 移动端抽屉菜单 -->
    <MobileSidebar
      v-model:visible="drawerVisible"
      :config="mobileConfig"
    >
      <template #drawer-menu>
        <a-menu
          :default-selected-keys="defaultSelectedKeys"
          :default-open-keys="defaultOpenKeys"
          class="border-0"
        >
          <template v-for="item in menuConfig" :key="item.key">
            <!-- 使用三个独立的 template 块，每个对应一种类型 -->
            <template v-if="item.children && item.children.length > 0">
              <a-sub-menu :key="item.key">
                <template #icon v-if="item.icon">
                  <component :is="item.icon" />
                </template>
                <template #title>{{ item.title }}</template>
                <template v-for="child in item.children" :key="child.key">
                  <!-- 子菜单项也使用独立的 template -->
                  <template v-if="child.divider">
                    <a-divider :key="`${child.key}-divider`" style="margin: 4px 0" />
                  </template>
                  
                  <template v-else>
                    <a-menu-item :key="child.key">
                      <nuxt-link v-if="child.route" :to="child.route" @click="closeDrawer">{{ child.title }}</nuxt-link>
                      <span v-else>{{ child.title }}</span>
                    </a-menu-item>
                  </template>
                </template>
              </a-sub-menu>
            </template>
            
            <template v-else-if="item.divider">
              <a-divider :key="`${item.key}-divider`" style="margin: 4px 0" />
            </template>
            
            <template v-else>
              <a-menu-item :key="item.key">
                <template #icon v-if="item.icon">
                  <component :is="item.icon" />
                </template>
                <nuxt-link v-if="item.route" :to="item.route" @click="closeDrawer">{{ item.title }}</nuxt-link>
                <span v-else>{{ item.title }}</span>
              </a-menu-item>
            </template>
          </template>
        </a-menu>
      </template>
      
      <template #drawer-footer>
        <slot name="drawer-footer"></slot>
      </template>
    </MobileSidebar>

    <!-- 顶部导航 - 固定在顶部 -->
    <HeaderNav 
      :class="getHeaderClass" 
      :config="headerConfig"
      @open-drawer="drawerVisible = true"
    >
      <template #user-dropdown>
        <slot name="user-dropdown"></slot>
      </template>
    </HeaderNav>

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

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useRoute } from '#imports';
import { useStorage, useBreakpoints } from '@vueuse/core';

// 导入子组件
import DesktopSidebar from './sidebar/DesktopSidebar.vue';
import MobileSidebar from './sidebar/MobileSidebar.vue';
import HeaderNav from './header/HeaderNav.vue';

// 定义组件配置类型
interface UserData {
  name?: string;
  avatarUrl?: string;
  [key: string]: any;
}

interface MenuItem {
  key: string;
  title: string;
  icon?: any; // 直接接收图标组件
  route?: string;
  children?: MenuItem[];
  divider?: boolean;
}

interface LayoutConfig {
  headerTitle: string;
  breadcrumbTitle: string;
  homeRoute: string;
  currentPageTitle: string;
  appVersion?: string;
  showNotifications?: boolean;
  showSettings?: boolean;
  showUserProfile?: boolean;
}

const props = defineProps({
  userData: {
    type: Object as () => UserData,
    default: () => null
  },
  layoutConfig: {
    type: Object as () => LayoutConfig,
    required: true
  },
  menuConfig: {
    type: Array as () => MenuItem[],
    default: () => []
  },
  defaultCollapsed: {
    type: Boolean,
    default: false
  },
  defaultSelectedKeys: {
    type: Array as () => string[],
    default: () => ['1']
  },
  defaultOpenKeys: {
    type: Array as () => string[],
    default: () => []
  },
  mobileBreakpoint: {
    type: Number,
    default: 768
  }
});

// 提供自定义事件
const emit = defineEmits(['collapse', 'update:mobile']);

// 响应式状态管理
const collapsed = useStorage('dashboard-sidebar-collapsed', props.defaultCollapsed);
const wasCollapsedBeforeMobile = useStorage('dashboard-sidebar-collapsed-before-mobile', props.defaultCollapsed);
const drawerVisible = ref(false);

// 响应式断点管理
const breakpoints = useBreakpoints({
  mobile: props.mobileBreakpoint
});
const isMobile = breakpoints.smaller('mobile');

// 路由
const route = useRoute();

// 计算属性 - 根据状态获取头部类名
const getHeaderClass = computed(() => 
  isMobile.value ? 'left-0' : (collapsed.value ? 'md:left-16' : 'md:left-60')
);

// 计算属性 - 获取主内容区的类名
const getMainClass = computed(() => 
  isMobile.value ? '' : (collapsed.value ? 'md:ml-16' : 'md:ml-60')
);

// 计算属性 - 折叠按钮文本
const collapseButtonText = computed(() => 
  collapsed.value ? '展开菜单' : '收起菜单'
);

// 关闭抽屉
const closeDrawer = () => {
  drawerVisible.value = false;
};

// 对象化配置 - 侧边栏配置
const sidebarConfig = computed(() => ({
  collapsed: collapsed.value,
  headerTitle: props.layoutConfig.headerTitle,
  homeRoute: props.layoutConfig.homeRoute,
  collapseButtonText: collapseButtonText.value
}));

// 对象化配置 - 移动端配置
const mobileConfig = computed(() => ({
  headerTitle: props.layoutConfig.headerTitle,
  homeRoute: props.layoutConfig.homeRoute
}));

// 对象化配置 - 顶部导航配置
const headerConfig = computed(() => ({
  isMobile: isMobile.value,
  showNotifications: props.layoutConfig.showNotifications ?? true,
  showSettings: props.layoutConfig.showSettings ?? true,
  showUserProfile: props.layoutConfig.showUserProfile ?? true,
  userData: props.userData
}));

// 折叠状态控制
const toggleCollapse = () => {
  collapsed.value = !collapsed.value;
  emit('collapse', collapsed.value);
};

// 响应式处理
watch(isMobile, (newIsMobile, oldIsMobile) => {
  if (newIsMobile) {
    wasCollapsedBeforeMobile.value = collapsed.value;
    collapsed.value = true;
  } else if (oldIsMobile) {
    collapsed.value = wasCollapsedBeforeMobile.value;
  }
  
  emit('update:mobile', newIsMobile);
});

// 监听路由变化关闭抽屉
watch(() => route.path, () => {
  drawerVisible.value = false;
});
</script> 