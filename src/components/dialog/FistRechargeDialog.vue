<template>
  <div class="first-recharge-dialog">
    <!-- 弹窗头部 -->
    <div class="dialog-header">
      <button class="close-btn" @click="handleClose">
        <img src="@/assets/imgs/recharge/close.png" alt="Close" />
      </button>
    </div>

    <!-- 弹窗内容 -->
    <div class="dialog-body">
      <div class="main-section">
        <!-- 倒计时 -->
        <p class="section-label">Oferta termina em</p>

        <!-- 倒计时 -->
        <div class="countdown-section">
          <div class="countdown-box">{{ countdownText }}</div>
        </div>
      </div>

      <!-- 充值选项网格 -->
      <div class="charge-options">
        <div
          v-for="(option, idx) in firstChargeConfig"
          :key="option.recharge_amount"
          class="charge-option"
          :class="{ selected: selectedAmount === Number(option.recharge_amount) }"
          @click="selectOption(option)"
        >
          <!-- 选项内容 -->
          <div class="charge-option--left">
            <img
              :src="optionImages[idx]"
              alt="money"
              :class="['option-icon', `option-icon-${idx}`]"
            />

            <div class="option-amount">
              <div class="bonus-display">
                {{ formatCurrency(option.recharge_amount) }}
              </div>
              <div class="deposit-info">
                GET {{ formatCurrency(getRealAmount(option)) }}
                <span
                  v-if="isShowTag(option, RECHARGE_CHANNEL_TYPE_ENUM.Hot)"
                  class="hot-badge"
                ></span>
              </div>
            </div>
          </div>

          <div
            class="charge-option--right"
            :class="{
              try: isShowTag(option, RECHARGE_CHANNEL_TYPE_ENUM.Try),
              popular: isShowTag(option, RECHARGE_CHANNEL_TYPE_ENUM.Popular),
              best: isShowTag(option, RECHARGE_CHANNEL_TYPE_ENUM.Best),
              vip: isShowTag(option, RECHARGE_CHANNEL_TYPE_ENUM.Vip),
              hot: isShowTag(option, RECHARGE_CHANNEL_TYPE_ENUM.Hot),
            }"
          >
            <img v-if="option.tags?.length" :src="getTagImageUrl(option)" alt="" />
          </div>
        </div>
      </div>
    </div>

    <!-- 按钮 -->
    <div class="footer-btn">
      <!-- <FormButton type="primary" class="btn-participate" label="Depósito" @click="handleDeposit" /> -->
      <div class="button" @click="handleDeposit">Depósito</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useActiveStore } from '@/stores/activeStore';
import { useDialogStore } from '@/stores/dialog';
import { useWalletStore } from '@/stores/walletStore';
// import { FormButton } from '@/components';
import { storeToRefs } from 'pinia';
import { showLoadingToast } from 'vant';
import { formatCurrency, multiply, divide, add } from '@/utils/math';
import { FirstRechargeListItem } from '@/types/activity';
import { RECHARGE_CHANNEL_TYPE_ENUM } from '@/config';

// 导入所有选项图片
import img0 from '@/assets/imgs/recharge/40.png';
import img1 from '@/assets/imgs/recharge/55.png';
import img2 from '@/assets/imgs/recharge/120.png';
import img3 from '@/assets/imgs/recharge/360.png';

const optionImages = [img0, img1, img2, img3, img3];

const RechargeBadgeMap = {
  [RECHARGE_CHANNEL_TYPE_ENUM.Try]: new URL('@/assets/imgs/recharge/try.png', import.meta.url).href,
  [RECHARGE_CHANNEL_TYPE_ENUM.Popular]: new URL('@/assets/imgs/recharge/POP.png', import.meta.url)
    .href,
  [RECHARGE_CHANNEL_TYPE_ENUM.Best]: new URL('@/assets/imgs/recharge/best.png', import.meta.url)
    .href,
  [RECHARGE_CHANNEL_TYPE_ENUM.Vip]: new URL('@/assets/imgs/recharge/vip.png', import.meta.url).href,
  [RECHARGE_CHANNEL_TYPE_ENUM.Hot]: new URL('@/assets/imgs/recharge/hot.png', import.meta.url).href,
};

const isSubmitting = ref(false);

