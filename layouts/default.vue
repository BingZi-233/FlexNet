<template>
  <div>
    <a-config-provider>
      <a-layout class="min-h-screen">
        <!-- 头部导航 -->
        <a-layout-header class="bg-white border-b border-gray-200 sticky top-0 w-full z-10 px-0 transition-all duration-300">
          <div class="container mx-auto px-4 h-full flex items-center justify-between">
            <div class="flex items-center">
              <nuxt-link to="/" class="flex items-center">
                <img src="/logo.svg" class="h-8 hover:opacity-80 transition-opacity" alt="Logo">
              </nuxt-link>
            </div>
            <div class="hidden sm:flex items-center space-x-4">
              <nuxt-link to="/auth/login">
                <a-button type="text" class="hover:bg-gray-50 transition-colors">
                  <template #icon><IconUser /></template>
                  登录
                </a-button>
              </nuxt-link>
              <nuxt-link to="/auth/register">
                <a-button type="primary" class="hover:opacity-90 transition-opacity shadow-sm">
                  <template #icon><IconUserAdd /></template>
                  注册
                </a-button>
              </nuxt-link>
            </div>
            <div class="sm:hidden">
              <a-button type="text" shape="circle" @click="menuVisible = !menuVisible" class="hover:bg-gray-50 transition-colors">
                <template #icon><IconMenu /></template>
              </a-button>
            </div>
          </div>
          <!-- 移动端菜单 -->
          <a-drawer v-model:visible="menuVisible" placement="right" :width="250" :footer="false" :mask-closable="true">
            <div class="flex flex-col space-y-4 p-4">
              <nuxt-link to="/auth/login">
                <a-button type="text" long class="hover:bg-gray-50 transition-colors">
                  <template #icon><IconUser /></template>
                  登录
                </a-button>
              </nuxt-link>
              <nuxt-link to="/auth/register">
                <a-button type="primary" long class="hover:opacity-90 transition-opacity shadow-sm">
                  <template #icon><IconUserAdd /></template>
                  注册
                </a-button>
              </nuxt-link>
            </div>
          </a-drawer>
        </a-layout-header>

        <!-- 主要内容 -->
        <a-layout-content class="bg-gray-50">
          <slot />
        </a-layout-content>

        <!-- 页脚 -->
        <a-layout-footer class="bg-gray-100 py-6 sm:py-8">
          <div class="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p class="text-gray-500 text-xs sm:text-sm">© 2024 FlexNet. All rights reserved.</p>
            <div class="flex space-x-4 sm:space-x-6">
              <nuxt-link to="/about">
                <a-button type="text" size="mini" class="text-gray-600 hover:text-blue-600 transition-colors">
                  <template #icon><IconInfoCircle /></template>
                  关于我们
                </a-button>
              </nuxt-link>
              <nuxt-link to="/privacy">
                <a-button type="text" size="mini" class="text-gray-600 hover:text-blue-600 transition-colors">
                  <template #icon><IconFile /></template>
                  隐私政策
                </a-button>
              </nuxt-link>
              <nuxt-link to="/terms">
                <a-button type="text" size="mini" class="text-gray-600 hover:text-blue-600 transition-colors">
                  <template #icon><IconBookmark /></template>
                  用户协议
                </a-button>
              </nuxt-link>
            </div>
          </div>
        </a-layout-footer>
      </a-layout>
    </a-config-provider>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

// 移动端菜单状态
const menuVisible = ref(false);
// 这里可以添加全局逻辑
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* 自定义布局过渡效果 - 与首页保持一致 */
.custom-layout-enter-active,
.custom-layout-leave-active {
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  overflow-x: hidden;
}
.custom-layout-enter-from,
.custom-layout-leave-to {
  opacity: 0;
  filter: blur(12px);
  transform: scale(0.95);
}

.arco-layout-header {
  height: 64px;
  line-height: 64px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.arco-layout-content {
  min-height: calc(100vh - 64px - 88px);
}

@media (max-width: 640px) {
  .arco-layout-header {
    height: 56px;
    line-height: 56px;
  }
  
  .arco-layout-content {
    min-height: calc(100vh - 56px - 112px);
  }
}
</style>