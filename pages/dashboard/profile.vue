<template>
  <div class="bg-white dark:bg-gray-900 min-h-screen">
    <!-- 顶部导航 -->
    <div class="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 px-6 py-3">
      <h1 class="text-2xl font-medium text-primary">个人资料</h1>
    </div>

    <!-- 个人资料内容 -->
    <div class="max-w-7xl mx-auto px-6 py-8">
      <!-- 个人资料显示区域 -->
      <div class="grid grid-cols-1 gap-6">
        <!-- 基本信息卡片 -->
        <div class="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg overflow-hidden mb-6">
          <div class="border-b border-gray-100 dark:border-gray-700 p-4">
            <div class="flex items-center">
              <span class="text-lg font-medium">基本信息</span>
            </div>
          </div>
          
          <div class="p-5">
            <div class="flex flex-col gap-6">
              <!-- 头像上传区域 -->
              <div class="flex items-center gap-4 pb-6 border-b border-gray-100 dark:border-gray-700">
                <div class="relative w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <a-avatar :size="80" class="w-full h-full">
                    <template v-if="avatarUrl">
                      <img :src="avatarUrl" alt="用户头像" class="w-full h-full object-cover" />
                    </template>
                    <template v-else>
                      <IconUser style="font-size: 40px" class="text-gray-400" />
                    </template>
                  </a-avatar>
                </div>
                
                <div class="flex-1">
                  <div class="flex items-center gap-2">
                    <div class="text-lg font-medium">{{ userForm.name || '用户' }}</div>
                    <a-tag color="green" size="small">邮箱已验证</a-tag>
                  </div>
                  <div class="text-gray-500 text-sm mt-1">支持 jpg、png 格式，文件小于 2MB</div>
                  <div class="mt-2">
                    <a-upload 
                      :auto-upload="false" 
                      :show-file-list="false" 
                      :disabled="isUploading"
                      :accept="'image/jpeg,image/png'"
                      :max-size="2"
                      @change="onAvatarChange"
                      :custom-request="() => {}"
                    >
                      <a-button type="outline" size="small" class="text-primary" :loading="isUploading">
                        <template #icon><IconUpload /></template>
                        {{ isUploading ? '上传中...' : '点击上传' }}
                      </a-button>
                    </a-upload>
                  </div>
                </div>
              </div>

              <!-- 表单内容 -->
              <div>
                <!-- 移除电子邮箱展示 -->
              </div>
            </div>
          </div>
        </div>
        
        <!-- 安全设置卡片 -->
        <div class="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg overflow-hidden mb-6">
          <div class="border-b border-gray-100 dark:border-gray-700 p-4">
            <div class="flex items-center">
              <IconLock class="mr-2 text-primary text-lg" />
              <span class="text-lg font-medium">安全设置</span>
            </div>
          </div>
          
          <div class="divide-y divide-gray-100 dark:divide-gray-700">
            <!-- 账户密码 -->
            <div class="flex justify-between items-center py-3 px-4">
              <div>
                <div class="font-medium text-sm">账户密码</div>
                <div class="text-gray-500 text-xs mt-0.5">定期修改密码可以保障账户安全</div>
              </div>
              <a-button type="text" @click="showChangePasswordModal = true" class="text-primary">
                修改
              </a-button>
            </div>
            
            <!-- 用户名修改 -->
            <div class="flex justify-between items-center py-3 px-4">
              <div>
                <div class="font-medium text-sm">用户名</div>
                <div class="text-gray-500 text-xs mt-0.5">{{ userForm.name || '未设置用户名' }}</div>
              </div>
              <a-button type="text" @click="showUpdateNameModal = true" class="text-primary">
                修改
              </a-button>
            </div>
            
            <!-- 电子邮箱 -->
            <div class="flex justify-between items-center py-3 px-4">
              <div>
                <div class="font-medium text-sm">
                  电子邮箱
                  <a-tag color="green" size="small" v-if="userForm.emailVerified" class="ml-1">已验证</a-tag>
                  <a-tag color="orange" size="small" v-else class="ml-1">未验证</a-tag>
                </div>
                <div class="text-gray-500 text-xs mt-0.5">
                  {{ userForm.email }}
                </div>
              </div>
              <div class="flex items-center gap-2">
                <a-button type="text" @click="showUpdateEmailModal = true" class="text-primary">
                  修改
                </a-button>
              </div>
            </div>
            
            <!-- 手机号码 -->
            <div class="flex justify-between items-center py-3 px-4">
              <div>
                <div class="font-medium text-sm">手机号码</div>
                <div class="text-gray-500 text-xs mt-0.5">
                  {{ userForm.phone ? userForm.phone : '未设置手机号' }}
                </div>
              </div>
              <a-button type="text" @click="showUpdatePhoneModal = true" class="text-primary">
                {{ userForm.phone ? '修改' : '绑定' }}
              </a-button>
            </div>
            
            <!-- 登录设备 -->
            <div class="flex justify-between items-center py-3 px-4">
              <div>
                <div class="font-medium text-sm">登录设备</div>
                <div class="text-gray-500 text-xs mt-0.5">查看并管理已登录的设备</div>
              </div>
              <a-button type="text" @click="showSessionsModal = true" class="text-primary">
                管理
              </a-button>
            </div>
          </div>
        </div>
        
        <!-- 会话日志卡片 -->
        <div class="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg overflow-hidden mb-6">
          <div class="border-b border-gray-100 dark:border-gray-700 p-4 cursor-pointer" @click="toggleSessionLogs">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <IconHistory class="mr-2 text-primary text-lg" />
                <span class="text-lg font-medium">会话日志</span>
                <a-tag v-if="isLogsExpanded && totalLogs > 0" class="ml-2" color="green">共 {{ totalLogs }} 条</a-tag>
              </div>
              <div class="flex items-center">
                <a-button v-if="isLogsExpanded" type="text" @click.stop="refreshSessionLogs">
                  <template #icon><IconRefresh /></template>
                  刷新
                </a-button>
                <a-button type="text" @click.stop="toggleSessionLogs">
                  <IconDown v-if="!isLogsExpanded" />
                  <IconUp v-else />
                </a-button>
              </div>
            </div>
            <div class="mt-1 text-gray-500 text-sm">查看您的账户活动记录</div>
          </div>
          
          <div class="overflow-hidden transition-all duration-300" :class="{ 'h-0': !isLogsExpanded, 'h-auto': isLogsExpanded }">
            <div class="p-4">
              <div v-if="loadingSessionLogs && !loadingMore" class="flex justify-center items-center py-16">
                <a-spin />
              </div>

              <div v-else-if="sessionLogs.length === 0 && isLogsExpanded" class="text-center py-16 text-gray-500">
                暂无日志记录
              </div>

              <div v-else-if="isLogsExpanded" class="max-h-[500px] overflow-y-auto" ref="logsContainer" @scroll="handleScroll">
                <div class="grid grid-cols-1 gap-4">
                  <div v-for="(log, index) in sessionLogs" :key="index" 
                    class="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
                    <div class="flex items-start gap-3">
                      <!-- 事件图标 -->
                      <div class="flex-none w-8 h-8 rounded-full flex items-center justify-center"
                        :class="{
                          'bg-green-100 dark:bg-green-900': log.event.includes('login'),
                          'bg-blue-100 dark:bg-blue-900': log.event.includes('create'),
                          'bg-red-100 dark:bg-red-900': log.event.includes('logout'),
                          'bg-orange-100 dark:bg-orange-900': log.event.includes('update'),
                          'bg-gray-100 dark:bg-gray-700': !log.event.includes('login') && !log.event.includes('create') && !log.event.includes('logout') && !log.event.includes('update')
                        }">
                        <IconCheck v-if="log.event.includes('login')" class="text-green-500" />
                        <IconPlus v-else-if="log.event.includes('create')" class="text-blue-500" />
                        <IconClose v-else-if="log.event.includes('logout')" class="text-red-500" />
                        <IconEdit v-else-if="log.event.includes('update')" class="text-orange-500" />
                        <IconHistory v-else class="text-gray-500" />
                      </div>

                      <!-- 日志内容 -->
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center justify-between">
                          <div class="text-base font-medium truncate">{{ log.eventName }}</div>
                          <div class="text-sm text-gray-500 flex-none">{{ formatDate(log.time) }}</div>
                        </div>
                        
                        <div class="mt-2 space-y-1.5">
                          <!-- IP和位置信息 -->
                          <div class="flex items-center gap-2 text-sm">
                            <span class="text-gray-500">IP:</span>
                            <span class="font-medium">{{ log.ip }}</span>
                            <a-tag size="small" color="green">{{ log.location }}</a-tag>
                          </div>
                          
                          <!-- 设备信息 -->
                          <div class="flex items-center gap-2 text-sm">
                            <span class="text-gray-500">设备:</span>
                            <span class="font-medium">{{ formatDeviceInfo(log) }}</span>
                          </div>
                          
                          <!-- 浏览器信息 -->
                          <div class="flex items-center gap-2 text-sm">
                            <span class="text-gray-500">浏览器:</span>
                            <span class="font-medium">{{ log.clientInfo }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- 加载更多指示器 -->
                <div v-if="loadingMore" class="flex justify-center py-4">
                  <a-spin />
                </div>
                
                <!-- 全部加载完毕提示 -->
                <div v-if="!hasMore && sessionLogs.length > 0" class="text-center text-sm text-gray-500 py-2">
                  已加载全部日志
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 账号关联卡片 -->
        <div class="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg overflow-hidden">
          <div class="border-b border-gray-100 dark:border-gray-700 p-4">
            <div class="flex items-center">
              <IconLink class="mr-2 text-primary text-lg" />
              <span class="text-lg font-medium">账号关联</span>
            </div>
          </div>
          
          <div class="p-4">
            <div class="space-y-3">
              <!-- GitHub -->
              <div class="flex items-center justify-between py-3 px-4 rounded-lg border border-gray-100 dark:border-gray-700">
                <div class="flex items-center">
                  <div class="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full mr-3">
                    <IconGithub class="text-xl" />
                  </div>
                  <div>
                    <div class="font-medium">GitHub</div>
                    <div class="text-gray-500 text-xs mt-0.5">
                      {{ userLinkedAccounts.github ? '已关联' : '未关联' }}
                    </div>
                  </div>
                </div>
                <a-button 
                  :type="userLinkedAccounts.github ? 'outline' : 'primary'" 
                  :status="userLinkedAccounts.github ? 'danger' : 'normal'"
                  size="small" 
                  :loading="linkingAccount.github"
                  @click="userLinkedAccounts.github ? handleUnlinkAccount('github') : handleLinkAccount('github')"
                >
                  {{ userLinkedAccounts.github ? '解除绑定' : '绑定账号' }}
                </a-button>
              </div>
              
              <!-- Google -->
              <div class="flex items-center justify-between py-3 px-4 rounded-lg border border-gray-100 dark:border-gray-700">
                <div class="flex items-center">
                  <div class="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full mr-3">
                    <IconGoogle class="text-xl" />
                  </div>
                  <div>
                    <div class="font-medium">Google</div>
                    <div class="text-gray-500 text-xs mt-0.5">
                      {{ userLinkedAccounts.google ? '已关联' : '未关联' }}
                    </div>
                  </div>
                </div>
                <a-button 
                  :type="userLinkedAccounts.google ? 'outline' : 'primary'" 
                  :status="userLinkedAccounts.google ? 'danger' : 'normal'"
                  size="small" 
                  :loading="linkingAccount.google"
                  @click="userLinkedAccounts.google ? handleUnlinkAccount('google') : handleLinkAccount('google')"
                >
                  {{ userLinkedAccounts.google ? '解除绑定' : '绑定账号' }}
                </a-button>
              </div>
              
              <!-- 微信 -->
              <div class="flex items-center justify-between py-3 px-4 rounded-lg border border-gray-100 dark:border-gray-700">
                <div class="flex items-center">
                  <div class="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full mr-3">
                    <IconWechat class="text-xl" />
                  </div>
                  <div>
                    <div class="font-medium">微信</div>
                    <div class="text-gray-500 text-xs mt-0.5">
                      {{ userLinkedAccounts.wechat ? '已关联' : '未关联' }}
                    </div>
                  </div>
                </div>
                <a-button 
                  :type="userLinkedAccounts.wechat ? 'outline' : 'primary'" 
                  :status="userLinkedAccounts.wechat ? 'danger' : 'normal'"
                  size="small" 
                  :loading="linkingAccount.wechat"
                  @click="userLinkedAccounts.wechat ? handleUnlinkAccount('wechat') : handleLinkAccount('wechat')"
                >
                  {{ userLinkedAccounts.wechat ? '解除绑定' : '绑定账号' }}
                </a-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 修改密码模态框 -->
    <a-modal
      v-model:visible="showChangePasswordModal"
      title="修改密码"
      @cancel="resetPasswordForm"
      :footer="false"
      :width="480"
    >
      <div class="p-4">
        <a-form :model="passwordForm" layout="vertical">
          <a-form-item field="oldPassword" label="当前密码" required>
            <a-input-password
              v-model="passwordForm.oldPassword"
              placeholder="请输入当前密码"
              allow-clear
              :disabled="isChangingPassword"
            />
          </a-form-item>
          
          <a-form-item field="newPassword" label="新密码" required>
            <a-input-password
              v-model="passwordForm.newPassword"
              placeholder="请输入新密码"
              allow-clear
              :disabled="isChangingPassword"
            />
          </a-form-item>
          
          <div class="mb-4 -mt-2 text-xs text-gray-500 bg-gray-50 dark:bg-gray-800 p-2 rounded block w-full">
            密码应包含大小写字母、数字和特殊字符，长度至少8位
          </div>
          
          <a-form-item field="confirmPassword" label="确认新密码" required>
            <a-input-password
              v-model="passwordForm.confirmPassword"
              placeholder="请再次输入新密码"
              allow-clear
              :disabled="isChangingPassword"
            />
          </a-form-item>
        </a-form>
      </div>
      <div class="flex justify-end gap-2 px-4 py-3 border-t border-gray-100 dark:border-gray-700">
        <a-button @click="showChangePasswordModal = false">取消</a-button>
        <a-button type="primary" :loading="isChangingPassword" @click="submitChangePassword">
          <template #icon><IconLock /></template>
          确认修改
        </a-button>
      </div>
    </a-modal>
    
    <!-- 登录设备模态框 -->
    <a-modal
      v-model:visible="showSessionsModal"
      title="登录设备管理"
      @cancel="showSessionsModal = false"
      :footer="false"
      :width="720"
    >
      <div class="p-4">
        <a-table :data="sessionsList" :loading="loadingSessions" :pagination="false" size="small" :scroll="{ x: '100%' }">
          <template #columns>
            <a-table-column title="设备" data-index="device">
              <template #cell="{ record }">
                <div class="flex items-center">
                  <div class="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full mr-2">
                    <IconComputer class="text-gray-500" />
                  </div>
                  <div>
                    <div class="text-sm">{{ record.device || '未知设备' }}</div>
                    <div class="text-xs text-gray-500">{{ record.ip || '未知IP' }}</div>
                  </div>
                </div>
              </template>
            </a-table-column>
            <a-table-column title="位置" data-index="location">
              <template #cell="{ record }">
                <span class="text-sm">{{ record.location }}</span>
              </template>
            </a-table-column>
            <a-table-column title="登录时间" data-index="timeLogin">
              <template #cell="{ record }">
                <span class="text-sm">{{ record.timeLogin }}</span>
              </template>
            </a-table-column>
            <a-table-column title="操作" fixed="right" width="100">
              <template #cell="{ record }">
                <a-button 
                  type="text" 
                  status="danger" 
                  size="mini" 
                  :disabled="record.current" 
                  @click="removeSession(record.$id)"
                >
                  <span class="text-xs">移除</span>
                </a-button>
              </template>
            </a-table-column>
          </template>
        </a-table>
        <div class="mt-4 flex justify-end">
          <a-button type="outline" status="danger" @click="removeAllSessions">
            <template #icon><IconDelete /></template>
            移除所有其他设备
          </a-button>
        </div>
      </div>
      <div class="flex justify-end gap-2 px-4 py-3 border-t border-gray-100 dark:border-gray-700">
        <a-button @click="showSessionsModal = false">关闭</a-button>
      </div>
    </a-modal>
    
    <!-- 修改手机号模态框 -->
    <a-modal
      v-model:visible="showUpdatePhoneModal"
      title="修改手机号"
      @cancel="resetPhoneForm"
      :footer="false"
      :width="480"
    >
      <div class="p-4">
        <a-form :model="phoneForm" layout="vertical">
          <a-form-item field="phone" label="手机号" required>
            <a-input
              v-model="phoneForm.phone"
              placeholder="请输入手机号（含国际区号，如+86）"
              allow-clear
              :disabled="isUpdatingPhone"
            />
          </a-form-item>
          
          <div class="mb-4 -mt-2 text-xs text-gray-500 bg-gray-50 dark:bg-gray-800 p-2 rounded block w-full">
            必须包含国际区号，例如：+86
          </div>
          
          <a-form-item field="password" label="当前密码" required>
            <a-input-password
              v-model="phoneForm.password"
              placeholder="请输入当前密码"
              allow-clear
              :disabled="isUpdatingPhone"
            />
          </a-form-item>
        </a-form>
      </div>
      <div class="flex justify-end gap-2 px-4 py-3 border-t border-gray-100 dark:border-gray-700">
        <a-button @click="showUpdatePhoneModal = false">取消</a-button>
        <a-button type="primary" :loading="isUpdatingPhone" @click="submitUpdatePhone">
          <template #icon><IconPhone /></template>
          确认修改
        </a-button>
      </div>
    </a-modal>
    
    <!-- 修改用户名模态框 -->
    <a-modal
      v-model:visible="showUpdateNameModal"
      title="修改用户名"
      @cancel="showUpdateNameModal = false"
      :footer="false"
      :width="480"
    >
      <div class="p-4">
        <a-form :model="nameForm" layout="vertical">
          <a-form-item field="name" label="用户名" required>
            <a-input
              v-model="nameForm.name"
              placeholder="请输入新的用户名"
              allow-clear
              :disabled="isUpdatingName"
            />
          </a-form-item>
          
          <div class="mb-4 -mt-2 text-xs text-gray-500 bg-gray-50 dark:bg-gray-800 p-2 rounded block w-full">
            用户名将用于系统中显示和识别您的身份
          </div>
        </a-form>
      </div>
      <div class="flex justify-end gap-2 px-4 py-3 border-t border-gray-100 dark:border-gray-700">
        <a-button @click="showUpdateNameModal = false">取消</a-button>
        <a-button type="primary" :loading="isUpdatingName" @click="submitUpdateName">
          <template #icon><IconUser /></template>
          确认修改
        </a-button>
      </div>
    </a-modal>
    
    <!-- 修改电子邮件模态框 -->
    <a-modal
      v-model:visible="showUpdateEmailModal"
      title="修改电子邮件"
      @cancel="resetEmailForm"
      :footer="false"
      :width="480"
    >
      <div class="p-4">
        <a-form :model="emailForm" layout="vertical">
          <a-form-item field="email" label="新邮箱" required>
            <a-input
              v-model="emailForm.email"
              placeholder="请输入新的电子邮箱"
              allow-clear
              :disabled="isUpdatingEmail"
            />
          </a-form-item>
          
          <div class="mb-4 -mt-2 text-xs text-gray-500 bg-gray-50 dark:bg-gray-800 p-2 rounded block w-full">
            请输入有效的电子邮箱格式，更改邮箱后需要重新验证
          </div>
          
          <a-form-item field="password" label="当前密码" required>
            <a-input-password
              v-model="emailForm.password"
              placeholder="请输入当前密码"
              allow-clear
              :disabled="isUpdatingEmail"
            />
          </a-form-item>
        </a-form>
      </div>
      <div class="flex justify-end gap-2 px-4 py-3 border-t border-gray-100 dark:border-gray-700">
        <a-button @click="showUpdateEmailModal = false">取消</a-button>
        <a-button type="primary" :loading="isUpdatingEmail" @click="submitUpdateEmail">
          <template #icon><IconEmail /></template>
          确认修改
        </a-button>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';
import { useAppwriteAccount } from '~/composables/useAppwriteAccount';
import { useAppwriteStorage } from '~/composables/useAppwriteStorage';
import { useAppwriteAvatar } from '~/composables/useAppwriteAvatar';
import { Message } from '@arco-design/web-vue';
import type { Models } from 'appwrite';
import { 
  IconUser, 
  IconUpload, 
  IconSave, 
  IconLock, 
  IconLink, 
  IconGithub, 
  IconGoogle, 
  IconWechat, 
  IconDelete,
  IconComputer,
  IconHistory,
  IconRefresh,
  IconCheck,
  IconClose,
  IconPlus,
  IconEdit,
  IconDown,
  IconUp,
  IconPhone,
  IconEmail
} from '@arco-design/web-vue/es/icon';
import { Query } from 'appwrite';

definePageMeta({
  layout: 'dashboard'
});

// 获取Appwrite服务
const { 
  getCurrentUser, 
  updateName, 
  updatePassword,
  updatePhone,
  updateEmail,
  getSessions, 
  getPreferences, 
  updatePreferences,
  loginWithGithub,
  loginWithGoogle,
  getIdentities,
  deleteIdentity,
  getSessionLogs,
  terminateAllOtherSessions,
  deleteSession
} = useAppwriteAccount();

const { uploadFile, getFileViewUrl } = useAppwriteStorage();
const { getFlag } = useAppwriteAvatar();

// 用户表单数据
const userForm = ref({
  name: '',
  email: '',
  phone: '',
  location: '',
  bio: '',
  emailVerified: false,
  twoFactorEnabled: false
});

// 密码表单数据
const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
});

