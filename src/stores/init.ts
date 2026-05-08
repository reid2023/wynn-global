import { useUserStore } from '@/stores/userStore';
import { useVipStore } from '@/stores/vipStore';
import { useWalletStore } from '@/stores/walletStore';
import { useSpecialActivityStore } from '@/stores/specialActivityStore';
import { useActiveStore } from './activeStore';

/**
 * 初始化应用数据
 * 分为登录前、登录后、始终执行三个阶段
 */
const useInit = () => {
  const userStore = useUserStore();
  const vipStore = useVipStore();
  const walletStore = useWalletStore();
  const specialActivityStore = useSpecialActivityStore();
  const activeStore = useActiveStore();

  /**
   * 始终执行的初始化（登录前后都需要）
   */
  const initAlways = async () => {
    // console.log('[Init] 执行通用初始化');
  };

  /**
   * 仅在登录后执行的初始化
   */
  const initAfterLogin = async () => {
    console.log('[Init] 执行登录后初始化');

    // 创建任务列表用于加载跟踪
    const tasks = [
      { name: '钱包数据', fn: () => walletStore.fetchUserWallet() },
      { name: '可领取活动', fn: () => activeStore.fetchAvailableActivities() },
      { name: '救援金配置', fn: () => specialActivityStore.fetchRescueOffer() },
      { name: 'VIP等级', fn: () => vipStore.fetchVipLevelList() },
      { name: '首充活动', fn: () => activeStore.fetchFirstRechargeConfig() },
      { name: '充值档位', fn: () => walletStore.fetchRechargeAmountConfig() },
    ];

    // 并行执行所有任务
    const taskPromises = tasks.map((task) => {
      return Promise.resolve(task.fn())
        .catch((err) => {
          console.error(`[Init] ${task.name} 失败:`, err);
        })
        .finally(() => {
          // 每个任务完成时更新进度
          if (window.LoadingProgress) {
            window.LoadingProgress.step(2);
          }
        });
    });

    await Promise.all(taskPromises);
  };

  /**
   * 应用启动时的初始化流程
   */
  const initApp = async () => {
    console.log('[Init] 应用启动初始化');

    try {
      // 阶段 1: 始终执行的初始化
      await initAlways();

      // 阶段 2: 根据登录状态执行相应初始化
      if (userStore.isLoggedIn) {
        await initAfterLogin();
      }

      console.log('[Init] 初始化完成');
    } catch (err) {
      console.error('[Init] 初始化出错:', err);
    }
  };

  /**
   * 用户退出登录后的初始化
   * 在处理注销/退出后调用此函数
   */
  const initOnUserLogout = async () => {
    console.log('[Init] 用户退出登录，执行登录前初始化');
    await userStore.logout();
  };

  return {
    initApp,
    initAfterLogin,
    initOnUserLogout,
  };
};

export default useInit;
