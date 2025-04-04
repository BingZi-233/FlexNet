// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  modules: ['arco-design-nuxt-module', '@nuxtjs/tailwindcss'],
  
  // Arco Design 配置
  arco: {
    // 组件前缀
    componentPrefix: 'A',
    // 样式导入方式
    importStyle: 'css',
    // 导入所有图标（true类型报错，使用通配符导入全部图标）
    icons: ['*'],
    // 导入功能组件
    imports: ['Message', 'Notification']
  },
  
  // 配置应用级别的过渡效果
  app: {
    pageTransition: {
      name: 'page',
      mode: 'out-in'
    },
    layoutTransition: {
      name: 'layout',
      mode: 'out-in'
    },
    head: {
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
      ]
    }
  },
  
  // 实验性功能
  experimental: {
    // 启用JSON负载渲染，支持自定义类型序列化
    renderJsonPayloads: true
  },
  
  // Appwrite 配置
  runtimeConfig: {
    // 私有配置（仅在服务器端可访问）
    appwriteApiKey: process.env.APPWRITE_API_KEY || '',
    // 公共配置（客户端和服务器端都可访问）
    public: {
      appwriteEndpoint: process.env.APPWRITE_ENDPOINT || '',
      appwriteProjectId: process.env.APPWRITE_PROJECT_ID || ''
    }
  }
})