// 第三方账号绑定
const userLinkedAccounts = ref({
  github: '',
  google: '',
  wechat: ''
});

// 账号绑定状态
const linkingAccount = ref({
  github: false,
  google: false,
  wechat: false
});

// 头像相关
const avatarUrl = ref<string | null>(null);

// 状态相关
const isSaving = ref(false);
const showChangePasswordModal = ref(false);
const showSessionsModal = ref(false);
const showSessionLogsModal = ref(false);
const loadingSessions = ref(false);
const loadingSessionLogs = ref(false);
const sessionsList = ref<Models.SessionList | null>(null);
const sessionLogs = ref<any[]>([]);
const isUploading = ref(false);
const logsContainer = ref<HTMLElement | null>(null);
const logsPerPage = 10;
const currentLogsPage = ref(0);
const totalLogs = ref(0);
const hasMore = ref(true);
const loadingMore = ref(false);
const allSessionLogs = ref<any[]>([]);
const isLogsExpanded = ref(false);

// 添加修改手机号相关状态和函数
const showUpdatePhoneModal = ref(false);
const phoneForm = ref({
  phone: '',
  password: ''
});
const isUpdatingPhone = ref(false);

// 重置手机号表单
const resetPhoneForm = () => {
  phoneForm.value = {
    phone: '',
    password: ''
  };
};

