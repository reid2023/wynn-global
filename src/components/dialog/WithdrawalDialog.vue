<template>
  <div class="withdrawal-dialog common-dialog-large">
    <!-- 头部 -->
    <div class="dialog-header">
      <h1 class="title text-gradient-gold-light">Saque</h1>
      <button class="close-btn" @click="handleClose">
        <img src="@/assets/imgs/public/close.png" alt="Close" />
      </button>
    </div>

    <!-- 内容区域 -->
    <div class="dialog-body">
      <!-- 表单区域 -->
      <div class="form-section">
        <div class="form-group">
          <label class="form-label text-gradient-gold">Minha Conta</label>
          <FormInput
            :model-value="''"
            type="text"
            disabled
            placeholder=""
            class="account-balance-input"
          >
            <template #prefix>
              <div class="account-prefix">
                <img src="@/assets/imgs/public/jb.png" alt="Balance" class="balance-icon" />
                <span class="balance-amount">
                  <span class="text-gradient-gold">{{ userBalance }}</span></span
                >
              </div>
            </template>
          </FormInput>
        </div>

        <!-- 提现金额 -->
        <div class="form-group">
          <label class="form-label text-gradient-gold">Saque</label>
          <FormInput
            v-model="form.amount"
            type="number"
            placeholder="Por favor, insira o valor (50-5000)"
            :max-length="6"
          />
        </div>

        <div class="form-line"></div>

        <!-- Conta PIX 标题 -->
        <h3 class="section-title text-gradient-gold">Conta PIX</h3>

        <!-- 账户类型 -->
        <div class="form-group">
          <label class="form-label text-gradient-gold">Tipo</label>
          <FormInput
            :model-value="form.accountType"
            type="text"
            placeholder="Por favor, insira seu nome"
          />
        </div>

        <!-- 账户持有人姓名 -->
        <div class="form-group">
          <label class="form-label text-gradient-gold">Nome</label>
          <FormInput
            :model-value="form.name"
            type="text"
            placeholder="Por favor, insira seu nome"
          />
        </div>

        <!-- CPF/CNPJ -->
        <div class="form-group">
          <label class="form-label text-gradient-gold">
            {{ form.accountType === 'cpf' ? 'CPF' : 'CNPJ' }}
          </label>
          <FormInput
            :model-value="form.cpf"
            type="text"
            :placeholder="
              form.accountType === 'cpf'
                ? 'Por favor, insira o número'
                : 'Por favor, insira o número'
            "
            @update:modelValue="(value) => (form.cpf = value)"
          />
        </div>
        <div class="form-line"></div>
      </div>

      <!-- 提交按钮 -->
      <div class="form-actions">
        <FormButton type="primary" :loading="isLoading" @click="handleSubmit">
          {{ isLoading ? 'Processando...' : 'Confirmar' }}
        </FormButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useWalletStore } from '@/stores/walletStore';
import { FormInput, FormButton } from '@/components';
import { storeToRefs } from 'pinia';
import { formatCurrency } from '@/utils/math';

interface Props {
  dialogId: string;
  params?: Record<string, any>;
}

const props = withDefaults(defineProps<Props>(), {});

const emit = defineEmits<{
  close: [];
}>();

const walletStore = useWalletStore();
const { userWalletBalance } = storeToRefs(walletStore);

const isLoading = ref(false);

const form = ref({
  amount: '',
  name: '',
  cpf: '',
  accountType: 'cpf',
});

// 用户余额
const computedUserBalance = computed(() => userWalletBalance.value.balance ?? 0);

const userBalance = computed(() => {
  return formatCurrency(computedUserBalance.value, undefined, 'R$', 'pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
});

// ==================== 方法 ====================

/**
 * 处理提交
 */
const handleSubmit = async () => {
  console.log(1111, form);
};

/**
 * 关闭对话框
 */
const handleClose = () => {
  form.value = {
    amount: '',
    name: '',
    cpf: '',
    accountType: 'cpf',
  };
  isLoading.value = false;

  emit('close');
};
</script>

<style scoped lang="less">
// ==================== 内容区域 ====================
.withdrawal-dialog {
  .dialog-body {
    gap: 0;
  }
}

// ==================== 表单样式 ====================
.account-balance-input {
  :deep(.form-input) {
    padding-left: 120px;
  }

  .account-prefix {
    position: absolute;
    display: flex;
    align-items: center;
    gap: 8px;
    height: 60px;
    padding: 0 24px;

    .balance-icon {
      width: 38px;
      height: 38px;
      object-fit: contain;
    }

    .balance-amount {
      font-size: 22px;
      font-weight: 600;
    }
  }
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.form-line {
  width: 100%;
  height: 3px;
  margin-top: 10px;

  background-image: url('@/assets/imgs/public/xian.png');
  background-repeat: no-repeat;
  background-position: left 0 top 0;
  background-size: 100%;
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  padding-bottom: 8px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;

  .form-label {
    font-size: 14px;
    font-weight: 600;
    display: block;
  }
}

// ==================== 按钮区域 ====================

.form-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;

  :deep(.form-button) {
    flex: 1;
  }
}
</style>
