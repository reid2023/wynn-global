<template>
  <div class="share-dialog">
    <!-- 弹窗头部 -->
    <div class="dialog-header">
      <button class="close-btn" @click="handleClose">
        <img src="@/assets/imgs/invite/gb.png" alt="Close" />
      </button>
    </div>

    <!-- 弹窗内容 -->
    <div class="dialog-body">
      <!-- 描述文本 -->
      <div class="description">
        <p class="desc-main">Convide amigos e ganhe!</p>
        <p class="desc-text">Convide seus amigos para jogar.</p>
        <p class="desc-text">
          Quando um amigo depositar
          <span class="text-gradient-gold-yellow">{{
            formatCurrency(computedRechargeAmount, 2, 'R$')
          }}</span>
        </p>
        <p class="desc-text">
          você ganha na hora
          <span class="text-gradient-gold-yellow">{{
            formatCurrency(computedRewardAmount, 2, 'R$')
          }}</span>
          de bônus!
        </p>
        <p class="desc-text">Quanto mais amigos, mais você ganha!</p>
      </div>

      <div class="share-body">
        <!-- 邀请链接部分 -->
        <div class="invite-link-section">
          <label class="section-label">Meu link:</label>
          <div class="link-input-wrapper">
            <div class="link-input">{{ computedInviteLink }}</div>
            <button class="copy-btn text-gradient-gold-copy" @click="handleCopyLink">Cópia</button>
          </div>
        </div>

        <!-- 分享方式 -->
        <div class="share-methods-section">
          <label class="section-label">Compartilhamento Rápido</label>
          <div class="share-buttons">
            <button
              v-for="method in shareMethods"
              :key="method.id"
              class="share-btn"
              :title="method.label"
              @click="handleShare(method)"
            >
              <img v-if="method.icon" :src="method.icon" :alt="method.label" class="share-icon" />
              <span class="share-label">{{ method.label }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 底部提示 -->
      <div class="footer-tip">
        <p class="tip-text">
          {{ `Convide até ${computedDailyLimit} amigos por dia` }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { showSuccessToast } from 'vant';
import { useProxyStore } from '@/stores/proxyStore';
import { storeToRefs } from 'pinia';
import { formatCurrency } from '@/utils/math';
import { shareToplatform } from '@/utils/navigation';
import { useShare, useClipboard } from '@vueuse/core';
import { useI18n } from 'vue-i18n';

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
const proxyStore = useProxyStore();
const { proxyInfo, proxyRewardConfig } = storeToRefs(proxyStore);

// 初始化 useClipboard
const { copy } = useClipboard();

// 获取邀请充值金额
const computedRechargeAmount = computed(() => {
  return proxyRewardConfig.value?.recharge_threshold ?? 0;
});

// 获取邀请奖励金额
const computedRewardAmount = computed(() => {
  return proxyRewardConfig.value?.reward_amount ?? 0;
});

// 获取邀请人数
const computedDailyLimit = computed(() => {
  return proxyRewardConfig.value?.daily_limit ?? 0;
});

// 获取邀请链接
const computedInviteLink = computed(() => {
  return proxyInfo.value?.inviter_url ?? '';
});

// 获取邀请CODE
const computedInviteCode = computed(() => {
  return proxyInfo.value?.inviter_code ?? '';
});

/**
 * 复制邀请链接
 */
const handleCopyLink = async () => {
  try {
    await copy(computedInviteLink.value);
    showSuccessToast(t('common.copied') || 'Copiado');
  } catch (error) {
    console.error('Copy failed:', error);
    showSuccessToast('Falha na cópia');
  }
};

/**
 * 处理分享
 */
const handleShare = async (method: { id: string; label: string; icon: string }) => {
  try {
    const { share, isSupported } = useShare({
      title: `Convite para participar - ${method.label}`,
      text: 'Convidamos você a participar do jogo e ganhar comissões!',
      url: computedInviteLink.value,
    });

    if (isSupported.value) {
      await share();
    } else {
      // 降级方案：使用平台分享链接
      shareToplatform(
        method.id as any,
        computedInviteCode.value,
        'Convidamos você a participar do jogo e ganhar comissões!'
      );
    }
  } catch (error) {
    if ((error as any).name !== 'AbortError') {
      console.warn('Web Share API failed, falling back to platform links');
    }
  }
};

const shareMethods = computed(() => [
  {
    id: 'mais',
    label: 'Mais',
    icon: new URL('@/assets/imgs/invite/fx.png', import.meta.url).href,
  },
  {
    id: 'facebook',
    label: 'Facebook',
    icon: new URL('@/assets/imgs/invite/Facebook.png', import.meta.url).href,
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    icon: new URL('@/assets/imgs/invite/WhatsApp.png', import.meta.url).href,
  },
  {
    id: 'telegram',
    label: 'Telegram',
    icon: new URL('@/assets/imgs/invite/Telegram.png', import.meta.url).href,
  },
  {
    id: 'instagram',
    label: 'Instagram',
    icon: new URL('@/assets/imgs/invite/Instagram.png', import.meta.url).href,
  },
  {
    id: 'kwai',
    label: 'Kwai',
    icon: new URL('@/assets/imgs/invite/Kwai.png', import.meta.url).href,
  },
  {
    id: 'twitter',
    label: 'Twitter',
    icon: new URL('@/assets/imgs/invite/Twitter.png', import.meta.url).href,
  },
]);

/**
 * 关闭弹窗
 */
const handleClose = () => {
  emit('close');
};

onMounted(() => {
  proxyStore.fetchProxyInfoData();
  proxyStore.fetchProxyRewardData();
});
</script>

<style scoped lang="less">
.share-dialog {
  background: url('@/assets/imgs/invite/bg.png') center top no-repeat;
  background-size: 100% 100%;
  border-radius: 20px;
  width: 705px;
  height: 630px;
}

.dialog-header {
  position: relative;

  .close-btn {
    position: absolute;
    top: 44px;
    right: 28px;
    border: none;
    padding: 6px;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;

    &:hover,
    &:active {
      transform: scale(1.05);
    }

    img {
      width: 65px;
      height: 65px;
    }
  }
}

.dialog-body {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 160px 22px 10px;
}

.description {
  display: flex;
  flex-direction: column;
  gap: 2px;
  text-align: center;
  letter-spacing: var(--letter-spacing-sm);
  color: #13793d;
  line-height: 1.4;

  .desc-main {
    font-size: 18px;
    font-weight: 700;
    margin: 0;
  }

  .desc-text {
    font-size: 18px;
    font-weight: 700;
    margin: 0;
  }
}

.share-body {
  position: relative;

  .invite-link-section {
    display: flex;
    flex-direction: column;
    padding: 16px 0 4px;

    .section-label {
      text-align: left;
      padding-left: 70px;
    }

    .link-input-wrapper {
      display: flex;
      gap: 12px;
      align-items: center;
      justify-content: center;
      padding: 0 85px;
      height: 60px;
      margin-top: 8px;
    }

    .link-input {
      flex: 1;
      color: #ffe89a;
      font-size: 18px;
      word-break: break-all;
      cursor: pointer;
    }

    .copy-btn {
      background: url('@/assets/imgs/invite/fz.png') center top no-repeat;
      width: 125px;
      height: 48px;
      background-size: 100% 100%;
      border: none;
      border-radius: 8px;
      color: #fff;
      font-size: 18px;
      padding-bottom: 4px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
    }
  }
}

.section-label {
  font-size: 20px;
  font-weight: 700;
  text-align: center;
  color: var(--color-white);
}

.share-methods-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.share-buttons {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  align-items: center;
  justify-content: center;
  padding: 6px 40px 0;

  .share-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    cursor: pointer;

    .share-icon {
      width: 49px;
      height: 49px;
      object-fit: contain;
    }

    .share-label {
      font-size: 14px;
      font-weight: 600;
      text-align: center;
      line-height: 1;
      color: #f9ef9a;
    }
  }
}

.footer-tip {
  text-align: center;
  padding-top: 16px;
  color: #f9ef9a;

  .tip-text {
    font-size: 18px;
    margin: 0;
    font-weight: 700;
  }
}
</style>