// 处理更新手机号
const handleUpdatePhone = async () => {
  // 验证表单
  if (!phoneForm.value.phone || !phoneForm.value.password) {
    Message.error('请填写完整的手机号和密码');
    return false;
  }
  
  // 验证手机号格式（简单验证，需要包含国际区号）
  if (!phoneForm.value.phone.startsWith('+')) {
    Message.error('手机号必须包含国际区号，例如：+86');
    return false;
  }
  
  isUpdatingPhone.value = true;
  try {
    // 调用 updatePhone 方法更新手机号
    await updatePhone(phoneForm.value.phone, phoneForm.value.password);
    
    // 更新本地状态
    userForm.value.phone = phoneForm.value.phone;
    
    Message.success('手机号更新成功');
    resetPhoneForm();
    return true;
  } catch (error) {
    console.error('更新手机号失败:', error);
    const errorMessage = error instanceof Error ? error.message : '未知错误';
    Message.error(`更新手机号失败: ${errorMessage}`);
    return false;
  } finally {
    isUpdatingPhone.value = false;
  }
};

// 获取用户信息
const fetchUserData = async () => {
  try {
    const userPromise = getCurrentUser();
    
    // 等待用户信息请求完成
    const user = await userPromise;
    if (user) {
      userForm.value.name = user.name || '';
      userForm.value.email = user.email;
      userForm.value.emailVerified = user.emailVerification || false;
      
      // 这些请求可以并行执行
      const prefsPromise = getPreferences();
      const identitiesPromise = getIdentities();
      
      // 等待偏好设置请求完成
      const prefs = await prefsPromise;
      if (prefs) {
        userForm.value.phone = prefs.phone || '';
        userForm.value.location = prefs.location || '';
        userForm.value.bio = prefs.bio || '';
        userForm.value.twoFactorEnabled = prefs.twoFactorEnabled || false;
        avatarUrl.value = prefs.avatarUrl || null;
      }

      // 等待身份信息请求完成
      const identities = await identitiesPromise;
      userLinkedAccounts.value = {
        github: identities.identities.some(i => i.provider === 'github') ? '已关联' : '',
        google: identities.identities.some(i => i.provider === 'google') ? '已关联' : '',
        wechat: identities.identities.some(i => i.provider === 'wechat') ? '已关联' : ''
      };
    }
  } catch (error) {
    console.error('获取用户数据失败:', error);
    Message.error('获取用户数据失败');
  }
};

