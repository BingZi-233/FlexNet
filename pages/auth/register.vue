<template>
  <div class="flex min-h-screen bg-gray-50">
    <!-- 注册表单区域 -->
    <div class="w-full flex items-center justify-center p-6">
      <div class="w-full max-w-md">
        <!-- Logo -->
        <div class="flex justify-center mb-8">
          <nuxt-link to="/">
            <img src="/logo.svg" class="h-16 hover:opacity-90 transition-opacity" alt="Logo">
          </nuxt-link>
        </div>
        
        <!-- 注册卡片 -->
        <div class="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
          <!-- 标题 -->
          <div class="mb-6">
            <h2 class="text-2xl font-bold text-gray-900">创建账号</h2>
            <p class="text-gray-500 mt-2">几步简单操作，即可开始您的旅程</p>
          </div>
          
          <!-- 表单 -->
          <a-form :model="form" @submit="handleSubmit" layout="vertical">
            <!-- 用户名 -->
            <a-form-item field="username" label="用户名" 
              :rules="[
                { required: true, message: '请输入用户名' },
                { minLength: 4, message: '用户名至少4个字符' },
                { maxLength: 20, message: '用户名最多20个字符' }
              ]">
              <a-input v-model="form.username" placeholder="请输入用户名" 
                allow-clear :max-length="20" size="medium">
                <template #prefix>
                  <icon-user />
                </template>
              </a-input>
            </a-form-item>
            
            <!-- 邮箱 -->
            <a-form-item field="email" label="邮箱"
              :rules="[
                { required: true, message: '请输入邮箱' },
                { type: 'email', message: '请输入有效的邮箱地址' }
              ]">
              <a-input v-model="form.email" placeholder="请输入邮箱" 
                allow-clear :max-length="50" size="medium">
                <template #prefix>
                  <icon-email />
                </template>
              </a-input>
            </a-form-item>
            
            <!-- 密码 -->
            <a-form-item field="password" label="密码"
              :rules="[
                { required: true, message: '请输入密码' },
                { minLength: 6, message: '密码至少6个字符' }
              ]">
              <a-input-password v-model="form.password" placeholder="请输入密码" 
                allow-clear :max-length="20" size="medium">
                <template #prefix>
                  <icon-lock />
                </template>
              </a-input-password>
            </a-form-item>
            
            <!-- 确认密码 -->
            <a-form-item field="confirmPassword" label="确认密码"
              :rules="[
                { required: true, message: '请确认密码' },
                { validator: validateConfirmPassword, message: '两次输入的密码不一致' }
              ]">
              <a-input-password v-model="form.confirmPassword" placeholder="请确认密码" 
                allow-clear :max-length="20" size="medium">
                <template #prefix>
                  <icon-lock />
                </template>
              </a-input-password>
            </a-form-item>
            
            <!-- 用户协议 -->
            <a-form-item field="agreement" validate-trigger="change" class="mb-6"
              :rules="[{ type: 'boolean', true: true, message: '请同意用户协议' }]">
              <a-checkbox v-model="form.agreement">
                我已阅读并同意
                <a-link>《用户协议》</a-link>
                和
                <a-link>《隐私政策》</a-link>
              </a-checkbox>
            </a-form-item>
            
            <!-- 注册按钮 -->
            <a-button type="primary" html-type="submit" long size="medium" 
              class="hover:opacity-90 transition-opacity">
              注册
            </a-button>
            
            <!-- 第三方注册 -->
            <div class="mt-6 pt-4 border-t border-gray-100">
              <p class="text-center text-gray-500 text-sm mb-4">- 使用其他方式注册 -</p>
              <div class="flex justify-center gap-4">
                <a-button shape="circle" size="medium" class="bg-gray-800 hover:bg-gray-700 text-white border-none" @click="handleGithubRegister">
                  <template #icon><icon-github /></template>
                </a-button>
                <a-button shape="circle" size="medium" class="bg-red-500 hover:bg-red-600 text-white border-none" @click="handleGoogleRegister">
                  <template #icon><icon-google /></template>
                </a-button>
                <a-button shape="circle" size="medium" class="bg-green-500 hover:bg-green-600 text-white border-none">
                  <template #icon><icon-wechat /></template>
                </a-button>
              </div>
            </div>
          </a-form>
        </div>
        
        <!-- 登录链接 -->
        <div class="text-center mt-6">
          <span class="text-gray-500">已有账号？</span>
          <nuxt-link to="/auth/login" class="text-blue-600 font-medium hover:underline ml-1">
            立即登录
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { Message } from '@arco-design/web-vue';

// 设置页面元数据
definePageMeta({
  layout: 'default'
});

// 表单数据
const form = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreement: false
});

// 状态管理
const loading = ref(false);
const error = ref('');

// 使用 Appwrite 账户服务
const { createAccount, loginWithEmail, loginWithGithub, loginWithGoogle } = useAppwriteAccount();
const router = useRouter();

// 验证确认密码
const validateConfirmPassword = (value: string) => {
  return form.password === value;
};

// 提交表单
const handleSubmit = async () => {
  if (loading.value) return;
  
  loading.value = true;
  error.value = '';
  
  try {
    // 创建新用户账号
    await createAccount(form.email, form.password, form.username);
    
    // 注册成功
    Message.success('注册成功！请登录您的账号。');
    
    // 尝试自动登录
    try {
      await loginWithEmail(form.email, form.password);
      // 登录成功，跳转到首页
      router.push('/');
    } catch (loginErr) {
      // 登录失败，跳转到登录页
      router.push('/auth/login');
    }
  } catch (err) {
    console.error('注册过程出错:', err);
    error.value = '注册失败，邮箱可能已被使用或输入的信息不符合要求。';
    Message.error(error.value);
  } finally {
    loading.value = false;
  }
};

// GitHub注册
const handleGithubRegister = () => {
  try {
    // 设置回调URL
    const successUrl = `${window.location.origin}/auth/callback`;
    const failureUrl = `${window.location.origin}/auth/register`;
    
    loginWithGithub(successUrl, failureUrl);
  } catch (err) {
    console.error('GitHub注册失败:', err);
    Message.error('GitHub注册失败，请稍后再试。');
  }
};

// Google注册
const handleGoogleRegister = () => {
  try {
    // 设置回调URL
    const successUrl = `${window.location.origin}/auth/callback`;
    const failureUrl = `${window.location.origin}/auth/register`;
    
    loginWithGoogle(successUrl, failureUrl);
  } catch (err) {
    console.error('Google注册失败:', err);
    Message.error('Google注册失败，请稍后再试。');
  }
};
</script>

<style scoped>
:deep(.arco-input-wrapper) {
  background-color: #f9fafb;
  border-radius: 0.5rem;
}

:deep(.arco-input-wrapper:hover),
:deep(.arco-input-wrapper:focus-within) {
  background-color: #f3f4f6;
  border-color: rgb(var(--primary-6));
}

:deep(.arco-form-item-label-text) {
  font-weight: 500;
  color: #4b5563;
}
</style> 