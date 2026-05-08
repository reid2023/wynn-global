import { proxyApi } from '@/services';
import { defineStore } from 'pinia';
import { ref } from 'vue';

// import { local } from '@/utils/storage';
// import { LOCAL_KEY } from '@/config';
import { ProxyInfo, InviteConfigItem } from '@/types/proxy';

export const useProxyStore = defineStore('proxy', () => {
  // 邀请信息
  const proxyInfo = ref<ProxyInfo | null>(null);

  // 邀请奖励配置
  const proxyRewardConfig = ref<InviteConfigItem | null>(null);

  // 获取邀请信息
  const fetchProxyInfoData = async () => {
    try {
      const response = await proxyApi.getProxyInfo();
      proxyInfo.value = response.data as ProxyInfo;
    } catch (error) {
      console.error('Failed to fetch Proxy Info:', error);
    }
  };

  // 获取邀请奖励配置
  const fetchProxyRewardData = async () => {
    try {
      const response = await proxyApi.getProxyInviteConfig();
      proxyRewardConfig.value = response.data as InviteConfigItem;
    } catch (error) {
      console.error('Failed to fetch Proxy Reward Config:', error);
    }
  };

  return {
    proxyInfo,
    proxyRewardConfig,
    fetchProxyInfoData,
    fetchProxyRewardData,
  };
});