// 处理头像上传
const onAvatarChange = async (options: any) => {
  console.log('文件选择事件:', options);
  
  // 确保有文件对象
  if (!options || !options.fileList || options.fileList.length === 0) {
    Message.error('未选择文件或文件无效');
    return;
  }
  
  const file = options.fileList[0].file;
  if (!file) {
    Message.error('文件对象无效');
    return;
  }
  
  // 验证文件类型
  if (!['image/jpeg', 'image/png'].includes(file.type)) {
    Message.error('只支持 JPG 和 PNG 格式的图片');
    return;
  }
  
  // 验证文件大小（2MB）
  if (file.size > 2 * 1024 * 1024) {
    Message.error('图片大小不能超过 2MB');
    return;
  }
  
  isUploading.value = true;
  try {
    // 上传文件
    const uploadedFile = await uploadFile(file);
    if (!uploadedFile || !uploadedFile.$id) {
      throw new Error('上传文件响应格式错误');
    }
    
    // 获取文件预览URL
    const fileUrl = await getFileViewUrl(uploadedFile.$id);
    if (!fileUrl) {
      throw new Error('获取文件URL失败');
    }
    
    // 更新头像URL
    avatarUrl.value = fileUrl;
    
    // 直接更新用户偏好设置
    await updatePreferences({
      avatarUrl: fileUrl
    });
    
    Message.success('头像上传成功');
  } catch (error) {
    console.error('头像上传失败:', error);
    Message.error('头像上传失败，请稍后重试');
    // 重置头像URL
    avatarUrl.value = null;
  } finally {
    isUploading.value = false;
  }
};

