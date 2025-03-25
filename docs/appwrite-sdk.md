# Appwrite 双SDK集成方案（SSR架构）

## 环境变量配置
```env
# .env
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your_project_id
APPWRITE_API_KEY=your_admin_key  # 服务端专用
APPWRITE_CLIENT_KEY=your_client_key  # 客户端专用
```

## SDK实例化方案

### 服务端SDK（Admin）
```typescript
// plugins/serverAppwrite.ts
export default defineNuxtPlugin(() => {
  if (process.server) {
    const { Client } = require('node-appwrite');
    
    const client = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT)
      .setProject(process.env.APPWRITE_PROJECT_ID)
      .setKey(process.env.APPWRITE_API_KEY);

    return {
      provide: {
        serverAppwrite: client
      }
    }
  }
});
```

### 客户端SDK（Web）
```typescript
// plugins/clientAppwrite.client.ts
import { Client } from 'appwrite';

export default defineNuxtPlugin(() => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID);

  // 会话管理通过客户端SDK处理
  if (process.client) {
    client.setSession(`session_${Math.random().toString(36).substr(2,9)}`);
  }

  return {
    provide: {
      clientAppwrite: client
    }
  }
});
```

## 使用示例
```vue
<!-- pages/index.vue -->
<script setup>
// 客户端调用
const { $clientAppwrite } = useNuxtApp();

// 服务端调用（仅SSR）
const { $serverAppwrite } = process.server ? useNuxtApp() : {};
</script>
```

## 安全配置
1. Admin Key仅限服务端使用
2. 客户端会话采用独立密钥
3. 敏感操作通过API路由代理