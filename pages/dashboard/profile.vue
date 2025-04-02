<template>
  <div class="max-w-6xl mx-auto px-3 sm:px-4 py-6">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-primary">个人资料</h1>
      <a-button type="primary" :loading="isSaving" @click="saveUserInfo">
        <template #icon><IconSave /></template>
        保存信息
      </a-button>
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- 左侧：个人信息卡片 -->
      <div class="lg:col-span-8 space-y-5">
        <!-- 基本信息卡片 -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700">
          <div class="border-b border-gray-100 dark:border-gray-700 p-4">
            <div class="flex items-center">
              <IconUser class="mr-2 text-primary text-lg" />
              <span class="text-lg font-medium">基本信息</span>
            </div>
          </div>
          
          <div class="p-5">
            <div class="flex flex-col sm:flex-row gap-6">
              <!-- 头像区域 -->
              <div class="flex flex-col items-center sm:items-start">
                <div class="relative group">
                  <div class="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-100 dark:border-gray-700 shadow-md group-hover:shadow-lg transition-all duration-300">
                    <a-avatar :size="96" class="!w-full !h-full">
                      <template v-if="avatarUrl">
                        <img :src="avatarUrl" alt="用户头像" class="w-full h-full object-cover" />
                      </template>
                      <template v-else>
                        <IconUser style="font-size: 40px" />
                      </template>
                    </a-avatar>
                  </div>
                  <div class="mt-3 flex justify-center">
                    <a-upload 
                      action="#" 
                      :auto-upload="false" 
                      :show-file-list="false" 
                      :disabled="isUploading"
                      @change="onAvatarChange"
                    >
                      <a-button type="outline" size="small" :loading="isUploading">
                        <template #icon><IconUpload /></template>
                        {{ isUploading ? '上传中...' : '更换头像' }}
                      </a-button>
                    </a-upload>
                  </div>
                </div>
              </div>
              
              <!-- 表单区域 -->
              <div class="flex-1">
                <a-form :model="userForm" layout="vertical">
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                    <a-form-item field="name" label="用户名" validate-trigger="blur">
                      <a-input 
                        v-model="userForm.name" 
                        placeholder="请输入用户名" 
                        :max-length="30"
                        allow-clear
                      />
                    </a-form-item>
                    
                    <a-form-item field="email" label="电子邮箱" disabled>
                      <a-input
                        v-model="userForm.email"
                        placeholder="请输入电子邮箱"
                        disabled
                      />
                    </a-form-item>
                    
                    <a-form-item field="phone" label="手机号码" validate-trigger="blur">
                      <a-input
                        v-model="userForm.phone"
                        placeholder="请输入手机号码"
                        allow-clear
                      />
                    </a-form-item>
                    
                    <a-form-item field="location" label="所在地区" validate-trigger="blur">
                      <a-input
                        v-model="userForm.location"
                        placeholder="请输入所在地区"
                        allow-clear
                      />
                    </a-form-item>
                  </div>
                  
                  <a-form-item field="bio" label="个人简介">
                    <a-textarea
                      v-model="userForm.bio"
                      placeholder="请输入个人简介"
                      :max-length="200"
                      show-word-limit
                      allow-clear
                    />
                  </a-form-item>
                </a-form>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 第三方账号绑定卡片 -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700">
          <div class="border-b border-gray-100 dark:border-gray-700 p-4">
            <div class="flex items-center">
              <IconLink class="mr-2 text-primary text-lg" />
              <span class="text-lg font-medium">账号关联</span>
            </div>
          </div>
          
          <div class="p-4">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
              <!-- GitHub -->
              <div class="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300 border border-transparent hover:border-gray-200 dark:hover:border-gray-600 w-full">
                <div class="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full mr-3 shadow-sm">
                  <IconGithub class="text-xl" />
                </div>
                <div class="flex-1">
                  <div class="font-medium text-sm">GitHub</div>
                  <div class="text-gray-500 dark:text-gray-400 text-xs mt-0.5">
                    {{ userLinkedAccounts.github ? '已关联' : '未关联' }}
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
              <div class="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300 border border-transparent hover:border-gray-200 dark:hover:border-gray-600 w-full">
                <div class="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full mr-3 shadow-sm">
                  <IconGoogle class="text-xl" />
                </div>
                <div class="flex-1">
                  <div class="font-medium text-sm">Google</div>
                  <div class="text-gray-500 dark:text-gray-400 text-xs mt-0.5">
                    {{ userLinkedAccounts.google ? '已关联' : '未关联' }}
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
              <div class="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300 border border-transparent hover:border-gray-200 dark:hover:border-gray-600 w-full">
                <div class="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full mr-3 shadow-sm">
                  <IconWechat class="text-xl" />
                </div>
                <div class="flex-1">
                  <div class="font-medium text-sm">微信</div>
                  <div class="text-gray-500 dark:text-gray-400 text-xs mt-0.5">
                    {{ userLinkedAccounts.wechat ? '已关联' : '未关联' }}
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
      
      <!-- 右侧：账户安全卡片 -->
      <div class="lg:col-span-4 space-y-5">
        <!-- 用户信息卡片 -->
        <div class="bg-gradient-to-br from-primary/5 to-secondary/15 dark:from-primary/10 dark:to-secondary/20 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 p-5">
          <div class="text-center">
            <div class="w-16 h-16 mx-auto mb-3 bg-white dark:bg-gray-800 rounded-full shadow-md flex items-center justify-center">
              <IconUser class="text-2xl text-primary" />
            </div>
            <div class="font-medium text-base">{{ userForm.name || '用户' }}</div>
            <div class="text-gray-500 dark:text-gray-400 text-xs mt-0.5 mb-3">{{ userForm.email }}</div>
            <div class="inline-block bg-primary bg-opacity-10 text-primary rounded-full px-3 py-0.5 text-xs font-medium">
              标准用户
            </div>
          </div>
        </div>
        
        <!-- 安全设置卡片 -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700">
          <div class="border-b border-gray-100 dark:border-gray-700 p-4">
            <div class="flex items-center">
              <IconLock class="mr-2 text-primary text-lg" />
              <span class="text-lg font-medium">安全设置</span>
            </div>
          </div>
          
          <div class="divide-y divide-gray-100 dark:divide-gray-700">
            <!-- 修改密码 -->
            <div class="flex justify-between items-center py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div>
                <div class="font-medium text-sm">账户密码</div>
                <div class="text-gray-500 dark:text-gray-400 text-xs mt-0.5">定期修改密码可以保障账户安全</div>
              </div>
              <a-button type="text" size="small" @click="showChangePasswordModal = true" class="text-primary px-0">
                修改
              </a-button>
            </div>
            
            <!-- 登录设备 -->
            <div class="flex justify-between items-center py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div>
                <div class="font-medium text-sm">登录设备</div>
                <div class="text-gray-500 dark:text-gray-400 text-xs mt-0.5">查看并管理已登录的设备</div>
              </div>
              <a-button type="text" size="small" @click="showSessionsModal = true" class="text-primary px-0">
                管理
              </a-button>
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
      @before-ok="handleChangePassword"
    >
      <div class="p-2">
        <a-form :model="passwordForm" layout="vertical">
          <a-form-item field="oldPassword" label="当前密码" required>
            <a-input-password
              v-model="passwordForm.oldPassword"
              placeholder="请输入当前密码"
              allow-clear
            />
          </a-form-item>
          
          <a-form-item field="newPassword" label="新密码" required>
            <a-input-password
              v-model="passwordForm.newPassword"
              placeholder="请输入新密码"
              allow-clear
            />
            <div class="mt-1 text-xs text-gray-500">密码应包含大小写字母、数字和特殊字符，长度至少8位</div>
          </a-form-item>
          
          <a-form-item field="confirmPassword" label="确认新密码" required>
            <a-input-password
              v-model="passwordForm.confirmPassword"
              placeholder="请再次输入新密码"
              allow-clear
            />
          </a-form-item>
        </a-form>
      </div>
    </a-modal>
    
    <!-- 登录设备模态框 -->
    <a-modal
      v-model:visible="showSessionsModal"
      title="登录设备管理"
      @cancel="showSessionsModal = false"
      :footer="false"
    >
      <div class="p-2">
        <a-table :data="sessionsList" :loading="loadingSessions" :pagination="false" size="small">
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
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useAppwriteAccount } from '~/composables/useAppwriteAccount';
import { useAppwriteStorage } from '~/composables/useAppwriteStorage';
import { Message } from '@arco-design/web-vue';
import type { Models } from 'appwrite';

