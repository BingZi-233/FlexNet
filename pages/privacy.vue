<template>
  <div class="py-12 md:py-16 px-4">
    <div class="max-w-3xl mx-auto">
      <a-typography-title :heading="1" class="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">
        隐私政策
      </a-typography-title>
      
      <a-divider />
      
      <a-typography-paragraph class="text-gray-700 text-base md:text-lg mt-6">
        本隐私政策描述了FlexNet如何收集、使用和保护您在使用我们的服务时提供的个人信息。我们高度重视您的隐私，并致力于保护您的个人数据。
      </a-typography-paragraph>
      
      <a-typography-title :heading="2" class="text-xl sm:text-2xl font-bold mt-8 mb-4">
        信息收集
      </a-typography-title>
      
      <a-typography-paragraph class="text-gray-700 text-base md:text-lg mt-4">
        我们可能收集以下类型的信息：
      </a-typography-paragraph>
      
      <ul class="list-disc pl-6 text-gray-700 text-base md:text-lg mt-2 space-y-2">
        <li><strong>个人识别信息</strong>：包括您的姓名、电子邮件地址、电话号码、地址等。</li>
        <li><strong>使用数据</strong>：有关您如何使用我们的服务的信息，包括访问时间、浏览页面和停留时间。</li>
        <li><strong>设备信息</strong>：您的设备类型、操作系统、浏览器类型和IP地址。</li>
        <li><strong>Cookies</strong>：我们使用cookies和类似技术来收集使用模式数据并改善用户体验。</li>
      </ul>
      
      <a-typography-title :heading="2" class="text-xl sm:text-2xl font-bold mt-8 mb-4">
        信息使用
      </a-typography-title>
      
      <a-typography-paragraph class="text-gray-700 text-base md:text-lg mt-4">
        我们使用收集到的信息用于：
      </a-typography-paragraph>
      
      <ul class="list-disc pl-6 text-gray-700 text-base md:text-lg mt-2 space-y-2">
        <li>提供、维护和改进我们的服务</li>
        <li>处理您的交易和账户管理</li>
        <li>向您发送服务相关通知和更新</li>
        <li>在您同意的情况下，向您发送营销信息</li>
        <li>监控服务使用情况并防止欺诈行为</li>
        <li>遵守法律义务</li>
      </ul>
      
      <a-typography-title :heading="2" class="text-xl sm:text-2xl font-bold mt-8 mb-4">
        信息保护
      </a-typography-title>
      
      <a-typography-paragraph class="text-gray-700 text-base md:text-lg mt-4">
        我们实施了适当的安全措施，包括加密、访问控制和安全存储，以保护您的个人信息免受未经授权的访问、更改、披露或销毁。
      </a-typography-paragraph>
      
      <a-typography-title :heading="2" class="text-xl sm:text-2xl font-bold mt-8 mb-4">
        第三方分享
      </a-typography-title>
      
      <a-typography-paragraph class="text-gray-700 text-base md:text-lg mt-4">
        我们不会出售您的个人信息。我们可能与以下第三方共享您的信息：
      </a-typography-paragraph>
      
      <ul class="list-disc pl-6 text-gray-700 text-base md:text-lg mt-2 space-y-2">
        <li>提供服务所必需的服务提供商</li>
        <li>在遵守法律要求或保护我们的权利时</li>
        <li>在业务转让或合并情况下</li>
      </ul>
      
      <a-typography-title :heading="2" class="text-xl sm:text-2xl font-bold mt-8 mb-4">
        您的权利
      </a-typography-title>
      
      <a-typography-paragraph class="text-gray-700 text-base md:text-lg mt-4">
        您对您的个人信息拥有一定的权利，包括：
      </a-typography-paragraph>
      
      <ul class="list-disc pl-6 text-gray-700 text-base md:text-lg mt-2 space-y-2">
        <li>访问和获取您的个人信息副本</li>
        <li>更正不准确的个人信息</li>
        <li>在特定情况下删除您的个人信息</li>
        <li>限制或反对我们处理您的个人信息</li>
        <li>数据可携权利</li>
      </ul>
      
      <a-typography-title :heading="2" class="text-xl sm:text-2xl font-bold mt-8 mb-4">
        政策更新
      </a-typography-title>
      
      <a-typography-paragraph class="text-gray-700 text-base md:text-lg mt-4">
        我们可能会不时更新本隐私政策。任何重大变更都会通过服务通知或向您发送电子邮件通知。我们建议您定期查看本政策以了解最新信息。
      </a-typography-paragraph>
      
      <a-typography-title :heading="2" class="text-xl sm:text-2xl font-bold mt-8 mb-4">
        联系我们
      </a-typography-title>
      
      <a-typography-paragraph class="text-gray-700 text-base md:text-lg mt-4">
        如果您对本隐私政策有任何疑问或建议，请联系我们：<a-link href="mailto:privacy@example.com">privacy@example.com</a-link>
      </a-typography-paragraph>
      
      <div class="mt-10 text-center">
        <a-typography-paragraph class="text-gray-500 text-sm">
          最后更新日期：2024年3月30日
        </a-typography-paragraph>
        
        <nuxt-link to="/">
          <a-button type="primary" class="mt-4">
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