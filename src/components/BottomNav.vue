<template>
  <div class="bottom-nav" role="navigation" aria-label="Main navigation">
    <div class="nav-container">
      <button
        v-for="item in navItems"
        :key="item.path"
        type="button"
        class="nav-item"
        :class="{ active: isActive(item.path) }"
        :aria-current="isActive(item.path) ? 'page' : undefined"
        :aria-label="`Navigate to ${item.label}`"
        @click="navigate(item.path)"
      >
        <span class="nav-icon" aria-hidden="true">{{ item.icon }}</span>
        <span class="nav-label">{{ item.label }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

const router = useRouter();
const route = useRoute();
const { t } = useI18n();

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

const navItems: NavItem[] = [
  {
    path: '/',
    label: t('home'),
    icon: '🏠',
  },
  {
    path: '/discount',
    label: t('discount'),
    icon: '🎁',
  },
  {
    path: '/service',
    label: t('service'),
    icon: '🎧',
  },
  {
    path: '/support',
    label: t('support'),
    icon: '❤️',
  },
  {
    path: '/mine',
    label: t('mine'),
    icon: '👤',
  },
];

const isActive = (path: string) => {
  return route.path === path;
};

const navigate = (path: string) => {
  if (!isActive(path)) {
    router.push(path);
  }
};
</script>

<style scoped lang="less">
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  // 考虑 iOS 设备的 safe area（刘海屏、底部操作条）
  padding-bottom: max(0, env(safe-area-inset-bottom));
  background-color: var(--color-bg);
  border-top: 1px solid var(--color-border);
  min-height: calc(50px + max(0, env(safe-area-inset-bottom)));
  display: flex;
  align-items: flex-start;
  justify-content: center;
  z-index: 100;
  box-shadow: 0 -1px 4px var(--color-shadow);
  // iOS Safari 修复：确保背景色覆盖到边界
  width: 100vw;
  margin-left: -50vw;
  left: 50%;
  border-top-left-radius: var(--spacing-lg);
  border-top-right-radius: var(--spacing-lg);
}

.nav-container {
  width: 100%;
  max-width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: var(--spacing-xs) var(--spacing-sm) 0;
  // 确保在 safe area 内
  padding-bottom: max(var(--spacing-xs), env(safe-area-inset-bottom));
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  // 确保触摸目标至少 44x44px（Apple HIG 标准）
  min-height: 44px;
  min-width: 44px;
  padding: var(--spacing-xs);
  // 移除默认按钮样式
  border: none;
  background: none;
  cursor: pointer;
  // 防止双击放大（iOS）
  -webkit-user-select: none;
  user-select: none;
  // 禁用 iOS Safari 默认点击样式
  -webkit-tap-highlight-color: transparent;
  transition: color var(--transition-base);
  color: var(--color-text-secondary);
  font-size: var(--font-size-xs);
  font-family: inherit;
  // 防止文本选中
  -webkit-touch-callout: none;

  // 确保在深色模式下也能看清
  &:active {
    opacity: 0.7;
    // 使用更好的视觉反馈
    background-color: rgba(0, 0, 0, 0.05);
  }

  &.active {
    color: var(--color-primary);
    font-weight: 500;

    .nav-icon {
      transform: scale(1.15);
    }
  }

  // 深色主题下的点击反馈
  :root.dark &:active {
    background-color: rgba(255, 255, 255, 0.1);
  }

  // focusx 状态（键盘导航）
  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: -2px;
  }
}

.nav-icon {
  font-size: 24px;
  margin-bottom: 4px;
  transition: transform var(--transition-base);
  // 防止用户选择表情文字
  -webkit-user-select: none;
  user-select: none;
  // 禁用 iOS 长按菜单
  -webkit-user-interaction: none;
  pointer-events: none;
}

.nav-label {
  font-size: var(--font-size-xs);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 90%;
  line-height: 1.2;
  -webkit-user-select: none;
  user-select: none;
}
</style>
