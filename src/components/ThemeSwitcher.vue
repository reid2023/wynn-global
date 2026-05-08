<template>
  <div class="theme-switcher flex items-center gap-2">
    <!-- 主题选择器 -->
    <div class="flex gap-2">
      <button
        v-for="theme in availableThemes"
        :key="theme.name"
        :class="[
          'theme-btn w-10 h-10 rounded-full transition-all duration-200 flex items-center justify-center',
          currentTheme === theme.name
            ? 'ring-2 ring-offset-2 ring-[var(--color-primary)]'
            : 'opacity-60 hover:opacity-100',
        ]"
        :title="theme.label"
        :aria-label="`Switch to ${theme.label} theme`"
        @click="switchTheme(theme.name)"
      >
        <span v-if="theme.name === 'light'" class="text-xl">☀️</span>
        <span v-else-if="theme.name === 'dark'" class="text-xl">🌙</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { themeState, switchTheme, getAvailableThemes } from '@/theme';

const currentTheme = computed(() => themeState.current);
const availableThemes = getAvailableThemes();
</script>

<style scoped>
.theme-switcher {
  padding: 0.5rem;
  border-radius: var(--radius-lg);
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
}

.theme-btn {
  font-size: 1.25rem;
  line-height: 1;
}

input[type='checkbox'] {
  cursor: pointer;
}
</style>
