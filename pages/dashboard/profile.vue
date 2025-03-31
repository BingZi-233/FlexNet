<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">个人资料</h1>
    
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 个人信息卡片 -->
      <a-card class="lg:col-span-2">
        <template #title>基本信息</template>
        
        <a-form :model="userForm" layout="vertical">
          <div class="flex flex-wrap justify-center sm:justify-start mb-6">
            <div class="relative">
              <a-avatar :size="80" class="mb-2">
                <template v-if="avatarUrl">
                  <img :src="avatarUrl" alt="用户头像" />
                </template>
                <template v-else-if="initialsAvatarUrl">
                  <img :src="initialsAvatarUrl" alt="首字母头像" />
                </template>
                <template v-else>{{ nameInitial }}</template>
              </a-avatar>
              <div class="mt-2 flex justify-center">
                <a-upload 
                  action="#" 
                  :auto-upload="false" 
                  :show-file-list="false" 
                  :disabled="isUploading"
                  @change="onAvatarChange"
                >
                  <a-button type="primary" size="small" :loading="isUploading">
                    <template #icon><IconUpload /></template>
                    {{ isUploading ? '上传中...' : '更换头像' }}
                  </a-button>
                </a-upload>
              </div>
            </div>
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
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
          
          <a-form-item>
            <a-button type="primary" :loading="isSaving" @click="saveUserInfo">
              <template #icon><IconSave /></template>
              保存信息
            </a-button>
          </a-form-item>
        </a-form>
      </a-card>
      
      <!-- 账户安全卡片 -->
      <a-card>
        <template #title>账户安全</template>
        
        <div class="space-y-4">
          <div class="flex justify-between items-center pb-3 border-b border-gray-100">
            <div>
              <div class="font-medium">修改密码</div>
              <div class="text-gray-500 text-xs">定期更新密码可增强账户安全性</div>
            </div>
            <a-button type="text" @click="showChangePasswordModal = true">
              <template #icon><IconEdit /></template>
              修改
            </a-button>
          </div>
          
          <div class="flex justify-between items-center pb-3 border-b border-gray-100">
            <div>
              <div class="font-medium">邮箱验证</div>
              <div class="text-gray-500 text-xs">验证您的邮箱以保护账户安全</div>
            </div>
            <a-tag :color="userForm.emailVerified ? 'green' : 'orange'">
              {{ userForm.emailVerified ? '已验证' : '未验证' }}
            </a-tag>
          </div>
          
          <div class="flex justify-between items-center pb-3 border-b border-gray-100">
            <div>
              <div class="font-medium">两步验证</div>
              <div class="text-gray-500 text-xs">启用两步验证，提高账户安全性</div>
            </div>
            <a-switch v-model="userForm.twoFactorEnabled" disabled />
          </div>
          
          <div class="flex justify-between items-center pb-3">
            <div>
              <div class="font-medium">登录设备</div>
              <div class="text-gray-500 text-xs">管理当前已登录的设备</div>
            </div>
            <a-button type="text" @click="showSessionsModal = true">
              <template #icon><IconComputer /></template>
              查看
            </a-button>
          </div>
        </div>
      </a-card>
    </div>
    
    <!-- 修改密码模态框 -->
    <a-modal
      v-model:visible="showChangePasswordModal"
      title="修改密码"
      @cancel="resetPasswordForm"
      @before-ok="handleChangePassword"
    >
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
    </a-modal>
    
    <!-- 登录设备模态框 -->
    <a-modal
      v-model:visible="showSessionsModal"
      title="登录设备管理"
      @cancel="showSessionsModal = false"
    >
      <a-table :data="sessionsList" :loading="loadingSessions">
        <template #columns>
          <a-table-column title="设备" data-index="device">
            <template #cell="{ record }">
              <div class="flex items-center">
                <IconComputer class="mr-2" />
                <div>
                  <div>{{ record.device || '未知设备' }}</div>
                  <div class="text-xs text-gray-500">{{ record.ip || '未知IP' }}</div>
                </div>
              </div>
            </template>
          </a-table-column>
          <a-table-column title="位置" data-index="location" />
          <a-table-column title="登录时间" data-index="timeLogin" />
          <a-table-column title="操作" fixed="right" width="100">
            <template #cell="{ record }">
              <a-button 
                type="text" 
                status="danger" 
                size="small" 
                :disabled="record.current" 
                @click="removeSession(record.$id)"
              >
                移除
              </a-button>
            </template>
          </a-table-column>
        </template>
      </a-table>
      <div class="mt-4">
        <a-button type="primary" status="danger" @click="removeAllSessions">
          <template #icon><IconDelete /></template>
          移除所有其他设备
        </a-button>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useAppwriteAccount } from '~/composables/useAppwriteAccount';
