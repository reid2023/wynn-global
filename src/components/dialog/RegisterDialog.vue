<template>
  <div class="common-dialog-litter register-dialog">
    <!-- 弹窗头部 -->
    <div class="dialog-header">
      <h2 class="title text-gradient-gold">Registrar</h2>
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
          placeholder="Por favor, insira 6-12 dígitos e letras"
        />
      </div>

      <!-- 确认密码输入 -->
      <div class="form-group">
        <label class="form-label text-gradient-gold">Confirmar Senha</label>
        <FormInput
          v-model="form.password2"
          type="password"
          :allow-password="true"
          placeholder="Insira a senha novamente"
        />
      </div>

      <!-- 年龄确认复选框 -->
      <FormCheckbox v-model="form.isAdult" class="age-checkbox">
        Por lei, confirme que tem 18 anos ou mais.
      </FormCheckbox>

      <FormButton
        type="primary"
        class="btn-confirm"
        label="Registrar"
        :disabled="isSubmitting"
        @click="handleRegister"
      />

      <!-- 登录链接 -->
      <div class="login-link">
        Já tem uma conta?
        <button class="link-btn text-gradient-gold" @click="switchToLogin">Clique em Entrar</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { showLoadingToast, showSuccessToast, closeToast, showToast } from 'vant';
import { createFormValidator, predefinedRules } from '@/utils/form-validator';
import { userApi } from '@/services';
import { FormButton, FormInput, CountrySelect, FormCheckbox } from '@/components';
import { useDialogStore } from '@/stores/dialog';
import { useUserStore } from '@/stores/userStore';
import { local } from '@/utils/storage';
import { LOCAL_KEY } from '@/config';
import { COUNTRIES, type Country } from '@/config/countries';
import { find } from 'lodash-es';
import useInit from '@/stores/init';
import md5 from 'blueimp-md5';

const dialogStore = useDialogStore();

interface Props {
  dialogId: string;
  params?: Record<string, any>;
}

const props = withDefaults(defineProps<Props>(), {
  params: () => ({}),
});

const emit = defineEmits<{
  close: [];
  switchToLogin: [];
}>();

const getDefaultAult = () => {
  const isCheckUseAge = local.get(LOCAL_KEY.USER_AGE);
  if (isCheckUseAge) {
    return Boolean(isCheckUseAge);
  }

  return false;
};

// 表单数据
const form = ref({
  mobile: '',
  password: '',
  password2: '',
  countryCode: 'BR',
  isAdult: getDefaultAult(),
});

const isSubmitting = ref(false);

const userStore = useUserStore();

const { initAfterLogin } = useInit();

// 监听 isAdult 变化，同步到 localStorage
watch(
  () => form.value.isAdult,
  (newValue) => {
    local.set(LOCAL_KEY.USER_AGE, newValue);
  }
);

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
  password2: {
    required: true,
  },
});

/**
 * 处理注册
 */
const handleRegister = async () => {
  // 验证表单
  const validationResult = validator.validateAll({
    mobile: form.value.mobile,
    password: form.value.password,
    password2: form.value.password2,
  });

  if (!validationResult.valid) {
    // 显示第一个错误
    const firstError = Object.values(validationResult.errors)[0];
    showToast(firstError);
    return;
  }

  // 验证密码是否一致
  if (form.value.password !== form.value.password2) {
    showToast('As senhas não coincidem');
    return;
  }

  // 验证是否同意年龄确认
  if (!form.value.isAdult) {
    showToast('Por lei, confirme que tem 18 anos ou mais');
    return;
  }

  try {
    isSubmitting.value = true;
    showLoadingToast({
      message: 'Registrando...',
      forbidClick: true,
      duration: 0,
    });

    const countrieItem = find(COUNTRIES, { code: form.value.countryCode }) as Country;

    // Chamar API de registro
    const response = await userApi.register({
      mobile: form.value.mobile,
      // password: md5(form.value.password),
      // password2: md5(form.value.password),
      password: form.value.password,
      password2: form.value.password2,
      // areaCode: form.value.countryCode,
      areaCode: Number(countrieItem?.dialCode),
    });

    if (response.data) {
      showSuccessToast('Registrar sucesso');

      dialogStore.closeDialog(props.dialogId);
      // 更新用户信息
      userStore.setIsLoggedIn(response.data);

      // 执行登录后初始化
      initAfterLogin();

      // 延迟关闭弹窗，让用户看到成功提示
      setTimeout(() => {
        handleClose();
      }, 500);

      // // 延迟关闭弹窗，让用户看到成功提示
      // setTimeout(() => {
      //   dialogStore.openDialog('login');
      // }, 500);
    } else {
      showToast(response.message || 'Falha ao registrar');
    }
  } catch (error) {
    // showToast('Falha ao registrar, por favor tente novamente');
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
 * 切换到登录
 */
const switchToLogin = () => {
  dialogStore.closeDialog(props.dialogId);
  dialogStore.openDialog('login');
  emit('switchToLogin');
};
</script>

<style scoped lang="less">
.register-dialog {
  .phone-input-wrapper {
    display: flex;
    gap: 20px;
    align-items: center;
  }

  .country-text {
    flex: 1;
  }

  .age-checkbox {
    margin-top: 4px;
    margin-bottom: 12px;
  }

  .login-link {
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
