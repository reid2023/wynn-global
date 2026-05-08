import { defineStore } from 'pinia';
import { ref } from 'vue';
import { showSuccessToast } from 'vant';
import { activityApi } from '@/services';
import { SignInListItem } from '@/types/activity';

export enum SignInStatusEnum {
  /**
   * 未领取 可领取
   */
  Unclaimed = 0,
  /**
   * 已领取
   */
  Claimed = 1,

  /**
   * 已过期
   */
  Expired = 2,
}

export interface DailyReward {
  day: number;
  amount: number;
  claimed: boolean;
}

export const useDailyCheckInStore = defineStore('dailyCheckIn', () => {
  // ==================== 状态 ====================

  // 当前是第几天
  const currentDay = ref<number>(1);
  const signInList = ref<SignInListItem[]>([]);

  // 提交loading
  const isSubmitting = ref(false);

  // ==================== 方法 ====================
  // 是否为后面的天
  const isAfterDay = (day: number): boolean => {
    return day > currentDay.value;
  };

  /**
   * 执行签到
   */
  const handleSignIn = async (reward: SignInListItem) => {
    // 已领取不可点击
    if (reward.status == SignInStatusEnum.Claimed) {
      return;
    }

    // 后面的天数不可点击
    if (isAfterDay(reward.day)) {
      return;
    }

    // 正在调用接口
    if (isSubmitting.value) {
      return;
    }

    try {
      isSubmitting.value = true;
      await activityApi.claimSignIn();
      showSuccessToast('Login realizado com sucesso');

      // 等待300ms后再刷新数据
      await new Promise((resolve) => setTimeout(resolve, 300));

      await fetchDailySignInData();
    } catch (err) {
      //
    } finally {
      isSubmitting.value = false;
    }
  };

  /**
   * 获取每日签到数据
   */
  const fetchDailySignInData = async () => {
    try {
      const response = await activityApi.getSignIn();
      if (response && response.data) {
        signInList.value = response.data.list;
        currentDay.value = response.data.current_day;
      }
    } catch (error) {
      console.error('Failed to fetch daily sign-in data:', error);
    }
  };

  return {
    currentDay,
    signInList,

    // 方法
    handleSignIn,
    fetchDailySignInData,
    isAfterDay,
  };
});