definePageMeta({
  layout: 'dashboard'
});

// 获取Appwrite服务
const { 
  getCurrentUser, 
  updateName, 
  updatePassword, 
  getSessions, 
  getPreferences, 
  updatePreferences,
  loginWithGithub,
  loginWithGoogle,
  getIdentities,
  deleteIdentity
} = useAppwriteAccount();

const { uploadFile, getFileViewUrl } = useAppwriteStorage();

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
const loadingSessions = ref(false);
const sessionsList = ref<Models.SessionList | null>(null);
const isUploading = ref(false);

// 获取用户信息
const fetchUserData = async () => {
  try {
    const user = await getCurrentUser();
    if (user) {
      userForm.value.name = user.name || '';
      userForm.value.email = user.email;
      userForm.value.emailVerified = user.emailVerification || false;
      
      // 获取用户偏好设置
      const prefs = await getPreferences();
      
      if (prefs) {
        userForm.value.phone = prefs.phone || '';
        userForm.value.location = prefs.location || '';
        userForm.value.bio = prefs.bio || '';
        userForm.value.twoFactorEnabled = prefs.twoFactorEnabled || false;
        avatarUrl.value = prefs.avatarUrl || null;
      }

      // 获取第三方账号绑定信息
      const identities = await getIdentities();
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

// 保存用户信息
const saveUserInfo = async () => {
  isSaving.value = true;
  try {
    // 更新用户名
    if (userForm.value.name) {
      await updateName(userForm.value.name);
    }
    
    // 更新用户偏好设置
    await updatePreferences({
      phone: userForm.value.phone,
      location: userForm.value.location,
      bio: userForm.value.bio,
      twoFactorEnabled: userForm.value.twoFactorEnabled,
      avatarUrl: avatarUrl.value
    });
    
    Message.success('个人信息更新成功');
  } catch (error) {
    console.error('保存用户信息失败:', error);
    Message.error('保存用户信息失败');
  } finally {
    isSaving.value = false;
  }
};

// 处理头像上传
const onAvatarChange = async (file: File) => {
  isUploading.value = true;
  try {
    const uploadedFile = await uploadFile(file);
    avatarUrl.value = await getFileViewUrl(uploadedFile.$id);
    Message.success('头像上传成功');
  } catch (error) {
    console.error('头像上传失败:', error);
    Message.error('头像上传失败');
  } finally {
    isUploading.value = false;
  }
};

// 修改密码
const handleChangePassword = async () => {
  try {
    if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
      Message.error('两次输入的密码不一致');
      return false;
    }
    
    await updatePassword(passwordForm.value.oldPassword, passwordForm.value.newPassword);
    Message.success('密码修改成功');
    resetPasswordForm();
    return true;
  } catch (error) {
    console.error('修改密码失败:', error);
    Message.error('修改密码失败');
    return false;
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
  } catch (error) {
    console.error('获取登录设备列表失败:', error);
    Message.error('获取登录设备列表失败');
  } finally {
    loadingSessions.value = false;
  }
};

// 移除单个设备
const removeSession = async (sessionId: string) => {
  try {
    // TODO: 实现移除单个设备的功能
    Message.success('设备已移除');
    await fetchSessions();
  } catch (error) {
    console.error('移除设备失败:', error);
    Message.error('移除设备失败');
  }
};

// 移除所有其他设备
const removeAllSessions = async () => {
  try {
    // TODO: 实现移除所有其他设备的功能
    Message.success('已移除所有其他设备');
    await fetchSessions();
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
    } catch (error) {
      console.error('处理OAuth回调失败:', error);
      Message.error('账号绑定失败，请稍后再试');
    }
  } else if (linkFailure) {
    Message.error(`绑定${linkFailure}账号失败，请稍后再试`);
  }
};

onMounted(async () => {
  await fetchUserData();
  await handleOAuthCallback();
});
</script>