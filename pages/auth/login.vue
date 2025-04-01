<template>
  <div class="flex min-h-screen bg-gray-50">
    <!-- 登录表单区域 -->
    <div class="w-full flex items-center justify-center p-6">
      <div class="w-full max-w-md">
        <!-- Logo -->
        <div class="flex justify-center mb-8">
          <nuxt-link to="/">
            <img src="/logo.svg" class="h-16 hover:opacity-90 transition-opacity" alt="Logo">
          </nuxt-link>
        </div>
        
        <!-- 登录卡片 -->
        <div class="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
          <!-- 标题 -->
          <div class="mb-6">
            <h2 class="text-2xl font-bold text-gray-900">用户登录</h2>
            <p class="text-gray-500 mt-2">欢迎回来，请登录您的账号</p>
          </div>
          
          <!-- 表单 -->
          <a-form :model="form" @submit="handleSubmit" layout="vertical">
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
              :rules="[{ required: true, message: '请输入密码' }]">
              <a-input-password v-model="form.password" placeholder="请输入密码" 
                allow-clear :max-length="20" size="medium">
                <template #prefix>
                  <icon-lock />
                </template>
              </a-input-password>
            </a-form-item>
            
            <!-- 记住我和忘记密码 -->
            <div class="flex justify-between items-center mb-4">
              <a-checkbox v-model="form.rememberMe">记住我</a-checkbox>
              <a-link>忘记密码？</a-link>
            </div>
            
            <!-- 登录按钮 -->
            <a-button type="primary" html-type="submit" long size="medium" 
              class="hover:opacity-90 transition-opacity">
              登录
            </a-button>
            
            <!-- 第三方登录 -->
            <div class="mt-6 pt-4 border-t border-gray-100">
              <p class="text-center text-gray-500 text-sm mb-4">- 使用其他方式登录 -</p>
              <div class="flex justify-center gap-4">
                <a-button shape="circle" size="medium" class="bg-gray-800 hover:bg-gray-700 text-white border-none" @click="handleGithubLogin">
                  <template #icon><icon-github /></template>
                </a-button>
                <a-button shape="circle" size="medium" class="bg-red-500 hover:bg-red-600 text-white border-none" @click="handleGoogleLogin">
                  <template #icon><icon-google /></template>
                </a-button>
                <a-button shape="circle" size="medium" class="bg-green-500 hover:bg-green-600 text-white border-none">
                  <template #icon><icon-wechat /></template>
                </a-button>
              </div>
            </div>

            <!-- 魔术链接登录 -->
            <div class="mt-6 pt-4 border-t border-gray-100">
              <p class="text-center text-gray-500 text-sm mb-4">- 使用魔术链接登录 -</p>
              <div class="flex flex-col">
                <a-input 
                  v-model="magicLinkEmail" 
                  placeholder="请输入邮箱地址"
                  allow-clear
                  size="medium"
                  class="mb-2"
                >
                  <template #prefix>
                    <icon-email />
                  </template>
                </a-input>
                <a-button 
                  type="outline" 
                  size="medium" 
                  :loading="magicLinkLoading"
                  @click="handleMagicLinkLogin"
                  class="hover:opacity-90 transition-opacity"
                >
                  发送登录链接
                </a-button>
              </div>
            </div>
          </a-form>
        </div>
        
        <!-- 注册链接 -->
        <div class="text-center mt-6">
          <span class="text-gray-500">还没有账号？</span>
          <nuxt-link to="/auth/register" class="text-blue-600 font-medium hover:underline ml-1">
            立即注册
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
  email: '',
  password: '',
  rememberMe: false
});

// 状态管理
const loading = ref(false);
const error = ref('');

// 使用 Appwrite 账户服务
const { loginWithEmail, loginWithGithub, loginWithGoogle, createMagicURLToken } = useAppwriteAccount();
const router = useRouter();

// 魔术链接登录表单数据和状态
const magicLinkEmail = ref('');
const magicLinkLoading = ref(false);

// 提交表单
const handleSubmit = async () => {
  if (loading.value) return;
  
  loading.value = true;
  error.value = '';
  
  try {
    // 使用邮箱密码登录
    await loginWithEmail(form.email, form.password);
    // 登录成功
    Message.success('登录成功！');
    // 跳转到首页
    router.push('/');
  } catch (err) {
    console.error('登录过程出错:', err);
    error.value = '邮箱或密码错误，请重试。';
    Message.error(error.value);
  } finally {
    loading.value = false;
  }
};

// GitHub登录
const handleGithubLogin = () => {
  try {
    // 设置回调URL
    const successUrl = `${window.location.origin}/auth/callback`;
    const failureUrl = `${window.location.origin}/auth/login`;
    
    loginWithGithub(successUrl, failureUrl);
  } catch (err) {
    console.error('GitHub登录失败:', err);
    Message.error('GitHub登录失败，请稍后再试。');
  }
};

// Google登录
const handleGoogleLogin = () => {
  try {
    // 设置回调URL
    const successUrl = `${window.location.origin}/auth/callback`;
    const failureUrl = `${window.location.origin}/auth/login`;
    
    loginWithGoogle(successUrl, failureUrl);
  } catch (err) {
    console.error('Google登录失败:', err);
    Message.error('Google登录失败，请稍后再试。');
  }
};

// 处理魔术链接登录
const handleMagicLinkLogin = async () => {
  // 验证邮箱
  if (!magicLinkEmail.value || !magicLinkEmail.value.includes('@')) {
    Message.error('请输入有效的邮箱地址');
    return;
  }
  
  magicLinkLoading.value = true;
  try {
    // 创建魔术链接令牌
    await createMagicURLToken(magicLinkEmail.value);
    
    // 显示成功消息
    Message.success('已发送登录链接到您的邮箱，请检查并点击链接登录');
    magicLinkEmail.value = '';
  } catch (err) {
    console.error('魔术链接发送失败:', err);
    Message.error('发送失败，请稍后再试');
  } finally {
    magicLinkLoading.value = false;
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