<template>
  <div class="daily-checkin-dialog">
    <!-- 头部 -->
    <div class="dialog-header">
      <button class="close-btn" @click="handleClose">
        <img src="@/assets/imgs/daily/gb.png" alt="Close" />
      </button>
    </div>

    <!-- 内容区域 -->
    <div class="dialog-body">
      <div class="dialog-body-content">
        <!-- 说明文字 -->
        <div class="intro-section">
          <p class="intro-text">Faça Login Todos os Dias e Ganhe Recompensas!</p>
        </div>

        <!-- 每日奖励卡片网格 -->
        <div class="rewards-grid">
          <div
            v-for="(reward, index) in signInList.slice(0, 6)"
            :key="index"
            class="reward-card"
            :class="{
              claimed: reward.status == SignInStatusEnum.Claimed,
              afterDay: dailyCheckInStore.isAfterDay(reward.day),
              [`reward-${reward.day}`]: true,
            }"
          >
            <!-- 奖励金额 -->
            <div
              class="reward-amount text-gradient-gold-daily-amount"
              :class="{ claimed: reward.status == SignInStatusEnum.Claimed }"
            >
              +R$
              <span>{{ reward.amount }}</span>
            </div>

            <!-- 奖励圆圈 -->
            <div class="reward-icon" @click="() => dailyCheckInStore.handleSignIn(reward)">
              <img :src="getTodayIcon(reward.day)" alt="reward" />
            </div>

            <!-- 日期标签 -->
            <div class="reward-day" :class="{ claimed: reward.status == SignInStatusEnum.Claimed }">
              {{ getTodayLabel(reward.day) }}
            </div>
          </div>
        </div>

        <div
          class="reward-card-last"
          v-if="showSignInDom"
          :class="{
            claimed: lastSignInData?.status == SignInStatusEnum.Claimed,
            afterDay: dailyCheckInStore.isAfterDay(lastSignInData?.day),
            [`reward-${lastSignInData?.day}`]: true,
          }"
        >
          <!-- 奖励金额 -->
          <div
            class="reward-amount text-gradient-gold-daily-amount"
            :class="{ claimed: lastSignInData?.status == SignInStatusEnum.Claimed }"
          >
            Receba até R$
            <span>{{ maxSignReward }}</span>
          </div>

          <!-- 奖励圆圈 -->
          <div class="reward-icon" @click="() => dailyCheckInStore.handleSignIn(lastSignInData)">
            <img :src="getTodayIcon(lastSignInData?.day)" alt="reward" />
          </div>

          <!-- 日期标签 -->
          <div
            class="reward-day"
            :class="{ claimed: lastSignInData?.status == SignInStatusEnum.Claimed }"
          >
            {{ getTodayLabel(lastSignInData?.day) }}
          </div>
        </div>
      </div>
      <!-- lastSignInData -->

      <!-- 底部励志文字 -->
      <p v-if="showSignInDom" class="footer-text text-gradient-gold">
        Entre Todos os Dias e Acumule Mais Bônus!
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useDailyCheckInStore, SignInStatusEnum } from '@/stores/dailyCheckInStore';
import { storeToRefs } from 'pinia';
import { map, last } from 'lodash-es';
import { sum } from '@/utils/math';

interface Props {
  params?: Record<string, any>;
}

withDefaults(defineProps<Props>(), {
  params: () => ({}),
});

const emit = defineEmits<{
  close: [];
}>();

const dailyCheckInStore = useDailyCheckInStore();
const { signInList } = storeToRefs(dailyCheckInStore);

onMounted(() => {
  dailyCheckInStore.fetchDailySignInData();
});

const showSignInDom = computed(() => signInList.value.length > 0);

const lastSignInData = computed(() => signInList.value[signInList.value.length - 1]);

const maxSignReward = computed(() => {
  const amounts = map(signInList.value, 'amount');
  return sum(amounts);
});

/**
 * 获取日期标签文字
 */
const getTodayLabel = (day: number): string => {
  const labels = ['', 'Dia 1', 'Dia 2', 'Dia 3', 'Dia 4', 'Dia 5', 'Dia 6', 'Dia 7'];
  return labels[day] || '';
};