// 修改密码
const handleChangePassword = async () => {
  // 验证表单
  if (!passwordForm.value.oldPassword || !passwordForm.value.newPassword || !passwordForm.value.confirmPassword) {
    Message.error('请填写完整的密码信息');
    return false;
  }
  
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    Message.error('两次输入的密码不一致');
    return false;
  }
  
  isChangingPassword.value = true;
  try {
    // 调用updatePassword方法，注意参数顺序是先新密码，再旧密码
    await updatePassword(passwordForm.value.newPassword, passwordForm.value.oldPassword);
    Message.success('密码修改成功');
    resetPasswordForm();
    return true;
  } catch (error) {
    console.error('修改密码失败:', error);
    const errorMessage = error instanceof Error ? error.message : '未知错误';
    Message.error(`修改密码失败: ${errorMessage}`);
    return false;
  } finally {
    isChangingPassword.value = false;
  }
};

// 重置密码表单
const resetPasswordForm = () => {
  passwordForm.value = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
};

// 获取登录设备列表
const fetchSessions = async () => {
  loadingSessions.value = true;
  try {
    sessionsList.value = await getSessions();
    return sessionsList.value;
  } catch (error) {
    console.error('获取登录设备列表失败:', error);
    Message.error('获取登录设备列表失败');
    return null;
  } finally {
    loadingSessions.value = false;
  }
};

