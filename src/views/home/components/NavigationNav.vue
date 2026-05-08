<template>
  <div class="navigation-nav">
    <div class="nav-grid">
      <button
        v-for="item in NAV_ITEMS"
        :key="item.value"
        class="nav-item"
        @click="handleNavClick(item.value)"
      >
        <div class="nav-icon">
          <img :src="item.icon" :alt="item.label" />
          <span class="nav-title text-gradient-gold">{{ item.label }}</span>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NAV_ITEMS } from '../homeConfig';
import { useDialogStore } from '@/stores/dialog';

const dialogStore = useDialogStore();

const handleNavClick = (value: string) => {
  // 根据不同的导航项执行相应的操作
  switch (value) {
    case 'vip':
      dialogStore.openDialog('vip');
      break;
    case 'daily':
      dialogStore.openDialog('dailyCheckIn');
      break;
    case 'invite':
      dialogStore.openDialog('share');
      break;
    case 'licensed':
      dialogStore.openDialog('licensed');
      break;
  }
};
</script>

<style scoped lang="less">
.navigation-nav {
  width: 100%;
  height: 134px;
  background: url('@/assets/imgs/home/dingk.png') center top no-repeat;
  background-size: 100% auto;
}

.nav-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  width: 100%;
  height: 100%;
  gap: 56px;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border-radius: 8px;
  height: 134px;
  transition: all 0.3s ease;
  position: relative;

  .nav-title {
    position: absolute;
    bottom: 16px;
    width: 100%;
    text-align: center;
    padding-left: 1px;
    font-size: 20px;
    font-weight: 700;
  }

  img {
    width: 130px;
    height: 134px;
    object-fit: contain;
  }

  &:hover,
  &:active {
    transform: scale(1.05);
  }
}
</style>
