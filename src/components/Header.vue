<template>
  <header class="header-component">
    <div class="header-container">
      <h1>{{ title }}</h1>
      <ThemeSwitcher />
    </div>
  </header>
</template>

<script setup lang="ts">
import ThemeSwitcher from './ThemeSwitcher.vue';

interface Props {
  title: string;
}

withDefaults(defineProps<Props>(), {
  title: 'Wynn Global',
});
</script>

<style scoped lang="less">
.header-component {
  box-shadow: var(--shadow-sm);
  background-color: var(--color-bg-secondary);
  color: var(--color-text);
  border-bottom: 1px solid var(--color-border);
  transition:
    background-color var(--transition-base),
    border-color var(--transition-base);
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-lg);
  height: 3.5rem;
}

h1 {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-text);
}
</style>
