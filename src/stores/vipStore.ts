import { vipApi } from '@/services';
import { defineStore } from 'pinia';
import { ref } from 'vue';

// import { local } from '@/utils/storage';
// import { LOCAL_KEY } from '@/config';
import { VipLevel, VipDaily, VipInfo } from '@/types/vip';

export const useVipStore = defineStore('vip', () => {
  /**
   * VIP配置
   */
  const vipLevelList = ref<VipLevel[]>([]);

  /**
   * 今日 VIP 工资信息
   */
  const vipDailyData = ref<VipDaily | null>(null);

  /**
   * VIP 信息
   */
  const useVipInfo = ref<VipInfo | null>(null);

  /**
   * 获取VIP数据
   */
  const fetchVipLevelList = async () => {
    try {
      const response = await vipApi.getVipLevels();
      vipLevelList.value = response.data?.levels || [];
    } catch (error) {
      console.error('Failed to fetch VIP level list:', error);
    }
  };

  const fetchVipInfo = async () => {
    try {
      const response = await vipApi.getVipInfo();
      useVipInfo.value = response.data as VipInfo;
    } catch (error) {
      console.error('Failed to fetch VIP info:', error);
    }
  };

  const fetchVipDaily = async () => {
    try {
      const response = await vipApi.getVipDaily();
      vipDailyData.value = response.data as VipDaily;
    } catch (error) {
      console.error('Failed to fetch VIP Daily:', error);
    }
  };

  return {
    vipLevelList,
    useVipInfo,
    vipDailyData,
    fetchVipLevelList,
    fetchVipInfo,
    fetchVipDaily,
  };
});
