<template>
  <div class="bg-white dark:bg-gray-900 min-h-screen">
    <!-- 顶部导航 -->
    <div class="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 px-6 py-3">
      <h1 class="text-2xl font-medium text-primary">插件授权概览</h1>
    </div>

    <!-- 仪表盘内容 -->
    <div class="max-w-7xl mx-auto px-6 py-8">
      <!-- 顶部描述区域 -->
      <div class="text-center mb-10">
        <h2 class="text-2xl font-bold mb-2">FlexNet 授权管理系统</h2>
        <p class="text-gray-500 max-w-2xl mx-auto">
          全面的插件授权管理平台，实时监控授权状态、使用情况及收益数据，帮助您优化授权策略和收入流。
        </p>
        <div class="mt-6">
          <a-button type="primary" class="rounded-full px-6">
            导出授权报告
          </a-button>
        </div>
      </div>

      <!-- 数据卡片网格 -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- 环形图卡片 -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
          <p class="text-sm font-medium mb-4">授权活跃率</p>
          <div class="flex items-center justify-center">
            <div class="relative w-32 h-32">
              <!-- 环形图背景 -->
              <div class="absolute inset-0 rounded-full border-8 border-gray-100 dark:border-gray-700"></div>
              <!-- 环形图数据部分 - 47% -->
              <div class="absolute inset-0 rounded-full border-8 border-transparent border-t-red-500 border-r-red-500 border-b-red-500 transform rotate-[55deg]"></div>
              <!-- 中心内容 -->
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="text-center">
                  <span class="text-3xl font-bold text-red-500">47%</span>
                </div>
              </div>
            </div>
          </div>
          <div class="flex items-center justify-center space-x-4 mt-4">
            <div class="flex items-center">
              <div class="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
              <span class="text-xs text-gray-500">活跃授权</span>
            </div>
            <div class="flex items-center">
              <div class="w-3 h-3 rounded-full bg-gray-200 dark:bg-gray-600 mr-1"></div>
              <span class="text-xs text-gray-500">未使用</span>
            </div>
          </div>
        </div>

        <!-- 曲线图卡片 -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
          <p class="text-sm font-medium mb-4">授权趋势</p>
          <div class="h-32 relative">
            <!-- 简化的趋势线 -->
            <svg class="w-full h-full" viewBox="0 0 100 50">
              <polyline 
                points="0,40 10,35 20,38 30,30 40,32 50,25 60,15 70,20 80,10 90,5 100,15" 
                fill="none" 
                stroke="#f87171" 
                stroke-width="2" 
                class="trend-line"
              />
              <polyline 
                points="0,45 10,42 20,44 30,40 40,38 50,42 60,35 70,30 80,32 90,25 100,20" 
                fill="none" 
                stroke="#60a5fa" 
                stroke-width="2" 
                class="trend-line"
              />
              <polyline 
                points="0,35 10,40 20,30 30,35 40,25 50,30 60,25 70,15 80,20 90,15 100,10" 
                fill="none" 
                stroke="#34d399" 
                stroke-width="2" 
                class="trend-line"
              />
            </svg>
          </div>
          <div class="flex items-center justify-between mt-4">
            <div class="flex items-center">
              <div class="w-3 h-3 rounded-full bg-red-400 mr-1"></div>
              <span class="text-xs text-gray-500">新增授权</span>
            </div>
            <div class="flex items-center">
              <div class="w-3 h-3 rounded-full bg-blue-400 mr-1"></div>
              <span class="text-xs text-gray-500">更新授权</span>
            </div>
            <div class="flex items-center">
              <div class="w-3 h-3 rounded-full bg-green-400 mr-1"></div>
              <span class="text-xs text-gray-500">活跃使用</span>
            </div>
          </div>
        </div>

        <!-- 饼图卡片 -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
          <p class="text-sm font-medium mb-4">授权类型分布</p>
          <div class="flex justify-center">
            <div class="relative w-32 h-32">
              <svg viewBox="0 0 100 100" class="w-full h-full">
                <!-- 蓝色部分 - 45% -->
                <circle cx="50" cy="50" r="45" fill="transparent" stroke-width="10" stroke="blue" stroke-dasharray="282.7 282.7" stroke-dashoffset="155.5" />
                <!-- 黄色部分 - 30% -->
                <circle cx="50" cy="50" r="45" fill="transparent" stroke-width="10" stroke="gold" stroke-dasharray="282.7 282.7" stroke-dashoffset="84.8" transform="rotate(-130 50 50)" />
                <!-- 红色部分 - 25% -->
                <circle cx="50" cy="50" r="45" fill="transparent" stroke-width="10" stroke="red" stroke-dasharray="282.7 282.7" stroke-dashoffset="212" transform="rotate(120 50 50)" />
              </svg>
            </div>
          </div>
          <div class="flex items-center justify-between mt-4">
            <div class="flex items-center">
              <div class="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
              <span class="text-xs text-gray-500">试用版</span>
            </div>
            <div class="flex items-center">
              <div class="w-3 h-3 rounded-full bg-yellow-400 mr-1"></div>
              <span class="text-xs text-gray-500">标准版</span>
            </div>
            <div class="flex items-center">
              <div class="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
              <span class="text-xs text-gray-500">专业版</span>
            </div>
          </div>
        </div>

        <!-- 进度条卡片 -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
          <p class="text-sm font-medium mb-4">插件排行榜</p>
          <div class="space-y-4">
            <div>
              <div class="flex justify-between text-xs mb-1">
                <span>插件A</span>
                <span>64,216</span>
              </div>
              <div class="h-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                <div class="h-full bg-blue-400 rounded-full" style="width: 85%"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between text-xs mb-1">
                <span>插件B</span>
                <span>32,109</span>
              </div>
              <div class="h-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                <div class="h-full bg-blue-400 rounded-full" style="width: 65%"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between text-xs mb-1">
                <span>插件C</span>
                <span>22,845</span>
              </div>
              <div class="h-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                <div class="h-full bg-blue-400 rounded-full" style="width: 55%"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between text-xs mb-1">
                <span>插件D</span>
                <span>10,428</span>
              </div>
              <div class="h-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                <div class="h-full bg-red-400 rounded-full" style="width: 35%"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 关键指标卡片 -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <!-- 总授权数 -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
          <div class="flex items-center mb-2">
            <div class="w-8 h-8 bg-blue-50 dark:bg-blue-900 rounded-full flex items-center justify-center mr-2">
              <IconLock class="text-blue-500 text-lg" />
            </div>
            <div class="text-sm text-gray-500">总授权数</div>
          </div>
          <div class="pl-10">
            <div class="text-2xl font-bold">8,846</div>
            <div class="flex items-center text-xs">
              <IconUp class="text-green-500 mr-1" />
              <span class="text-green-500">8.2%</span>
              <span class="text-gray-400 ml-1">较上周</span>
            </div>
          </div>
        </div>
        
        <!-- 本月新增 -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
          <div class="flex items-center mb-2">
            <div class="w-8 h-8 bg-green-50 dark:bg-green-900 rounded-full flex items-center justify-center mr-2">
              <IconPlus class="text-green-500 text-lg" />
            </div>
            <div class="text-sm text-gray-500">本月新增</div>
          </div>
          <div class="pl-10">
            <div class="text-2xl font-bold">1,257</div>
            <div class="flex items-center text-xs">
              <IconUp class="text-green-500 mr-1" />
              <span class="text-green-500">12.5%</span>
              <span class="text-gray-400 ml-1">较上月</span>
            </div>
          </div>
        </div>
        
        <!-- 总收入 -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
          <div class="flex items-center mb-2">
            <div class="w-8 h-8 bg-purple-50 dark:bg-purple-900 rounded-full flex items-center justify-center mr-2">
              <IconCurrency class="text-purple-500 text-lg" />
            </div>
            <div class="text-sm text-gray-500">总收入</div>
          </div>
          <div class="pl-10">
            <div class="text-2xl font-bold">¥123,456</div>
            <div class="flex items-center text-xs">
              <IconDown class="text-red-500 mr-1" />
              <span class="text-red-500">2.3%</span>
              <span class="text-gray-400 ml-1">较上月</span>
            </div>
          </div>
        </div>
        
        <!-- 续费率 -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
          <div class="flex items-center mb-2">
            <div class="w-8 h-8 bg-amber-50 dark:bg-amber-900 rounded-full flex items-center justify-center mr-2">
              <IconSync class="text-amber-500 text-lg" />
            </div>
            <div class="text-sm text-gray-500">续费率</div>
          </div>
          <div class="pl-10">
            <div class="text-2xl font-bold">78.4%</div>
            <div class="flex items-center text-xs">
              <IconUp class="text-green-500 mr-1" />
              <span class="text-green-500">4.1%</span>
              <span class="text-gray-400 ml-1">较上季度</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 授权到期提醒 -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-8">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center">
            <IconCalendar class="text-primary text-lg mr-2" />
            <span class="text-sm font-medium">即将到期授权</span>
          </div>
          <a-button type="text" size="small">
            查看全部
          </a-button>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead>
              <tr class="border-b border-gray-100 dark:border-gray-700">
                <th class="py-2 px-4 text-left font-medium">客户名称</th>
                <th class="py-2 px-4 text-left font-medium">插件产品</th>
                <th class="py-2 px-4 text-left font-medium">授权类型</th>
                <th class="py-2 px-4 text-left font-medium">到期日期</th>
                <th class="py-2 px-4 text-left font-medium">状态</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-gray-100 dark:border-gray-700">
                <td class="py-2 px-4">华为科技</td>
                <td class="py-2 px-4">安全管理插件</td>
                <td class="py-2 px-4">企业版</td>
                <td class="py-2 px-4">2024-06-15</td>
                <td class="py-2 px-4"><a-tag color="orange">7天后到期</a-tag></td>
              </tr>
              <tr class="border-b border-gray-100 dark:border-gray-700">
                <td class="py-2 px-4">腾讯科技</td>
                <td class="py-2 px-4">数据分析工具</td>
                <td class="py-2 px-4">专业版</td>
                <td class="py-2 px-4">2024-06-18</td>
                <td class="py-2 px-4"><a-tag color="orange">10天后到期</a-tag></td>
              </tr>
              <tr>
                <td class="py-2 px-4">阿里巴巴</td>
                <td class="py-2 px-4">云存储接口</td>
                <td class="py-2 px-4">企业版</td>
                <td class="py-2 px-4">2024-06-25</td>
                <td class="py-2 px-4"><a-tag color="green">17天后到期</a-tag></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { 
  IconUser, 
  IconUserGroup,
  IconSettings,
  IconFile,
  IconUp,
  IconDown,
  IconDashboard,
  IconRefresh,
  IconLock,
  IconPlus,
  IconSettings as IconCurrency,
  IconSync,
  IconCalendar
} from '@arco-design/web-vue/es/icon';

definePageMeta({
  layout: 'dashboard'
});
</script>

<style scoped>
.trend-line {
  transition: all 0.3s ease;
}

@keyframes dash {
  to {
    stroke-dashoffset: 0;
  }
}

.trend-line {
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  animation: dash 1.5s ease-in-out forwards;
}
</style> 