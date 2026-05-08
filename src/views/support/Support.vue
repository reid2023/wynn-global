<template>
  <div class="page-support pb-3xl">
    <van-nav-bar title="赞助支持" left-arrow @click-left="goBack" />
    <div class="p-lg">
      <div class="text-center mb-xl">
        <h1 class="section-title">{{ $t('support') }}</h1>
        <p class="text-secondary">支持我们，享受更多特权</p>
      </div>

      <!-- 赞助方案 -->
      <div class="support-plans">
        <div v-for="plan in sponsorPlans" :key="plan.id" class="plan-card">
          <div class="plan-badge" v-if="plan.isPopular">热门</div>
          <div class="plan-header">
            <h3 class="plan-name">{{ plan.name }}</h3>
            <p class="plan-price">¥{{ plan.price }}/月</p>
          </div>

          <ul class="plan-features">
            <li v-for="feature in plan.features" :key="feature">✓ {{ feature }}</li>
          </ul>

          <van-button type="primary" block :class="{ 'is-popular': plan.isPopular }">
            立即赞助
          </van-button>
        </div>
      </div>

      <!-- 赞助者权益 -->
      <div class="mt-xl">
        <h3 class="section-title">赞助者权益</h3>
        <div class="benefits-grid">
          <div class="benefit-item">
            <div class="benefit-icon">👑</div>
            <p class="benefit-text">VIP身份标识</p>
          </div>
          <div class="benefit-item">
            <div class="benefit-icon">🎁</div>
            <p class="benefit-text">专属礼物</p>
          </div>
          <div class="benefit-item">
            <div class="benefit-icon">⭐</div>
            <p class="benefit-text">优先支持</p>
          </div>
          <div class="benefit-item">
            <div class="benefit-icon">📱</div>
            <p class="benefit-text">高级功能</p>
          </div>
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

interface SponsorPlan {
  id: number;
  name: string;
  price: number;
  isPopular: boolean;
  features: string[];
}

const sponsorPlans: SponsorPlan[] = [
  {
    id: 1,
    name: '基础赞助',
    price: 9,
    isPopular: false,
    features: ['VIP身份', '专属徽章', '基础功能'],
  },
  {
    id: 2,
    name: '高级赞助',
    price: 29,
    isPopular: true,
    features: ['VIP身份', '专属徽章', '所有功能', '优先客服', '月度礼物'],
  },
  {
    id: 3,
    name: '至尊赞助',
    price: 99,
    isPopular: false,
    features: ['VIP身份', '专属徽章', '所有功能', '优先客服', '月度礼物', '定制服务'],
  },
];

const goBack = () => {
  router.back();
};
</script>

<style scoped lang="less">
.support-plans {
  display: grid;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
}

.plan-card {
  position: relative;
  padding: var(--spacing-lg);
  background-color: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  transition: all var(--transition-base);

  &.is-popular {
    border-color: var(--color-primary);
    box-shadow: 0 0 12px rgba(59, 130, 246, 0.15);
  }
}

.plan-badge {
  position: absolute;
  top: -12px;
  right: 20px;
  background-color: var(--color-primary);
  color: white;
  padding: 4px 12px;
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: bold;
}

.plan-header {
  margin-bottom: var(--spacing-md);
}

.plan-name {
  font-size: var(--font-size-lg);
  font-weight: bold;
  color: var(--color-text);
  margin: 0 0 var(--spacing-xs) 0;
}

.plan-price {
  font-size: var(--font-size-xl);
  color: var(--color-primary);
  font-weight: bold;
  margin: 0;
}

.plan-features {
  list-style: none;
  padding: 0;
  margin: 0 0 var(--spacing-lg) 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);

  li {
    padding: 4px 0;
  }
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
}

.benefit-item {
  padding: var(--spacing-md);
  background-color: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  text-align: center;
}

.benefit-icon {
  font-size: 32px;
  margin-bottom: var(--spacing-sm);
}

.benefit-text {
  font-size: var(--font-size-sm);
  color: var(--color-text);
  margin: 0;
}

.section-title {
  font-size: var(--font-size-xl);
  font-weight: bold;
  color: var(--color-text);
  margin: 0 0 var(--spacing-lg) 0;
}
</style>
