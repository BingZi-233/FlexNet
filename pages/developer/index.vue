<template>
  <div>
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <h1 class="text-2xl font-bold">开发者中心</h1>
      <a-tag color="purple" size="medium">开发者预览版</a-tag>
    </div>
    
    <!-- 欢迎卡片 -->
    <a-card class="mb-6">
      <div class="flex flex-col md:flex-row gap-6">
        <div class="flex-1">
          <h2 class="text-lg font-bold mb-2">👋 欢迎使用开发者平台</h2>
          <p class="text-gray-500 mb-4">使用我们的API和开发工具，打造更加强大的应用和服务。</p>
          <div class="flex flex-wrap gap-2">
            <a-button type="primary">创建新项目</a-button>
            <a-button>阅读文档</a-button>
          </div>
        </div>
        <div class="flex justify-center items-center p-4 bg-gray-50 rounded-lg">
          <!-- <img src="/code-illustration.svg" alt="开发插图" class="max-h-32" /> -->
        </div>
      </div>
    </a-card>
    
    <!-- API 使用情况 -->
    <a-row :gutter="16" class="mb-6">
      <a-col :span="6" :xs="24" :sm="12" :md="6" class="mb-4">
        <a-card hoverable>
          <div class="flex items-center">
            <div class="p-3 rounded-lg bg-purple-100 mr-4">
              <IconCode class="text-purple-600 text-lg" />
            </div>
            <div>
              <div class="text-sm text-gray-500">API 密钥</div>
              <div class="text-xl font-bold">{{ apiKeyCount }}</div>
            </div>
          </div>
          <div class="mt-2 text-xs">
            <a-link @click="$router.push('/developer/api/keys')">
              <IconRight class="mr-1" /> 管理密钥
            </a-link>
          </div>
        </a-card>
      </a-col>
      
      <a-col :span="6" :xs="24" :sm="12" :md="6" class="mb-4">
        <a-card hoverable>
          <div class="flex items-center">
            <div class="p-3 rounded-lg bg-blue-100 mr-4">
              <IconDesktop class="text-blue-600 text-lg" />
            </div>
            <div>
              <div class="text-sm text-gray-500">API 请求 / 日</div>
              <div class="text-xl font-bold">{{ dailyRequests }}</div>
            </div>
          </div>
          <div class="mt-2 text-xs">
            <a-link @click="$router.push('/developer/api/logs')">
              <IconRight class="mr-1" /> 查看日志
            </a-link>
          </div>
        </a-card>
      </a-col>
      
      <a-col :span="6" :xs="24" :sm="12" :md="6" class="mb-4">
        <a-card hoverable>
          <div class="flex items-center">
            <div class="p-3 rounded-lg bg-green-100 mr-4">
              <IconCheckCircle class="text-green-600 text-lg" />
            </div>
            <div>
              <div class="text-sm text-gray-500">成功率</div>
              <div class="text-xl font-bold">{{ successRate }}%</div>
            </div>
          </div>
          <div class="mt-2 text-xs text-green-600">
            <IconArrowRise class="mr-1" /> 较上周提升 2.1%
          </div>
        </a-card>
      </a-col>
      
      <a-col :span="6" :xs="24" :sm="12" :md="6" class="mb-4">
        <a-card hoverable>
          <div class="flex items-center">
            <div class="p-3 rounded-lg bg-amber-100 mr-4">
              <IconClockCircle class="text-amber-600 text-lg" />
            </div>
            <div>
              <div class="text-sm text-gray-500">平均响应时间</div>
              <div class="text-xl font-bold">{{ avgResponseTime }} ms</div>
            </div>
          </div>
          <div class="mt-2 text-xs text-green-600">
            <IconArrowFall class="mr-1" /> 较上周下降 18 ms
          </div>
        </a-card>
      </a-col>
    </a-row>
    
    <!-- 主要内容区域 -->
    <a-row :gutter="16">
      <!-- API参考和文档 -->
      <a-col :span="8" :xs="24" :md="8" class="mb-6">
        <a-card title="API 参考" :bordered="false">
          <div class="space-y-4">
            <a-list bordered>
              <a-list-item v-for="api in apiEndpoints" :key="api.id">
                <div class="w-full flex items-center justify-between">
                  <div>
                    <div class="flex items-center">
                      <a-tag :color="api.method === 'GET' ? 'green' : api.method === 'POST' ? 'blue' : api.method === 'PUT' ? 'orange' : 'red'" size="small">
                        {{ api.method }}
                      </a-tag>
                      <span class="ml-2 font-mono text-sm">{{ api.endpoint }}</span>
                    </div>
                    <div class="text-xs text-gray-500 mt-1">{{ api.description }}</div>
                  </div>
                  <IconRight class="text-gray-300" />
                </div>
              </a-list-item>
            </a-list>
            
            <div class="text-right">
              <a-button type="primary" size="small" @click="$router.push('/developer/docs/reference')">完整 API 文档</a-button>
            </div>
          </div>
        </a-card>
      </a-col>
      
      <!-- 代码示例 -->
      <a-col :span="8" :xs="24" :md="8" class="mb-6">
        <a-card title="代码示例" :bordered="false">
          <template #extra>
            <a-select v-model="selectedLanguage" size="small" style="width: 120px">
              <a-option value="javascript">JavaScript</a-option>
              <a-option value="python">Python</a-option>
              <a-option value="java">Java</a-option>
              <a-option value="curl">cURL</a-option>
            </a-select>
          </template>
          
          <div class="p-3">
            <div class="text-xs text-gray-500 mb-2">基本身份验证</div>
            <div class="bg-gray-900 p-4 rounded-lg text-gray-200 font-mono text-xs overflow-auto" style="max-height: 240px">
              <pre v-if="selectedLanguage === 'javascript'">
