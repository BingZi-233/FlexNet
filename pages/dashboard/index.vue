<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">仪表台概览</h1>
    
    <!-- 数据卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
      <a-card class="hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 mb-1">总用户数</p>
            <p class="text-2xl font-bold">8,846</p>
            <div class="flex items-center mt-2">
              <IconUp class="text-green-500 text-xs mr-1" />
              <span class="text-xs text-green-500">8.2%</span>
              <span class="text-xs text-gray-400 ml-1">较上周</span>
            </div>
          </div>
          <div class="bg-blue-50 p-3 rounded-lg">
            <IconUser class="text-blue-500 text-2xl" />
          </div>
        </div>
      </a-card>
      
      <a-card class="hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 mb-1">今日活跃</p>
            <p class="text-2xl font-bold">1,257</p>
            <div class="flex items-center mt-2">
              <IconUp class="text-green-500 text-xs mr-1" />
              <span class="text-xs text-green-500">12.5%</span>
              <span class="text-xs text-gray-400 ml-1">较昨日</span>
            </div>
          </div>
          <div class="bg-green-50 p-3 rounded-lg">
            <IconUserGroup class="text-green-500 text-2xl" />
          </div>
        </div>
      </a-card>
      
      <a-card class="hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 mb-1">总收入</p>
            <p class="text-2xl font-bold">¥123,456</p>
            <div class="flex items-center mt-2">
              <IconDown class="text-red-500 text-xs mr-1" />
              <span class="text-xs text-red-500">2.3%</span>
              <span class="text-xs text-gray-400 ml-1">较上月</span>
            </div>
          </div>
          <div class="bg-purple-50 p-3 rounded-lg">
            <IconMoney class="text-purple-500 text-2xl" />
          </div>
        </div>
      </a-card>
      
      <a-card class="hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 mb-1">转化率</p>
            <p class="text-2xl font-bold">24.8%</p>
            <div class="flex items-center mt-2">
              <IconUp class="text-green-500 text-xs mr-1" />
              <span class="text-xs text-green-500">4.1%</span>
              <span class="text-xs text-gray-400 ml-1">较上季度</span>
            </div>
          </div>
          <div class="bg-amber-50 p-3 rounded-lg">
            <IconPercentage class="text-amber-500 text-2xl" />
          </div>
        </div>
      </a-card>
    </div>
    
    <!-- 图表区域 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
      <a-card class="lg:col-span-2">
        <template #title>
          <div class="flex items-center justify-between">
            <span>用户增长趋势</span>
            <a-select default-value="week" size="small" style="width: 100px">
              <a-option value="day">日</a-option>
              <a-option value="week">周</a-option>
              <a-option value="month">月</a-option>
              <a-option value="year">年</a-option>
            </a-select>
          </div>
        </template>
        <div class="h-64">
          <client-only>
            <DashboardUserGrowthChart />
            <template #fallback>
              <div class="flex items-center justify-center h-full">
                <a-spin />
              </div>
            </template>
          </client-only>
        </div>
      </a-card>
      
      <a-card>
        <template #title>用户分布</template>
        <div class="h-64">
          <client-only>
            <DashboardUserDistributionChart />
            <template #fallback>
              <div class="flex items-center justify-center h-full">
                <a-spin />
              </div>
            </template>
          </client-only>
        </div>
      </a-card>
    </div>
    
    <!-- 最近活动 -->
    <a-card>
      <template #title>
        <div class="flex items-center justify-between">
          <span>最近活动</span>
          <a-button type="text" size="small">查看全部</a-button>
        </div>
      </template>
      <a-table :data="activityData" :pagination="false" :bordered="false">
        <template #columns>
          <a-table-column title="用户" data-index="user">
            <template #cell="{ record }">
              <div class="flex items-center">
                <a-avatar :size="28" :style="{ backgroundColor: record.avatarColor }">
                  {{ record.avatarText }}
                </a-avatar>
                <span class="ml-2">{{ record.user }}</span>
              </div>
            </template>
          </a-table-column>
          <a-table-column title="活动" data-index="activity" />
          <a-table-column title="时间" data-index="time" />
          <a-table-column title="状态" data-index="status">
            <template #cell="{ record }">
              <a-tag :color="getStatusColor(record.status)">
                {{ record.status }}
              </a-tag>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

definePageMeta({
  layout: 'dashboard'
});

// 模拟活动数据
const activityData = ref([
  {
    user: '张三',
    avatarText: '张',
    avatarColor: '#165DFF',
    activity: '登录系统',
    time: '10分钟前',
    status: '成功'
  },
  {
    user: '李四',
    avatarText: '李',
    avatarColor: '#722ED1',
    activity: '更新个人资料',
    time: '23分钟前',
    status: '成功'
  },
  {
    user: '王五',
    avatarText: '王',
    avatarColor: '#0FC6C2',
    activity: '提交订单',
    time: '1小时前',
    status: '处理中'
  },
  {
    user: '赵六',
    avatarText: '赵',
    avatarColor: '#F5222D',
    activity: '删除文件',
    time: '1小时前',
    status: '失败'
  },
  {
    user: '钱七',
    avatarText: '钱',
    avatarColor: '#FF7D00',
    activity: '修改密码',
    time: '2小时前',
    status: '成功'
  }
]);

// 获取状态颜色
const getStatusColor = (status: string) => {
  switch (status) {
    case '成功':
      return 'green';
    case '处理中':
      return 'blue';
    case '失败':
      return 'red';
    default:
      return 'gray';
  }
};
</script> 