<template>
  <div>
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <h1 class="text-2xl font-bold">管理控制台</h1>
      <div class="text-sm text-gray-500">最后更新: {{ currentDate }}</div>
    </div>
    
    <!-- 系统状态概览 -->
    <a-row :gutter="16" class="mb-6">
      <a-col :span="6" :xs="24" :sm="12" :md="6" class="mb-4">
        <a-card hoverable>
          <div class="flex items-center">
            <div class="p-3 rounded-lg bg-blue-100 mr-4">
              <IconUser class="text-blue-600 text-lg" />
            </div>
            <div>
              <div class="text-sm text-gray-500">用户总数</div>
              <div class="text-xl font-bold">{{ userCount }}</div>
            </div>
          </div>
          <div class="mt-2 text-xs text-green-600">
            <IconArrowRise class="mr-1" /> 增长 {{ userGrowth }}%
          </div>
        </a-card>
      </a-col>
      
      <a-col :span="6" :xs="24" :sm="12" :md="6" class="mb-4">
        <a-card hoverable>
          <div class="flex items-center">
            <div class="p-3 rounded-lg bg-green-100 mr-4">
              <IconCalendar class="text-green-600 text-lg" />
            </div>
            <div>
              <div class="text-sm text-gray-500">今日访问</div>
              <div class="text-xl font-bold">{{ todayVisits }}</div>
            </div>
          </div>
          <div class="mt-2 text-xs text-green-600">
            <IconArrowRise class="mr-1" /> 增长 {{ visitGrowth }}%
          </div>
        </a-card>
      </a-col>
      
      <a-col :span="6" :xs="24" :sm="12" :md="6" class="mb-4">
        <a-card hoverable>
          <div class="flex items-center">
            <div class="p-3 rounded-lg bg-purple-100 mr-4">
              <IconStorage class="text-purple-600 text-lg" />
            </div>
            <div>
              <div class="text-sm text-gray-500">存储用量</div>
              <div class="text-xl font-bold">{{ storageUsage }}</div>
            </div>
          </div>
          <div class="mt-2 text-xs text-gray-500">
            占总容量 {{ storagePercentage }}%
          </div>
        </a-card>
      </a-col>
      
      <a-col :span="6" :xs="24" :sm="12" :md="6" class="mb-4">
        <a-card hoverable>
          <div class="flex items-center">
            <div class="p-3 rounded-lg bg-amber-100 mr-4">
              <IconNotification class="text-amber-600 text-lg" />
            </div>
            <div>
              <div class="text-sm text-gray-500">系统通知</div>
              <div class="text-xl font-bold">{{ notificationCount }}</div>
            </div>
          </div>
          <div class="mt-2 text-xs text-red-600" v-if="unreadAlerts > 0">
            {{ unreadAlerts }} 个未读紧急通知
          </div>
          <div class="mt-2 text-xs text-green-600" v-else>
            全部通知已读
          </div>
        </a-card>
      </a-col>
    </a-row>
    
    <!-- 二级状态卡片 -->
    <a-row :gutter="16" class="mb-6">
      <a-col :span="8" :xs="24" :md="8" class="mb-4">
        <a-card title="系统健康状态" :bordered="false">
          <template #extra>
            <a-button type="text" shape="circle">
              <template #icon><IconRefresh /></template>
            </a-button>
          </template>
          
          <div class="p-3">
            <div class="flex justify-between items-center mb-3">
              <span>CPU 使用率</span>
              <span class="text-gray-500">{{ systemStats.cpu }}%</span>
            </div>
            <a-progress :percent="systemStats.cpu" status="normal" />
            
            <div class="flex justify-between items-center mt-4 mb-3">
              <span>内存使用率</span>
              <span class="text-gray-500">{{ systemStats.memory }}%</span>
            </div>
            <a-progress :percent="systemStats.memory" status="normal" />
            
            <div class="flex justify-between items-center mt-4 mb-3">
              <span>磁盘使用率</span>
              <span class="text-gray-500">{{ systemStats.disk }}%</span>
            </div>
            <a-progress :percent="systemStats.disk" status="warning" />
            
            <div class="mt-4 text-right">
              <a-button type="primary" size="small">查看详情</a-button>
            </div>
          </div>
        </a-card>
      </a-col>
      
      <a-col :span="8" :xs="24" :md="8" class="mb-4">
        <a-card title="最近注册用户" :bordered="false">
          <template #extra>
            <a-button type="text" shape="circle">
              <template #icon><IconMore /></template>
            </a-button>
          </template>
          
          <div class="p-3">
            <div class="space-y-4">
              <div v-for="user in recentUsers" :key="user.id" class="flex items-center justify-between">
                <div class="flex items-center">
                  <a-avatar :style="{ backgroundColor: user.color }">{{ user.nameInitial }}</a-avatar>
                  <div class="ml-3">
                    <div class="font-medium">{{ user.name }}</div>
                    <div class="text-xs text-gray-500">{{ user.email }}</div>
                  </div>
                </div>
                <a-tag :color="user.role === 'admin' ? 'blue' : user.role === 'developer' ? 'purple' : 'green'">
                  {{ user.role === 'admin' ? '管理员' : user.role === 'developer' ? '开发者' : '用户' }}
                </a-tag>
              </div>
            </div>
            
            <div class="mt-4 text-right">
              <a-button type="primary" size="small" @click="$router.push('/admin/users/list')">所有用户</a-button>
            </div>
          </div>
        </a-card>
      </a-col>
      
      <a-col :span="8" :xs="24" :md="8" class="mb-4">
        <a-card title="系统事件" :bordered="false">
          <template #extra>
            <a-button type="text" shape="circle">
              <template #icon><IconFilter /></template>
            </a-button>
          </template>
          
          <div class="p-3">
            <a-timeline>
              <a-timeline-item v-for="event in systemEvents" :key="event.id" :dot-color="event.color">
                <div class="text-sm">{{ event.content }}</div>
                <div class="text-xs text-gray-500">{{ event.time }}</div>
              </a-timeline-item>
            </a-timeline>
            
            <div class="mt-4 text-right">
              <a-button type="primary" size="small" @click="$router.push('/admin/system/logs')">所有日志</a-button>
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>
    
    <!-- 下方图表区域 -->
    <a-row :gutter="16">
      <a-col :span="16" :xs="24" :lg="16" class="mb-4">
        <a-card title="网站流量统计" :bordered="false">
          <template #extra>
            <a-radio-group type="button" size="small" v-model="timeRange">
              <a-radio value="day">今日</a-radio>
              <a-radio value="week">本周</a-radio>
              <a-radio value="month">本月</a-radio>
            </a-radio-group>
          </template>
          
          <div style="height: 300px;" class="mt-4">
            <!-- 在实际项目中，这里会使用echarts或其他图表库 -->
            <div class="h-full flex items-center justify-center text-gray-500">
              <p>流量统计图表（需接入实际图表库）</p>
            </div>
          </div>
        </a-card>
      </a-col>
      
      <a-col :span="8" :xs="24" :lg="8" class="mb-4">
        <a-card title="待处理事项" :bordered="false">
          <template #extra>
            <a-button type="text" size="small">全部标记为已处理</a-button>
          </template>
          
          <div class="p-3">
            <a-list>
              <a-list-item v-for="task in pendingTasks" :key="task.id">
                <div class="w-full">
                  <div class="flex justify-between items-center">
                    <div class="flex items-center">
                      <a-checkbox :checked="task.completed" @change="toggleTask(task)"></a-checkbox>
                      <span class="ml-2" :class="{'line-through text-gray-400': task.completed}">{{ task.title }}</span>
                    </div>
                    <a-tag :color="task.priority === 'high' ? 'red' : task.priority === 'medium' ? 'orange' : 'green'" size="small">
                      {{ task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低' }}
                    </a-tag>
                  </div>
                  <div class="ml-6 text-xs text-gray-500">{{ task.dueDate }}</div>
                </div>
              </a-list-item>
            </a-list>
            
            <div class="mt-4 flex justify-between">
              <a-button size="small">
                <template #icon><IconPlus /></template>
                添加任务
              </a-button>
              <a-button type="primary" size="small">
                查看全部
              </a-button>
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';

definePageMeta({
  layout: 'admin'
});

// 当前日期
const currentDate = computed(() => {
  return new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// 统计数据
const userCount = ref(8729);
const userGrowth = ref(5.3);
const todayVisits = ref(1243);
const visitGrowth = ref(12.7);
const storageUsage = ref('128.5 GB');
const storagePercentage = ref(42);
const notificationCount = ref(18);
const unreadAlerts = ref(3);

// 系统状态
const systemStats = ref({
  cpu: 38,
  memory: 56,
  disk: 72
});

// 最近注册用户
const recentUsers = ref([
  {
    id: 1,
    name: '张三',
    email: 'zhangsan@example.com',
    nameInitial: '张',
    color: '#1677FF',
    role: 'admin'
  },
  {
    id: 2,
    name: '李四',
    email: 'lisi@example.com',
    nameInitial: '李',
    color: '#9254DE',
    role: 'developer'
  },
  {
    id: 3,
    name: '王五',
    email: 'wangwu@example.com',
    nameInitial: '王',
    color: '#00B42A',
    role: 'user'
  },
  {
    id: 4,
    name: '赵六',
    email: 'zhaoliu@example.com',
    nameInitial: '赵',
    color: '#FF7D00',
    role: 'user'
  }
]);

// 系统事件
const systemEvents = ref([
  {
    id: 1,
    content: '系统更新完成',
    time: '10分钟前',
    color: 'green'
  },
  {
    id: 2,
    content: '新用户注册: 张三',
    time: '30分钟前',
    color: 'blue'
  },
  {
    id: 3,
    content: '数据库备份完成',
    time: '1小时前',
    color: 'green'
  },
  {
    id: 4,
    content: '发现系统安全漏洞',
    time: '2小时前',
    color: 'red'
  },
  {
    id: 5,
    content: '用户权限变更',
    time: '3小时前',
    color: 'gray'
  }
]);

// 网站流量图表
const timeRange = ref('week');

// 待处理任务
const pendingTasks = ref([
  {
    id: 1,
    title: '审核新用户注册',
    priority: 'high',
    dueDate: '今天 14:00',
    completed: false
  },
  {
    id: 2,
    title: '更新系统安全补丁',
    priority: 'high',
    dueDate: '今天 18:00',
    completed: false
  },
  {
    id: 3,
    title: '检查数据库备份',
    priority: 'medium',
    dueDate: '明天 10:00',
    completed: true
  },
  {
    id: 4,
    title: '回复用户反馈',
    priority: 'low',
    dueDate: '明天 16:00',
    completed: false
  }
]);

// 定义任务类型接口
interface Task {
  id: number;
  title: string;
  priority: string;
  dueDate: string;
  completed: boolean;
}

// 切换任务完成状态
const toggleTask = (task: Task) => {
  task.completed = !task.completed;
};
</script> 