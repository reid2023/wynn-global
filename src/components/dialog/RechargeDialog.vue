<template>
  <div class="recharge-dialog common-dialog-litter">
    <!-- 弹窗头部 -->
    <div class="dialog-header">
      <h2 class="title text-gradient-gold-light">Depósito</h2>
      <button class="close-btn" @click="handleClose">
        <img src="@/assets/imgs/public/close.png" alt="Close" />
      </button>
    </div>

    <!-- 弹窗内容 -->
    <div class="dialog-body">
      <!-- 充值选项网格 -->
      <div class="charge-options">
        <div
          v-for="(option, idx) in rechargeAmountConfig"
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

    <div class="form-line"></div>

    <!-- 按钮 -->
    <div class="footer-btn">
      <FormInput
        v-model="selectedAmount"
        type="number"
        :placeholder="`Por favor, insira o valor (${computedMinValue}-${computedMaxValue})`"
        :min="computedMinValue"
        :max="computedMaxValue"
        class="amount-input"
      />

      <FormButton
        type="primary"
        class="btn-participate"
        label="Depósito"
        :disabled="isSubmitting"
        @click="handleDeposit"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useDialogStore } from '@/stores/dialog';
import { FormButton, FormInput } from '@/components';
import { storeToRefs } from 'pinia';
import { map, min, max } from 'lodash-es';
import { showLoadingToast } from 'vant';
// 导入所有选项图片
import img0 from '@/assets/imgs/recharge/40.png';
import img1 from '@/assets/imgs/recharge/55.png';
import img2 from '@/assets/imgs/recharge/120.png';
import img3 from '@/assets/imgs/recharge/360.png';
// import img4 from '@/assets/imgs/recharge/4.png';

import { useWalletStore } from '@/stores/walletStore';
import { formatCurrency, multiply, divide, add } from '@/utils/math';
import { RECHARGE_CHANNEL_TYPE_ENUM } from '@/config';
import { RechargeLevelListItem } from '@/types/wallet';

const optionImages = [img0, img0, img0, img1, img1, img2, img2, img3, img3];

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

const walletStore = useWalletStore();
const { rechargeAmountConfig } = storeToRefs(walletStore);

// 选中的充值金额（默认为第一个选项）
const selectedAmount = ref<number>(0);

const isSubmitting = ref(false);

// 当配置变化时，初始化选中金额为第一个选项
watch(
  () => rechargeAmountConfig.value,
  (options) => {
    if (options.length > 0) {
      selectedAmount.value = Number(options[0].recharge_amount);
    }
  },
  { immediate: true }
);

const RechargeBadgeMap = {
  [RECHARGE_CHANNEL_TYPE_ENUM.Try]: new URL('@/assets/imgs/recharge/try.png', import.meta.url).href,
  [RECHARGE_CHANNEL_TYPE_ENUM.Popular]: new URL('@/assets/imgs/recharge/POP.png', import.meta.url)
    .href,
  [RECHARGE_CHANNEL_TYPE_ENUM.Best]: new URL('@/assets/imgs/recharge/best.png', import.meta.url)
    .href,
  [RECHARGE_CHANNEL_TYPE_ENUM.Vip]: new URL('@/assets/imgs/recharge/vip.png', import.meta.url).href,
  [RECHARGE_CHANNEL_TYPE_ENUM.Hot]: new URL('@/assets/imgs/recharge/hot.png', import.meta.url).href,
};

// 获取图片
const getTagImageUrl = (option: RechargeLevelListItem) => {
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
const isShowTag = (option: RechargeLevelListItem, type: RECHARGE_CHANNEL_TYPE_ENUM) => {
  return (option.tags ?? []).includes(type);
};

/**
 * 选择充值选项
 */
const selectOption = (option: RechargeLevelListItem) => {
  selectedAmount.value = Number(option.recharge_amount);
};

/**
 * 获取真实到账金额
 * @param item
 */
const getRealAmount = (item: RechargeLevelListItem) => {
  const bonus = multiply(item.recharge_amount, divide(item.reward_rate, 100));
  return add(item.recharge_amount, bonus);
};

const computedMinValue = computed(() =>
  min(map(rechargeAmountConfig.value, 'recharge_amount').map((i) => +i))
);
const computedMaxValue = computed(() =>
  max(map(rechargeAmountConfig.value, 'recharge_amount').map((i) => +i))
);

/**
 * 处理充值
 */
const handleDeposit = async () => {
  console.log('Processing recharge deposit with amount:', selectedAmount.value);
  // 可以在这里处理充值页面跳转或 API 调用

  try {
    isSubmitting.value = true;
    showLoadingToast({
      message: 'Depósito...',
      forbidClick: true,
      duration: 0,
    });

    await walletStore.createRechargeOrder(selectedAmount.value);

    dialogStore.closeDialog(props.dialogId);
    dialogStore.openDialog('thirdPartyPayment');
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
.recharge-dialog {
  .dialog-body {
    height: 520px;
    overflow-y: auto;
    padding-top: 20px;

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
  }
}

.charge-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
  // margin-top: 6px;
}

.charge-option {
  position: relative;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 90px;
  background-image: url('@/assets/imgs/form/czk_1.png');
  background-size: 654px 98px;
  background-position: left 0 top 0;
  background-repeat: no-repeat;

  &:active,
  &.selected {
    background-image: url('@/assets/imgs/form/btn_primary.png');
    background-size: 656px 100px;
    background-position: left -1px top 0;
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
      font-size: 22px;
      font-weight: 700;
      line-height: 1;
      color: var(--color-white);
    }

    .deposit-info {
      font-size: 30px;
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
    img {
      width: auto;
      height: 90px;
      position: relative;
    }

    &.try img {
      top: 10px;
    }

    &.popular img {
      top: 10px;
    }

    &.best img {
      top: 12px;
    }

    &.vip img {
      top: 14px;
    }

    &.hot img {
      top: 10px;
    }
  }
}

.form-line {
  width: 100%;
  height: 3px;
  margin-top: 20px;
  margin-bottom: 16px;

  background-image: url('@/assets/imgs/public/xian.png');
  background-repeat: no-repeat;
  background-position: left 0 top 0;
  background-size: 100%;
}

.footer-btn {
  padding: 0 22px;

  .amount-input {
    margin-bottom: 20px;
  }

  .btn-participate {
    width: 100%;
    font-size: 20px;
    margin-top: 10px;
  }
}
</style>
