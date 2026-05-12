<template>
  <div class="common-dialog-litter login-dialog">
    <!-- 弹窗头部 -->
    <div class="dialog-header">
      <h2 class="title text-gradient-gold-light">Entrar</h2>
      <button class="close-btn" @click="handleClose">
        <img src="@/assets/imgs/public/close.png" alt="Close" />
      </button>
    </div>

    <!-- 弹窗内容 -->
    <div class="dialog-body">
      <!-- 电话号码输入 -->
      <div class="form-group">
        <label class="form-label text-gradient-gold">Número de Telefone</label>
        <div class="phone-input-wrapper">
          <CountrySelect v-model="form.countryCode" :allow-select="false" />
          <FormInput
            v-model="form.mobile"
            type="phone"
            :max-length="11"
            backgroundImageType="phone"
            placeholder="Por favor, insira seu número de telefone"
            class="country-text"
          />
        </div>
      </div>

      <!-- 密码输入 -->
      <div class="form-group">
        <label class="form-label text-gradient-gold">Insira Senha</label>
        <FormInput
          v-model="form.password"
          type="password"
          :allow-password="true"
          backgroundImageType="fill"
          :max-length="12"
          placeholder="Por favor, insira 6-12 dígitos e letras"
        />
      </div>

      <FormButton
        type="primary"
        class="btn-confirm"
        label="Entrar"
        :disabled="isSubmitting"
        @click="handleLogin"
      />

      <!-- 注册链接 -->
      <div class="register-link">
        Já tem uma conta?
        <button class="link-btn text-gradient-gold" @click="switchToRegister">
          Clique em Registrar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { showLoadingToast, showSuccessToast, showToast, closeToast } from 'vant';
import { createFormValidator, predefinedRules } from '@/utils/form-validator';
import { userApi } from '@/services';
import { FormButton, FormInput, CountrySelect } from '@/components';
import { useUserStore } from '@/stores/userStore';
import { useDialogStore } from '@/stores/dialog';
import { COUNTRIES, type Country } from '@/config/countries';
import { find } from 'lodash-es';
import useInit from '@/stores/init';
import md5 from 'blueimp-md5';

interface Props {
  dialogId: string;
  params?: Record<string, any>;
}

const props = withDefaults(defineProps<Props>(), {
  params: () => ({}),
});

const emit = defineEmits<{
  close: [];
  switchToRegister: [];
}>();

const dialogStore = useDialogStore();

// 表单数据
const form = ref({
  mobile: '',
  password: '',
  countryCode: 'BR',
});

const isSubmitting = ref(false);

const userStore = useUserStore();

const { initAfterLogin } = useInit();

// 创建表单校验器
const validator = createFormValidator({
  mobile: {
    required: true,
    ...predefinedRules.brPhone,
  },
  password: {
    required: true,
    ...predefinedRules.password,
  },
});

/**
 * 处理登录
 */
const handleLogin = async () => {
  // 验证表单
  const validationResult = validator.validateAll({
    mobile: form.value.mobile,
    password: form.value.password,
  });

  if (!validationResult.valid) {
    // 显示第一个错误
    const firstError = Object.values(validationResult.errors)[0];
    showToast(firstError);
    return;
  }

  try {
    isSubmitting.value = true;
    showLoadingToast({
      message: 'Login...',
      forbidClick: true,
      duration: 0,
    });

    const countrieItem = find(COUNTRIES, { code: form.value.countryCode }) as Country;

    // 调用登录 API，密码使用 MD5 加密
    const response = await userApi.login({
      mobile: form.value.mobile,
      // phone: `${Number(countrieItem?.dialCode)}|${form.value.mobile}`,
      // password: md5(form.value.password),
      password: form.value.password,
      // areaCode: form.value.countryCode,
      areaCode: Number(countrieItem?.dialCode),
    });

    if (response.data) {
      showSuccessToast('Login successful');

      dialogStore.closeDialog(props.dialogId);
      // 更新用户信息
      userStore.setIsLoggedIn(response.data);

      // 执行登录后初始化
      initAfterLogin();

      // 延迟关闭弹窗，让用户看到成功提示
      setTimeout(() => {
        handleClose();
      }, 500);
    } else {
      showToast(response.message || 'Falha ao entrar');
    }
  } catch (error) {
    // API 层已经处理异常消息提示
  } finally {
    closeToast();
    isSubmitting.value = false;
  }
};

/**
 * 关闭弹窗
 */
const handleClose = () => {
  emit('close');
};

/**
 * 切换到注册
 */
const switchToRegister = () => {
  dialogStore.closeDialog(props.dialogId);
  dialogStore.openDialog('register');
  emit('switchToRegister');
};
</script>

<style scoped lang="less">
.login-dialog {
  .dialog-body {
    padding-top: 100px;
  }

  .phone-input-wrapper {
    display: flex;
    gap: 20px;
    align-items: center;
  }

  .country-text {
    flex: 1;
  }

  .btn-confirm {
    margin-top: 20px;
  }

  .register-link {
    text-align: center;
    font-size: 18px;
    color: var(--color-primary);

    .link-btn {
      border: none;
      font-weight: 600;
      font-size: 19px;
      cursor: pointer;
      padding: 0;
      margin-left: 4px;
      transition: color 0.2s ease;

      &:hover {
        color: var(--color-primary);
      }
    }
  }
}
</style>
