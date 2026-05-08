<template>
  <div class="marquee-container">
    <div class="marquee-content">
      <span class="marquee-icon">🎉</span>
      <div class="marquee-scroll">
        <div class="marquee-text">
          <span v-for="item in repeatedItems" :key="`${item.id}-${item.playerName}`" class="marquee-item">
            <span class="player-name">{{ item.playerName }}</span>
            <span class="amount">{{ item.amount }}</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { MARQUEE_ITEMS, type MarqueeItem } from '../homeConfig';

// 重复多次以实现无限滚动效果
const repeatedItems = computed(() => {
  return Array.from({ length: 3 }).flatMap(() => MARQUEE_ITEMS);
});
</script>

<style scoped lang="less">
.marquee-container {
  width: 100%;
  height: 40px;
  background: linear-gradient(90deg, #2a1810 0%, #3d2817 100%);
  border: 1px solid #d4af37;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  padding: 0 16px;
  box-sizing: border-box;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
}

.marquee-content {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  overflow: hidden;
}

.marquee-icon {
  font-size: 20px;
  flex-shrink: 0;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.marquee-scroll {
  flex: 1;
  overflow: hidden;
  min-width: 0;
}

.marquee-text {
  display: inline-flex;
  gap: 20px;
  animation: scroll 25s linear infinite;
  white-space: nowrap;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
}

@keyframes scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(calc(-100% / 3));
  }
}

.marquee-item {
  display: inline-flex;
  gap: 8px;
  align-items: center;
}

.player-name {
  font-size: 12px;
  color: #d4af37;
  font-weight: 600;
}

.amount {
  font-size: 12px;
  color: #4caf50;
  font-weight: 700;
}
</style>
