<template>
  <div class="container mx-auto p-6">
    <div class="max-w-lg mx-auto bg-white rounded-xl shadow-sm p-8 border border-gray-100">
      <h1 class="text-2xl font-bold mb-6">认证调试页面</h1>
      
      <div class="mb-4">
        <p><strong>当前登录状态:</strong> {{ isLoggedIn ? '已登录' : '未登录' }}</p>
        <p v-if="user"><strong>用户信息:</strong> {{ user.email }}</p>
      </div>
      
      <div class="flex gap-4 mb-8">
        <a-button type="primary" @click="setLogin(true)">
          模拟登录
        </a-button>
        <a-button @click="setLogin(false)">
          模拟退出
        </a-button>
        <a-button status="success" @click="checkStatus">
          检查状态
        </a-button>
      </div>
      
      <div class="mt-6 border-t pt-4">
        <h2 class="text-lg font-semibold mb-3">导航测试</h2>
        <div class="flex gap-3 flex-wrap">
          <nuxt-link to="/auth/login">
            <a-button>登录页</a-button>
          </nuxt-link>
          <nuxt-link to="/auth/register">
            <a-button>注册页</a-button>
          </nuxt-link>
          <nuxt-link to="/">
            <a-button>首页</a-button>
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 获取登录状态
const isLoggedIn = useState('isLoggedIn');
const user = useState('user');
const { $checkAuthStatus } = useNuxtApp();

// 设置登录状态
const setLogin = (value) => {
  isLoggedIn.value = value;
  if (!value) {
    user.value = null;
  } else if (!user.value) {
    // 如果模拟登录但没有用户信息，创建假用户
    user.value = {
      $id: 'debug-user',
      email: 'debug@example.com',
      name: 'Debug User'
    };
  }
  console.log('登录状态已手动修改:', { isLoggedIn: isLoggedIn.value });
};

// 检查状态
const checkStatus = async () => {
  if ($checkAuthStatus) {
    await $checkAuthStatus();
  }
  console.log('当前状态:', { 
    isLoggedIn: isLoggedIn.value,
    user: user.value
  });
};
</script> 