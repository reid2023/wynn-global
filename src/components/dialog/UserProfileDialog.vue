<template>
  <div class="user-profile-dialog common-dialog-middle">
    <!-- 弹窗头部 -->
    <div class="dialog-header">
      <h2 class="title text-gradient-gold-light">
        {{ t('profile.title') || 'Informações Pessoais' }}
      </h2>
      <button class="close-btn" @click="handleClose">
        <img src="@/assets/imgs/public/close.png" alt="Close" />
      </button>
    </div>

    <!-- 弹窗内容 -->
    <div class="dialog-body">
      <!-- 用户信息卡片 -->
      <div class="user-info-card">
        <div class="user-info-top">
          <!-- 用户头像 -->
          <img :src="userAvatar" alt="User Avatar" class="user-avatar" />

          <!-- 用户ID和余额 -->
          <div class="user-details">
            <div class="user-id">
              <div class="user-id-container">ID: {{ userID }}</div>
              <button class="copy-btn" @click="handleCopyID" title="copy">
                <img src="@/assets/imgs/public/copy.png" alt="copy" />
              </button>
            </div>
            <div class="user-balance">
              <img src="@/assets/imgs/home/jb.png" alt="jb" />
              <span class="text-gradient-gold balance-amount">{{
                Number(userBalance) == 0 ? '0.00' : userBalance
              }}</span>
            </div>
          </div>

          <!-- 存款按钮 -->
          <div class="btn-deposit">
            <FormButton type="recharge" label="Depósito" @click="handleDeposit" />
          </div>
        </div>
      </div>

      <!-- 头像选择区域 -->
      <div class="avatar-section">
        <div class="avatar-grid">
          <div class="avatar-grid-content">
            <div
              class="avatar-item"
              :class="{ active: uploadAvatar === avatar }"
              v-for="(avatar, index) in AVATAR_LIST.slice(0, 5)"
              :key="index"
              @click="uploadAvatar = avatar"
            >
              <img :src="avatar" alt="avatar" />
              <img v-if="uploadAvatar === avatar" src="@/assets/imgs/public/gou1.png" alt="check" />
            </div>
          </div>

          <FormButton
            type="withdraw"
            class="btn-action"
            label="Enviar Foto"
            @click="handleUploadPhoto"
          />
        </div>

        <div class="avatar-grid">
          <div class="avatar-grid-content">
            <div
              class="avatar-item"
              :class="{ active: uploadAvatar === avatar }"
              v-for="(avatar, index) in AVATAR_LIST.slice(5, 10)"
              :key="index"
              @click="uploadAvatar = avatar"
            >
              <img :src="avatar" alt="avatar" />
              <img v-if="uploadAvatar === avatar" src="@/assets/imgs/public/gou1.png" alt="check" />
            </div>
          </div>

          <FormButton
            type="recharge"
            class="btn-action"
            label="Trocar Avatar"
            :disabled="isSubmitAvatar"
            @click="handleChangeAvatar"
          />
        </div>
      </div>

      <!-- 账户信息部分 -->
      <div class="account-section">
        <h3 class="section-title text-gradient-gold">
          {{ t('profile.myAccount') || 'Minha Conta' }}
        </h3>

        <!-- 电话号码 -->
        <div class="form-group">
          <div class="phone-input-wrapper">
            <FormInput
              v-model="userPhone"
              type="phone"
              :max-length="11"
              :disabled="true"
              background-image-type="country-phone"
              :placeholder="t('profile.phonePlaceholder') || 'Digite seu número de telefone'"
            >
            </FormInput>
            <FormButton
              type="default"
              class="btn-action-sm"
              label="Sair"
              :disabled="isLogoutLoading"
              @click="handleLogout"
            />
          </div>
        </div>
      </div>

      <!-- 密码修改部分 -->
      <div class="password-section">
        <!-- 原始密码 -->
        <div class="form-group">
          <FormInput
            v-model="form.oldPassword"
            type="password"
            :allow-password="true"
            :max-length="12"
            :placeholder="
              t('profile.oldPasswordPlaceholder') || 'Por favor, insira a senha original'
            "
          />
        </div>

        <!-- 新密码 -->
        <div class="form-group">
          <FormInput
            v-model="form.newPassword"
            type="password"
            :allow-password="true"
            :max-length="12"
            :placeholder="
              t('profile.newPasswordPlaceholder') ||
              'Por favor, insira uma nova senha de 6-12 dígitos'
            "
          />
        </div>

        <!-- 修改密码按钮 -->
        <FormButton
          type="primary"
          class="btn-change-password"
          label="Alterar Senha"
          :disabled="isSubmitting"
          @click="handleChangePassword"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useDialogStore } from '@/stores/dialog';
