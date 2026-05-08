<template>
  <div class="third-party-payment-dialog common-dialog-litter">
    <!-- 弹窗头部 -->
    <div class="dialog-header">
      <h2 class="title text-gradient-gold-light">Depósito</h2>
      <button class="close-btn" @click="handleClose">
        <img src="@/assets/imgs/public/close.png" alt="Close" />
      </button>
    </div>

    <!-- 弹窗内容 -->
    <div class="dialog-body">
      <!-- 支付方式和金额 -->
      <div class="payment-header">
        <div class="payment-method">
          <img :src="paymentMethodIcon" alt="payment method" class="method-icon" />
        </div>

        <div class="payment-amount">
          <img src="@/assets/imgs/public/jb.png" alt="jb" />
          <span class="text-gradient-gold">{{ formattedRechargeAmount }}</span>
        </div>
      </div>

      <div class="divider"></div>

      <!-- 二维码区域 -->
      <div class="qrcode-section">
        <div class="qrcode-container">
          <img ref="qrcodeImage" :src="qrcodeDataUrl" class="qrcode-img" alt="QRCode" />
        </div>
        <!-- 下载按钮 -->
        <button class="download-btn" @click="handleDownloadQRCode" title="download qrcode">
          <img src="@/assets/imgs/public/xz.png" alt="download" />
        </button>
      </div>

      <!-- 提示文本 -->
      <p class="hint-text">
        <img class="icon" src="@/assets/imgs/public/ts.png" alt="ts" />
        <span class="text-gradient-gold">
          Por favor, use pagamento/escaneie/QR para fazer o pagamento</span
        >
      </p>
    </div>

    <!-- 底部按钮 -->
    <div class="footer-btn">
      <FormButton
        type="primary"
        class="btn-copy-code"
        label="Copiar Código PIX"
        @click="handleCopyCode"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue';
import { FormButton } from '@/components';
import { useClipboard } from '@vueuse/core';
import QRCode from 'qrcode';
import { storeToRefs } from 'pinia';
import { showSuccessToast } from 'vant';
import { useWalletStore } from '@/stores/walletStore';
import { formatCurrency } from '@/utils/math';
import { useI18n } from 'vue-i18n';

interface Props {
  params?: Record<string, any>;
}

const props = withDefaults(defineProps<Props>(), {
  params: () => ({}),
});

const emit = defineEmits<{
  close: [];
}>();

const walletStore = useWalletStore();
const { userRechargeAmount, userRechargeInfo } = storeToRefs(walletStore);

const { t } = useI18n();

// 从参数中获取支付信息
const amount = computed(() => userRechargeAmount.value ?? 0);
const pixCode = computed(() => userRechargeInfo.value?.pix_qr || 'www.baidu.com');
const paymentMethod = computed(() => props.params?.method || 'pix');

// 支付方式图标映射
const paymentMethodIconMap: Record<string, string> = {
  pix: new URL('@/assets/imgs/public/pix.png', import.meta.url).href,
};

const paymentMethodIcon = computed(() => paymentMethodIconMap[paymentMethod.value] || '');

const formattedRechargeAmount = computed(() =>
  formatCurrency(amount.value, undefined, 'R$', 'pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
);

const qrcodeImage = ref<HTMLImageElement>();
const qrcodeDataUrl = ref<string>('');

// 初始化 useClipboard
const { copy } = useClipboard();

/**
 * 生成二维码
 */
const generateQRCode = async () => {
  try {
    // 生成二维码为数据 URL
    const dataUrl = await QRCode.toDataURL(pixCode.value, {
      width: 300,
      margin: 0.5,
      color: {
        dark: '#000',
        light: '#fff',
      },
    });
    qrcodeDataUrl.value = dataUrl;
  } catch (error) {
    console.error('Failed to generate QRCode:', error);
  }
};

/**
 * 下载二维码
 */
const handleDownloadQRCode = () => {
  if (qrcodeImage.value) {
    const link = document.createElement('a');
    link.href = qrcodeDataUrl.value;
    link.download = `pix-${amount.value}.png`;
    link.click();
  }
};

/**
 * 复制PIX代码
 */
const handleCopyCode = async () => {
  try {
    await copy(pixCode.value);
    console.log('PIX code copied to clipboard');
    // handleClose();
    showSuccessToast(t('common.copied') || 'Copiado com sucesso');
  } catch (error) {
    console.error('Failed to copy PIX code:', error);
  }
};

/**
 * 关闭弹窗
 */
const handleClose = () => {
  emit('close');
};

// 监听参数变化，重新生成二维码
watch(
  () => props.params?.pixCode,
  async () => {
    await generateQRCode();
  },
  { immediate: false }
);

// 组件挂载时生成二维码
onMounted(async () => {
  await generateQRCode();
});
</script>

<style scoped lang="less">
.third-party-payment-dialog {
  .dialog-body {
    gap: 14px;
  }
}

.payment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .payment-method {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 229px;
    height: 83px;
    border-radius: 8px;

    .method-icon {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  .payment-amount {
    height: 53px;
    padding: 0 12px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 10px;

    width: 209px;
    height: 83px;
    background-image: url('@/assets/imgs/form/btn_k_4.png');
    background-repeat: no-repeat;
    background-position: left 0 top 0;
    background-size: 100%;

    img {
      width: 38px;
      height: 38px;
      position: relative;
      bottom: 4px;
    }

    span {
      font-size: 22px;
      font-weight: 600;
      position: relative;
      bottom: 4px;
    }
  }
}

.divider {
  width: 100%;
  height: 3px;
  background-image: url('@/assets/imgs/public/xian.png');
  background-repeat: no-repeat;
  background-position: left 0 top 0;
  background-size: 100%;
}

.qrcode-section {
  display: flex;
  flex-direction: column;
  align-items: center;

  .qrcode-container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 330px;
    height: 330px;
    border-radius: 12px;

    background-image: url('@/assets/imgs/public/qr_bg.png');
    background-repeat: no-repeat;
    background-position: left 0 top 0;
    background-size: 100%;

    .qrcode-img {
      border: 2px solid #d4af37;
      border-radius: 12px;
      width: 294px;
      height: 294px;
      display: block;
      object-fit: contain;

      position: relative;
      bottom: 4px;
    }
  }

  .download-btn {
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;

    img {
      width: 70px;
      height: 70px;
      object-fit: contain;
      position: relative;
      top: 6px;
    }
  }
}

.hint-text {
  display: flex;
  align-items: center;
  height: 70px;

  background-image: url('@/assets/imgs/form/k3.png');
  background-repeat: no-repeat;
  background-position: left 0 top 0;
  background-size: 100% 76px;

  gap: 10px;
  padding: 0 20px;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 10px;

  .icon {
    width: 38px;
    height: 38px;
    position: relative;
    bottom: -1px;
  }

  span {
    font-size: 18px;
  }
}

.footer-btn {
  padding: 0 20px 0;

  .btn-copy-code {
    width: 100%;
  }
}
</style>
