import { walletApi } from '@/services';
import { defineStore } from 'pinia';
import { ref } from 'vue';

import { WalletBalance, RechargeDetail, RechargeLevelListItem } from '@/types/wallet';
import { useSpecialActivityStore, ActiveTypeEnum } from './specialActivityStore';
import { RECHARGE_CHANNEL_TYPE_ENUM } from '@/config';

export type RechageAmountType = {
  fixed_bonus: number | string;
  reward_rate: number | string;
  hot?: boolean;
  type?: RECHARGE_CHANNEL_TYPE_ENUM;
};

export const useWalletStore = defineStore('wallet', () => {
  const specialActivityStore = useSpecialActivityStore();

  // 用户钱包余额信息
  const userWalletBalance = ref<WalletBalance>({
    balance: 0,
    min_withdrawal: 0,
    wager_required: 0,
  });

  // 用户的充值金额
  const userRechargeAmount = ref<number | string>(0);
  // 用户的充值链接信息
  const userRechargeInfo = ref<RechargeDetail | null>(null);

  // 充值金额配置
  const rechargeAmountConfig = ref<RechargeLevelListItem[]>([]);

  // 获取用户钱包数据
  const fetchUserWallet = async () => {
    try {
      const response = await walletApi.getBalance();
      if (response.data) {
        userWalletBalance.value = response.data;

        const balance = Number(response.data.balance ?? 0);

        // 快输光
        if (balance <= 5 && balance > 0) {
          // 获取特殊活动配置
          await specialActivityStore.fetchRescueOffer();
          specialActivityStore.openSpecialActive(ActiveTypeEnum.Quick);

          // 已经输光
        } else if (balance < 0.5 && balance <= 0) {
          // 获取特殊活动配置
          await specialActivityStore.fetchRescueOffer();
          specialActivityStore.openSpecialActive(ActiveTypeEnum.Limit);
        }
      }
    } catch (error) {
      console.error('Failed to fetch user wallet balance:', error);
    }
  };

  /**
   * 获取充值档位列表
   */
  const fetchRechargeAmountConfig = async () => {
    try {
      const response = await walletApi.getRechargeLevelConfig();
      if (response.data) {
        rechargeAmountConfig.value = response.data.list ?? [];
        // rechargeAmountConfig.value = [
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
      }
    } catch (error) {
      console.error('Failed to fetch recharge orders:', error);
    }
  };

  /**
   * 充值订单列表
   */
  const fetchRechargeOrders = async () => {
    try {
      const response = await walletApi.getRechargeOrders();
      if (response.data) {
        // 处理充值订单数据
      }
    } catch (error) {
      console.error('Failed to fetch recharge orders:', error);
    }
  };

  /**
   * 创建充值
   */
  const createRechargeOrder = async (amount: number | string) => {
    try {
      const response = await walletApi.createRecharge({ amount: amount.toString() });

      userRechargeAmount.value = amount;
      if (response.data) {
        userRechargeInfo.value = response.data;
      }
    } catch (error) {
      console.error('Failed to create recharge order:', error);
    }
  };

  return {
    userWalletBalance,
    userRechargeAmount,
    userRechargeInfo,
    rechargeAmountConfig,

    fetchUserWallet,
    fetchRechargeOrders,
    createRechargeOrder,
    fetchRechargeAmountConfig,
  };
});
