<template>
  <div class="py-12 md:py-20 px-4">
    <div class="max-w-5xl mx-auto">
      <!-- 主标题区域 -->
      <a-space direction="vertical" :size="24" align="center" class="w-full">
        <div class="max-w-3xl mx-auto w-full text-center">
          <div class="mb-2 text-secondary font-medium tracking-wide">简单、高效、安全</div>
          <a-typography-title :heading="1" class="text-2xl sm:text-3xl md:text-5xl font-bold !leading-tight">
            插件管理与授权平台
          </a-typography-title>
          <a-typography-paragraph class="text-sm sm:text-base md:text-lg text-gray-600 mt-3 md:mt-5 max-w-2xl mx-auto">
            FlexNet让您轻松获取和管理正版插件，为开发者提供完善的授权管理系统。无论您是用户还是开发者，都能享受便捷、安全的插件生态体验。
          </a-typography-paragraph>

          <div class="flex flex-col sm:flex-row gap-4 justify-center mt-8 md:mt-10">
            <nuxt-link to="/auth/register" prefetch>
              <a-button type="primary" size="large" class="shadow-md hover:shadow-lg hover:opacity-90 transition-all px-6 w-full sm:w-auto">
                <template #icon><IconFire /></template>
                立即体验
              </a-button>
            </nuxt-link>
            <a-button size="large" class="hover:bg-gray-50 transition-colors w-full sm:w-auto" @click="goToPlugins">
              <template #icon><IconFile /></template>
              浏览插件
            </a-button>
          </div>
        </div>
      </a-space>
    </div>
  </div>
</template>

<script setup>
// 定义页面元数据
definePageMeta({
  layout: 'default',
  title: 'FlexNet - 插件管理与授权平台',
  description: 'FlexNet让您轻松获取和管理正版插件，为开发者提供完善的授权管理系统。'
})

// 定义路由规则，启用预渲染
defineRouteRules({
  prerender: true
})

// 编程式导航示例
const goToPlugins = async () => {
  await navigateTo('/plugins', { 
    replace: false, // 默认为false，可以省略
    redirectCode: 301 // 设置重定向代码
  })
}
</script>