// 获取会话日志
const fetchSessionLogs = async (loadMore = false) => {
  if (loadMore) {
    loadingMore.value = true;
  } else {
    loadingSessionLogs.value = true;
    // 如果不是加载更多，重置页码
    currentLogsPage.value = 0;
    sessionLogs.value = [];
  }
  
  try {
    console.log('获取会话日志');
    
    // 使用getSessionLogs方法获取日志，每次获取10条
    const logs = await getSessionLogs(10, currentLogsPage.value * 10);
    
    console.log('会话日志返回结果:', logs);
    
    // 更新总日志数
    totalLogs.value = logs.total;
    
    // 格式化日志
    const formattedLogs = logs.logs.map(formatLogEntry);
    
    // 如果加载更多，追加日志，否则替换日志
    if (loadMore) {
      sessionLogs.value = [...sessionLogs.value, ...formattedLogs];
    } else {
      sessionLogs.value = formattedLogs;
    }
    
    // 检查是否还有更多日志
    hasMore.value = sessionLogs.value.length < logs.total;
    
    return sessionLogs.value;
  } catch (error) {
    console.error('获取会话日志失败:', error);
    const errorMessage = error instanceof Error ? error.message : '未知错误';
    Message.error(`获取会话日志失败: ${errorMessage}`);
    if (!loadMore) {
      sessionLogs.value = [];
    }
    return [];
  } finally {
    loadingSessionLogs.value = false;
    loadingMore.value = false;
  }
};

// 格式化日志条目
const formatLogEntry = (log: any) => {
  const event = log.event || '';
  return {
    time: log.time,
    event: event,
    eventName: getEventName(event),
    eventColor: getEventColor(event),
    ip: log.ip || '',
    location: log.countryName || '未知位置',
    countryCode: log.countryCode || '',
    deviceInfo: getDeviceInfo(log),
    osInfo: getOsInfo(log),
    clientInfo: getClientInfo(log)
  };
};

