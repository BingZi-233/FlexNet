<template>
  <div>
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <h1 class="text-2xl font-bold">用户管理</h1>
      <a-button type="primary">
        <template #icon><IconPlus /></template>
        添加用户
      </a-button>
    </div>
    
    <a-card>
      <div class="mb-4 flex flex-wrap gap-4">
        <a-input-search
          placeholder="搜索用户名/邮箱"
          search-button
          style="width: 100%; max-width: 320px"
          v-model="searchValue"
          @search="handleSearch"
        />
        
        <div class="flex flex-wrap gap-4">
          <a-select
            placeholder="用户状态"
            style="width: 140px"
            v-model="statusFilter"
            allow-clear
          >
            <a-option value="active">已激活</a-option>
            <a-option value="inactive">未激活</a-option>
            <a-option value="blocked">已封禁</a-option>
          </a-select>
          
          <a-select
            placeholder="用户角色"
            style="width: 140px"
            v-model="roleFilter"
            allow-clear
          >
            <a-option value="admin">管理员</a-option>
            <a-option value="user">普通用户</a-option>
            <a-option value="guest">访客</a-option>
          </a-select>
        </div>
        
        <div class="flex gap-2">
          <a-button>
            <template #icon><IconFilter /></template>
            筛选
          </a-button>
          
          <a-button type="text">
            <template #icon><IconRefresh /></template>
            重置
          </a-button>
        </div>
      </div>
      
      <a-table 
        :data="filteredUsers" 
        :loading="loading" 
        :pagination="pagination" 
        @page-change="onPageChange"
        :scroll="{ x: 800 }"
        :responsive-column="['operation']"
      >
        <template #columns>
          <a-table-column title="用户名" data-index="username">
            <template #cell="{ record }">
              <div class="flex items-center">
                <a-avatar :size="32" :style="{ backgroundColor: record.avatarColor }">
                  {{ record.avatarText }}
                </a-avatar>
                <div class="ml-2">
                  <div>{{ record.username }}</div>
                  <div class="text-gray-400 text-xs">{{ record.email }}</div>
                </div>
              </div>
            </template>
          </a-table-column>
          
          <a-table-column title="注册时间" data-index="registerTime">
            <template #cell="{ record }">
              <div class="whitespace-nowrap">{{ record.registerTime }}</div>
            </template>
          </a-table-column>
          
          <a-table-column title="最后登录" data-index="lastLogin">
            <template #cell="{ record }">
              <div class="whitespace-nowrap">{{ record.lastLogin }}</div>
            </template>
          </a-table-column>
          
          <a-table-column title="角色" data-index="role">
            <template #cell="{ record }">
              <a-tag :color="getRoleColor(record.role)">
                {{ getRoleName(record.role) }}
              </a-tag>
            </template>
          </a-table-column>
          
          <a-table-column title="状态" data-index="status">
            <template #cell="{ record }">
              <a-tag :color="getStatusColor(record.status)">
                {{ getStatusName(record.status) }}
              </a-tag>
            </template>
          </a-table-column>
          
          <a-table-column title="操作" data-index="operation" fixed="right" width="200">
            <template #cell="{ record }">
              <div class="flex flex-wrap gap-2">
                <a-button type="text" size="small" @click="editUser(record)">
                  <template #icon><IconEdit /></template>
                  编辑
                </a-button>
                <a-button type="text" size="small" status="warning" @click="resetPassword(record)">
                  <template #icon><IconLock /></template>
                  重置密码
                </a-button>
                <a-button type="text" size="small" status="danger" @click="removeUser(record)">
                  <template #icon><IconDelete /></template>
                  删除
                </a-button>
              </div>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';

definePageMeta({
  layout: 'dashboard'
});

// 加载状态
const loading = ref(false);

// 搜索和筛选
const searchValue = ref('');
const statusFilter = ref('');
const roleFilter = ref('');