const getTodayIcon = (day: number): string => {
  const iconList = [
    new URL('@/assets/imgs/daily/1.png', import.meta.url),
    new URL('@/assets/imgs/daily/2.png', import.meta.url),
    new URL('@/assets/imgs/daily/4.png', import.meta.url),
    new URL('@/assets/imgs/daily/4.png', import.meta.url),
    new URL('@/assets/imgs/daily/5.png', import.meta.url),
    new URL('@/assets/imgs/daily/6.png', import.meta.url),
    new URL('@/assets/imgs/daily/bx.png', import.meta.url),
  ];

  return (iconList[day - 1] as unknown as string) || '';
};

/**
 * 关闭弹窗
 */
const handleClose = () => {
  emit('close');
};
</script>

<style scoped lang="less">
// ==================== 全局样式 ====================

.daily-checkin-dialog {
  background: url('@/assets/imgs/daily/qd.png') center top no-repeat;
  background-size: 100% 100%;
  border-radius: 20px;
  width: 649px;
  height: 925px;
}

// ==================== 头部 ====================

.dialog-header {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 134px;

  .close-btn {
    position: absolute;
    top: 10px;
    right: -20px;
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
      width: 62px;
      height: 62px;
    }
  }
}

// ==================== 内容区域 ====================

.dialog-body {
  display: flex;
  flex-direction: column;
  padding: 0 20px 20px 20px;
  overflow-y: auto;
  // margin-top: 134px;
}

// ==================== 说明部分 ====================

.intro-section {
  text-align: center;
  padding: 0 50px 20px;

  .intro-text {
    font-size: 18px;
    font-weight: 700;
    color: var(--color-white);
    letter-spacing: var(--letter-spacing-sm);
  }
}

// ==================== 奖励卡片网格 ====================

.rewards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 48px 14px;
  margin: 18px 0;
  place-items: center;
  padding: 0 34px 0 44px;
}

.reward-card-last,
.reward-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  border-radius: 30px;
  width: 148px;
  height: 190px;
  background-size: 100%;
  position: relative;

  &::after {
    content: '';
    display: block;
    width: 42px;
    height: 39px;
    position: absolute;
    right: 0;
    bottom: 10px;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 42px 39px;
  }

  &.afterDay {
    .reward-icon {
      cursor: not-allowed;
    }

    &::after {
      background-image: url('@/assets/imgs/daily/suo.png');
    }
  }

  &.claimed {
    .reward-icon {
      cursor: not-allowed;
    }

    &::after {
      background-image: url('@/assets/imgs/daily/gou.png');
    }
  }

  // ==================== 奖励圆圈 ====================

  .reward-icon {
    border-radius: 50%;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding-top: 30px;
    width: 100%;
    height: 110px;
    cursor: pointer;

    img {
      object-fit: contain;
    }
  }

  &.reward-1 {
    .reward-icon img {
      width: 82px;
      height: 76px;
    }
  }

  &.reward-2 {
    .reward-icon img {
      width: 107px;
      height: 68px;
    }
  }

  &.reward-3,
  &.reward-4 {
    .reward-icon img {
      width: 105px;
      height: 80px;
    }
  }

  &.reward-5,
  &.reward-6 {
    .reward-icon img {
      width: 120px;
      height: 84px;
      position: relative;
      left: 6px;
    }
  }
  // ==================== 奖励金额 ====================

  .reward-amount {
    font-size: 24px;
    font-weight: 700;
  }

  // ==================== 日期标签 ====================

  .reward-day {
    padding-top: 6px;
    font-size: 16px;
    font-weight: 700;
    line-height: 1;
    color: #efe896;

    &.claimed {
      color: #9b9b9b;
    }
  }
}

.reward-card-last {
  width: 100%;
  padding: 0 34px 0 44px;
  margin-top: 40px;
  height: 200px;

  .reward-amount {
    line-height: 1.3;
    letter-spacing: 2px;
  }

  .reward-icon {
    width: 135px;
    height: 128px;
    margin-top: 0;

    img {
      width: 135px;
      height: 128px;
    }
  }

  .reward-day {
    padding-top: 0;
  }

  &::after {
    right: 40px;
    bottom: 14px;
  }
}

// ==================== 底部励志文字 ====================

.footer-text {
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  padding: 6px 12px;
  letter-spacing: 2px;
}

// ==================== 签到按钮 ====================

.checkin-actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;

  :deep(.form-button) {
    flex: 1;
  }
}
</style>
