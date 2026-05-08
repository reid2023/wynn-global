<template>
  <div class="form-input-wrapper" :class="backgroundImageType">
    <template v-if="backgroundImageType == 'country-phone'">
      <div class="country-info">
        <img :src="selectedCountry.flag" alt="flag" class="flag" />
        <span class="dial-code text-gradient-gold">{{ selectedCountry.dialCode }}</span>
      </div>
    </template>
    <slot name="prefix"></slot>
    <input
      ref="inputRef"
      :placeholder="placeholder"
      class="form-input"
      :class="{ 'is-password': type === 'password' }"
      @input="handleInput"
      @focus="isFocused = true"
      @blur="handleBlur"
      @keydown="handleKeydown"
      autocomplete="new-password"
      :maxlength="maxLength"
      :disabled="disabled"
    />

    <div class="input-action-btn">
      <!-- 密码显示/隐藏切换按钮 -->
      <button
        v-if="type === 'password' && internalValue && allowPassword"
        class="toggle-password-btn"
        @click="toggleShowPassword"
        :title="showPassword ? '隐藏密码' : '显示密码'"
      >
        <img v-if="showPassword" src="@/assets/imgs/public/yj1.png" alt="eye" />
        <img v-else src="@/assets/imgs/public/yj2.png" alt="eye-off" />
        <!-- <SvgIcon v-if="showPassword" name="eye" dir="action" size="18" color="#999" /> -->
        <!-- <SvgIcon v-else name="eye-off" dir="action" size="18" color="#999" /> -->
      </button>

      <!-- 清除按钮 (非密码框时显示) -->
      <button
        v-if="internalValue && allowClear && !disabled"
        class="clear-btn"
        @click="handleClear"
        title="清除"
      >
        <img src="@/assets/imgs/form/close.png" alt="clear" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, computed } from 'vue';
import { COUNTRIES, type Country } from '@/config/countries';

type BackgroundImageType = 'fill' | 'phone' | 'country-phone';

interface Props {
  modelValue: string | number;
  type?: 'text' | 'password' | 'number' | 'phone';
  placeholder?: string;
  allowClear?: boolean;
  allowPassword?: boolean;
  maxLength?: number;
  min?: number;
  max?: number;
  backgroundImageType?: BackgroundImageType;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: '',
  allowClear: true,
  allowPassword: true,
  maxLength: 50,
  min: undefined,
  max: undefined,
  backgroundImageType: 'fill',
  disabled: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const inputRef = ref<HTMLInputElement>();
const showPassword = ref(false);
const isFocused = ref(false);
const internalValue = ref('');
const countryCode = ref('BR');

/**
 * 当前选中的国家
 */
const selectedCountry = computed(() => {
  return COUNTRIES.find((c) => c.code === countryCode.value) || COUNTRIES[0];
});

/**
 * 更新输入框的显示内容（掩码或明文）
 */
const updateInputDisplay = () => {
  if (!inputRef.value) return;

  if (props.type === 'password' && !showPassword.value) {
    // 显示掩码
    inputRef.value.value = '●'.repeat(internalValue.value.length);
  } else {
    // 显示明文
    inputRef.value.value = internalValue.value;
  }
};

/**
 * 同步内部值和 props modelValue
 */
watch(
  () => props.modelValue,
  async (newVal) => {
    internalValue.value = String(newVal);
    // 使用 nextTick 确保 DOM 已挂载
    await nextTick();
    updateInputDisplay();
  },
  { immediate: true }
);

/**
 * 处理键盘按下事件
 */
const handleKeydown = (event: KeyboardEvent) => {
  // 如果不是密码框或已显示密码，不操作
  if (props.type !== 'password' || showPassword.value) {
    return;
  }

  const target = event.currentTarget as HTMLInputElement;

  // 处理特殊键
  if (event.key === 'Backspace' || event.key === 'Delete') {
    event.preventDefault();

    // 计算金标位置
    const cursorPos = target.selectionStart || 0;

    if (event.key === 'Backspace' && cursorPos > 0) {
      // 删除光标前的字符
      const newValue =
        internalValue.value.slice(0, cursorPos - 1) + internalValue.value.slice(cursorPos);
      internalValue.value = newValue;
      emit('update:modelValue', newValue);

      // 更新显示并恢复光标
      updateInputDisplay();
      setTimeout(() => {
        target.setSelectionRange(cursorPos - 1, cursorPos - 1);
      }, 0);
    } else if (event.key === 'Delete' && cursorPos < internalValue.value.length) {
      // 删除光标后的字符
      const newValue =
        internalValue.value.slice(0, cursorPos) + internalValue.value.slice(cursorPos + 1);
      internalValue.value = newValue;
      emit('update:modelValue', newValue);

      updateInputDisplay();
      setTimeout(() => {
        target.setSelectionRange(cursorPos, cursorPos);
      }, 0);
    }
  }
};

/**
 * 处理失去焦点事件 - 过滤前后空格或进行其他验证
 */
const handleBlur = () => {
  isFocused.value = false;

  // 只在不是 phone 类型时 trim 空格
  if (props.type !== 'phone' && inputRef.value) {
    const trimmedValue = internalValue.value.trim();
    if (trimmedValue !== internalValue.value) {
      internalValue.value = trimmedValue;
      // 密码框需要通过 updateInputDisplay 重新处理掩码显示
      if (props.type === 'password') {
        updateInputDisplay();
      } else {
        inputRef.value.value = trimmedValue;
      }
      emit('update:modelValue', trimmedValue);
    }
  }

  // number 类型 - 验证 min/max 值
  if (props.type === 'number' && internalValue.value && inputRef.value) {
    let numValue = parseInt(internalValue.value, 10);

    // 检查 min 值
    if (props.min !== undefined && numValue < props.min) {
      numValue = props.min;
    }
    // 检查 max 值
    if (props.max !== undefined && numValue > props.max) {
      numValue = props.max;
    }

    const correctedValue = String(numValue);
    if (correctedValue !== internalValue.value) {
      internalValue.value = correctedValue;
      inputRef.value.value = correctedValue;
      emit('update:modelValue', correctedValue);
    }
  }
};

/**
 * 处理输入事件
 */
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  let value = target.value;

