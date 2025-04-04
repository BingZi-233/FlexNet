<template>
  <div>
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold">API 密钥</h1>
        <p class="text-gray-500 mt-1">
          创建和管理您的API密钥，用于访问我们的API服务
        </p>
      </div>
      <a-button type="primary">
        <template #icon><IconPlus /></template>
        创建新密钥
      </a-button>
    </div>
    
    <!-- 安全提示 -->
    <a-alert class="mb-6" type="warning" show-icon>
      <template #icon><IconInfoCircle /></template>
      <template #title>安全提示</template>
      <template #content>
        API密钥具有与您账号相同的权限。请妥善保管您的密钥，不要在公共场合或代码库中暴露它们。
      </template>
    </a-alert>
    
    <!-- API密钥列表 -->
    <a-card>
      <a-table
        :columns="columns"
        :data="apiKeys"
        :loading="loading"
        :pagination="false"
        :bordered="false"
      >
        <template #name="{ record }">
          <div>
            <div class="font-medium">{{ record.name }}</div>
            <div class="text-xs text-gray-500">{{ record.prefix }}...{{ record.suffix }}</div>
          </div>
        </template>
        
        <template #type="{ record }">
          <a-tag :color="record.type === 'production' ? 'red' : 'green'">
            {{ record.type === 'production' ? '生产环境' : '测试环境' }}
          </a-tag>
        </template>
        
        <template #createdAt="{ record }">
          <div class="text-gray-600">{{ record.createdAt }}</div>
        </template>
        
        <template #status="{ record }">
          <a-badge
            :status="record.status === 'active' ? 'success' : 'danger'"
            :text="record.status === 'active' ? '已启用' : '已禁用'"
          />
        </template>
        
        <template #permissions="{ record }">
          <div class="flex flex-wrap gap-1">
            <a-tag
              v-for="(perm, index) in record.permissions"
              :key="index"
              size="small"
              :color="getPermissionColor(perm)"
            >
              {{ perm }}
            </a-tag>
          </div>
        </template>
        
        <template #operations="{ record }">
          <div class="flex gap-2">
            <!-- 查看密钥按钮 -->
            <a-tooltip content="查看详情">
              <a-button type="text" size="small" @click="viewKey(record)">
                <template #icon><IconEye /></template>
              </a-button>
            </a-tooltip>
            
            <!-- 重新生成密钥按钮 -->
            <a-tooltip content="重新生成">
              <a-button type="text" size="small" @click="regenerateKey(record)">
                <template #icon><IconRefresh /></template>
              </a-button>
            </a-tooltip>
            
            <!-- 切换状态按钮 -->
            <a-tooltip :content="record.status === 'active' ? '禁用' : '启用'">
              <a-button type="text" size="small" @click="toggleKeyStatus(record)">
                <template #icon>
                  <IconCheck v-if="record.status !== 'active'" />
                  <IconClose v-else />
                </template>
              </a-button>
            </a-tooltip>
            
            <!-- 编辑密钥按钮 -->
            <a-tooltip content="编辑">
              <a-button type="text" size="small" @click="editKey(record)">
                <template #icon><IconEdit /></template>
              </a-button>
            </a-tooltip>
            
            <!-- 删除密钥按钮 -->
            <a-tooltip content="删除">
              <a-button type="text" size="small" status="danger" @click="deleteKey(record)">
                <template #icon><IconDelete /></template>
              </a-button>
            </a-tooltip>
          </div>
        </template>
      </a-table>
    </a-card>
    
    <!-- 密钥用法指南 -->
    <a-card class="mt-6" title="API 密钥使用说明">
      <div class="p-4">
        <h3 class="font-bold mb-2">授权方式</h3>
        <p class="mb-4">将您的API密钥作为Bearer令牌在HTTP请求的Authorization头中进行传递:</p>
        
        <a-card class="mb-4 bg-gray-50">
          <pre class="language-bash"><code>curl -X GET "https://api.example.com/v1/users" \
-H "Authorization: Bearer YOUR_API_KEY" \
-H "Content-Type: application/json"</code></pre>
        </a-card>
        
        <h3 class="font-bold mb-2">最佳实践</h3>
        <ul class="list-disc list-inside space-y-2">
          <li>使用测试密钥进行开发和测试</li>
          <li>为不同应用或用途创建独立的密钥</li>
          <li>定期轮换您的API密钥</li>
          <li>限制密钥权限范围，遵循最小权限原则</li>
          <li>监控API密钥的使用情况，及时发现异常</li>
        </ul>
      </div>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { Message } from '@arco-design/web-vue';

definePageMeta({
  layout: 'developer'
});

// 加载状态
const loading = ref(false);

// 表格列定义
const columns = [
  {
    title: '密钥名称',
    dataIndex: 'name',
    slotName: 'name',
  },
  {
    title: '类型',
    dataIndex: 'type',
    slotName: 'type',
    width: 120
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    slotName: 'createdAt',
    width: 160
  },
  {
    title: '状态',
    dataIndex: 'status',
    slotName: 'status',
    width: 100
  },
  {
    title: '权限',
    dataIndex: 'permissions',
    slotName: 'permissions',
  },
  {
    title: '操作',
    slotName: 'operations',
    width: 200,
    fixed: 'right'
  }
];

// 模拟API密钥数据
const apiKeys = ref([
  {
    id: '1',
    name: '主应用生产密钥',
    prefix: 'pk_prod_',
    suffix: 'a7f9b2',
    type: 'production',
    createdAt: '2023-12-10 15:30',
    status: 'active',
    permissions: ['读取', '写入', '删除']
  },
  {
    id: '2',
    name: '移动应用生产密钥',
    prefix: 'pk_prod_',
    suffix: 'c8d3e4',
    type: 'production',
    createdAt: '2024-01-05 09:45',
    status: 'active',
    permissions: ['读取', '写入']
  },
  {
    id: '3',
    name: '开发环境测试密钥',
    prefix: 'pk_test_',
    suffix: 'b5e7f1',
    type: 'test',
    createdAt: '2024-02-20 11:20',
    status: 'active',
    permissions: ['读取', '写入', '删除', '管理']
  },
  {
    id: '4',
    name: 'CI/CD流水线密钥',
    prefix: 'pk_test_',
    suffix: 'd2f6g9',
    type: 'test',
    createdAt: '2024-03-15 16:40',
    status: 'inactive',
    permissions: ['读取']
  }
]);

// 获取权限对应的颜色
const getPermissionColor = (permission: string) => {
  switch (permission) {
    case '读取':
      return 'green';
    case '写入':
      return 'blue';
    case '删除':
      return 'orange';
    case '管理':
      return 'red';
    default:
      return 'default';
  }
};

// 密钥操作
const viewKey = (key: any) => {
  Message.info(`查看密钥: ${key.name}`);
};

const regenerateKey = (key: any) => {
  Message.warning(`重新生成密钥: ${key.name}`);
};

const toggleKeyStatus = (key: any) => {
  loading.value = true;
  setTimeout(() => {
    const index = apiKeys.value.findIndex(item => item.id === key.id);
    if (index !== -1) {
      const newStatus = key.status === 'active' ? 'inactive' : 'active';
      apiKeys.value[index].status = newStatus;
      Message.success(`密钥 ${key.name} 已${newStatus === 'active' ? '启用' : '禁用'}`);
    }
    loading.value = false;
  }, 500);
};

const editKey = (key: any) => {
  Message.info(`编辑密钥: ${key.name}`);
};

const deleteKey = (key: any) => {
  Message.error(`删除密钥: ${key.name}`);
};
</script> 