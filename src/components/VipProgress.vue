<template>
  <div class="vip-progress-container">
    <div class="vip-progress-group">
      <img :src="currentLevelImg" :alt="`VIP${currentLevel}`" />
      <span class="vip-label vip-next text-gradient-gold">{{ `VIP${currentLevel}` }}</span>
    </div>

    <!-- 进度条 -->
    <div class="progress-bar-wrapper">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
      </div>
    </div>

    <div class="vip-progress-group">
      <img :src="nextLevelImg" :alt="`VIP${nextLevel}`" />
      <span class="vip-label vip-current text-gradient-gold">{{ `VIP${nextLevel}` }}</span>
    </div>

    <!-- 进度百分比 -->
    <!-- <div class="progress-info">
      <span class="percentage text-gradient-gold">{{ Math.round(progressPercentage) }}%</span>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { VIP_ICON_LIST } from '@/config/index';

interface Props {
  /**
   * 当前 VIP 等级
   */
  currentLevel?: number;

  /**
   * 下一个 VIP 等级
   */
  nextLevel?: number;

  /**
   * 进度百分比 (0-100)
   */
  progress?: number;
}

const props = withDefaults(defineProps<Props>(), {
  currentLevel: 0,
  nextLevel: 1,
  progress: 20,
});

const currentLevelImg = computed(() => VIP_ICON_LIST[props.currentLevel]);
const nextLevelImg = computed(() => VIP_ICON_LIST[props.nextLevel]);

/**
 * 计算进度百分比 (0-100)
 */
const progressPercentage = computed(() => {
  return Math.min(Math.max(props.progress, 0), 100);
});
</script>

<style scoped lang="less">
.vip-progress-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  width: 100%;

  .vip-progress-group {
    display: flex;
    align-items: center;
    gap: 3px;

    img {
      width: 26px;
      height: 26px;
    }

    .vip-label {
      font-size: 20px;
      font-weight: 700;
    }
  }
}

// ==================== 进度条 ====================

.progress-bar-wrapper {
  display: flex;
  align-items: center;
  flex: 1;
}

.progress-bar {
  width: 100%;
  height: 22px;
  background: #021f0e;
  border-radius: 11px;
  overflow: hidden;
  position: relative;

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #fcc87d 0%, #e0ac50 100%);
    transition: width 0.5s ease;
    border-radius: 6px;
  }
}
// ==================== 进度信息 ====================

.progress-info {
  display: flex;
  justify-content: center;
  width: 100%;

  .percentage {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: var(--letter-spacing-sm);
  }
}
</style>
