<template>
  <div
    class="special-activity-dialog"
    :class="{
      quick: specialActiveType == ActiveTypeEnum.Quick,
      limit: specialActiveType == ActiveTypeEnum.Limit,
    }"
  >
    <!-- 弹窗头部 -->
    <div class="dialog-header">
      <!-- <h2 class="title text-gradient-gold">{{ computedActivityConfig.title }}</h2> -->
      <button class="close-btn" @click="handleClose">
        <img src="@/assets/imgs/special/close.png" alt="Close" />
      </button>
    </div>

    <!-- 弹窗内容 -->
    <div class="dialog-body">
      <p class="section-label">Oferta termina em</p>
      <!-- 倒计时 -->
      <div class="countdown-section">
        <div class="countdown-box">{{ specialActivityStore.countdownTextShort }}</div>
      </div>

      <div class="alert-section">
        <p class="alert-text">Seu saldo está acabando!</p>
        <p class="alert-text">Deposite agora e ganhe bônus extra!</p>
      </div>

      <!-- 主标题部分 -->
      <div class="main-section">
        <p>
          Deposite
          <span class="text-gradient-gold">{{
            formatCurrency(currentRecueOffer?.deposit ?? 0)
          }}</span>
        </p>

        <p>
          e ganhe na hora
          <span class="text-gradient-gold"
            >+{{ formatCurrency(currentRecueOffer?.bonus ?? 0) }}!</span
          >
        </p>
      </div>
    </div>

    <!-- 按钮 -->
    <div class="footer-btn">
      <FormButton
        type="special-recharge"
        class="btn-participate"
        :label="computedActivityConfig.buttonText"
        @click="handleParticipate"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useSpecialActivityStore, ActiveTypeEnum } from '@/stores/specialActivityStore';
import { useDialogStore } from '@/stores/dialog';
import { FormButton } from '@/components';

import { storeToRefs } from 'pinia';
import { formatCurrency } from '@/utils/math';
import { showLoadingToast } from 'vant';
import { walletApi } from '@/services';

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

const specialActivityStore = useSpecialActivityStore();
const { specialActiveType, currentRecueOffer } = storeToRefs(specialActivityStore);
const dialogStore = useDialogStore();

const computedActivityConfig = computed(() => {
  const activeConfig = {
    [ActiveTypeEnum.Limit]: {
      title: 'Oferta Especial!',
      warningText: 'Seu saldo está acabando! Deposite agora e ganhe bônus extra!',
      buttonText: 'Depósito',
    },
    [ActiveTypeEnum.Quick]: {
      title: 'Oferta Especial!',
      warningText: 'Seu saldo está acabando! Deposite agora e ganhe bônus extra!',
      buttonText: 'Depósito',
    },
  };

  return activeConfig[specialActiveType.value];
});

/**
 * 参加特殊活动
 */
const handleParticipate = async () => {
  showLoadingToast({
    message: 'Depósito...',
    forbidClick: true,
    duration: 0,
  });

  try {
    await walletApi.createRecharge({ amount: (currentRecueOffer.value?.deposit ?? 0).toString() });

    dialogStore.closeDialog(props.dialogId);
    dialogStore.openDialog('thirdPartyPayment');
  } catch (error) {
    console.error('Failed to create recharge order:', error);
  }

  // dialogStore.openDialog('recharge', { active: 'specialActivity' });
};

/**
 * 关闭弹窗
 */
const handleClose = () => {
  emit('close');
};
</script>

<style scoped lang="less">
.special-activity-dialog {
  border-radius: 20px;
  width: 672px;
  height: 804px;
  padding-bottom: 20px;

  &.limit {
    background-image: url('@/assets/imgs/special/bg1.png');
  }

  &.quick {
    background-image: url('@/assets/imgs/special/bg2.png');
  }
  background-size: 672px 804px;
  background-position: center;
  background-repeat: no-repeat;
}

.dialog-header {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
  padding-bottom: 20px;

  // .title {
  //   font-size: 28px;
  //   font-weight: 700;
  //   text-align: center;
  //   margin: 0;
  // }

  .close-btn {
    position: absolute;
    top: 56px;
    right: 10px;
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
  justify-content: center;
  align-items: center;
  background-size: 100% 100%;
  position: relative;
  padding: 40px 30px 20px;
  border-radius: 12px;

  .section-label {
    font-size: 22px;
    font-weight: 500;
    margin-bottom: 8px;
    color: var(--color-white);
    letter-spacing: var(--letter-spacing-sm);
    line-height: 1.2;
  }

  .alert-section {
    text-align: center;
    padding-top: 8px;
    padding-bottom: 10px;

    .alert-text {
      font-size: 22px;
      font-weight: 500;
      color: var(--color-white);
      letter-spacing: var(--letter-spacing-sm);
      line-height: 1.2;
    }
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

  .main-section {
    display: flex;
    flex-direction: column;
    text-align: center;
    position: relative;
    width: 100%;
    padding-top: 330px;

    p {
      font-size: 22px;
      color: var(--color-white);
      height: 36px;

      span {
        font-size: 28px;
        font-weight: 600;
      }
    }
  }
}

.footer-btn {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
