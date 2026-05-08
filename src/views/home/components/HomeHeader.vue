<template>
  <header
    class="home-header"
    :class="{ hidden: isHeaderHidden, 'is-static': mode === 'static' }"
    :style="{ position: mode === 'static' ? 'static' : 'fixed' }"
  >
    <div class="header-content">
      <!-- 左侧：Logo + 标题 -->
      <div class="header-left">
        <img src="@/assets/imgs/home/logo.png" alt="Wynn" class="logo-img" />
      </div>

      <!-- 右侧：社交按钮 -->
      <div class="header-right">
        <button class="social-btn whatsapp-btn" title="WhatsApp">
          <img src="@/assets/imgs/home/whatsapp.png" alt="WhatsApp" />
        </button>
        <button class="social-btn telegram-btn" title="Telegram">
          <img src="@/assets/imgs/home/telegram.png" alt="Telegram" />
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

interface Props {
  mode?: 'fixed' | 'static'; // fixed: 固定定位(默认) | static: 跟随滚动
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'fixed',
});

const isHeaderHidden = ref(false);
let lastScrollTop = 0;
let scrollTimeout: ReturnType<typeof setTimeout> | null = null;

const updateOnScroll = () => {
  // 只有fixed模式才需要隐藏逻辑
  if (props.mode === 'static') return;

  const pageMain = document.querySelector('.home-main');
  if (!pageMain) return;

  const currentScroll = pageMain.scrollTop;

  // 向下滚动超过50px时隐藏，向上滚动时显示
  if (currentScroll > lastScrollTop && currentScroll > 50) {
    isHeaderHidden.value = true;
  } else {
    isHeaderHidden.value = false;
  }

  lastScrollTop = currentScroll;
};

onMounted(() => {
  const pageMain = document.querySelector('.home-main');
  if (pageMain) {
    pageMain.addEventListener('scroll', updateOnScroll);
  }
});

onUnmounted(() => {
  const pageMain = document.querySelector('.home-main');
  if (pageMain) {
    pageMain.removeEventListener('scroll', updateOnScroll);
  }
  if (scrollTimeout) {
    clearTimeout(scrollTimeout);
  }
});

defineExpose({
  updateOnScroll,
});
</script>

<style scoped lang="less">
.home-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 90px;
  z-index: 100;
  transition: transform 0.3s ease;
  background: url('@/assets/imgs/home/dingbu.png') center top no-repeat;
  background-size: 100% 100%;

  &.hidden {
    transform: translateY(-100%);
  }

  // static 模式：跟随滚动，无 z-index
  &.is-static {
    position: static;
    z-index: auto;
    margin-bottom: 0;
  }
}

.header-content {
  width: 100%;
  max-width: 750px;
  height: 100%;
  margin: 0 auto;
  padding: 0 var(--padding-30) 0 var(--padding-20);
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;

  .logo-img {
    width: 275px;
    height: 53px;
    object-fit: contain;
  }

  .header-title {
    font-size: 18px;
    font-weight: 600;
    color: #d4af37;
    white-space: nowrap;
  }
}

.header-right {
  display: flex;
  gap: var(--font-size-xl);
}

.social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 58px;
  height: 58px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  &:hover,
  &:active {
    transform: scale(1.05);
  }
}
</style>