import { showSuccessToast, showToast, showFailToast } from 'vant';
import { FormButton, FormInput } from '@/components';
import { useClipboard } from '@vueuse/core';
import { useUserStore } from '@/stores/userStore';
import { useWalletStore } from '@/stores/walletStore';
import { storeToRefs } from 'pinia';
import { formatCurrency } from '@/utils/math';
import { DEFAULT_AVATAR, AVATAR_LIST } from '@/config';
import { userApi } from '@/services';
import { createFormValidator, predefinedRules } from '@/utils/form-validator';
import useInit from '@/stores/init';

interface Props {
  params?: Record<string, any>;
}

withDefaults(defineProps<Props>(), {
  params: () => ({}),
});

const emit = defineEmits<{
  close: [];
}>();

const { t } = useI18n();
const dialogStore = useDialogStore();

const userStore = useUserStore();
const { userProfile } = storeToRefs(userStore);

const walletStore = useWalletStore();
const { userWalletBalance } = storeToRefs(walletStore);

const { initOnUserLogout } = useInit();

// 初始化 useClipboard
const { copy } = useClipboard();

// ==================== 数据配置 ====================
// 用户信息
const userAvatar = computed(() => {
  return userProfile.value?.avatar || DEFAULT_AVATAR;
});

// const userPhone = ref('');
const userPhone = computed(() => {
  const phone = userProfile.value?.phone ?? '';
  const splitPhone = phone.split('|')[1];
  return splitPhone || '';
});

const uploadAvatar = ref(userProfile.value?.avatar ?? '');

// 修改密码loading
const isSubmitting = ref(false);
// 修改头像loading
const isSubmitAvatar = ref(false);
// 退出登录loading
const isLogoutLoading = ref(false);

// 创建表单校验器
const validator = createFormValidator({
  new_password: {
    required: true,
    ...predefinedRules.password,
  },
  // old_password: {
  //   required: true,
  //   ...predefinedRules.password,
  // },
});

// 表单数据
const form = ref({
  oldPassword: '',
  newPassword: '',
});

// ==================== 方法 ====================

const userID = computed(() => userProfile.value?.user_id ?? '-');
const userBalance = computed(() =>
  formatCurrency(userWalletBalance.value.balance ?? 0, undefined, '', 'pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
);

/**
 * 复制用户 ID
 */
const handleCopyID = async () => {
  try {
    await copy(userID.value);
    showSuccessToast(t('common.copied') || 'Copiado');
  } catch (error) {
    console.error('Failed to copy user ID:', error);
  }
};

/**
 * 存款
 */
const handleDeposit = () => {
  dialogStore.openDialog('recharge');
};

/**
 * 上传照片
 */
const handleUploadPhoto = () => {
  return;
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        // userAvatar.value = event.target.result;
        showSuccessToast(t('profile.uploadSuccess') || 'Foto enviada com sucesso');
      };
      reader.readAsDataURL(file);
    }
  };
  input.click();
};

/**
 * 更换头像（选择已有头像）
 */
const handleChangeAvatar = async () => {
  if (!uploadAvatar.value) {
    showToast('Por favor, selecione um avatar.');
    return;
  }

  try {
    isSubmitAvatar.value = true;
    await userApi.updateAvatar({ avatar: uploadAvatar.value });
    showSuccessToast('Operação bem-sucedida');

    await userStore.getUserProfile();
  } catch (err) {
    //
  } finally {
    isSubmitAvatar.value = false;
  }
};

/**
 * 登出
 */
const handleLogout = async () => {
  emit('close');

  try {
    isLogoutLoading.value = true;

    await initOnUserLogout();

    // 登出逻辑
    showSuccessToast(t('profile.logout') || 'Desconectado');
  } finally {
    isLogoutLoading.value = false;
  }
};

/**
 * 修改密码
 */
