<template>
  <header class="bg-white h-16 flex items-center px-4 fixed top-0 right-0 left-0 z-20 border-b border-gray-200 shadow-sm transition-all duration-300">
    <div class="flex items-center justify-between w-full">
      <!-- 左侧移动端菜单按钮 -->
      <button 
        v-if="config.isMobile"
        class="flex items-center justify-center w-10 h-10 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors"
        @click="$emit('open-drawer')"
      >
        <IconMenu class="w-5 h-5" />
      </button>
      
      <!-- 中间内容 - 可以放置标题或自定义内容 -->
      <div class="flex-1 flex justify-center md:justify-start">
        <slot name="header-content"></slot>
      </div>
      
      <!-- 右侧用户区 -->
      <div class="flex items-center space-x-3">
        <a-button v-if="config.showNotifications" shape="circle" type="text" class="hover:bg-gray-50 transition-colors">
          <template #icon><IconNotification /></template>
        </a-button>
        <a-button v-if="config.showSettings" shape="circle" type="text" class="hover:bg-gray-50 transition-colors hidden sm:flex">
          <template #icon><IconSettings /></template>
        </a-button>
        
        <!-- 用户下拉菜单 -->
        <a-dropdown v-if="config.showUserProfile" trigger="click">
          <div class="flex items-center cursor-pointer px-2 py-1 rounded-lg hover:bg-gray-50 transition-colors">
            <a-avatar :size="32" v-if="config.userData">
              <template v-if="config.userData.avatarUrl">
                <img :src="config.userData.avatarUrl" alt="用户头像" />
              </template>
              <template v-else>
                <IconUser />
              </template>
            </a-avatar>
            <a-avatar :size="32" v-else>
              <IconUser />
            </a-avatar>
            <span class="ml-2 text-sm hidden sm:inline">{{ config.userData ? config.userData.name : '加载中...' }}</span>
            <IconDown class="ml-1 text-xs hidden sm:inline" />
          </div>
          <template #content>
            <slot name="user-dropdown"></slot>
          </template>
        </a-dropdown>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import type { HeaderConfig } from '~/types/layout';

defineProps({
  config: {
    type: Object as () => HeaderConfig,
    required: true
  }
});

defineEmits(['open-drawer']);
</script> 