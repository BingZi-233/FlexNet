<template>
  <div class="w-full max-w-4xl mx-auto py-8 px-4">
    <h1 class="text-2xl font-bold mb-6">Appwrite 认证示例</h1>
    
    <div class="bg-white p-6 rounded-lg shadow-md">
      <AppwriteAuthDemo />
    </div>
    
    <div class="mt-8 bg-gray-50 p-6 rounded-lg">
      <h2 class="text-xl font-bold mb-4">使用说明</h2>
      <p class="mb-2">这个页面展示了 Appwrite 账户服务的基本使用方法，包括：</p>
      <ul class="list-disc list-inside ml-4 space-y-1">
        <li>用户注册</li>
        <li>邮箱密码登录</li>
        <li>OAuth 社交登录</li>
        <li>会话管理</li>
        <li>退出登录</li>
      </ul>
      
      <div class="mt-6">
        <h3 class="text-lg font-medium mb-2">如何使用</h3>
        <ol class="list-decimal list-inside ml-4 space-y-1">
          <li>首先确保在 .env 文件中设置了 Appwrite 的配置</li>
          <li>尝试使用邮箱和密码注册一个新账户</li>
          <li>退出登录，然后尝试使用刚刚注册的账户登录</li>
          <li>也可以尝试使用社交账号登录（需要在 Appwrite 控制台中配置相应的 OAuth 提供商）</li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 页面元数据
definePageMeta({
  layout: 'default',
  title: 'Appwrite 认证示例',
  description: '展示如何使用 Appwrite 进行用户认证'
});
</script> 