const apiKey = 'YOUR_API_KEY';

fetch('https://api.example.com/v1/users', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));</pre>
              <pre v-else-if="selectedLanguage === 'python'">
import requests

api_key = 'YOUR_API_KEY'
headers = {
    'Authorization': f'Bearer {api_key}',
    'Content-Type': 'application/json'
}

response = requests.get(
    'https://api.example.com/v1/users',
    headers=headers
)

data = response.json()
print(data)</pre>
              <pre v-else-if="selectedLanguage === 'java'">
import java.net.HttpURLConnection;
import java.net.URL;
import java.io.BufferedReader;
import java.io.InputStreamReader;

URL url = new URL("https://api.example.com/v1/users");
HttpURLConnection conn = (HttpURLConnection) url.openConnection();
conn.setRequestMethod("GET");
conn.setRequestProperty("Authorization", "Bearer YOUR_API_KEY");
conn.setRequestProperty("Content-Type", "application/json");

BufferedReader in = new BufferedReader(
    new InputStreamReader(conn.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();

System.out.println(response.toString());</pre>
              <pre v-else-if="selectedLanguage === 'curl'">
curl -X GET \
  https://api.example.com/v1/users \
  -H 'Authorization: Bearer YOUR_API_KEY' \
  -H 'Content-Type: application/json'</pre>
            </div>
            
            <div class="mt-4 text-right">
              <a-button type="primary" size="small" @click="$router.push('/developer/docs/examples')">更多示例</a-button>
            </div>
          </div>
        </a-card>
      </a-col>
      
      <!-- 开发资源 -->
      <a-col :span="8" :xs="24" :md="8" class="mb-6">
        <a-card title="开发资源" :bordered="false">
          <div class="space-y-4">
            <a-card :style="{ marginBottom: '8px' }" hoverable>
              <div class="flex items-center">
                <div class="p-3 rounded-lg bg-blue-100 mr-3">
                  <IconBook class="text-blue-600" />
                </div>
                <div class="flex-1">
                  <div class="font-bold">快速入门指南</div>
                  <div class="text-xs text-gray-500">从这里开始使用我们的API</div>
                </div>
              </div>
            </a-card>
            
            <a-card :style="{ marginBottom: '8px' }" hoverable>
              <div class="flex items-center">
                <div class="p-3 rounded-lg bg-green-100 mr-3">
                  <IconDownload class="text-green-600" />
                </div>
                <div class="flex-1">
                  <div class="font-bold">SDK 下载</div>
                  <div class="text-xs text-gray-500">用于多种语言的SDK包</div>
                </div>
              </div>
            </a-card>
            
            <a-card :style="{ marginBottom: '8px' }" hoverable>
              <div class="flex items-center">
                <div class="p-3 rounded-lg bg-purple-100 mr-3">
                  <IconCommand class="text-purple-600" />
                </div>
                <div class="flex-1">
                  <div class="font-bold">API 控制台</div>
                  <div class="text-xs text-gray-500">在浏览器中测试API请求</div>
                </div>
              </div>
            </a-card>
            
            <a-card hoverable>
              <div class="flex items-center">
                <div class="p-3 rounded-lg bg-amber-100 mr-3">
                  <IconBulb class="text-amber-600" />
                </div>
                <div class="flex-1">
                  <div class="font-bold">最佳实践</div>
                  <div class="text-xs text-gray-500">优化开发工作流程的技巧</div>
                </div>
              </div>
            </a-card>
          </div>
        </a-card>
      </a-col>
    </a-row>
    
    <!-- 公告和动态 -->
    <a-row :gutter="16">
      <a-col :span="16" :xs="24" :lg="16" class="mb-4">
        <a-card title="最新公告" :bordered="false">
          <a-timeline>
            <a-timeline-item key="1">
              <template #dot>
                <div class="bg-blue-500 rounded-full h-2 w-2"></div>
              </template>
              <div class="font-bold">API v2.5 发布</div>
              <div class="text-sm text-gray-600 mb-1">2小时前</div>
              <div class="text-sm text-gray-700">
                我们很高兴地宣布API v2.5正式发布，新版本包括性能改进和新的端点。请查看文档了解详情。
              </div>
            </a-timeline-item>
            <a-timeline-item key="2">
              <template #dot>
                <div class="bg-green-500 rounded-full h-2 w-2"></div>
              </template>
              <div class="font-bold">Node.js SDK 更新</div>
              <div class="text-sm text-gray-600 mb-1">昨天</div>
              <div class="text-sm text-gray-700">
                Node.js SDK已更新到v3.2.1，修复了几个关键bug并添加了新的功能。建议所有开发者尽快更新。
              </div>
            </a-timeline-item>
            <a-timeline-item key="3">
              <template #dot>
                <div class="bg-amber-500 rounded-full h-2 w-2"></div>
              </template>
              <div class="font-bold">计划维护通知</div>
              <div class="text-sm text-gray-600 mb-1">3天前</div>
              <div class="text-sm text-gray-700">
                我们将在下周日凌晨2点至4点进行系统维护。在此期间API可能出现短暂中断，请做好准备。
              </div>
            </a-timeline-item>
          </a-timeline>
          
          <div class="mt-2 text-right">
            <a-button type="text" size="small">
              <template #icon><IconMore /></template>
              查看全部公告
            </a-button>
          </div>
        </a-card>
      </a-col>
      
      <a-col :span="8" :xs="24" :lg="8" class="mb-4">
        <a-card title="开发社区" :bordered="false">
          <a-empty description="加入开发社区，与其他开发者交流、分享想法和解决方案。">
            <template #image>
              <IconUserGroup class="text-5xl text-gray-300" />
            </template>
            <a-button type="primary">立即加入</a-button>
          </a-empty>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

definePageMeta({
  layout: 'developer'
});

// API密钥和使用情况
const apiKeyCount = ref(3);
const dailyRequests = ref(12457);
const successRate = ref(99.8);
const avgResponseTime = ref(235);

// API端点列表
const apiEndpoints = ref([
  {
    id: 1,
    method: 'GET',
    endpoint: '/api/v1/users',
    description: '获取用户列表'
  },
  {
    id: 2,
    method: 'POST',
    endpoint: '/api/v1/users',
    description: '创建新用户'
  },
  {
    id: 3,
    method: 'PUT',
    endpoint: '/api/v1/users/{id}',
    description: '更新用户信息'
  },
  {
    id: 4,
    method: 'DELETE',
    endpoint: '/api/v1/users/{id}',
    description: '删除用户'
  }
]);

// 代码示例语言选择
const selectedLanguage = ref('javascript');
</script> 