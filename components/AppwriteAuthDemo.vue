<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4">Appwrite 认证演示</h2>
    
    <!-- 登录状态显示 -->
    <div v-if="isLoggedIn" class="mb-6 bg-green-50 p-4 rounded-lg">
      <div class="text-green-700 font-medium">已登录</div>
      <div class="mt-2">
        <div><span class="font-medium">用户ID:</span> {{ user?.$id }}</div>
        <div><span class="font-medium">用户名:</span> {{ user?.name }}</div>
        <div><span class="font-medium">邮箱:</span> {{ user?.email }}</div>
      </div>
      <a-button type="primary" status="success" class="mt-3" @click="handleLogout">
        退出登录
      </a-button>
    </div>
    
    <!-- 未登录状态 -->
    <div v-else class="mb-6">
      <!-- 登录表单 -->
      <a-form :model="loginForm" class="mb-6 max-w-md">
        <a-form-item field="email" label="邮箱">
          <a-input v-model="loginForm.email" placeholder="请输入邮箱" />
        </a-form-item>
        <a-form-item field="password" label="密码">
          <a-input-password v-model="loginForm.password" placeholder="请输入密码" />
        </a-form-item>
        <a-space>
          <a-button type="primary" @click="handleLogin" :loading="loading">
            登录
          </a-button>
          <a-button @click="handleRegister" :loading="loading">
            注册
          </a-button>
        </a-space>
      </a-form>

      <!-- OAuth 登录选项 -->
      <div class="mt-6">
        <div class="text-sm text-gray-500 mb-2">或使用以下方式登录:</div>
        <a-space>
          <a-button @click="handleOAuthLogin(OAuthProvider.Google)">
            Google 登录
          </a-button>
          <a-button @click="handleOAuthLogin(OAuthProvider.Github)">
            GitHub 登录
          </a-button>
        </a-space>
      </div>
    </div>
    
    <!-- 操作结果提示 -->
    <a-alert v-if="errorMessage" type="error" :closable="true" class="mb-4">
      {{ errorMessage }}
    </a-alert>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { OAuthProvider } from 'appwrite';
import { useAppwriteAccount } from '@/composables/useAppwriteAccount';
import type { Models } from 'appwrite';

// 获取 Appwrite 账户服务
const accountService = useAppwriteAccount();

// 状态变量
const isLoggedIn = ref(false);
const user = ref<Models.User<Models.Preferences> | null>(null);
const loading = ref(false);
const errorMessage = ref('');

// 登录表单
const loginForm = ref({
  email: '',
  password: ''
});

// 初始化检查登录状态
onMounted(async () => {
  await checkAuthStatus();
});

// 检查用户登录状态
const checkAuthStatus = async () => {
  try {
    const loggedIn = await accountService.isLoggedIn();
    isLoggedIn.value = loggedIn;
    
    if (loggedIn) {
      user.value = await accountService.getCurrentUser();
    }
  } catch (error) {
    console.error('检查登录状态失败', error);
    isLoggedIn.value = false;
  }
};

// 登录处理
const handleLogin = async () => {
  loading.value = true;
  errorMessage.value = '';
  
  try {
    await accountService.loginWithEmail(
      loginForm.value.email,
      loginForm.value.password
    );
    
    await checkAuthStatus();
    loginForm.value = { email: '', password: '' };
  } catch (error: any) {
    errorMessage.value = `登录失败: ${error.message || '未知错误'}`;
  } finally {
    loading.value = false;
  }
};

// 注册处理
const handleRegister = async () => {
  loading.value = true;
  errorMessage.value = '';
  
  try {
    await accountService.createAccount(
      loginForm.value.email,
      loginForm.value.password
    );
    
    // 注册成功后自动登录
    await handleLogin();
  } catch (error: any) {
    errorMessage.value = `注册失败: ${error.message || '未知错误'}`;
    loading.value = false;
  }
};

// OAuth 登录处理
const handleOAuthLogin = (provider: OAuthProvider) => {
  try {
    // 重定向到 OAuth 提供商的登录页面
    // 需要配置回调 URL
    const currentUrl = window.location.href;
    accountService.loginWithOAuth(
      provider,
      currentUrl,
      currentUrl
    );
  } catch (error: any) {
    errorMessage.value = `OAuth 登录失败: ${error.message || '未知错误'}`;
  }
};

// 退出登录
const handleLogout = async () => {
  loading.value = true;
  
  try {
    await accountService.logout();
    isLoggedIn.value = false;
    user.value = null;
  } catch (error: any) {
    errorMessage.value = `退出失败: ${error.message || '未知错误'}`;
  } finally {
    loading.value = false;
  }
};
</script> 