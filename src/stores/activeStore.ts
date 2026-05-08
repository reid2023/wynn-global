import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

import { activityApi } from '@/services';
import { FirstRechargeListItem } from '@/types/activity';
// import { RECHARGE_CHANNEL_TYPE_ENUM } from '@/config';

export interface ChargeOption {
  amount: number;
  bonus: number;
  bonusPercent: number;
  hot?: boolean; // 是否为 HOT 选项
}

export const useActiveStore = defineStore('active', () => {
  // 首充优惠活动倒计时间
  const firstChargeCountdown = ref<number>(0);
  // 首充优惠活动是否开启
  const firstChargeIsActive = ref<boolean>(false);
  // 首充优惠活动配置
  const firstChargeConfig = ref<FirstRechargeListItem[]>([]);

  // 可领取活动列表
  const availableActivitiesList = ref<number[]>([]);

  // 格式化倒计时文本 (HH:MM:SS 或 MM:SS)
  const countdownText = computed(() => {
    const hours = Math.floor(firstChargeCountdown.value / 3600);
    const minutes = Math.floor((firstChargeCountdown.value % 3600) / 60);
    const seconds = firstChargeCountdown.value % 60;
    if (hours > 0) {
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  });

  // 倒计时是否进行中
  const isCountdownActive = computed(() => {
    // 活动开启 并且 有倒计时
    return firstChargeCountdown.value > 0 && firstChargeIsActive.value;
  });

  // 减少倒计时1秒
  const decrementCountdown = () => {
    if (firstChargeCountdown.value > 0) {
      firstChargeCountdown.value--;
    }
  };

  /**
   * 获取首充活动的配置
   */
  const fetchFirstRechargeConfig = async () => {
    try {
      const response = await activityApi.getFirstRechargeConfig();
      if (response.data) {
        firstChargeIsActive.value = response.data.is_active ?? false;
        firstChargeConfig.value = response.data.list ?? [];
        // firstChargeConfig.value = [
        //   {
        //     recharge_amount: '20',
        //     reward_rate: '25',
        //     fixed_bonus: '0',
        //     reward_max_amount: '0',
        //     tags: ['hot'],
        //   },
        //   {
        //     recharge_amount: '40',
        //     reward_rate: '40',
        //     fixed_bonus: '0',
        //     reward_max_amount: '0',
        //     tags: ['vip'],
        //   },
        //   {
        //     recharge_amount: '80',
        //     reward_rate: '50',
        //     fixed_bonus: '0',
        //     reward_max_amount: '0',
        //     tags: ['hot', 'base'],
        //   },
        //   {
        //     recharge_amount: '200',
        //     reward_rate: '80',
        //     fixed_bonus: '0',
        //     reward_max_amount: '0',
        //     tags: ['popular'],
        //   },
        // ];

        // 处理活动倒计时问题
        const now = Date.now();
        const serviceDate = response.data.expire_at ?? 0;
        // 与服务器间隔的时间戳
        const diff = serviceDate - now;
        // 换算成秒
        const diffSeconds = Math.floor(diff / 1000);
        // 设置倒计时
        firstChargeCountdown.value = diffSeconds;
      }
    } catch (err) {}
  };

  /**
   * 获取用户当前可领取的活动列表
   */
  const fetchAvailableActivities = async () => {
    const response = await activityApi.getAvailableActivities();
    if (response.data) {
      availableActivitiesList.value = response.data.activities ?? [];
    }
  };

  return {
    firstChargeCountdown,
    countdownText,
    isCountdownActive,
    firstChargeConfig,
    decrementCountdown,

    fetchFirstRechargeConfig,
    fetchAvailableActivities,
  };
});
