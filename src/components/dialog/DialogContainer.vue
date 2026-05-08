<template>
  <Teleport to="body">
    <!-- 背景遮罩（所有弹窗共用一个） -->
    <transition name="dialog-overlay">
      <div
        v-if="isDialogOpen"
        class="dialog-overlay"
        :style="{ zIndex: getOverlayZIndex() }"
        @click="handleOverlayClick"
      />
    </transition>

    <!-- 多个弹窗（v-for 遍历） -->
    <template v-for="dialog in dialogs" :key="dialog.id">
      <transition name="dialog-scale" @after-leave="onAfterLeave">
        <div v-if="dialog" class="dialog-container" :style="{ zIndex: dialog.zIndex }">
          <!-- 登录弹窗 -->
          <LoginDialog
            v-if="dialog.type === 'login'"
            :dialog-id="dialog.id"
            :params="dialog.params"
            @close="closeDialog(dialog.id)"
          />

          <!-- 注册弹窗 -->
          <RegisterDialog
            v-if="dialog.type === 'register'"
            :dialog-id="dialog.id"
            :params="dialog.params"
            @close="closeDialog(dialog.id)"
          />

          <!-- 邀请好友弹窗 -->
          <ShareDialog
            v-if="dialog.type === 'share'"
            :dialog-id="dialog.id"
            :params="dialog.params"
            @close="closeDialog(dialog.id)"
          />

          <!-- 首充优惠活动弹窗 -->
          <FirstChargeDialog
            v-if="dialog.type === 'firstCharge'"
            :dialog-id="dialog.id"
            :params="dialog.params"
            @close="closeDialog(dialog.id)"
          />

          <!-- 充值弹窗 -->
          <RechargeDialog
            v-if="dialog.type === 'recharge'"
            :dialog-id="dialog.id"
            :params="dialog.params"
            @close="closeDialog(dialog.id)"
          />

          <!-- 首充优惠活动弹窗 -->
          <FirstRechargeDialog
            v-if="dialog.type === 'firstRecharge'"
            :dialog-id="dialog.id"
            :params="dialog.params"
            @close="closeDialog(dialog.id)"
          />

          <!-- 第三方支付弹窗 -->
          <ThirdPartyPaymentDialog
            v-if="dialog.type === 'thirdPartyPayment'"
            :dialog-id="dialog.id"
            :params="dialog.params"
            @close="closeDialog(dialog.id)"
          />

          <!-- 提现弹窗 -->
          <WithdrawalDialog
            v-if="dialog.type === 'withdrawal'"
            :dialog-id="dialog.id"
            :params="dialog.params"
            @close="closeDialog(dialog.id)"
          />

          <!-- 每日签到弹窗 -->
          <DailyCheckInDialog
            v-if="dialog.type === 'dailyCheckIn'"
            :dialog-id="dialog.id"
            :params="dialog.params"
            @close="closeDialog(dialog.id)"
          />

          <!-- 特殊活动弹窗 -->
          <SpecialActivityDialog
            v-if="dialog.type === 'specialActivity'"
            :dialog-id="dialog.id"
            :params="dialog.params"
            @close="closeDialog(dialog.id)"
          />

          <!-- VIP弹窗 -->
          <VipDialog
            v-if="dialog.type === 'vip'"
            :dialog-id="dialog.id"
            :params="dialog.params"
            @close="closeDialog(dialog.id)"
          />

          <!-- 许可证及认证弹窗 -->
          <LicensedDialog
            v-if="dialog.type === 'licensed'"
            :dialog-id="dialog.id"
            :params="dialog.params"
            @close="closeDialog(dialog.id)"
          />

          <!-- 用户信息弹窗 -->
          <UserProfileDialog
            v-if="dialog.type === 'userProfile'"
            :dialog-id="dialog.id"
            :params="dialog.params"
            @close="closeDialog(dialog.id)"
          />
        </div>
      </transition>
    </template>
  </Teleport>
</template>

<script setup lang="ts">
import { useDialogStore } from '@/stores/dialog';
import { computed, watch } from 'vue';
import LoginDialog from './LoginDialog.vue';
import RegisterDialog from './RegisterDialog.vue';
import FirstRechargeDialog from './FistRechargeDialog.vue';
import ShareDialog from './ShareDialog.vue';
import FirstChargeDialog from './FirstChargeDialog.vue';
import RechargeDialog from './RechargeDialog.vue';
import WithdrawalDialog from './WithdrawalDialog.vue';
import DailyCheckInDialog from './DailyCheckInDialog.vue';
import SpecialActivityDialog from './SpecialActivityDialog.vue';
import ThirdPartyPaymentDialog from './ThirdPartyPaymentDialog.vue';
import VipDialog from './VipDialog.vue';
import LicensedDialog from './LicensedDialog.vue';
import UserProfileDialog from './UserProfileDialog.vue';

const dialogStore = useDialogStore();

// 计算属性：是否有弹窗打开
const isDialogOpen = computed(() => dialogStore.isDialogOpen);

// 计算属性：获取所有打开的弹窗
const dialogs = computed(() => dialogStore.dialogs);

// 监听弹窗状态，控制 body 滚动
watch(isDialogOpen, (open) => {
  if (open) {
    // 弹窗打开时禁止滚动
    document.body.style.overflow = 'hidden';
  } else {
    // 弹窗关闭时恢复滚动
    document.body.style.overflow = '';
  }
});

// 是的点击mask关闭弹窗
const isMaskColse = false;

/**
 * 获取背景遮罩的 z-index（最小的弹窗 z-index - 1）
 */
const getOverlayZIndex = (): number => {
  if (dialogs.value.length === 0) return 0;
  const minZ = Math.min(...dialogs.value.map((d) => d.zIndex || 1000));
  return minZ - 1;
};

/**
 * 处理背景遮罩点击
 */
const handleOverlayClick = () => {
  // 点击遮罩关闭最后打开的弹窗
  if (dialogs.value.length > 0 && isMaskColse) {
    const lastDialog = dialogs.value[dialogs.value.length - 1];
    dialogStore.closeDialog(lastDialog.id);
  }
};

/**
 * 关闭指定弹窗
 */
const closeDialog = (id: string) => {
  dialogStore.closeDialog(id);
};

/**
 * 动画完成后的清理
 */
const onAfterLeave = () => {
  // 可以在这里做一些清理工作
};
</script>

<style scoped lang="less">
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 998;
  backdrop-filter: blur(2px);
}

.dialog-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 999;
  max-height: 90vh;
}

/* 遮罩过渡动画 */
.dialog-overlay-enter-active,
.dialog-overlay-leave-active {
  transition: opacity 0.3s ease;
}

.dialog-overlay-enter-from,
.dialog-overlay-leave-to {
  opacity: 0;
}

/* 弹窗缩放过渡动画 */
.dialog-scale-enter-active,
.dialog-scale-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dialog-scale-enter-from,
.dialog-scale-leave-to {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.8);
}
</style>
