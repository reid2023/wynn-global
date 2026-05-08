<template>
  <div class="app bg-[var(--color-bg)] text-[var(--color-text)]">
    <RouterView />
    <!-- <BottomNav /> -->

    <!-- 全局弹窗容器 -->
    <DialogContainer />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import DialogContainer from '@/components/dialog/DialogContainer.vue';
import { useUserStore } from './stores/userStore';
import useInit from './stores/init';
import { onMounted } from 'vue';

const userStore = useUserStore();
const { initApp } = useInit();

onMounted(async () => {
  try {
    // Vue 应用初始化开始，更新进度（70% -> 80%）
    if (window.LoadingProgress) {
      window.LoadingProgress.step(5);
    }

    // 获取用户信息
    await userStore.getUserProfile();

    if (window.LoadingProgress) {
      window.LoadingProgress.step(5);
    }

    // 应用数据初始化
    await initApp();

    if (window.LoadingProgress) {
      window.LoadingProgress.step(5);
    }
  } catch (err) {
    console.error('[App] 初始化失败:', err);
  } finally {
    // 应用完全初始化完成，关闭 Loading 页面
    if (window.LoadingProgress) {
      setTimeout(() => {
        window.LoadingProgress.finish();
      }, 50);
    }
  }
});
</script>

<style scoped>
.app {
  width: 100%;
  min-height: 100%;
  max-width: 46.875rem; /* 750px ÷ 16px = 46.875rem（设计稿基准宽度） */
  margin: 0 auto;
  background-color: var(--color-bg);
  color: var(--color-text);
  box-sizing: border-box;
  transition:
    background-color var(--transition-base),
    color var(--transition-base);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  overflow-y: auto;
}
</style>
