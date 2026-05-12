<template>
  <footer class="home-action-bar">
    <div class="action-bar-content">
      <!-- 左侧：用户信息 -->
      <div class="section-left">
        <div class="user-profile">
          <div class="avatar-wrapper" @click="handleUserCenter">
            <img :src="userAvatar" alt="avatar" class="user-avatar" />
          </div>
          <div class="user-info">
            <div class="user-id">ID:{{ userProfile?.playerId ?? '-' }}</div>
            <div class="user-balance" @click="handleRecharge">
              <img src="@/assets/imgs/home/jb.png" alt="jb" />
              <span class="text-gradient-gold balance-amount">{{
                Number(userBalance) == 0 ? '0.00' : userBalance
              }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 中间：计时器 -->
      <div class="section-middle" @click="handleFirstCharge" v-if="showCountdown && isLoggedIn">
        <div class="countdown-wrapper">
          <div class="countdown">{{ countdownText }}</div>
        </div>
        <div class="text-gradient-gold gift-text">1º Depósito</div>
      </div>

      <!-- 右侧：操作按钮 -->
      <div class="section-right" v-if="!isLoggedIn">
        <button class="btn-entrar" @click="handleEnter">
          <!-- <span>Entrar</span> -->
        </button>
        <button class="btn-registrar" @click="handleRegister">
          <!-- <span>Registrar</span> -->
        </button>
        <div class="recharge-tips" v-if="!isLoggedIn">
          <span>Depósito Inicial +80%</span>
        </div>
      </div>

      <div class="section-right despoit" v-else>
        <button class="btn-withdraw" @click="handleWithdrawal">
          <!-- <span>Saque</span> -->
        </button>
        <button class="btn-recharge" @click="handleRecharge">
          <!-- <span>Depósito</span> -->
        </button>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue';
import { useDialogStore } from '@/stores/dialog';
import { useActiveStore } from '@/stores/activeStore';
import { useUserStore } from '@/stores/userStore';
import { storeToRefs } from 'pinia';
import { formatCurrency } from '@/utils/math';
import { useWalletStore } from '@/stores/walletStore';
import { DEFAULT_AVATAR } from '@/config';

// 对话框 store
const dialogStore = useDialogStore();

// 活动 store
const activeStore = useActiveStore();

const userStore = useUserStore();
const { isLoggedIn, userProfile } = storeToRefs(userStore);

const walletStore = useWalletStore();
const { userWalletBalance } = storeToRefs(walletStore);

const showCountdown = computed(() => activeStore.isCountdownActive);

const userAvatar = computed(() => {
  if (isLoggedIn.value) {
    return userProfile.value?.avatar || DEFAULT_AVATAR;
  }

  return DEFAULT_AVATAR;
});

const userBalance = computed(() => {
  const balance = isLoggedIn.value ? (userWalletBalance.value.balance ?? 0) : 0;

  return formatCurrency(balance, undefined, '', 'pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
});

// 使用 store 中的倒计时文本
const countdownText = computed(() => activeStore.countdownText);

let countdownInterval: ReturnType<typeof setInterval> | null = null;

const startCountdown = () => {
  countdownInterval = setInterval(() => {
    activeStore.decrementCountdown();
  }, 1000);
};

onMounted(() => {
  startCountdown();
});

onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }
});

/**
 * 打开注册弹窗
 */
const handleRegister = () => {
  dialogStore.openDialog('register');
};

/**
 * 打开登录弹窗
 */
const handleEnter = () => {
  dialogStore.openDialog('login');
};

/**
 * 打开首充优惠活动弹窗
 */
const handleFirstCharge = () => {
  dialogStore.openDialog('firstCharge');
};

/**
 * 打开充值弹窗
 */
const handleRecharge = () => {
  dialogStore.openDialog('recharge');
};

/**
 * 打开用户中心
 */
const handleUserCenter = () => {
  dialogStore.openDialog('userProfile');
};

/**
 * 打开提现
 */
const handleWithdrawal = () => {
  dialogStore.openDialog('withdrawal');
};
</script>

<style scoped lang="less">
.home-action-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 103px;
  background: url('@/assets/imgs/home/dikuang.png') no-repeat center / cover;
  background-size: 100% 100%;
  z-index: 999;
  max-width: 46.875rem; /* 750px ÷ 16px = 46.875rem（设计稿基准宽度） */
  margin: 0 auto;
}

.action-bar-content {
  width: 100%;
  max-width: 100%;
  height: 100%;
  padding: 10px 32px 0 35px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.section-left {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 8px;
}

.avatar-wrapper {
  width: 76px;
  height: 76px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.user-id {
  color: var(--color-white);
  font-size: 20px;
  font-weight: 600;
  letter-spacing: var(--letter-spacing-xs);
  height: 36px;
  width: 170px;
  background: url('@/assets/imgs/home/ID.png') no-repeat center / cover;
  background-size: contain;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 12px;
}

.user-balance {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: var(--color-white);
  height: 36px;
  width: 170px;
  gap: 2px;
  background: url('@/assets/imgs/home/ID.png') no-repeat center / cover;
  background-size: contain;

  img {
    width: 38px;
    height: 38px;
    position: relative;
    left: -4px;
  }

  .balance-symbol {
    font-size: 20px;
    font-weight: 900;
    letter-spacing: var(--letter-spacing-lg);
  }

  .balance-amount {
    font-weight: 600;
    letter-spacing: var(--letter-spacing-md);
    font-size: 20px;
  }
}

.section-middle {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: -38px;
  left: 50%;
  transform: translateX(-50%);

  .gift-text {
    font-size: 18px;
    font-weight: 600;
    padding-top: 4px;
    line-height: 1;
  }

  .countdown-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 170px;
    height: 98px;

    background-image: url('@/assets/imgs/home/liwu2.png');
    background-repeat: no-repeat;
    background-position: 32px 0;
    background-size: 144px 98px;

    .countdown {
      font-size: 18px;
      font-weight: 900;
      margin-top: 68px;

      color: var(--color-count-up);
      font-family: var(--count-up-font-family);
    }
  }
}

.section-right {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 6px;
  position: relative;

  .recharge-tips {
    background: url('@/assets/imgs/home/tishi.png') no-repeat center / cover;
    width: 254px;
    height: 57px;
    right: -31px;
    top: -56px;
    position: absolute;

    span {
      color: var(--color-white);
      font-size: 18px;
      font-weight: 600;
      position: relative;
      top: 10px;
      left: 48px;
    }
  }

  &.despoit {
    .btn-withdraw {
      position: relative;
      bottom: -10px;
    }

    .btn-recharge {
      position: relative;
      bottom: 28px;
    }
  }
}

.btn-registrar,
.btn-entrar {
  border: none;
  border-radius: 6px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  letter-spacing: var(--letter-spacing-xs);
  display: flex;
  align-items: center;
  justify-content: center;

  &:active {
    transform: scale(1.05);
  }
}

.btn-registrar {
  width: 132px;
  height: 51px;
  background: url('@/assets/imgs/home/btn_register.png') no-repeat center / cover;
}

.btn-entrar {
  width: 132px;
  height: 51px;
  background: url('@/assets/imgs/home/btn_login.png') no-repeat center / cover;
}

.btn-withdraw {
  width: 118px;
  height: 51px;
  background: url('@/assets/imgs/home/btn_withdraw.png') no-repeat center / cover;
}

.btn-recharge {
  width: 154px;
  height: 154px;
  background: url('@/assets/imgs/home/btn_recharge.png') no-repeat center / cover;
}
</style>