// 刷新日志
const refreshSessionLogs = () => {
  fetchSessionLogs();
};

// 加载更多日志
const loadMoreLogs = async () => {
  if (hasMore.value && !loadingMore.value) {
    currentLogsPage.value++;
    await fetchSessionLogs(true);
  }
};

// 处理滚动事件，实现无限滚动
const handleScroll = (e: Event) => {
  const target = e.target as HTMLElement;
  // 当滚动到底部时，加载更多日志
  if (target.scrollHeight - target.scrollTop - target.clientHeight < 50) {
    loadMoreLogs();
  }
};

// 根据日志获取设备信息
const getDeviceInfo = (log: any) => {
  let deviceInfo = '';
  
  // 如果有设备品牌和型号信息
  if (log.deviceBrand || log.deviceModel) {
    const brand = log.deviceBrand || '';
    const model = log.deviceModel || '';
    deviceInfo = [brand, model].filter(Boolean).join(' ');
  } 
  // 如果没有品牌型号但有设备名称
  else if (log.deviceName) {
    deviceInfo = log.deviceName;
  } 
  else {
    deviceInfo = '未知设备';
  }
  
  return deviceInfo;
};

// 添加获取操作系统信息的函数
const getOsInfo = (log: any) => {
  if (log.osName) {
    return `${log.osName} ${log.osVersion || ''}`.trim();
  }
  return '';
};

// 修改获取客户端信息的函数
const getClientInfo = (log: any) => {
  if (log.clientName && log.clientVersion) {
    return `${log.clientName} ${log.clientVersion}`;
  } else if (log.clientType) {
    return log.clientType;
  }
  return '';
};

// 获取事件颜色
const getEventColor = (event: string) => {
  if (event.includes('create')) return 'green';
  if (event.includes('login') || event.includes('sessions.create')) return 'blue';
  if (event.includes('delete') || event.includes('logout')) return 'red';
  if (event.includes('update')) return 'orange';
  return 'gray';
};

// 获取事件名称
const getEventName = (event: string) => {
  if (!event) return '未知事件';
  
  // 去掉前缀
  let eventName = event.replace('account.', '');
  
  // 常见事件映射
  const eventMap: Record<string, string> = {
    'sessions.create': '登录',
    'sessions.delete': '登出',
    'update.name': '更新名称',
    'update.password': '更新密码',
    'update.email': '更新邮箱',
    'update.prefs': '更新设置',
    'recovery.create': '密码重置',
    'verification.create': '邮箱验证',
    'jwt.create': '创建令牌'
  };
  
  // 查找匹配的事件
  for (const [key, value] of Object.entries(eventMap)) {
    if (eventName.includes(key)) {
      return value;
    }
  }
  
  // 默认返回原始事件名
  return eventName;
};

// 移除单个设备
const removeSession = async (sessionId: string) => {
  try {
    await deleteSession(sessionId);
    Message.success('设备已移除');
    await fetchSessions();
    await fetchSessionLogs(); // 同时刷新会话日志
  } catch (error) {
    console.error('移除设备失败:', error);
    Message.error('移除设备失败');
  }
};

// 移除所有其他设备
const removeAllSessions = async () => {
  try {
    await terminateAllOtherSessions();
    Message.success('已移除所有其他设备');
    await fetchSessions();
    await fetchSessionLogs(); // 同时刷新会话日志
  } catch (error) {
    console.error('移除设备失败:', error);
    Message.error('移除设备失败');
  }
};

// 绑定第三方账号
const handleLinkAccount = async (provider: 'github' | 'google' | 'wechat') => {
  linkingAccount.value[provider] = true;
  
  try {
    // 设置回调URL
    const successUrl = `${window.location.origin}/dashboard/profile?linkSuccess=${provider}`;
    const failureUrl = `${window.location.origin}/dashboard/profile?linkFailure=${provider}`;
    
    if (provider === 'github') {
      await loginWithGithub(successUrl, failureUrl);
    } else if (provider === 'google') {
      await loginWithGoogle(successUrl, failureUrl);
    } else if (provider === 'wechat') {
      // 微信登录暂未实现
      Message.warning('微信账号绑定功能正在开发中');
      linkingAccount.value[provider] = false;
    }
  } catch (error) {
    console.error(`绑定${provider}账号失败:`, error);
    Message.error(`绑定${provider}账号失败，请稍后再试`);
    linkingAccount.value[provider] = false;
  }
};

// 解除绑定第三方账号
const handleUnlinkAccount = async (provider: 'github' | 'google' | 'wechat') => {
  linkingAccount.value[provider] = true;
  
  try {
    // 获取当前身份列表
    const identities = await getIdentities();
    const identity = identities.identities.find(i => i.provider === provider);
    
    if (identity) {
      // 调用 deleteIdentity 方法解除绑定
      await deleteIdentity(identity.$id);
      Message.success(`已解除${provider}账号绑定`);
      
      // 更新本地状态
      userLinkedAccounts.value[provider] = '';
    }
  } catch (error) {
    console.error(`解除${provider}账号绑定失败:`, error);
    Message.error(`解除绑定失败，请稍后再试`);
  } finally {
    linkingAccount.value[provider] = false;
  }
};