// 分页
const pagination = ref({
  total: 100,
  current: 1,
  pageSize: 10,
  showTotal: true,
  showJumper: true,
});

// 模拟用户数据
const users = ref([
  {
    id: 1,
    username: '张三',
    email: 'zhangsan@example.com',
    avatarText: '张',
    avatarColor: '#165DFF',
    registerTime: '2023-09-15 09:34',
    lastLogin: '2024-03-28 15:47',
    role: 'admin',
    status: 'active'
  },
  {
    id: 2,
    username: '李四',
    email: 'lisi@example.com',
    avatarText: '李',
    avatarColor: '#722ED1',
    registerTime: '2023-10-22 11:20',
    lastLogin: '2024-03-29 10:15',
    role: 'user',
    status: 'active'
  },
  {
    id: 3,
    username: '王五',
    email: 'wangwu@example.com',
    avatarText: '王',
    avatarColor: '#0FC6C2',
    registerTime: '2023-11-08 16:42',
    lastLogin: '2024-03-27 09:23',
    role: 'user',
    status: 'inactive'
  },
  {
    id: 4,
    username: '赵六',
    email: 'zhaoliu@example.com',
    avatarText: '赵',
    avatarColor: '#F5222D',
    registerTime: '2024-01-17 08:55',
    lastLogin: '2024-03-20 14:38',
    role: 'guest',
    status: 'blocked'
  },
  {
    id: 5,
    username: '钱七',
    email: 'qianqi@example.com',
    avatarText: '钱',
    avatarColor: '#FF7D00',
    registerTime: '2024-02-03 13:18',
    lastLogin: '2024-03-29 08:07',
    role: 'user',
    status: 'active'
  }
]);

// 过滤后的用户数据
const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const matchSearch = searchValue.value 
      ? user.username.includes(searchValue.value) || user.email.includes(searchValue.value)
      : true;
    
    const matchStatus = statusFilter.value 
      ? user.status === statusFilter.value
      : true;
      
    const matchRole = roleFilter.value
      ? user.role === roleFilter.value
      : true;
      
    return matchSearch && matchStatus && matchRole;
  });
});

// 角色相关
const getRoleColor = (role: string) => {
  switch (role) {
    case 'admin':
      return 'blue';
    case 'user':
      return 'green';
    case 'guest':
      return 'gray';
    default:
      return 'default';
  }
};

const getRoleName = (role: string) => {
  switch (role) {
    case 'admin':
      return '管理员';
    case 'user':
      return '普通用户';
    case 'guest':
      return '访客';
    default:
      return '未知';
  }
};

// 状态相关
const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'green';
    case 'inactive':
      return 'orange';
    case 'blocked':
      return 'red';
    default:
      return 'default';
  }
};

const getStatusName = (status: string) => {
  switch (status) {
    case 'active':
      return '已激活';
    case 'inactive':
      return '未激活';
    case 'blocked':
      return '已封禁';
    default:
      return '未知';
  }
};

// 页码变化
const onPageChange = (current: number) => {
  pagination.value.current = current;
  // 实际项目中调用API获取数据
  console.log('加载第', current, '页数据');
};

// 搜索
const handleSearch = (value: string) => {
  searchValue.value = value;
  pagination.value.current = 1;
  // 实际项目中调用API进行搜索
  console.log('搜索:', value);
};

// 操作方法
const editUser = (user: any) => {
  // 实际项目中弹出编辑框
  console.log('编辑用户:', user.username);
};

const resetPassword = (user: any) => {
  // 实际项目中弹出确认框
  console.log('重置密码:', user.username);
};

const removeUser = (user: any) => {
  // 实际项目中弹出确认框
  console.log('删除用户:', user.username);
};
</script>

<style scoped>
@media (max-width: 768px) {
  :deep(.arco-table-th) {
    white-space: nowrap;
  }
  
  :deep(.arco-table-td) {
    white-space: nowrap;
  }
}
</style> 