<template>
  <div class="home-page" ref="pageRef">
    <!-- 顶部Header (绝对定位 + 滚动隐藏) -->
    <HomeHeader ref="headerRef" mode="static" />

    <!-- 下拉刷新组件 -->
    <van-pull-refresh
      v-model="isRefreshing"
      @refresh="handleRefresh"
      :disabled="!pullRefreshEnabled"
      success-text="Atualização concluída com sucesso"
      pulling-text="Puxe para atualizar"
      loosing-text="Solte para atualizar"
      loading-text="carregando..."
    >
      <!-- Página principal -->
      <main class="home-main">
        <!-- 跑马灯模块 -->
        <!-- <section class="module-marquee">
          <HomeMarquee />
        </section> -->

        <!-- Banner轮播图模块 -->
        <section class="module-banner">
          <BannerCarousel />
        </section>

        <!-- 快速导航模块 (4按钮) -->
        <section class="module-nav">
          <NavigationNav />
        </section>

        <!-- 热门游戏模块 -->
        <section class="module-games">
          <GameCardList />
        </section>

        <!-- 底部间距 -->
        <div class="bottom-spacer" />
      </main>
    </van-pull-refresh>

    <!-- 底部操作栏 (固定) -->
    <HomeActionBar />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import HomeHeader from './components/HomeHeader.vue';
// import HomeMarquee from './components/HomeMarquee.vue';
import BannerCarousel from './components/BannerCarousel.vue';
import NavigationNav from './components/NavigationNav.vue';
import GameCardList from './components/GameCardList.vue';
import HomeActionBar from './components/HomeActionBar.vue';
import useInit from '@/stores/init';

const pageRef = ref<HTMLElement>();
const headerRef = ref();

// 下拉刷新状态
const isRefreshing = ref(false);
const pullRefreshEnabled = ref(true); // 启用/禁用下拉刷新功能

const { initApp } = useInit();

onMounted(() => {
  // 处理header滚动隐藏逻辑
  if (pageRef.value) {
    pageRef.value.addEventListener('scroll', handleScroll);
  }
});

onUnmounted(() => {
  if (pageRef.value) {
    pageRef.value.removeEventListener('scroll', handleScroll);
  }
});

const handleScroll = () => {
  if (headerRef.value) {
    headerRef.value.updateOnScroll();
  }
};

/**
 * 处理下拉刷新
 */
const handleRefresh = async () => {
  try {
    // 这里可以调用刷新数据的 API
    // 例如: 重新加载游戏列表、重新获取轮播图等

    await initApp();
  } catch (error) {
    console.error('error:', error);
  } finally {
    isRefreshing.value = false;
  }
};
</script>

<style scoped lang="less">
.home-page {
  width: 100%;
  min-height: 100vh;
  background: var(--color-home-background) url('@/assets/imgs/home/bg.png') center top no-repeat;
  background-size: 100% auto;
  display: flex;
  flex-direction: column;
  position: relative;
}

.home-main {
  flex: 1;
  width: 100%;
  padding-bottom: 80px; /* 为ActionBar预留空间 */
  overflow-y: auto;
}

/* 各模块 */
.module-marquee,
.module-banner,
.module-nav,
.module-games {
  width: 100%;
  padding: 0 var(--padding-30);
  box-sizing: border-box;
}

.module-banner {
  padding: 0;
  margin-bottom: var(--padding-40);
}

.module-nav {
  margin-bottom: var(--padding-40);
}

.module-games {
  margin-bottom: var(--padding-40);
}

.bottom-spacer {
  height: 20px;
}
</style>
