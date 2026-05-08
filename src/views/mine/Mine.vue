<template>
  <div class="page-mine pb-3xl">
    <van-nav-bar title="个人中心" left-arrow @click-left="goBack" />

    <div class="user-section">
      <!-- 用户信息卡片 -->
      <div class="user-card">
        <div class="user-header">
          <div class="user-avatar">👤</div>
          <div class="user-info">
            <h2 class="user-name">{{ userName }}</h2>
            <p class="user-status">{{ userStatus }}</p>
          </div>
          <div class="vip-badge">VIP{{ vipLevel }}</div>
        </div>

        <!-- 余额信息 -->
        <div class="balance-info">
          <div class="balance-item">
            <p class="balance-label">账户余额</p>
            <p class="balance-value">¥{{ balance }}</p>
          </div>
          <div class="balance-divider"></div>
          <div class="balance-item">
            <p class="balance-label">流水额度</p>
            <p class="balance-range">{{ balanceRange }}</p>
          </div>
        </div>

        <!-- VIP等级 -->
        <div class="vip-progress">
          <div class="vip-label">VIP0 <span class="vip-range">VIP1</span></div>
          <van-progress percentage="30" color="linear-gradient(to right, #3b82f6, #60a5fa)" />
        </div>

        <!-- 操作按钮 -->
        <div class="action-buttons">
          <van-button type="primary" size="small">存款</van-button>
          <van-button type="primary" size="small">转账</van-button>
          <van-button type="primary" size="small">取款</van-button>
        </div>
      </div>
    </div>

    <!-- 菜单列表 -->
    <div class="menu-section">
      <div class="menu-grid">
        <div
          v-for="item in menuItems"
          :key="item.id"
          class="menu-item"
          @click="handleMenuClick(item.id)"
        >
          <div class="menu-icon">{{ item.icon }}</div>
          <p class="menu-title">{{ item.title }}</p>
        </div>
      </div>
    </div>

    <!-- 活动区域 -->
    <div class="p-lg">
      <div class="activity-card">
        <div class="activity-header">
          <h3 class="activity-title">长期活动</h3>
          <p class="activity-subtitle">邀请好友 分享赚钱</p>
        </div>
        <p class="activity-desc">邀请好友可获最高68元 邀请同行 流水最高3%</p>
        <img src="#" alt="activity" class="activity-image" />
      </div>
    </div>

    <!-- 其他菜单 -->
    <div class="other-menu">
      <div class="menu-row" @click="handleNavigate">
        <div class="menu-row-content">
          <div class="menu-row-icon">💰</div>
          <p class="menu-row-title">余额宝累计收益</p>
        </div>
        <div class="menu-row-arrow">›</div>
      </div>

      <div class="menu-row" @click="handleNavigate">
        <div class="menu-row-content">
          <div class="menu-row-icon">👥</div>
          <p class="menu-row-title">关于华体会</p>
        </div>
        <div class="menu-row-arrow">›</div>
      </div>

      <div class="menu-row" @click="handleNavigate">
        <div class="menu-row-content">
          <div class="menu-row-icon">👤</div>
          <p class="menu-row-title">添加桌面客服</p>
        </div>
        <div class="menu-row-arrow">›</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const userName = 'hank2015';
const userStatus = '加入华体会体育第1天';
const vipLevel = 0;
const balance = '0.00';
const balanceRange = '0.00/6,000.00';

interface MenuItem {
  id: number;
  title: string;
  icon: string;
}

const menuItems: MenuItem[] = [
  { id: 1, title: '交易记录', icon: '📝' },
  { id: 2, title: '投注记录', icon: '🎯' },
  { id: 3, title: '实时返水', icon: '💧' },
  { id: 4, title: '账户管理', icon: '⚙️' },
  { id: 5, title: '分享赚钱', icon: '💵' },
  { id: 6, title: '意见反馈', icon: '💬' },
  { id: 7, title: '帮助中心', icon: '❓' },
  { id: 8, title: '加入我们', icon: '👥' },
];

const goBack = () => {
  router.back();
};

const handleMenuClick = (id: number) => {
  // 可根据菜单项ID进行路由或其他操作
  console.log('菜单项被点击:', id);
};

const handleNavigate = () => {
  // 其他菜单项的导航逻辑
  console.log('菜单被点击');
};
</script>

<style scoped lang="less">
.page-mine {
  background-color: var(--color-bg);
  min-height: 100vh;
}

.user-section {
  padding: var(--spacing-lg);
  background-color: var(--color-bg);
}

.user-card {
  background-color: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  border: 1px solid var(--color-border);
}

.user-header {
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-lg);
  gap: var(--spacing-md);
}

.user-avatar {
  font-size: 48px;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-bg);
  border-radius: var(--radius-md);
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: var(--font-size-lg);
  font-weight: bold;
  color: var(--color-text);
  margin: 0 0 4px 0;
}

.user-status {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0;
}

.vip-badge {
  background-color: var(--color-primary);
  color: white;
  padding: 4px 12px;
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: bold;
  white-space: nowrap;
}

.balance-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md) 0;
  margin-bottom: var(--spacing-lg);
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
}

.balance-item {
  flex: 1;
  text-align: center;
}

.balance-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0 0 4px 0;
}

.balance-value {
  font-size: var(--font-size-lg);
  font-weight: bold;
  color: var(--color-text);
  margin: 0;
}

.balance-range {
  font-size: var(--font-size-sm);
  color: var(--color-text);
  margin: 0;
}

.balance-divider {
  width: 1px;
  height: 40px;
  background-color: var(--color-border);
}

.vip-progress {
  margin-bottom: var(--spacing-lg);
}

.vip-label {
  display: flex;
  justify-content: space-between;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-bottom: 8px;
}

.vip-range {
  color: var(--color-text);
}

.action-buttons {
  display: flex;
  gap: var(--spacing-md);

  :deep(.van-button) {
    flex: 1;
  }
}

.menu-section {
  padding: var(--spacing-lg);
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-md);
}

.menu-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-md);
  background-color: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-base);
  border: 1px solid var(--color-border);

  &:active {
    opacity: 0.8;
    transform: scale(0.95);
  }
}

.menu-icon {
  font-size: 32px;
  margin-bottom: var(--spacing-sm);
}

.menu-title {
  font-size: var(--font-size-xs);
  color: var(--color-text);
  text-align: center;
  margin: 0;
}

.activity-card {
  background: linear-gradient(135deg, var(--color-bg-secondary) 0%, var(--color-bg-tertiary) 100%);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  border: 1px solid var(--color-border);
}

.activity-header {
  margin-bottom: var(--spacing-md);
}

.activity-title {
  font-size: var(--font-size-lg);
  font-weight: bold;
  color: var(--color-text);
  margin: 0 0 4px 0;
}

.activity-subtitle {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0;
}

.activity-desc {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-md);
}

.activity-image {
  width: 100%;
  height: 120px;
  background-color: var(--color-bg);
  border-radius: var(--radius-md);
  display: block;
}

.other-menu {
  padding: 0 var(--spacing-lg) var(--spacing-lg);
}

.menu-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md) 0;
  border-bottom: 1px solid var(--color-border);
  cursor: pointer;
  transition: opacity var(--transition-base);

  &:last-child {
    border-bottom: none;
  }

  &:active {
    opacity: 0.7;
  }
}

.menu-row-content {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  flex: 1;
}

.menu-row-icon {
  font-size: 24px;
  min-width: 30px;
}

.menu-row-title {
  font-size: var(--font-size-md);
  color: var(--color-text);
  margin: 0;
}

.menu-row-arrow {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
}
</style>
