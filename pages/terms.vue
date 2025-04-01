<template>
  <div class="py-12 md:py-16 px-4">
    <div class="max-w-3xl mx-auto">
      <a-typography-title :heading="1" class="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">
        用户协议
      </a-typography-title>
      
      <a-divider />
      
      <a-typography-paragraph class="text-gray-700 text-base md:text-lg mt-6">
        欢迎使用FlexNet服务。本用户协议（"协议"）是您与FlexNet之间就使用我们的服务所达成的法律协议。使用我们的服务，即表示您同意本协议的条款。
      </a-typography-paragraph>
      
      <a-typography-title :heading="2" class="text-xl sm:text-2xl font-bold mt-8 mb-4">
        服务说明
      </a-typography-title>
      
      <a-typography-paragraph class="text-gray-700 text-base md:text-lg mt-4">
        FlexNet提供一套数字化管理工具和服务，帮助用户进行数据管理、分析和业务流程优化。我们可能随时更新、变更或终止部分或全部服务，恕不另行通知。
      </a-typography-paragraph>
      
      <a-typography-title :heading="2" class="text-xl sm:text-2xl font-bold mt-8 mb-4">
        账户注册与安全
      </a-typography-title>
      
      <a-typography-paragraph class="text-gray-700 text-base md:text-lg mt-4">
        使用我们的服务可能需要创建账户。您同意提供准确、完整的信息，并在信息变更时及时更新。您需对账户的所有活动负责，并保持密码的机密性。如发现任何未授权使用您账户的情况，请立即通知我们。
      </a-typography-paragraph>
      
      <a-typography-title :heading="2" class="text-xl sm:text-2xl font-bold mt-8 mb-4">
        用户行为规范
      </a-typography-title>
      
      <a-typography-paragraph class="text-gray-700 text-base md:text-lg mt-4">
        使用我们的服务时，您同意：
      </a-typography-paragraph>
      
      <ul class="list-disc pl-6 text-gray-700 text-base md:text-lg mt-2 space-y-2">
        <li>遵守所有适用的法律法规</li>
        <li>尊重他人的权利和隐私</li>
        <li>不发布或传播侵权、违法、有害、威胁、辱骂、骚扰、诽谤、淫秽或其他不适当的内容</li>
        <li>不尝试干扰或破坏服务的正常运行</li>
        <li>不利用我们的服务从事任何欺诈或非法活动</li>
      </ul>
      
      <a-typography-title :heading="2" class="text-xl sm:text-2xl font-bold mt-8 mb-4">
        知识产权
      </a-typography-title>
      
      <a-typography-paragraph class="text-gray-700 text-base md:text-lg mt-4">
        FlexNet及其许可方拥有服务中的所有知识产权。本协议不授予您对这些知识产权的任何权利。您可能在使用我们的服务时提交内容（如数据或反馈），您保留这些内容的所有权，但授予我们非排他性、全球性、免版税的许可，允许我们使用、存储、修改和展示这些内容，以提供和改善我们的服务。
      </a-typography-paragraph>
      
      <a-typography-title :heading="2" class="text-xl sm:text-2xl font-bold mt-8 mb-4">
        服务变更与终止
      </a-typography-title>
      
      <a-typography-paragraph class="text-gray-700 text-base md:text-lg mt-4">
        我们可能随时修改本协议，修改后的协议将在我们发布时生效。继续使用我们的服务即表示您接受修改后的条款。如果您不同意修改后的条款，请停止使用我们的服务。
      </a-typography-paragraph>
      
      <a-typography-paragraph class="text-gray-700 text-base md:text-lg mt-4">
        我们可能随时暂停或终止您对服务的访问，包括但不限于您违反本协议的情况。在适用法律允许的范围内，我们保留随时停止提供服务的权利，恕不另行通知。
      </a-typography-paragraph>
      
      <a-typography-title :heading="2" class="text-xl sm:text-2xl font-bold mt-8 mb-4">
        免责声明与责任限制
      </a-typography-title>
      
      <a-typography-paragraph class="text-gray-700 text-base md:text-lg mt-4">
        我们的服务按"现状"和"可用"提供，不提供任何明示或暗示的保证。在法律允许的最大范围内，FlexNet及其关联公司、员工、代理人不对任何直接、间接、附带、特殊、后果性或惩罚性损害承担责任。
      </a-typography-paragraph>
      
      <a-typography-title :heading="2" class="text-xl sm:text-2xl font-bold mt-8 mb-4">
        适用法律
      </a-typography-title>
      
      <a-typography-paragraph class="text-gray-700 text-base md:text-lg mt-4">
        本协议受中华人民共和国法律管辖。与本协议相关的任何争议应提交至有管辖权的法院解决。
      </a-typography-paragraph>
      
      <a-typography-title :heading="2" class="text-xl sm:text-2xl font-bold mt-8 mb-4">
        联系我们
      </a-typography-title>
      
      <a-typography-paragraph class="text-gray-700 text-base md:text-lg mt-4">
        如您对本协议有任何疑问，请联系我们：<a-link href="mailto:terms@example.com">terms@example.com</a-link>
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
  layout: 'default',
  pageTransition: {
    name: 'page',
    mode: 'out-in'
  }
})
</script> 