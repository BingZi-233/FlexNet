<template>
  <a-drawer
    :visible="visible"
    placement="left"
    :width="240"
    :footer="false"
    :mask-closable="true"
    :body-style="{ padding: 0 }"
    @update:visible="onVisibleChange"
  >
    <!-- 抽屉头部 -->
    <div class="h-16 p-4 flex items-center justify-between border-b border-gray-200 sticky top-0 bg-white z-10">
      <nuxt-link :to="config.homeRoute" class="flex items-center" @click="closeDrawer">
        <img src="/logo.svg" class="h-8 mr-2" alt="Logo">
        <span class="text-gray-800 font-bold">{{ config.headerTitle }}</span>
      </nuxt-link>
      <a-button type="text" shape="circle" @click="closeDrawer">
        <template #icon><IconClose /></template>
      </a-button>
    </div>
    
    <!-- 抽屉菜单 -->
    <div class="flex-1 overflow-y-auto overflow-x-hidden flex flex-col min-h-0">
      <div class="py-2 px-4">
        <slot name="drawer-menu"></slot>
      </div>
    </div>
    
    <!-- 抽屉底部 -->
    <div class="p-4 border-t border-gray-100 bg-white mt-auto">
      <slot name="drawer-footer"></slot>
    </div>
  </a-drawer>
</template>

<script setup lang="ts">
import type { MobileConfig } from '~/types/layout';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  config: {
    type: Object as () => MobileConfig,
    required: true
  }
});

const emit = defineEmits(['update:visible']);

const closeDrawer = () => {
  emit('update:visible', false);
};

const onVisibleChange = (val: boolean) => {
  emit('update:visible', val);
};
</script> 