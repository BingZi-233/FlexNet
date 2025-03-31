<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">系统设置</h1>
    
    <a-card class="mb-6">
      <a-tabs default-active-key="1">
        <a-tab-pane key="1" title="基本设置">
          <a-form :model="formData" layout="vertical">
            <a-form-item field="siteName" label="站点名称">
              <a-input v-model="formData.siteName" placeholder="请输入站点名称" />
            </a-form-item>
            
            <a-form-item field="siteDesc" label="站点描述">
              <a-textarea v-model="formData.siteDesc" placeholder="请输入站点描述" />
            </a-form-item>
            
            <a-form-item field="logo" label="站点Logo">
              <a-upload
                list-type="picture-card"
                :file-list="fileList"
                :limit="1"
                @change="handleLogoChange"
              >
                <div class="flex flex-col items-center">
                  <IconPlus />
                  <div class="mt-2">上传</div>
                </div>
              </a-upload>
            </a-form-item>
            
            <a-form-item>
              <a-button type="primary">
                保存设置
              </a-button>
            </a-form-item>
          </a-form>
        </a-tab-pane>
        
        <a-tab-pane key="2" title="安全设置">
          <a-form layout="vertical">
            <a-form-item label="启用二步验证">
              <a-switch v-model="formData.twoFactorAuth" />
              <div class="text-gray-500 text-xs mt-1">启用后登录将需要额外的验证步骤</div>
            </a-form-item>
            
            <a-form-item label="自动锁定">
              <div class="flex flex-wrap items-center gap-2">
                <span>登录失败</span>
                <a-input-number v-model="formData.maxLoginAttempts" :min="1" :max="10" />
                <span>次后锁定账号</span>
                <a-input-number v-model="formData.lockTime" :min="5" :max="60" />
                <span>分钟</span>
              </div>
            </a-form-item>
            
            <a-form-item label="密码策略">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <a-checkbox v-model="formData.passwordPolicy.upper">必须包含大写字母</a-checkbox>
                <a-checkbox v-model="formData.passwordPolicy.lower">必须包含小写字母</a-checkbox>
                <a-checkbox v-model="formData.passwordPolicy.number">必须包含数字</a-checkbox>
                <a-checkbox v-model="formData.passwordPolicy.special">必须包含特殊字符</a-checkbox>
              </div>
              <div class="text-gray-500 text-xs mt-1">推荐全部开启以增强账户安全性</div>
            </a-form-item>
            
            <a-form-item label="密码最小长度">
              <a-slider
                v-model="formData.passwordMinLength"
                :min="6"
                :max="20"
                show-ticks
                show-input
              />
            </a-form-item>
            
            <a-form-item>
              <div class="flex flex-wrap gap-4">
                <a-button type="primary">
                  保存设置
                </a-button>
                <a-button>
                  恢复默认
                </a-button>
              </div>
            </a-form-item>
          </a-form>
        </a-tab-pane>
        
        <a-tab-pane key="3" title="通知设置">
          <a-form layout="vertical">
            <a-form-item label="电子邮件通知">
              <a-space direction="vertical" style="width: 100%">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <a-checkbox v-model="formData.emailNotify.userRegister">新用户注册</a-checkbox>
                  <a-checkbox v-model="formData.emailNotify.orderCreated">订单创建</a-checkbox>
                  <a-checkbox v-model="formData.emailNotify.orderPaid">订单支付</a-checkbox>
                  <a-checkbox v-model="formData.emailNotify.systemAlert">系统警报</a-checkbox>
                </div>
              </a-space>
            </a-form-item>
            
            <a-form-item label="SMTP设置">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                <a-input v-model="formData.smtp.host" placeholder="SMTP服务器" />
                <a-input v-model="formData.smtp.port" placeholder="端口" />
                <a-input v-model="formData.smtp.username" placeholder="用户名" />
                <a-input-password v-model="formData.smtp.password" placeholder="密码" />
              </div>
              <div class="mt-4">
                <a-button type="primary" size="small">测试连接</a-button>
              </div>
            </a-form-item>
            
            <a-form-item>
              <a-button type="primary">
                保存设置
              </a-button>
            </a-form-item>
          </a-form>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

definePageMeta({
  layout: 'dashboard'
});

const fileList = ref([]);

const formData = ref({
  siteName: 'FlexNet管理系统',
  siteDesc: '高效的企业级管理系统',
  twoFactorAuth: false,
  maxLoginAttempts: 5,
  lockTime: 30,
  passwordPolicy: {
    upper: true,
    lower: true,
    number: true,
    special: false
  },
  passwordMinLength: 8,
  emailNotify: {
    userRegister: true,
    orderCreated: true,
    orderPaid: true,
    systemAlert: false
  },
  smtp: {
    host: 'smtp.example.com',
    port: '465',
    username: 'admin@example.com',
    password: ''
  }
});

const handleLogoChange = (fileList: any) => {
  // 实际项目中处理文件上传
  console.log('上传文件:', fileList);
};
</script>

<style scoped>
:deep(.arco-tabs-content) {
  overflow-x: hidden;
}

@media (max-width: 640px) {
  :deep(.arco-form-item-label) {
    margin-bottom: 8px;
  }
}
</style> 