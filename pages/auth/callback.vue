<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50 p-6">
    <div class="w-full max-w-md">
      <div class="bg-white rounded-xl shadow-sm p-8 border border-gray-100 text-center">
        <a-spin :loading="true" size="large">
          <h1 class="text-2xl font-bold mb-4">认证中...</h1>
          <p class="text-gray-500 mb-2">正在处理认证信息，请稍候...</p>
        </a-spin>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Message } from '@arco-design/web-vue';
import { useAppwriteAccount } from '@/composables/useAppwriteAccount';

// 获取路由参数
const route = useRoute();
const router = useRouter();

// 处理认证回调
onMounted(async () => {
  const { userId, secret, redirect } = route.query;
  
  // 处理重定向URL
  const redirectUrl = redirect ? decodeURIComponent(redirect.toString()) : '/';
  
  // 如果URL包含认证信息，处理魔术链接认证
  if (userId && secret) {
    try {
      const appwriteAccount = useAppwriteAccount();
      
      // 处理魔术链接认证
      await appwriteAccount.updateMagicURLSession(
        userId.toString(),
        secret.toString()
      );
      
      // 认证成功
      Message.success('登录成功');
      router.push(redirectUrl);
    } catch (error) {
      console.error('认证处理失败:', error);
      Message.error('认证失败，请重新登录');
      router.push('/auth/login');
    }
  } else {
    // OAuth回调处理
    try {
      const appwriteAccount = useAppwriteAccount();
      const loggedIn = await appwriteAccount.isLoggedIn();
      
      if (loggedIn) {
        // 获取用户信息
        const user = await appwriteAccount.getCurrentUser();
        if (user) {
          Message.success(`欢迎回来，${user.name || '用户'}`);
        } else {
          Message.success('登录成功');
        }
        router.push(redirectUrl);
      } else {
        // OAuth可能失败，检查URL是否包含错误信息
        if (route.query.error) {
          Message.error(`认证失败: ${route.query.error}`);
        } else {
          Message.error('认证失败，请重新登录');
        }
        router.push('/auth/login');
      }
    } catch (error) {
      console.error('检查认证状态失败:', error);
      Message.error('认证处理出错，请重新登录');
      router.push('/auth/login');
    }
  }
});
</script> 