<template>
  <div class="h-full w-full flex flex-col justify-center items-center">
    <!-- 实际项目中应使用 echarts 或其他图表库 -->
    <div class="relative h-48 w-48">
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="text-center">
          <div class="text-2xl font-bold">8,846</div>
          <div class="text-xs text-gray-500">总用户数</div>
        </div>
      </div>
      <svg viewBox="0 0 36 36" class="h-full w-full">
        <circle 
          cx="18" cy="18" r="15.91549430918954" 
          fill="transparent" 
          stroke="#f0f2f5" 
          stroke-width="3"
        ></circle>
        
        <!-- 第一段 - 男性 -->
        <circle 
          cx="18" cy="18" r="15.91549430918954" 
          fill="transparent" 
          stroke="#165DFF" 
          stroke-width="3"
          stroke-dasharray="45 100"
          stroke-dashoffset="25"
          class="transition-all duration-300 hover:opacity-80"
        ></circle>
        
        <!-- 第二段 - 女性 -->
        <circle 
          cx="18" cy="18" r="15.91549430918954" 
          fill="transparent" 
          stroke="#722ED1" 
          stroke-width="3"
          stroke-dasharray="30 100"
          stroke-dashoffset="-20"
          class="transition-all duration-300 hover:opacity-80"
        ></circle>
        
        <!-- 第三段 - 未知 -->
        <circle 
          cx="18" cy="18" r="15.91549430918954" 
          fill="transparent" 
          stroke="#0FC6C2" 
          stroke-width="3"
          stroke-dasharray="25 100"
          stroke-dashoffset="-50"
          class="transition-all duration-300 hover:opacity-80"
        ></circle>
      </svg>
    </div>
    
    <!-- 图例 -->
    <div class="flex justify-center space-x-6 mt-4">
      <div v-for="item in userData" :key="item.type" class="flex items-center">
        <div 
          class="w-3 h-3 rounded-sm mr-2"
          :style="{ backgroundColor: item.color }"
        ></div>
        <div class="text-xs">
          <span>{{ item.type }}</span>
          <span class="text-gray-500 ml-1">{{ item.percentage }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

// 模拟数据
const userData = ref([
  { type: '男性', value: 4523, percentage: '45%', color: '#165DFF' },
  { type: '女性', value: 3021, percentage: '30%', color: '#722ED1' },
  { type: '未知', value: 1302, percentage: '25%', color: '#0FC6C2' }
]);
</script> 