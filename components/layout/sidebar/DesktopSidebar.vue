<template>
  <aside 
    class="bg-white border-r border-gray-200 transition-all duration-300 h-screen overflow-hidden fixed top-0 left-0 z-10 flex flex-col"
    :class="[config.collapsed ? 'w-16' : 'w-60']"
  >
    <!-- Logo区域 -->
    <div class="h-16 border-b border-gray-100 p-4 flex items-center sticky top-0 bg-white z-10" 
         :class="[config.collapsed ? 'justify-center' : 'justify-start']">
      <nuxt-link :to="config.homeRoute" class="flex items-center">
        <img :src="config.collapsed ? '/favicon.svg' : '/logo.svg'" 
             :class="[config.collapsed ? 'h-8' : 'h-8 mr-2']" 
             alt="Logo">
        <span v-if="!config.collapsed && config.headerTitle" class="text-gray-800 font-bold text-base truncate">
          {{ config.headerTitle }}
        </span>
      </nuxt-link>
    </div>
    
    <!-- 折叠控制按钮 -->
    <div class="px-4 py-2 border-b border-gray-100">
      <a-button 
        type="text" 
        class="w-full flex items-center h-10 transition-all duration-300 hover:bg-gray-50"
        :class="[
          config.collapsed ? 'justify-center' : 'justify-between', 
          'group'
        ]"
        @click="$emit('toggle-collapse')"
      >
        <span class="flex items-center">
          <IconMenuFold v-if="!config.collapsed" class="transition-transform duration-300 group-hover:scale-110" />
          <IconMenuUnfold v-else class="transition-transform duration-300 group-hover:scale-110" />
          <span v-if="!config.collapsed" class="ml-2 text-sm">{{ config.collapseButtonText }}</span>
        </span>
      </a-button>
    </div>
    
    <!-- 菜单区域 -->
    <div class="flex-1 overflow-hidden flex flex-col min-h-0">
      <!-- 菜单可滚动区域 -->
      <div class="flex-1 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div class="py-2" :class="[config.collapsed ? 'px-2' : 'px-4']">
          <slot name="menu"></slot>
        </div>
      </div>
      
      <!-- 底部信息 - 始终固定在底部 -->
      <div class="border-t border-gray-100 bg-white mt-auto" :class="[config.collapsed ? 'p-2 flex justify-center' : 'p-4']">
        <slot name="sider-footer"></slot>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
interface SidebarConfig {
  collapsed: boolean;
  headerTitle: string;
  homeRoute: string;
  collapseButtonText: string;
}

defineProps({
  config: {
    type: Object as () => SidebarConfig,
    required: true
  }
});

defineEmits(['toggle-collapse']);
</script> 