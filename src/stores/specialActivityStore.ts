import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { activityApi } from '@/services';
import { RescueOffer } from '@/types/activity';
import { useDialogStore } from '@/stores/dialog';

export enum ActiveTypeEnum {
  /**
   * 快输完
   */
  Quick = 1,

  /**
   * 已经输光
   */
  Limit = 2,
}

export const useSpecialActivityStore = defineStore('specialActivity', () => {
  // ==================== 状态 ====================
  const dialogStore = useDialogStore();

  // 倒计时（秒）
  const remainingSeconds = ref<number>(0); // 1小时

  // 访问的活动类型
  const specialActiveType = ref<ActiveTypeEnum>(ActiveTypeEnum.Limit);

  // 存储活动数据
  const rescueOfferList = ref<RescueOffer[]>([]);

  // 当前活动的数据
  const currentRecueOffer = computed(() => {
    return rescueOfferList.value.find((offer) => offer.tier === specialActiveType.value);
  });

  // 当前活动是否可用
  const currentIsAvailable = computed(() => {
    return !!currentRecueOffer.value?.available;
  });

  // 当前时间
  const currentExpireTime = computed(() => {
    return Number(currentRecueOffer.value?.expire_at ?? 0);
  });

  // ==================== 定时器 ====================

  let countdownInterval: ReturnType<typeof setInterval> | null = null;

  // ==================== 计算属性 ====================

  /**
   * 倒计时短格式 (MM:SS)
   */
  const countdownTextShort = computed(() => {
    const minutes = Math.floor(remainingSeconds.value / 60);
    const seconds = remainingSeconds.value % 60;

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  });

  // ==================== 方法 ====================

  /**
   * 启动倒计时
   */
  const startCountdown = () => {
    if (countdownInterval) {
      return; // 已经在运行
    }

    countdownInterval = setInterval(() => {
      if (remainingSeconds.value > 0) {
        remainingSeconds.value--;
      } else {
        stopCountdown();
      }
    }, 1000);
  };

  /**
   * 停止倒计时
   */
  const stopCountdown = () => {
    if (countdownInterval) {
      clearInterval(countdownInterval);
      countdownInterval = null;
      remainingSeconds.value = 0;
    }
  };

  /**
   * 设置倒计时（秒）
   */
  const setCountdown = (seconds: number) => {
    remainingSeconds.value = Math.max(0, seconds);
  };

  /**
   * 获取特殊活动
   */
  const fetchRescueOffer = async () => {
    try {
      const response = await activityApi.getRescueOffer();

      if (Array.isArray(response.data?.offers)) {
        rescueOfferList.value = response.data?.offers ?? [];
        // rescueOfferList.value = [
        //   {
        //     tier: 1,
        //     deposit: '40',
        //     bonus: '20',
        //     available: true,
        //     expire_at: '1774949455191',
        //   },
        //   {
        //     tier: 2,
        //     deposit: '40',
        //     bonus: '20',
        //     available: true,
        //     expire_at: '1774949455191',
        //   },
        // ];
      }
    } catch (error) {
      console.error('Failed to fetch rescue offer:', error);
    }
  };

  /**
   * 打开特殊活动
   */
  const openSpecialActive = async (type: ActiveTypeEnum) => {
    // 判断活动是否可用， 不可用不能打开弹窗
    if (!currentIsAvailable.value) {
      return;
    }
    // 设置活动类型
    specialActiveType.value = type;

    // 处理活动倒计时问题
    const now = Date.now();
    // 与服务器间隔的时间搓
    const diff = currentExpireTime.value - now;
    // 换算成秒
    const diffSeconds = Math.floor(diff / 1000);
    remainingSeconds.value = diffSeconds;

    // 打开弹窗
    dialogStore.openDialog('specialActivity');

    // 启动倒计时
    startCountdown();
  };

  return {
    // 状态
    remainingSeconds,
    specialActiveType,
    rescueOfferList,

    // 计算属性
    currentRecueOffer,
    countdownTextShort,

    // 方法
    startCountdown,
    stopCountdown,
    setCountdown,

    fetchRescueOffer,
    openSpecialActive,
  };
});
