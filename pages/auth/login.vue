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
          <div class="mb-6 text-center">
            <h2 class="text-2xl font-bold text-gray-900">用户登录</h2>
            <p class="text-gray-500 mt-2">欢迎回来，请登录您的账号</p>
          </div>
          
          <!-- 登录方式选择 -->
          <div class="mb-6 border-b border-gray-100">
            <div class="flex text-center">
              <div 
                class="flex-1 py-3 cursor-pointer border-b-2 transition-colors"
                :class="activeTab === 'password' ? 'border-primary-500 text-primary-600 font-medium' : 'border-transparent text-gray-500 hover:text-gray-800'"
                @click="activeTab = 'password'"
              >
                密码登录
              </div>
              <div 
                class="flex-1 py-3 cursor-pointer border-b-2 transition-colors"
                :class="activeTab === 'magic-link' ? 'border-primary-500 text-primary-600 font-medium' : 'border-transparent text-gray-500 hover:text-gray-800'"
                @click="activeTab = 'magic-link'"
              >
                邮箱验证登录
              </div>
              <div 
                class="flex-1 py-3 cursor-pointer border-b-2 transition-colors"
                :class="activeTab === 'oauth' ? 'border-primary-500 text-primary-600 font-medium' : 'border-transparent text-gray-500 hover:text-gray-800'"
                @click="activeTab = 'oauth'"
              >
                第三方登录
              </div>
            </div>
          </div>
          
          <!-- 登录表单内容 -->
          <div>
            <!-- 密码登录 -->
            <div v-if="activeTab === 'password'">
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
                  :loading="loading"
                  class="hover:opacity-90 transition-opacity">
                  登录
                </a-button>
              </a-form>
            </div>
            
            <!-- 魔术链接登录 -->
            <div v-if="activeTab === 'magic-link'">
              <div class="py-2">
                <p class="text-gray-500 mb-4 text-center">
                  我们将发送一个登录链接到您的邮箱，点击链接即可登录
                </p>
                <a-form layout="vertical">
                  <a-form-item field="magicLinkEmail" label="邮箱地址"
                    :rules="[
                      { required: true, message: '请输入邮箱' },
                      { type: 'email', message: '请输入有效的邮箱地址' }
                    ]">
                    <a-input 
                      v-model="magicLinkEmail" 
                      placeholder="请输入邮箱地址"
                      allow-clear
                      size="medium"
                    >
                      <template #prefix>
                        <icon-email />
                      </template>
                    </a-input>
                  </a-form-item>
                  <a-button 
                    type="primary" 
                    long
                    size="medium" 
                    :loading="magicLinkLoading"
                    @click="handleMagicLinkLogin"
                    class="hover:opacity-90 transition-opacity"
                  >
                    发送登录链接
                  </a-button>
                </a-form>
              </div>
            </div>
            
            <!-- 第三方登录 -->
            <div v-if="activeTab === 'oauth'">
              <div class="py-2">
                <p class="text-gray-500 mb-6 text-center">选择以下第三方账号快速登录</p>
                <div class="flex justify-center gap-5 mb-2">
                  <button 
                    class="w-20 h-20 flex flex-col items-center justify-center bg-gray-50 border border-gray-200 rounded-lg transition-all duration-200 hover:shadow-md"
                    @click="handleGithubLogin"
                  >
                    <span class="text-3xl mb-2">
                      <icon-github />
                    </span>
                    <span class="text-sm">GitHub</span>
                  </button>
                  <button 
                    class="w-20 h-20 flex flex-col items-center justify-center bg-gray-50 border border-gray-200 rounded-lg transition-all duration-200 hover:shadow-md"
                    @click="handleGoogleLogin"
                  >
                    <span class="text-3xl mb-2">
                      <icon-google />
                    </span>
                    <span class="text-sm">Google</span>
                  </button>
                  <button 
                    class="w-20 h-20 flex flex-col items-center justify-center bg-gray-50 border border-gray-200 rounded-lg transition-all duration-200 hover:shadow-md"
                  >
                    <span class="text-3xl mb-2">
                      <icon-wechat />
                    </span>
                    <span class="text-sm">微信</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
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

// 活动标签
const activeTab = ref('password');

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