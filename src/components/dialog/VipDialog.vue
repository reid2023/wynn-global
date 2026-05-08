<template>
  <div class="vip-dialog">
    <!-- 弹窗头部 -->
    <div class="dialog-header">
      <h2 class="title text-gradient-gold">VIP</h2>
      <button class="close-btn" @click="handleClose">
        <img src="@/assets/imgs/vip/close.png" alt="Close" />
      </button>
    </div>

    <!-- 弹窗内容 -->
    <div class="dialog-body">
      <!-- VIP信息卡片 -->
      <div class="vip-info-card">
        <div class="vip-header">
          <div class="vip-header-left">
            <div class="stat-title">
              <img src="@/assets/imgs/vip/zs.png" alt="vip" />
              <h3 class="text-gradient-gold">{{ 'Meu VIP' }}</h3>
            </div>

            <div class="stat-item">
              <span class="label">{{ 'Minha Aposta' }}:</span>
              <span class="value text-gradient-gold">{{ computedMyBet }}</span>
            </div>

            <div class="stat-item">
              <span class="label">{{ 'Faltam' }}:</span>
              <span class="value">
                <i class="text-gradient-gold"> {{ formatCurrency(computedDiffBet) }}</i>
                <i>{{ 'para' }} VIP{{ nextVipLevel }}</i>
              </span>
            </div>
          </div>
          <div class="vip-header-right">
            <img :src="currentLevelImg" alt="vip" />
            <FormButton
              type="vip-recharge"
              class="deposit-btn"
              label="Depósito"
              @click="handleDeposit"
            />
          </div>
        </div>

        <!-- 进度条 -->
        <VipProgress
          :progress="progressPercentage"
          :current-level="currentVipLevel"
          :next-level="nextVipLevel"
        />
      </div>

      <!-- 奖励卡片容器 -->
      <div class="rewards-container">
        <div
          class="reward-card"
          v-for="reward in rewardCards"
          :key="reward.id"
          @click="reward.click"
        >
          <div class="reward-icon">
            <img :src="reward.icon" :alt="reward.title" />
          </div>
          <div class="reward-content">
            <div class="reward-amount text-gradient-gold">{{ reward.amount }}</div>
            <div class="reward-title">{{ reward.title }}</div>
          </div>
        </div>
      </div>

      <!-- VIP等级表格 -->
      <div class="vip-table-section">
        <div class="vip-table">
          <!-- 表头 -->
          <div class="vip-table-header">
            <div class="vip-table-cell header-cell">{{ 'Nivel' }}</div>
            <div class="vip-table-cell header-cell" v-html="`Aposta<br>Acumulada`"></div>
            <div class="vip-table-cell header-cell" v-html="`Recompens<br>Diária`"></div>
            <div class="vip-table-cell header-cell" v-html="`Recompensa<br>de Subida`"></div>
          </div>

          <!-- 表格行 -->
          <div
            v-for="level in vipLevelList.slice(0, 5)"
            :key="level.level"
            :class="{ 'vip-table-row': true, active: level.level === currentVipLevel }"
          >
            <div class="vip-table-cell">VIP{{ level.level }}</div>
            <div class="vip-table-cell">{{ formatCurrency(level.bet_threshold) }}</div>
            <div class="vip-table-cell">{{ formatCurrency(level.daily_salary, 2, 'R$') }}</div>
            <div class="vip-table-cell">{{ formatCurrency(level.upgrade_reward, 2, 'R$') }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
// import { useI18n } from 'vue-i18n';
import { showSuccessToast, showFailToast, showToast } from 'vant';
import { FormButton, VipProgress } from '@/components';

import { useVipStore } from '@/stores/vipStore';
import { useUserStore } from '@/stores/userStore';
import { useWalletStore } from '@/stores/walletStore';
import { useDialogStore } from '@/stores/dialog';
import { storeToRefs } from 'pinia';
import { formatCurrency, subtract, multiply, divide } from '@/utils/math';
import { vipApi } from '@/services';
import { VIP_ICON_LIST } from '@/config/index';

// const { t } = useI18n();

const dialogStore = useDialogStore();

const vipStore = useVipStore();
const { vipLevelList, useVipInfo, vipDailyData } = storeToRefs(vipStore);

const userStore = useUserStore();
const { userProfile } = storeToRefs(userStore);

const walletStore = useWalletStore();

// Props定义
interface Props {
  params?: Record<string, any>;
}

defineProps<Props>();

const emit = defineEmits<{
  close: [];
}>();

// 提交loading
const isSubmitting = ref(false);

// ==================== 数据配置 ====================

// 当前VIP等级
const currentVipLevel = computed(() => useVipInfo.value?.level ?? 0);

// 用户总投注
const computedTotalBet = computed(() => useVipInfo.value?.total_bet ?? 0);

// 下一等级总额
const nextLevelTotal = computed(() => useVipInfo.value?.next_level_threshold ?? 0);

const currentLevelImg = computed(() => VIP_ICON_LIST[currentVipLevel.value]);

// 用户还差的投注
const computedDiffBet = computed(() => {
  if (computedTotalBet.value >= nextLevelTotal.value) {
    return 0;
  }

  return subtract(nextLevelTotal.value, computedTotalBet.value);
});

// 每日奖励
const computedSalaryAmount = computed(() => vipDailyData.value?.salary_amount ?? 0);

// 未领取的升级奖励
const computedUpgradeAmount = computed(() => useVipInfo.value?.unclaimed_upgrade_amount ?? 0);

const computedMyBet = computed(() => {
  return formatCurrency(computedTotalBet.value, undefined, 'R$', 'pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
});

// 奖励卡片配置
const rewardCards = computed(() => [
  {
    id: 'upgrade',
    icon: new URL('@/assets/imgs/vip/hdt_1.png', import.meta.url).href,
    amount: formatCurrency(computedUpgradeAmount.value, 2, 'R$'),
    title: 'VIP1',
    click: handleClaimVipUpgrade,
  },
  {
    id: 'daily',
    icon: new URL('@/assets/imgs/vip/hdt_2.png', import.meta.url).href,
    amount: formatCurrency(computedSalaryAmount.value, 2, 'R$'),
    title: 'Recompensa Diária',
    click: handleClaimVipDaily,
  },
]);
// ==================== 计算属性 ====================

// 下一个VIP等级
const nextVipLevel = computed(() => {
  const next = currentVipLevel.value + 1;
  const maxLevel = vipLevelList.value.length;
  return next <= maxLevel ? next : maxLevel;
});

// 进度百分比
const progressPercentage = computed(() => {
  // 总投注为0
  if (computedTotalBet.value === 0) {
    return 0;
  }

  // 总差值为0
  if (computedDiffBet.value === 0) {
    return 100; // 最高等级显示100%
  }

  const val = divide(computedTotalBet.value, nextLevelTotal.value);
  return multiply(val, 100);
});

// ==================== 方法 ====================

/**
 * 关闭弹窗
 */
const handleClose = () => {
  emit('close');
};

/**
 * 处理存款按钮点击
 */
const handleDeposit = () => {
  // 关闭VIP弹窗，打开充值弹窗
  dialogStore.openDialog('recharge');
};

onMounted(async () => {
  await vipStore.fetchVipInfo();
  await vipStore.fetchVipDaily();
});

/**
 * 领取每日奖励
 */
const handleClaimVipDaily = async () => {
  if (Number(computedSalaryAmount.value) === 0) {
    return;
  }

  // status: 0: 未满足条件 1: 可领取 2: 已领取,  3: 已过期(保留用)
  if (vipDailyData.value?.status == 0) {
    showToast('Condições da recompensa diária não cumpridas');
    return;
  }

  if (vipDailyData.value?.status == 2) {
    showToast('Recompensa diária resgatada');
    return;
  }

  if (isSubmitting.value) {
    return;
  }

  try {
    isSubmitting.value = true;
    await vipApi.claimVipDaily();
    showSuccessToast('Recompensa diária resgatada com sucesso.');
    walletStore.fetchUserWallet();
  } catch (error) {
    showFailToast(`Não conseguiu reivindicar a recompensa diária.`);
    console.error('Failed to claim VIP daily reward:', error);
  } finally {
    isSubmitting.value = false;
  }
};

/**
 * 领取升级奖励
 */
const handleClaimVipUpgrade = async () => {
  if (Number(computedUpgradeAmount.value) === 0) {
    return;
  }

  if (isSubmitting.value) {
    return;
  }

  try {
    isSubmitting.value = true;
    const data = {
      level: currentVipLevel.value,
      user_id: userProfile.value?.user_id ?? '',
    };

    await vipApi.claimVipUpgrade(data);
    showSuccessToast('Resgate bem-sucedido da recompensa de upgrade');
    walletStore.fetchUserWallet();
  } catch (err) {
    showFailToast(`Não foi possível resgatar a recompensa de upgrade.`);
    console.error('Failed to claim VIP upgrade reward:', err);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped lang="less">
.vip-dialog {
  background: url('@/assets/imgs/vip/bg.png') center top no-repeat;
  background-size: 100% 100%;
  border-radius: 20px;
  width: 750px;
  height: 992px;
}

// ==================== 头部布局 ====================

.dialog-header {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 140px;

  .title {
    padding-top: 134px;
    font-size: 32px;
    font-weight: 700;
    text-align: center;
    text-transform: uppercase;
  }

  .close-btn {
    position: absolute;
    top: 96px;
    right: 36px;
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
      width: 61px;
      height: 61px;
    }
  }
}

// ==================== 内容区域 ====================

.dialog-body {
  display: flex;
  flex-direction: column;
  gap: 25px;
  padding: 0 100px 20px;
  overflow-y: auto;
  margin-top: 68px;
}

// ==================== VIP信息卡片 ====================

.vip-info-card {
  padding: 20px;
  border-radius: 6px;
  width: 100%;
  height: 200px;
  background-size: 100% 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .vip-header {
    display: flex;
    justify-content: space-between;
    .vip-header-left {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;

      .stat-title {
        display: flex;
        align-items: center;
        padding-bottom: 10px;

        img {
          width: 36px;
          height: 32px;
          position: relative;
          top: 4px;
        }

        h3 {
          font-size: 20px;
          font-weight: 800;
        }
      }

      .stat-item {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-bottom: 4px;
        height: 36px;

        .label {
          color: #fff;
          margin: 0;
          font-weight: bold;
          font-size: 18px;
        }

        .value {
          font-weight: bold;
          padding-left: 4px;
          word-break: break-all;
          font-size: 20px;
          padding-left: 4px;

          i {
            font-style: normal;
            padding-left: 6px;

            &:last-child {
              font-weight: normal;
              color: #fff;
            }
          }
        }
      }
    }

    .vip-header-right {
      height: 100%;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      position: relative;
      width: 150px;

      img {
        position: absolute;
        width: 142px;
        height: 142px;
        top: -28px;
        left: 50%;
        transform: translateX(-50%);
      }

      .deposit-btn {
        //
      }
    }
  }
}

// ==================== 奖励卡片 ====================

.rewards-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;

  .reward-card {
    padding: 0 16px;
    flex: 1;
    height: 106px;
    background-size: 100% 100%;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;

    &:nth-child(1) {
      .reward-icon {
        width: 136px;
      }
    }

    &:nth-child(2) {
      .reward-icon {
        width: 128px;
      }
    }

    .reward-icon {
      width: auto;
      height: 103px;

      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        position: relative;
      }
    }

    .reward-content {
      flex: 1;
      min-width: 0;

      .reward-amount {
        font-size: 20px;
        font-weight: bold;
      }

      .reward-title {
        font-size: 16px;
        color: #fff;
        font-weight: bold;
        line-height: 1.3;
      }
    }
  }
}

// ==================== VIP等级表格 ====================

.vip-table-section {
  .vip-table {
    width: 100%;
    border-radius: 2px;
    overflow: hidden;

    .vip-table-header {
      display: grid;
      grid-template-columns: 90px 142px 154px 164px;
      height: 60px;
      background-image: url('@/assets/imgs/vip/biaoge.png');
      background-repeat: no-repeat;
      background-size: 100%;
      background-position: center top;
      margin-bottom: 4px;

      .header-cell {
        height: 60px;
        padding: 0 8px;
        text-align: center;
        font-size: 16px;
        font-weight: 700;
        color: #faeac8;
        white-space: normal;
        line-height: 1.3;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .vip-table-row {
      display: grid;
      grid-template-columns: 90px 142px 154px 164px;
      height: 60px;
      transition: background-color 0.3s ease;
      background-image: url('@/assets/imgs/vip/biaoge.png');
      background-repeat: no-repeat;
      background-size: 100%;
      background-position: center top;
      margin-bottom: 4px;

      .vip-table-cell {
        height: 60px;
        padding: 0 8px;
        text-align: center;
        font-size: 16px;
        color: #58bc93;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}
</style>