  // 处理 number 与 phone 类型 - 只允许数字
  if (props.type === 'number' || props.type === 'phone') {
    value = value.replace(/[^0-9]/g, '');
    if (value !== target.value) {
      target.value = value;
    }
  }

  if (props.type !== 'password' || showPassword.value) {
    // 非密码框或已显示密码
    internalValue.value = value;
    emit('update:modelValue', value);
  } else {
    // 密码框且未显示 - 通过掩码计算
    const currentDisplay = target.value;
    const bulletCount = (currentDisplay.match(/●/g) || []).length;
    const newInputCount = currentDisplay.length - bulletCount;

    if (newInputCount > 0) {
      // 用户输入了新字符
      let newChars = currentDisplay.replace(/●/g, '');

      const newValue = internalValue.value + newChars;
      internalValue.value = newValue;
      emit('update:modelValue', newValue);

      // 更新显示
      updateInputDisplay();

      // 恢复光标位置（光标应在最后）
      setTimeout(() => {
        target.setSelectionRange(newValue.length, newValue.length);
      }, 0);
    }
  }
};

/**
 * 处理清除
 */
const handleClear = () => {
  internalValue.value = '';
  emit('update:modelValue', '');
  updateInputDisplay();
};

/**
 * 切换显示/隐藏密码
 */
const toggleShowPassword = () => {
  showPassword.value = !showPassword.value;
  updateInputDisplay();
  // 恢复光标位置
  setTimeout(() => {
    if (inputRef.value) {
      const len = internalValue.value.length;
      inputRef.value.setSelectionRange(len, len);
      inputRef.value.focus();
    }
  }, 0);
};
</script>

<style scoped lang="less">
.form-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  height: 73px;
  overflow: hidden;
  background-clip: content-box;
  border-radius: 10px;

  &.fill {
    background-image: url('@/assets/imgs/form/k3.png');
    background-repeat: no-repeat;
    background-position: left -3px top 0;
    background-size: 659px 83px;
  }

  &.phone {
    background: rgba(255, 255, 255, 0.05);
    background-image: url('@/assets/imgs/form/k2.png');
    background-repeat: no-repeat;
    background-position: left -3px top 0;
    background-size: 459px 83px;
  }

  &.country-phone {
    background: rgba(255, 255, 255, 0.05);
    background-image: url('@/assets/imgs/form/k2.png');
    background-repeat: no-repeat;
    background-position: left -3px top 0;
    background-size: 470px 83px;
  }
}

// 掩码密码框样式 - 控制圆点大小
.form-input.is-password {
  font-size: 18px;
}

.form-input {
  flex: 1;
  height: 100%;
  padding: 0 16px;
  padding-right: 64px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid transparent;
  border-radius: 10px;
  color: #fff;
  font-size: 20px;
  font-weight: 500;
  transition: all 0.3s ease;

  &::placeholder {
    color: var(--color-primary);
    font-size: 20px;
  }

  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.08);
  }

  // 密码框的右边距（用于显示眼睛+清除按钮）
  &.is-password:not(:placeholder-shown) {
    padding-right: 120px;
  }
}

.input-action-btn {
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 10;
  gap: 4px;

  button {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .icon {
    width: 48px;
    height: 48px;
    stroke-width: 2;
  }

  .clear-btn {
    img {
      width: 48px;
      height: 48px;
      object-fit: contain;
      position: relative;
      top: 2px;
    }
  }

  .toggle-password-btn {
    img {
      width: auto;
      height: 22px;
      object-fit: contain;
    }
  }
}

.country-phone {
  .country-info {
    position: absolute;
    display: flex;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
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

  .form-input {
    padding-left: 120px;
  }
}
</style>
