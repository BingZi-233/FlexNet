<template>
  <div class="py-12 md:py-16 px-4">
    <div class="max-w-3xl mx-auto">
      <a-typography-title :heading="1" class="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">
        关于我们
      </a-typography-title>
      
      <a-divider />
      
      <a-typography-paragraph class="text-gray-700 text-base md:text-lg mt-6">
        FlexNet 是一家致力于为企业提供数字化转型解决方案的技术公司。我们的使命是通过创新技术帮助企业提升效率、降低成本、增强竞争力。
      </a-typography-paragraph>
      
      <a-typography-paragraph class="text-gray-700 text-base md:text-lg mt-4">
        我们的团队由一群充满激情的技术专家组成，他们在云计算、人工智能、大数据分析等领域拥有丰富的经验和专业知识。我们相信，技术的力量可以改变企业的未来，而我们正是这一变革的推动者。
      </a-typography-paragraph>
      
      <a-typography-title :heading="2" class="text-xl sm:text-2xl font-bold mt-8 mb-4">
        我们的价值观
      </a-typography-title>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div class="bg-white p-4 rounded-lg shadow-sm">
          <h3 class="font-semibold text-primary mb-2">创新驱动</h3>
          <p class="text-gray-600">我们不断探索新技术，推动行业创新，为客户创造更多价值。</p>
        </div>
        
        <div class="bg-white p-4 rounded-lg shadow-sm">
          <h3 class="font-semibold text-primary mb-2">客户至上</h3>
          <p class="text-gray-600">我们始终将客户需求放在首位，提供个性化解决方案。</p>
        </div>
        
        <div class="bg-white p-4 rounded-lg shadow-sm">
          <h3 class="font-semibold text-primary mb-2">团队协作</h3>
          <p class="text-gray-600">我们相信，团队的力量大于个人，协作是成功的关键。</p>
        </div>
        
        <div class="bg-white p-4 rounded-lg shadow-sm">
          <h3 class="font-semibold text-primary mb-2">持续学习</h3>
          <p class="text-gray-600">在快速变化的技术世界中，我们保持学习的激情和好奇心。</p>
        </div>
      </div>
      
      <div class="mt-10 text-center">
        <nuxt-link to="/">
          <a-button type="primary">
            <template #icon><IconHome /></template>
            返回首页
          </a-button>
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'default'
})
</script> 