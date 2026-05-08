<template>
  <div class="licensed-dialog-module">
    <div class="licensed-dialog common-dialog-large">
      <!-- 弹窗头部 -->
      <div class="dialog-header">
        <h2 class="title text-gradient-gold">{{ t('licenses.title') }}</h2>
        <button class="close-btn" @click="handleClose">
          <img src="@/assets/imgs/public/close.png" alt="Close" />
        </button>
      </div>

      <!-- 弹窗内容 -->
      <div class="dialog-body">
        <div>
          <!-- 介绍文案 -->
          <div class="compliance-intro">
            <p class="intro-main text-gradient-gold">{{ t('licenses.complianceCommitment') }}</p>
            <p class="intro-text text-gradient-gold">{{ t('licenses.complianceText') }}</p>

            <!-- 第一部分: Licensed Operation -->
            <div class="compliance-section">
              <h3 class="section-title text-gradient-gold">
                {{ t('licenses.licensedOperation') }}
              </h3>
              <p class="section-text">{{ t('licenses.licensedOperationDesc') }}</p>
              <p class="section-text">{{ t('licenses.licenseNumber') }}</p>
            </div>

            <!-- 第二部分: Fair Gaming -->
            <div class="compliance-section">
              <h3 class="section-title text-gradient-gold">{{ t('licenses.fairGaming') }}</h3>
              <p class="section-text">{{ t('licenses.fairGamingDesc') }}</p>
            </div>

            <!-- 第三部分: Safety & Responsibility -->
            <div class="compliance-section">
              <h3 class="section-title text-gradient-gold">{{ t('licenses.safety') }}</h3>
              <p class="section-text">{{ t('licenses.safetyDesc') }}</p>
            </div>
          </div>

          <!-- 内容区域 -->
          <div class="licenses-content">
            <!-- 证书图片 -->
            <div class="certificates-container">
              <div class="certificate-item first">
                <!-- <img
                  src="@/assets/imgs/licensed/hg_2.png"
                  alt="Gambling Commission License"
                  class="certificate-img"
                /> -->
              </div>
              <div class="link-text commission">
                <a
                  href="https://www.gov.uk/government/organisations/gambling-commission"
                  target="_blank"
                >
                  {{ t('licenses.commissionLink') }}
                </a>
              </div>

              <div class="certificate-item second">
                <!-- <img
                  src="@/assets/imgs/licensed/hg_3.png"
                  alt="iTech Labs RNG Certificate"
                  class="certificate-img"
                /> -->
              </div>
              <div class="link-text">
                <a href="https://www.itechlabs.com" target="_blank">
                  {{ t('licenses.itechLink') }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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

/**
 * 关闭弹窗
 */
const handleClose = () => {
  emit('close');
};
</script>

<style scoped lang="less">
.licensed-dialog-module {
  padding: 20px;
}

.licensed-dialog {
  display: flex;
  flex-direction: column;
  color: var(--color-primary);
}

.dialog-body {
  display: flex;
  flex-direction: column;
  padding: 0 22px 0;
  overflow-y: auto;
  flex: 1;
  min-height: 0;
  margin-bottom: 40px;
}

.compliance-intro {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 20px;
  height: 430px;

  background-image: url('@/assets/imgs/licensed/hg_1.png');
  background-repeat: no-repeat;
  background-position: left 0 top 0;
  background-size: 100% 100%;

  .intro-main {
    font-size: 22px;
    font-weight: 700;
    margin: 0;
    text-align: center;
    letter-spacing: var(--letter-spacing-sm);
  }

  .intro-text {
    font-size: 18px;
    font-weight: 500;
    margin: 0;
    letter-spacing: var(--letter-spacing-sm);
  }

  .compliance-section {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-right: 40px;
    letter-spacing: var(--letter-spacing-sm);

    .section-title {
      font-size: 20px;
      font-weight: 700;
      margin: 0;
    }

    .section-text {
      font-size: 16px;
      font-weight: 600;
      margin: 0;
      line-height: 1.6;
    }
  }
}

.licenses-content {
  padding-bottom: 10px;
  display: flex;
  flex-direction: column;
}

.certificates-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;

  .certificate-item {
    display: flex;
    justify-content: center;
    align-items: center;

    .certificate-img {
      width: 100%;
      height: auto;
      min-height: 800px;
      border-radius: 8px;
    }

    &.first {
      width: 100%;
      height: 940px;

      background-image: url(@/assets/imgs/licensed/hg_2.png);
      background-repeat: no-repeat;
      background-size: 654px 943px;
      background-position: left -3px top 0;
    }

    &.second {
      width: 100%;
      height: 920px;

      background-image: url(@/assets/imgs/licensed/hg_3.png);
      background-repeat: no-repeat;
      background-size: 654px 923px;
      background-position: left -3px top 0;
    }
  }

  .link-text {
    text-decoration: none;
    cursor: pointer;
    transition: opacity 0.2s ease;
    padding: 10px 30px;
    background-color: #0a452e;
    border: 1px solid #125238;
    border-radius: 10px;
    line-height: 1.2;

    &.commission {
      margin-bottom: 6px;
    }

    .text-center {
      text-align: center;
    }

    a {
      font-weight: 400;
      font-size: 20px;
    }

    &:hover a {
      opacity: 0.8;
    }
  }
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;

  &:hover {
    background: rgba(255, 255, 255, 0.5);
  }
}
</style>
