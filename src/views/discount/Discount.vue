<template>
  <div class="page-discount pb-3xl">
    <van-nav-bar title="优惠中心" left-arrow @click-left="goBack" />
    <div class="p-lg">
      <div class="text-center mb-xl">
        <h1 class="section-title">{{ $t('discount') }}</h1>
        <p class="text-secondary">享受专享优惠和折扣</p>
      </div>

      <!-- 优惠券列表 -->
      <div class="coupon-list">
        <div v-for="item in coupons" :key="item.id" class="coupon-card">
          <div class="coupon-content">
            <div class="coupon-amount">{{ item.amount }}</div>
            <div class="coupon-info">
              <p class="coupon-title">{{ item.title }}</p>
              <p class="coupon-desc">{{ item.desc }}</p>
            </div>
          </div>
          <van-button type="primary" size="small">领取</van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const router = useRouter();
const { t } = useI18n();

interface Coupon {
  id: number;
  amount: string;
  title: string;
  desc: string;
}

const coupons: Coupon[] = [
  {
    id: 1,
    amount: '¥50',
    title: '新用户优惠券',
    desc: '满100元可用',
  },
  {
    id: 2,
    amount: '¥100',
    title: '会员折扣券',
    desc: '满500元可用',
  },
  {
    id: 3,
    amount: '¥20',
    title: '周末特惠券',
    desc: '满200元可用',
  },
];

const goBack = () => {
  router.back();
};
</script>

<style scoped lang="less">
.coupon-list {
  display: grid;
  gap: var(--spacing-md);
}

.coupon-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-lg);
  background-color: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  transition: all var(--transition-base);

  &:active {
    opacity: 0.8;
  }
}

.coupon-content {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  flex: 1;
}

.coupon-amount {
  font-size: var(--font-size-xl);
  font-weight: bold;
  color: var(--color-danger);
  min-width: 60px;
}

.coupon-info {
  flex: 1;
}

.coupon-title {
  font-weight: 500;
  color: var(--color-text);
  margin: 0 0 var(--spacing-xs) 0;
}

.coupon-desc {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0;
}

.section-title {
  font-size: var(--font-size-2xl);
  font-weight: bold;
  color: var(--color-text);
  margin: 0;
}
</style>