import { useAppwriteAvatar } from '~/composables/useAppwriteAvatar';
import { useAppwriteStorage } from '~/composables/useAppwriteStorage';
import { Message } from '@arco-design/web-vue';

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
  updatePreferences 
} = useAppwriteAccount();

const { getInitialsAvatar, getGravatarImage } = useAppwriteAvatar();
const { uploadFile, getFileView } = useAppwriteStorage();

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

// 头像相关
const avatarUrl = ref<string | null>(null);
const initialsAvatarUrl = ref<string | null>(null);
const nameInitial = computed(() => {
  return userForm.value.name ? userForm.value.name.charAt(0).toUpperCase() : '用';
});

// 状态相关
const isSaving = ref(false);
const showChangePasswordModal = ref(false);
const showSessionsModal = ref(false);
const loadingSessions = ref(false);
const sessionsList = ref<any[]>([]);
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

      // 如果没有头像，生成首字母头像
      if (!avatarUrl.value) {
        initialsAvatarUrl.value = getInitialsAvatar(userForm.value.name, 80, 80, '#F2F3F5');
      }
    }
  } catch (error) {
    console.error('获取用户数据失败:', error);
    Message.error('获取用户数据失败');
  }
};

// 保存用户信息
const saveUserInfo = async () => {
  try {
    isSaving.value = true;
    
    // 更新用户名
    await updateName(userForm.value.name);
    
    // 更新用户偏好设置
    await updatePreferences({
      phone: userForm.value.phone,
      location: userForm.value.location,
      bio: userForm.value.bio,
      avatarUrl: avatarUrl.value
    });
    
    Message.success('保存成功');
  } catch (error) {
    console.error('保存用户信息失败:', error);
    Message.error('保存用户信息失败');
  } finally {
    isSaving.value = false;
  }
};

// 头像上传处理
const onAvatarChange = async (files: any) => {
  if (!files.fileList || files.fileList.length === 0) return;
  
  const file = files.fileList[0].file;
  if (!file) return;
  
  try {
    isUploading.value = true;
    
    // 上传文件到 Appwrite Storage
    const uploadResult = await uploadFile('avatars', file);
    
    if (uploadResult) {
      // 获取文件预览URL
      const fileUrl = getFileView('avatars', uploadResult.$id);
      
      // 更新头像URL
      avatarUrl.value = fileUrl;
      
      // 更新用户偏好设置
      await updatePreferences({
        avatarUrl: fileUrl
      });
      
      Message.success('头像更新成功');
    }
  } catch (error) {
    console.error('上传头像失败:', error);
    Message.error('上传头像失败');
  } finally {
    isUploading.value = false;
  }
};

// 获取会话列表
const fetchSessions = async () => {
  try {
    loadingSessions.value = true;
    const response = await getSessions();
    
    if (response && response.sessions) {
      sessionsList.value = response.sessions.map((session: any) => ({
        ...session,
        device: `${session.osName || '未知'} - ${session.clientName || '未知浏览器'}`,
        location: session.countryName || '未知地区',
        timeLogin: formatDate(session.dateCreated)
      }));
    }
  } catch (error) {
    console.error('获取会话列表失败:', error);
    Message.error('获取会话列表失败');
  } finally {
    loadingSessions.value = false;
  }
};

// 移除指定会话
const removeSession = async (sessionId: string) => {
  // 实际项目中需要调用Appwrite API移除会话
  console.log('移除会话:', sessionId);
  Message.success('已移除该设备');
};

// 移除所有其他会话
const removeAllSessions = async () => {
  // 实际项目中需要调用Appwrite API移除所有其他会话
  console.log('移除所有其他会话');
  Message.success('已移除所有其他设备');
};

// 修改密码
const handleChangePassword = async (done: (closed: boolean) => void) => {
  // 验证密码
  if (!passwordForm.value.oldPassword || !passwordForm.value.newPassword || !passwordForm.value.confirmPassword) {
    Message.error('请填写所有密码字段');
    done(false);
    return;
  }
  
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    Message.error('两次输入的新密码不一致');
    done(false);
    return;
  }
  
  try {
    // 更新密码
    await updatePassword(passwordForm.value.newPassword, passwordForm.value.oldPassword);
    Message.success('密码修改成功');
    resetPasswordForm();
    done(true);
  } catch (error) {
    console.error('修改密码失败:', error);
    Message.error('修改密码失败，请检查当前密码是否正确');
    done(false);
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

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

// 页面加载时获取数据
onMounted(() => {
  fetchUserData();
});

// 打开会话模态框时获取会话列表
watch(showSessionsModal, (value) => {
  if (value) {
    fetchSessions();
  }
});
</script> 