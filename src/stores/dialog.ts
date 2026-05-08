import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useUserStore } from './userStore';
import { showToast } from 'vant';

export type DialogType =
  | 'login'
  | 'register'
  | 'vip'
  | 'share'
  | 'firstCharge'
  | 'recharge'
  | 'withdrawal'
  | 'dailyCheckIn'
  | 'specialActivity'
  | 'thirdPartyPayment'
  | 'userProfile'
  | 'firstRecharge'
  | string;

export interface DialogConfig {
  requireAuth?: boolean; // 是否需要登录权限
}

export interface DialogItem {
  id: string; // 唯一ID (uuid)
  type: DialogType;
  params: Record<string, any>;
  zIndex?: number; // 层级（用于多弹窗的 z-index）
}

/**
 * Dialog 全局状态管理
 * 支持多个弹窗同时存在，类似 antd modal
 */
export const useDialogStore = defineStore('dialog', () => {
  // 弹窗列表（支持多个弹窗同时存在）
  const dialogs = ref<DialogItem[]>([]);

  // 生成唯一 ID
  const generateId = (): string => {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // 登录状态从 userStore 获取（通过计算属性延迟获取）
  const isLoggedIn = computed(() => useUserStore().isLoggedIn);

  // 弹窗配置
  const dialogConfigs: Record<DialogType, DialogConfig> = {
    login: {
      requireAuth: false,
    },
    register: {
      requireAuth: false,
    },
    vip: {
      requireAuth: true,
    },
    share: {
      requireAuth: true,
    },
    firstCharge: {
      requireAuth: true,
    },
    recharge: {
      requireAuth: true,
    },
    withdrawal: {
      requireAuth: true,
    },
    dailyCheckIn: {
      requireAuth: true,
    },
    specialActivity: {
      requireAuth: true,
    },
    thirdPartyPayment: {
      requireAuth: true,
    },
    licensed: {
      requireAuth: false,
    },
    userProfile: {
      requireAuth: true,
    },
    firstRecharge: {
      requireAuth: true,
    },
  };

  /**
   * 检查弹窗是否有权限打开
   */
  const canOpenDialog = (type: DialogType): boolean => {
    const config = dialogConfigs[type];
    if (!config) return false;

    // 检查权限：如果需要登录权限且未登录，则不允许打开
    if (config.requireAuth && !isLoggedIn.value) {
      showToast('Por favor, faça login na sua conta.');
      return false;
    }

    return true;
  };

  /**
   * 打开弹窗 - 支持多个弹窗同时存在
   * @param type 弹窗类型
   * @param params 额外参数
   * @returns 弹窗 ID
   */
  const openDialog = (type: DialogType, params: Record<string, any> = {}): string => {
    // 检查权限
    if (!canOpenDialog(type)) {
      return '';
    }

    // 生成新的弹窗项
    const id = generateId();
    const zIndex = 1000 + dialogs.value.length * 10; // 动态计算 z-index

    dialogs.value.push({
      id,
      type,
      params,
      zIndex,
    });

    return id;
  };

  /**
   * 关闭指定弹窗（通过 ID）
   * @param id 弹窗 ID
   */
  const closeDialog = (id: string) => {
    const index = dialogs.value.findIndex((item) => item.id === id);
    if (index !== -1) {
      dialogs.value.splice(index, 1);
    }
  };

  /**
   * 关闭所有弹窗
   */
  const closeAllDialogs = () => {
    dialogs.value = [];
  };

  /**
   * 更新弹窗参数
   */
  const updateDialogParams = (id: string, params: Record<string, any>) => {
    const item = dialogs.value.find((d) => d.id === id);
    if (item) {
      item.params = {
        ...item.params,
        ...params,
      };
    }
  };

  /**
   * 移除弹窗参数
   */
  const removeDialogParams = (id: string, keys: string[]) => {
    const item = dialogs.value.find((d) => d.id === id);
    if (item) {
      keys.forEach((key) => {
        delete item.params[key];
      });
    }
  };

  // 计算属性：是否有弹窗打开
  const isDialogOpen = computed(() => dialogs.value.length > 0);

  return {
    dialogs,
    isDialogOpen,
    openDialog,
    closeDialog,
    closeAllDialogs,
    updateDialogParams,
    removeDialogParams,
    canOpenDialog,
  };
});
