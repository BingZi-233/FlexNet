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
          :selected-keys="selectedKeys"
          :open-keys="openKeys"
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
          :selected-keys="selectedKeys"
          :open-keys="openKeys"
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
      @open-drawer="openDrawer"
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
import { useRoute } from '#imports';
// 从类型定义文件中导入类型
import type { UserData, MenuItem, LayoutConfig } from '~/types/layout';
// 导入子组件
import DesktopSidebar from './sidebar/DesktopSidebar.vue';
import MobileSidebar from './sidebar/MobileSidebar.vue';
import HeaderNav from './header/HeaderNav.vue';
// 使用composables
import { useMenu } from '~/composables/useMenu';
import { useResponsiveLayout } from '~/composables/useResponsiveLayout';

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

// 使用菜单composable
const { selectedKeys, openKeys } = useMenu(
  props.menuConfig,
  props.defaultSelectedKeys,
  props.defaultOpenKeys
);

// 使用响应式布局composable
const { 
  isMobile, 
  drawerVisible, 
  collapsed, 
  toggleCollapse, 
  openDrawer,
  closeDrawer,
  getMainClass,
  getHeaderClass
} = useResponsiveLayout(props.mobileBreakpoint);

// 监视响应式状态变化并触发事件
watch(collapsed, (newValue) => {
  emit('collapse', newValue);
});

watch(isMobile, (newValue) => {
  emit('update:mobile', newValue);
});

// 计算属性 - 折叠按钮文本
const collapseButtonText = computed(() => 
  collapsed.value ? '展开菜单' : '收起菜单'
);

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
</script> 