<template>
  <div class="country-select-wrapper">
    <div class="country-select-button" :class="{ disabled: !allowSelect }" @click="handleToggle">
      <div class="country-info">
        <img :src="selectedCountry.flag" alt="flag" class="flag" />
        <span class="dial-code text-gradient-gold">{{ selectedCountry.dialCode }}</span>
      </div>
      <img src="@/assets/imgs/form/xl.png" alt="xiala" class="dropdown-arrow" />
    </div>

    <!-- 下拉列表 -->
    <transition name="dropdown">
      <div v-if="isOpen && allowSelect" class="country-dropdown">
        <div
          v-for="country in COUNTRIES"
          :key="country.code"
          class="country-option"
          :class="{ active: country.code === selectedCountry.code }"
          @click="handleSelectCountry(country)"
        >
          <img :src="country.flag" alt="" class="flag" />
          <div class="country-details">
            <div class="country-name">{{ country.name }}</div>
            <div class="country-meta">{{ country.dialCode }} • {{ country.currency }}</div>
          </div>
          <span class="checkmark" v-if="country.code === selectedCountry.code">✓</span>
        </div>
      </div>
    </transition>

    <!-- 覆盖层 - 点击关闭下拉列表 -->
    <div v-if="isOpen && allowSelect" class="country-select-overlay" @click="isOpen = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { COUNTRIES, type Country } from '@/config/countries';

interface Props {
  modelValue: string; // 国家代码
  allowSelect?: boolean; // 是否允许选择
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 'BR',
  allowSelect: true,
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const isOpen = ref(false);

/**
 * 当前选中的国家
 */
const selectedCountry = computed(() => {
  return COUNTRIES.find((c) => c.code === props.modelValue) || COUNTRIES[0];
});

/**
 * 切换下拉列表
 */
const handleToggle = () => {
  if (props.allowSelect) {
    isOpen.value = !isOpen.value;
  }
};

/**
 * 选择国家
 */
const handleSelectCountry = (country: Country) => {
  emit('update:modelValue', country.code);
  isOpen.value = false;
};
</script>

<style scoped lang="less">
.country-select-wrapper {
  position: relative;
  height: 73px;
  width: 180px;

  background-image: url('@/assets/imgs/form/k4.png');
  background-repeat: no-repeat;
  background-position: left -3px top 0;
  background-size: 188px 83px;
}

.country-select-button {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 20px;
  border: 1px solid transparent;
  border-radius: 10px;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }

  &.disabled {
    cursor: not-allowed;
    // opacity: 0.6;
  }

  .country-info {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1;

    .flag {
      width: 44px;
      height: 44px;
    }

    .dial-code {
      font-size: 20px;
      font-weight: 500;
    }
  }

  .dropdown-arrow {
    width: 20px;
    height: 14px;
    transition: transform 0.3s ease;
  }
}

.country-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(30, 30, 30, 0.98);
  border: 1px solid rgba(177, 157, 50, 0.3);
  border-radius: 8px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  max-height: 400px;
  overflow-y: auto;

  // 移动端滚动优化
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(177, 157, 50, 0.3);
    border-radius: 3px;

    &:hover {
      background: rgba(177, 157, 50, 0.5);
    }
  }
}

.country-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  &:hover {
    background: rgba(177, 157, 50, 0.1);
  }

  &.active {
    background: rgba(177, 157, 50, 0.15);
  }

  .flag {
    font-size: 24px;
    line-height: 1;
    flex-shrink: 0;
  }

  .country-details {
    flex: 1;
    min-width: 0;

    .country-name {
      font-size: 16px;
      font-weight: 500;
      color: #fff;
    }

    .country-meta {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.6);
      margin-top: 2px;
    }
  }

  .checkmark {
    flex-shrink: 0;
    color: #b19d32;
    font-size: 16px;
    font-weight: bold;
  }
}

.country-select-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
}

// 下拉列表动画
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
