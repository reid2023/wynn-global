<template>
  <div class="form-checkbox">
    <label class="checkbox-wrapper">
      <input type="checkbox" :checked="modelValue" @change="handleChange" class="checkbox-input" />
      <span class="checkbox-custom"></span>
      <span class="checkbox-label text-gradient-gold">
        <slot></slot>
      </span>
    </label>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

/**
 * 处理复选框变化
 */
const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.checked);
};
</script>

<style scoped lang="less">
.form-checkbox {
  display: flex;
  align-items: center;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;

  .checkbox-input {
    display: none;
  }

  .checkbox-custom {
    width: 39px;
    height: 39px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    flex-shrink: 0;
    background-image: url('@/assets/imgs/form/gou_1.png');
    background-repeat: no-repeat;
    background-position: left -3px top 0;
    background-size: 48px 48px;
  }

  .checkbox-label {
    font-size: 18px;
    font-weight: 600;
    line-height: 1.5;
    letter-spacing: var(--letter-spacing-sm);
  }

  .checkbox-input:checked ~ .checkbox-custom {
    background-image: url('@/assets/imgs/form/gou_2.png');

    &::after {
      opacity: 1;
    }
  }
}
</style>