const handleChangePassword = async () => {
  // 验证表单
  const validationResult = validator.validateAll({
    new_password: form.value.newPassword,
  });

  if (!validationResult.valid) {
    // 显示第一个错误
    const firstError = Object.values(validationResult.errors)[0];
    showFailToast(firstError);
    return;
  }

  try {
    isSubmitting.value = true;

    // 调用 API
    await userApi.updatePassword({
      new_password: form.value.newPassword,
      old_password: form.value.oldPassword,
    });

    showSuccessToast(t('profile.passwordChanged') || 'Senha alterada com sucesso');
    form.value.oldPassword = '';
    form.value.newPassword = '';
  } finally {
    isSubmitting.value = false;
  }
};

/**
 * 关闭弹窗
 */
const handleClose = () => {
  emit('close');
};
</script>

<style scoped lang="less">
.user-profile-dialog {
  .dialog-body {
    gap: 18px;
  }
}

// ==================== 用户信息卡片 ====================

.user-info-card {
  height: 150px;
  // background-color: #103c2c;
  padding: 16px 22px 16px 26px;
  display: flex;
  flex-direction: column;
  background: url('@/assets/imgs/public/gexx_1.png') no-repeat center;
  background-size: 100% 100%;

  .user-info-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    height: 100%;

    .user-avatar {
      width: 92px;
      height: 92px;
      border-radius: 50%;
      object-fit: cover;
    }

    .user-details {
      display: flex;
      flex-direction: column;
      gap: 10px;

      .user-id {
        display: flex;
        align-items: center;
        gap: 8px;

        .user-id-container {
          color: var(--color-white);
          font-size: 20px;
          font-weight: 600;
          letter-spacing: var(--letter-spacing-xs);
          height: 36px;
          width: 170px;
          background: url('@/assets/imgs/home/ID.png') no-repeat center / cover;
          background-size: contain;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          padding-left: 12px;
        }

        .copy-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;

          img {
            width: 44px;
            height: 44px;
            position: relative;
            top: 2px;
          }
        }
      }

      .user-balance {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        color: var(--color-white);
        height: 36px;
        width: 170px;
        gap: 2px;
        background: url('@/assets/imgs/home/ID.png') no-repeat center / cover;
        background-size: contain;

        img {
          width: 38px;
          height: 38px;
          position: relative;
          left: -4px;
        }

        .balance-symbol {
          font-size: 20px;
          font-weight: 900;
          letter-spacing: var(--letter-spacing-lg);
        }

        .balance-amount {
          font-weight: 600;
          letter-spacing: var(--letter-spacing-md);
          font-size: 20px;
        }
      }
    }

    .btn-deposit {
      flex: 1;
      display: flex;
      justify-content: flex-end;

      button {
        font-size: 20px;
        padding-bottom: 4px;
      }
    }
  }
}

// ==================== 头像选择区域 ====================

.avatar-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px 22px 16px 26px;
  background: url('@/assets/imgs/public/gexx_2.png') no-repeat center;
  background-size: 100% 100%;

  .avatar-grid {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 4px;

    &-content {
      flex: 1;
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 2px;
    }

    .avatar-item {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      object-fit: cover;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;

      img:nth-child(1) {
        width: 70px;
        height: 70px;
      }

      img:nth-child(2) {
        width: 40px;
        height: 40px;
        position: absolute;
        right: -10px;
        bottom: -10px;
      }
    }
  }

  .btn-action {
    font-size: 20px;
    padding-bottom: 4px;
  }
}

// ==================== 账户信息部分 ====================

.account-section {
  display: flex;
  flex-direction: column;
  gap: 12px;

  .section-title {
    font-size: 16px;
    font-weight: 700;
    margin: 0;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .form-label {
      font-size: 14px;
      font-weight: 600;
    }

    .phone-input-wrapper {
      display: flex;
      align-items: center;
      gap: 20px;

      :deep(.form-input-wrapper) {
        flex: 1;
      }

      .btn-action-sm {
        width: 168px;
      }
    }
  }
}

// ==================== 密码修改部分 ====================

.password-section {
  display: flex;
  flex-direction: column;
  gap: 20px;

  .section-title {
    font-size: 16px;
    font-weight: 700;
    margin: 0;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;

    :deep(.form-input-wrapper) {
      width: 100%;
    }
  }

  .btn-change-password {
    width: 100%;
    margin-top: 8px;
  }
}
</style>
