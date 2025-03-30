<template>
  <div class="py-12 md:py-20 px-4">
    <div class="max-w-5xl mx-auto">
      <!-- 主标题区域 -->
      <a-space direction="vertical" size="large" align="center" class="w-full">
        <div class="max-w-3xl mx-auto w-full text-center">
          <div class="mb-2 text-secondary font-medium tracking-wide">快速、安全、可靠</div>
          <a-typography-title :heading="1" class="text-2xl sm:text-3xl md:text-5xl font-bold !leading-tight">
            开启您的数字化旅程
          </a-typography-title>
          <a-typography-paragraph class="text-sm sm:text-base md:text-lg text-gray-600 mt-3 md:mt-5 max-w-2xl mx-auto">
            让创新与技术完美融合，构建未来智能解决方案。FlexNet 为您提供一站式数字化转型服务，助力企业实现增长。
          </a-typography-paragraph>

          <div class="flex flex-col sm:flex-row gap-4 justify-center mt-8 md:mt-10">
            <nuxt-link to="/auth/register">
              <a-button type="primary" size="large" class="shadow-md hover:shadow-lg hover:opacity-90 transition-all px-6 w-full sm:w-auto">
                <template #icon><IconFire /></template>
                立即开始
              </a-button>
            </nuxt-link>
            <a-button size="large" class="hover:bg-gray-50 transition-colors w-full sm:w-auto">
              <template #icon><IconFile /></template>
              阅读文档
            </a-button>
          </div>
        </div>
      </a-space>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'default',
  pageTransition: {
    name: 'home-page',
    mode: 'out-in'
  }
})
</script>