<template>
  <div>
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <h1 class="text-2xl font-bold">用户列表</h1>
      <a-button type="primary">
        <template #icon><IconPlus /></template>
        添加用户
      </a-button>
    </div>
    
    <!-- 用户搜索和筛选 -->
    <a-card class="mb-6">
      <div class="flex flex-wrap gap-4 items-end">
        <a-input-search
          placeholder="搜索用户名/邮箱"
          search-button
          style="width: 320px"
          v-model="searchQuery"
          @search="handleSearch"
        />
        
        <a-select
          placeholder="角色"
          style="width: 140px"
          v-model="roleFilter"
          allow-clear
        >
          <a-option value="admin">管理员</a-option>
          <a-option value="developer">开发者</a-option>
          <a-option value="user">普通用户</a-option>
        </a-select>
        
        <a-select
          placeholder="状态"
          style="width: 140px"
          v-model="statusFilter"
          allow-clear
        >
          <a-option value="active">已激活</a-option>
          <a-option value="inactive">未激活</a-option>
          <a-option value="blocked">已封禁</a-option>
        </a-select>
        
        <a-date-picker
          style="width: 240px"
          placeholder="注册时间"
          v-model="dateFilter"
        />
        
        <div class="ml-auto flex gap-2">
          <a-button @click="resetFilters">
            <template #icon><IconRefresh /></template>
            重置
          </a-button>
          <a-button type="primary" @click="applyFilters">
            <template #icon><IconFilter /></template>
            筛选
          </a-button>
        </div>
      </div>
    </a-card>
    
    <!-- 用户数据表格 -->
    <a-card>
      <a-table
        :columns="columns"
        :data="userData"
        :loading="loading"
        :pagination="pagination"
        @page-change="onPageChange"
      >
        <template #name="{ record }">
          <div class="flex items-center">
            <a-avatar :size="32" :style="{ backgroundColor: record.avatarColor }">
              {{ record.nameInitial }}
            </a-avatar>
            <div class="ml-2">
              <div class="font-medium">{{ record.name }}</div>
              <div class="text-xs text-gray-500">{{ record.email }}</div>
            </div>
          </div>
        </template>
        
        <template #role="{ record }">
          <a-tag :color="record.role === 'admin' ? 'blue' : record.role === 'developer' ? 'purple' : 'green'">
            {{ record.role === 'admin' ? '管理员' : record.role === 'developer' ? '开发者' : '普通用户' }}
          </a-tag>
        </template>
        
        <template #status="{ record }">
          <a-tag :color="record.status === 'active' ? 'green' : record.status === 'inactive' ? 'orange' : 'red'">
            {{ record.status === 'active' ? '已激活' : record.status === 'inactive' ? '未激活' : '已封禁' }}
          </a-tag>
        </template>
        
        <template #lastLogin="{ record }">
          <span>{{ record.lastLogin }}</span>
        </template>
        
        <template #operations="{ record }">
          <div class="flex gap-2">
            <a-button type="text" size="small" @click="editUser(record)">
              <template #icon><IconEdit /></template>
              编辑
            </a-button>
            <a-button type="text" size="small" status="warning" @click="resetPassword(record)">
              <template #icon><IconLock /></template>
              重置密码
            </a-button>
            <a-button type="text" size="small" status="danger" @click="deleteUser(record)">
              <template #icon><IconDelete /></template>
              删除
            </a-button>
          </div>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { Message } from '@arco-design/web-vue';

definePageMeta({
  layout: 'admin'
});

// 表格数据
const loading = ref(false);
const searchQuery = ref('');
const roleFilter = ref('');
const statusFilter = ref('');
const dateFilter = ref();

// 表格列定义
const columns = [
  {
    title: '用户信息',
    dataIndex: 'name',
    slotName: 'name'
  },
  {
    title: '角色',
    dataIndex: 'role',
    slotName: 'role'
  },
  {
    title: '状态',
    dataIndex: 'status',
    slotName: 'status'
  },
  {
    title: '注册时间',
    dataIndex: 'createdAt'
  },
  {
    title: '最后登录',
    dataIndex: 'lastLogin',
    slotName: 'lastLogin'
  },
  {
    title: '操作',
    slotName: 'operations',
    width: 200
  }
];

// 模拟用户数据
const userData = ref([
  {
    id: 1,
    name: '张三',
    email: 'zhangsan@example.com',
    nameInitial: '张',
    avatarColor: '#1677FF',
    role: 'admin',
    status: 'active',
    createdAt: '2023-06-15',
    lastLogin: '2024-04-01 10:23'
  },
  {
    id: 2,
    name: '李四',
    email: 'lisi@example.com',
    nameInitial: '李',
    avatarColor: '#9254DE',
    role: 'developer',
    status: 'active',
    createdAt: '2023-08-22',
    lastLogin: '2024-04-01 09:15'
  },
  {
    id: 3,
    name: '王五',
    email: 'wangwu@example.com',
    nameInitial: '王',
    avatarColor: '#00B42A',
    role: 'user',
    status: 'active',
    createdAt: '2023-09-03',
    lastLogin: '2024-03-30 16:45'
  },
  {
    id: 4,
    name: '赵六',
    email: 'zhaoliu@example.com',
    nameInitial: '赵',
    avatarColor: '#FF7D00',
    role: 'user',
    status: 'inactive',
    createdAt: '2023-11-18',
    lastLogin: '2024-03-25 11:30'
  },
  {
    id: 5,
    name: '钱七',
    email: 'qianqi@example.com',
    nameInitial: '钱',
    avatarColor: '#F5222D',
    role: 'user',
    status: 'blocked',
    createdAt: '2024-01-07',
    lastLogin: '2024-02-15 09:20'
  }
]);

// 分页配置
const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 100,
  showTotal: true,
  showJumper: true
});

// 翻页处理
const onPageChange = (page: number) => {
  pagination.value.current = page;
  // 实际项目中这里会发起API请求
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 500);
};

// 搜索处理
const handleSearch = (value: string) => {
  searchQuery.value = value;
  pagination.value.current = 1;
  // 实际项目中这里会发起API请求
  Message.info(`搜索关键词: ${value}`);
};

// 重置筛选
const resetFilters = () => {
  searchQuery.value = '';
  roleFilter.value = '';
  statusFilter.value = '';
  dateFilter.value = undefined;
  Message.success('已重置所有筛选条件');
};

// 应用筛选
const applyFilters = () => {
  // 实际项目中这里会发起API请求
  Message.success('筛选条件已应用');
};

// 用户操作
const editUser = (user: any) => {
  Message.info(`编辑用户: ${user.name}`);
};

const resetPassword = (user: any) => {
  Message.warning(`重置密码: ${user.name}`);
};

const deleteUser = (user: any) => {
  Message.error(`删除用户: ${user.name}`);
};
</script> 