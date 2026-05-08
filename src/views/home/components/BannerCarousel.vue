<template>
  <div class="banner-carousel">
    <van-swipe
      ref="swipeRef"
      class="carousel-swipe"
      :autoplay="5000"
      :duration="400"
      :loop="true"
      :show-indicators="false"
      @change="handleSwipeChange"
    >
      <van-swipe-item v-for="banner in BANNER_ITEMS" :key="banner.id" class="carousel-slide">
        <img
          :src="banner.image"
          :alt="banner.title"
          :class="['banner-image', `banner-image-${banner.id}`]"
        />
      </van-swipe-item>
    </van-swipe>

    <!-- 自定义指示点 -->
    <div class="carousel-indicators">
      <div
        v-for="(banner, index) in BANNER_ITEMS"
        :key="banner.id"
        class="indicator-dot"
        :class="{ active: index === currentIndex }"
        @click="goToSlide(index)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
// import { Swipe, SwipeItem } from 'vant';
import { BANNER_ITEMS } from '../homeConfig';

const swipeRef = ref<any>(null);
const currentIndex = ref(0);

const handleSwipeChange = (index: number) => {
  currentIndex.value = index;
};

const goToSlide = (index: number) => {
  if (swipeRef.value) {
    swipeRef.value.swipeTo(index);
  }
};

// 处理窗口大小变化，强制 swipe 重新计算宽度
const handleWindowResize = () => {
  if (swipeRef.value && swipeRef.value.resize) {
    // 手动触发 swipe 重新计算尺寸
    swipeRef.value.resize();
  }
};

onMounted(() => {
  // 监听窗口大小变化
  window.addEventListener('resize', handleWindowResize);
});

onUnmounted(() => {
  // 清理事件监听
  window.removeEventListener('resize', handleWindowResize);
});
</script>

<style scoped lang="less">
.banner-carousel {
  width: 100%;
  position: relative;
  height: 620px;
}

:deep(.carousel-swipe) {
  .van-swipe {
    width: 100%;
    aspect-ratio: 16 / 9;
    border-radius: 12px;
    overflow: hidden;

    .van-swipe__track {
      height: 100%;
    }
  }
}

.carousel-slide {
  width: 100%;
  height: 100%;
  min-height: 565px;
  display: flex;
  justify-content: center;
  position: relative;
}

.banner-image {
  width: 100%;
  height: 565px;
  display: inline-block;
  position: relative;
  top: 10px;
}

.carousel-indicators {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 10;
}

.indicator-dot {
  width: 8px;
  height: 8px;
  background: #575a58;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;

  &.active {
    background: #00bd08;
    width: 24px;
    border-radius: 4px;
  }

  &:not(&.active):hover {
    background: rgba(255, 255, 255, 0.8);
  }
}
</style>
