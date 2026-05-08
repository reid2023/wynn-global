<template>
  <div class="first-charge-dialog">
    <!-- 弹窗头部 -->
    <div class="dialog-header">
      <button class="close-btn" @click="handleClose">
        <img src="@/assets/imgs/recharge/close.png" alt="Close" />
      </button>
    </div>

    <!-- 弹窗内容 -->
    <div class="dialog-body">
      <!-- 主标题部分 -->
      <div class="main-section">
        <p class="section-label">Oferta termina em</p>

        <!-- 倒计时 -->
        <div class="countdown-section">
          <div class="countdown-box">{{ countdownText }}</div>
        </div>

        <div class="bonus-title">
          <p class="text-gradient-gold-shadow">Bônus de Primeiro Depósito</p>
          <p class="text-gradient-gold-shadow">Deposite Agora e Receba</p>
          <p class="text-gradient-gold-shadow">
            até<span class="text-gradient-gold-shadow">{{ computedMaxBonusPercent }}%</span>de
            Bônus!
          </p>
        </div>
      </div>

      <!-- 充值选项 -->
      <div class="charge-options">
        <div v-for="(option, idx) in firstChargeConfig" :key="idx" class="charge-option">
          <div class="option-content text-gradient-gold-shadow">
            <span class="option-amount"
              >Deposite
              <i>{{ getRechargeAmount(option.recharge_amount) }}</i>
            </span>
            <span class="option-arrow">
              <SvgIcon name="arrow" dir="action" size="1.25rem" color="#e8d5b5" />
            </span>
            <span class="option-bonus"
              >Receba
              <i>+{{ option.reward_rate }}%</i>
              Extra
            </span>
          </div>

          <img
            class="charge-plus"
            v-if="idx < firstChargeConfig.length - 1"
            src="@/assets/imgs/recharge/plus.png"
            alt="plus"
          />
        </div>
      </div>

      <!-- 底部提示 -->
      <p class="footer-text">Quanto Mais Você Deposita, Mais Você Ganha!</p>
    </div>

    <!-- 按钮 -->

    <div class="footer-btn">
      <!-- <FormButton
        type="primary"
        class="btn-participate"
        label="Participe Agora"
        @click="handleParticipate"
      /> -->
      <div class="button" @click="handleParticipate">Participe Agora</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useActiveStore } from '@/stores/activeStore';
import { useDialogStore } from '@/stores/dialog';
// import { FormButton } from '@/components';
import { map } from 'lodash-es';
import { storeToRefs } from 'pinia';
import { formatCurrency } from '@/utils/math';

interface Props {
  dialogId: string;
  params?: Record<string, any>;
}

const props = withDefaults(defineProps<Props>(), {
  params: () => ({}),
});

const emit = defineEmits<{
  close: [];
}>();

const activeStore = useActiveStore();
const { firstChargeConfig } = storeToRefs(activeStore);

const dialogStore = useDialogStore();

// 获取倒计时文本
const countdownText = computed(() => activeStore.countdownText);

const computedMaxBonusPercent = computed(() => {
  const bonusPercent = map(firstChargeConfig.value, 'reward_rate').map((i) => Number(i));
  return Math.max(...bonusPercent);
});

// 得到金额
const getRechargeAmount = (amount: number | string) => {
  return formatCurrency(amount, undefined, 'R$');
};

/**
 * 参加优惠活动
 */
const handleParticipate = () => {
  dialogStore.closeDialog(props.dialogId);
  // 打开充值弹窗并携带首充活动参数
  dialogStore.openDialog('firstRecharge');
};

/**
 * 关闭弹窗
 */
const handleClose = () => {
  emit('close');
};
</script>

<style scoped lang="less">
.first-charge-dialog {
  background: url('@/assets/imgs/recharge/bg.png') center top no-repeat;
  background-size: 100% 100%;
  border-radius: 20px;
  width: 668px;
  height: 897px;
}

.dialog-header {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
  padding-bottom: 20px;

  .title {
    font-size: 28px;
    font-weight: 700;
    text-align: center;
    margin: 0;
  }

  .close-btn {
    position: absolute;
    top: 94px;
    right: 30px;
    border: none;
    padding: 6px;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover,
    &:active {
      transform: scale(1.05);
    }

    img {
      width: 62px;
      height: 62px;
    }
  }
}

.dialog-body {
  display: flex;
  flex-direction: column;
  margin: 0 20px;
  min-height: 430px;
  background-size: 100% 100%;
  position: relative;
  margin-top: 146px;
}

.main-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 0 20px 0;

  .section-label {
    font-size: 22px;
    font-weight: 500;
    margin-bottom: 8px;
    color: var(--color-white);
    letter-spacing: var(--letter-spacing-sm);
    line-height: 1.2;
  }

  .countdown-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 172px;
    height: 53px;
    background: url('@/assets/imgs/special/djs.png') center top no-repeat;
    background-size: 100% 100%;

    .countdown-box {
      font-size: 32px;
      font-weight: 600;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      color: var(--color-count-up);
      font-family: var(--count-up-font-family);
    }
  }

  .bonus-title {
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 2px;
    font-size: 26px;
    font-weight: 700;
    letter-spacing: var(--letter-spacing-lg);
    line-height: 1.1;

    span {
      padding: 0 6px;
      font-size: 26px;
    }

    p:last-child {
      margin-bottom: 4px;
    }
  }
}

.charge-options {
  display: flex;
  flex-direction: column;
  margin: 0 30px;

  .charge-option {
    height: 64px;
    border-radius: 8px;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    position: relative;
    background: url('@/assets/imgs/recharge/k.png') center top no-repeat;
    background-size: 100% 100%;

    .option-content {
      display: flex;
      align-items: center;
      gap: 12px;
      height: 30px;
      font-weight: 700;
      padding-left: 90px;
      letter-spacing: var(--letter-spacing-md);

      .option-amount {
        font-size: 18px;
        font-weight: 700;
      }

      .option-arrow {
        height: 100%;
        display: flex;
        align-items: center;
        color: #e8d5b5;
      }

      .option-bonus {
        font-size: 18px;
        font-weight: 700;
      }

      span i {
        font-size: 20px;
        font-style: normal;
        font-weight: 700;
      }
    }
  }

  .charge-plus {
    width: 30px;
    height: 30px;

    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: -15px;
    z-index: 1;
  }
}

.footer-text {
  text-align: center;
  font-size: 20px;
  color: #fff;
  font-weight: 700;
  letter-spacing: var(--letter-spacing-md);
}

.footer-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: -100px;

  .button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 380px;
    height: 84px;
    background-image: url('@/assets/imgs/recharge/button.png');
    background-repeat: no-repeat;
    background-size: cover;
    cursor: pointer;

    font-size: 24px;
    font-weight: 700;
    letter-spacing: var(--letter-spacing-sm);
    color: var(--text-primary);
  }
}
</style>