// 获取图片
const getTagImageUrl = (option: FirstRechargeListItem) => {
  if (option.tags?.length) {
    let tags = option.tags ?? [];

    // 如果有热门需要过滤
    if (tags.length > 1) {
      tags = tags.filter((item) => item !== RECHARGE_CHANNEL_TYPE_ENUM.Hot);
    }

    const tag = tags[0] as RECHARGE_CHANNEL_TYPE_ENUM;
    return RechargeBadgeMap[tag];
  }

  return '';
};

// 是否显示TAG
const isShowTag = (option: FirstRechargeListItem, type: RECHARGE_CHANNEL_TYPE_ENUM) => {
  return (option.tags ?? []).includes(type);
};

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

const dialogStore = useDialogStore();

const activeStore = useActiveStore();
const { firstChargeConfig, countdownText } = storeToRefs(activeStore);

const walletStore = useWalletStore();

// 选中的充值金额（默认为第一个选项）
const selectedAmount = ref<number>(0);

/**
 * 获取真实到账金额
 * @param item
 */
const getRealAmount = (item: FirstRechargeListItem) => {
  const bonus = multiply(item.recharge_amount, divide(item.reward_rate, 100));
  return add(item.recharge_amount, bonus);
};

// 当配置变化时，初始化选中金额为第一个选项
watch(
  () => firstChargeConfig.value,
  (options) => {
    const opts = options as FirstRechargeListItem[];
    if (opts.length > 0) {
      selectedAmount.value = Number(opts[0].recharge_amount);
    }
  },
  { immediate: true }
);

/**
 * 选择充值选项
 */
const selectOption = (option: FirstRechargeListItem) => {
  selectedAmount.value = Number(option.recharge_amount);
};

/**
 * 处理充值
 */
const handleDeposit = async () => {
  // 正在调用接口
  if (isSubmitting.value) return;

  try {
    isSubmitting.value = true;
    showLoadingToast({
      message: 'Depósito...',
      forbidClick: true,
      duration: 0,
    });

    try {
      await walletStore.createRechargeOrder(selectedAmount.value.toString());

      dialogStore.closeDialog(props.dialogId);
      dialogStore.openDialog('thirdPartyPayment');
    } catch (error) {
      console.error('Failed to create recharge order:', error);
    }
  } catch (error) {
    // console.error('Failed to create recharge:', error);
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
.first-recharge-dialog {
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
    right: 46px;
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
  margin-top: 150px;
  padding: 0 60px;

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
  }
}

.charge-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
}

.charge-option {
  position: relative;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 75px;
  background-image: url('@/assets/imgs/recharge/k_mr.png');
  background-size: 100% 75px;
  background-position: left 0 top 0;
  background-repeat: no-repeat;

  &:active,
  &.selected {
    background-image: url('@/assets/imgs/recharge/k_xz.png');
    background-size: 519px 88px;
    background-position: left -4px top 0;
    background-repeat: no-repeat;
  }

  .hot-badge {
    display: inline-block;
    width: 50px;
    height: 42px;
    background-image: url('@/assets/imgs/recharge/hot1.png');
    background-size: 100% 100%;
    margin-left: 6px;
    position: absolute;
    right: -56px;
    bottom: -10px;
  }

  .option-icon {
    object-fit: contain;
    width: auto;
    height: 100%;

    &-0,
    &-1,
    &-2 {
      position: relative;
      top: 12px;
    }

    &-3,
    &-4 {
      position: relative;
      top: 14px;
    }

    &-5,
    &-6 {
      position: relative;
      top: 14px;
    }

    &-7,
    &-8 {
      position: relative;
      top: 14px;
    }
  }

  .charge-option--left {
    display: flex;
    align-items: center;
    height: 100%;

    .option-amount {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }

    .bonus-display {
      font-size: 18px;
      font-weight: 700;
      line-height: 1;
      color: var(--color-white);
    }

    .deposit-info {
      font-size: 22px;
      font-weight: 600;
      color: #faeac8;
      line-height: 1;
      padding-top: 8px;
      display: flex;
      align-items: center;
      position: relative;
    }
  }

  &:active,
  &.selected {
    .charge-option--left {
      .option-amount {
        .bonus-display,
        .deposit-info {
          color: #173e30;
        }
      }
    }
  }

  .charge-option--right {
    height: 75px;
    img {
      width: auto;
      height: 100%;
      position: relative;
    }

    &.hot img {
      top: 8px;
    }

    &.try img {
      top: 8px;
    }

    &.popular img {
      top: 6px;
    }

    &.best img {
      top: 8px;
    }

    &.vip img {
      top: 8px;
    }
  }
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
