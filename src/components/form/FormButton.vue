<template>
  <button
    class="form-button"
    :class="[`form-button--${type}`, { 'is-loading': loading }]"
    :disabled="disabled || loading"
    @click="$emit('click')"
  >
    <span
      class="button-text"
      :class="{
        'text-gradient-gold-daily-amount': 'recharge' == type,
        'text-gradient-gold-vip-recharge-amount': 'vip-recharge' == type,
      }"
    >
      <slot>{{ label }}</slot>
    </span>
  </button>
</template>

<script setup lang="ts">
interface Props {
  type?: 'primary' | 'default' | 'recharge' | 'withdraw' | 'vip-recharge' | 'special-recharge';
  label?: string;
  disabled?: boolean;
  loading?: boolean;
}

withDefaults(defineProps<Props>(), {
  type: 'primary',
  label: '',
  disabled: false,
  loading: false,
});

const emit = defineEmits<{
  click: [];
}>();
</script>

<style scoped lang="less">
.form-button {
  position: relative;
  min-width: 100px;
  height: 83px;
  padding: 0 4px;
  border: none;
  border-radius: 8px;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: var(--letter-spacing-sm);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  overflow: hidden;
  color: var(--text-primary);

  .button-text {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  &.is-loading {
    cursor: not-allowed;
  }
}

// Primary 类型 - 金色渐变
.form-button--primary {
  background-image: url('@/assets/imgs/form/btn_primary.png');
  background-repeat: no-repeat;
  background-position: left -3px top 0;
  background-size: 659px 92px;
}

// Default 类型 - 灰色渐变
.form-button--default {
  width: 168px;
  height: 70px;
  background-image: url('@/assets/imgs/form/btn_default.png');
  background-repeat: no-repeat;
  background-position: left 0 top 0;
  background-size: 169px 72px;
}

.form-button--recharge {
  width: 160px;
  height: 58px;
  background-image: url('@/assets/imgs/form/btn_recharge.png');
  background-repeat: no-repeat;
  background-position: left 0 top 0;
  background-size: 160px 58px;
}

.form-button--vip-recharge {
  width: 125px;
  height: 48px;
  background-image: url('@/assets/imgs/vip/cz.png');
  background-repeat: no-repeat;
  background-position: left 0 top 0;
  background-size: 125px 48px;

  .button-text {
    font-size: 18px;
    position: relative;
    top: -2px;
  }
}

.form-button--special-recharge {
  width: 479px;
  height: 92px;
  background-image: url('@/assets/imgs/form/btn_special_recharge.png');
  background-repeat: no-repeat;
  background-position: left 0 top 0;
  background-size: 479px 92px;

  .button-text {
    position: relative;
    top: -2px;
  }
}

.form-button--withdraw {
  width: 160px;
  height: 58px;
  background-image: url('@/assets/imgs/form/btn_withdraw.png');
  background-repeat: no-repeat;
  background-position: left 0 top 0;
  background-size: 160px 58px;

  .button-text {
    color: #daedff;
  }
}
</style>
