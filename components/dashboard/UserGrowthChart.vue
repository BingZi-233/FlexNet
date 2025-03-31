<template>
  <div class="h-full w-full">
    <!-- 实际项目中应使用 echarts 或其他图表库 -->
    <div class="flex items-end h-full w-full justify-between px-4">
      <div v-for="(item, index) in mockData" :key="index" class="flex flex-col items-center">
        <div class="h-6 text-xs text-gray-500">{{ item.value }}</div>
        <div 
          class="w-8 bg-blue-500 rounded-t-sm transition-all duration-300 hover:bg-blue-600"
          :style="{ height: `${item.value / maxValue * 80}%` }"
        ></div>
        <div class="h-6 text-xs mt-2 text-gray-500">{{ item.date }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';

// 模拟数据
const mockData = ref([
  { date: '周一', value: 120 },
  { date: '周二', value: 180 },
  { date: '周三', value: 150 },
  { date: '周四', value: 200 },
  { date: '周五', value: 250 },
  { date: '周六', value: 180 },
  { date: '周日', value: 220 }
]);

// 计算最大值
const maxValue = computed(() => {
  return Math.max(...mockData.value.map(item => item.value));
});
</script> 