// 检查URL参数，处理OAuth回调
const handleOAuthCallback = async () => {
  const route = useRoute();
  
  // 检查是否有成功绑定的参数
  const linkSuccess = route.query.linkSuccess as string;
  const linkFailure = route.query.linkFailure as string;
  
  if (linkSuccess) {
    try {
      // 重新获取身份信息
      const identities = await getIdentities();
      const provider = linkSuccess as 'github' | 'google' | 'wechat';
      const isLinked = identities.identities.some(i => i.provider === provider);
      
      if (isLinked) {
        userLinkedAccounts.value[provider] = '已关联';
        Message.success(`已成功绑定${provider}账号`);
      }
      
      return true;
    } catch (error) {
      console.error('处理OAuth回调失败:', error);
      Message.error('账号绑定失败，请稍后再试');
      return false;
    }
  } else if (linkFailure) {
    Message.error(`绑定${linkFailure}账号失败，请稍后再试`);
    return false;
  }
  
  return true;
};

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

// 获取国家图标
const getCountryFlag = (countryCode: string) => {
  if (!countryCode) return '';
  return getFlag(countryCode.toUpperCase(), 24, 24);
};

// 监听会话日志模态框显示状态
watch(showSessionLogsModal, (newVal) => {
  if (newVal) {
    fetchSessionLogs();
  }
});

// 格式化设备和操作系统信息
const formatDeviceInfo = (log: any) => {
  let result = '';
  
  // 如果有设备品牌信息，添加到结果中
  if (log.deviceInfo && log.deviceInfo.trim() !== '') {
    result += log.deviceInfo;
  }
  
  // 如果同时有设备和系统信息，添加空格分隔
  if (result && log.osInfo && log.osInfo.trim() !== '') {
    result += ' ';
  }
  
  // 添加操作系统信息
  if (log.osInfo && log.osInfo.trim() !== '') {
    result += log.osInfo;
  }
  
  return result || '未知设备';
};

// 切换会话日志展开状态
const toggleSessionLogs = () => {
  isLogsExpanded.value = !isLogsExpanded.value;
  
  // 如果展开且尚未加载过数据，则加载数据
  if (isLogsExpanded.value && sessionLogs.value.length === 0 && !loadingSessionLogs.value) {
    fetchSessionLogs();
  }
};

// 添加提交函数
const submitUpdatePhone = async () => {
  const success = await handleUpdatePhone();
  if (success) {
    showUpdatePhoneModal.value = false;
  }
};

// 增加密码更改状态
const isChangingPassword = ref(false);

// 添加提交函数
const submitChangePassword = async () => {
  const success = await handleChangePassword();
  if (success) {
    showChangePasswordModal.value = false;
  }
};

// 添加用户名修改相关状态
const showUpdateNameModal = ref(false);
const nameForm = ref({
  name: ''
});
const isUpdatingName = ref(false);

// 处理更新用户名
const submitUpdateName = async () => {
  // 验证表单
  if (!nameForm.value.name) {
    Message.error('请输入用户名');
    return;
  }
  
  isUpdatingName.value = true;
  try {
    // 调用 updateName 方法更新用户名
    await updateName(nameForm.value.name);
    
    // 更新本地状态
    userForm.value.name = nameForm.value.name;
    
    Message.success('用户名更新成功');
    showUpdateNameModal.value = false;
  } catch (error) {
    console.error('更新用户名失败:', error);
    const errorMessage = error instanceof Error ? error.message : '未知错误';
    Message.error(`更新用户名失败: ${errorMessage}`);
  } finally {
    isUpdatingName.value = false;
  }
};

// 添加电子邮件修改相关状态
const showUpdateEmailModal = ref(false);
const emailForm = ref({
  email: '',
  password: ''
});
const isUpdatingEmail = ref(false);

// 重置电子邮件表单
const resetEmailForm = () => {
  emailForm.value = {
    email: '',
    password: ''
  };
};

// 处理更新电子邮件
const submitUpdateEmail = async () => {
  // 验证表单
  if (!emailForm.value.email || !emailForm.value.password) {
    Message.error('请填写完整的邮箱和密码');
    return;
  }
  
  // 简单的邮箱格式验证
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailForm.value.email)) {
    Message.error('请输入有效的电子邮箱');
    return;
  }
  
  isUpdatingEmail.value = true;
  try {
    // 调用 updateEmail 方法更新邮箱
    await updateEmail(emailForm.value.email, emailForm.value.password);
    
    // 更新本地状态
    userForm.value.email = emailForm.value.email;
    userForm.value.emailVerified = false; // 新邮箱需要重新验证
    
    Message.success('邮箱更新成功，请留意验证邮件');
    showUpdateEmailModal.value = false;
  } catch (error) {
    console.error('更新邮箱失败:', error);
    const errorMessage = error instanceof Error ? error.message : '未知错误';
    Message.error(`更新邮箱失败: ${errorMessage}`);
  } finally {
    isUpdatingEmail.value = false;
  }
};

onMounted(async () => {
  // 所有请求并行执行，互不等待
  fetchUserData();
  handleOAuthCallback();
});
</script>