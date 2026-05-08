<template>
  <svg
    :class="['svg-icon', customClass]"
    :style="svgStyle"
    :width="size"
    :height="size"
    aria-hidden="true"
  >
    <use :xlink:href="`#${iconId}`" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  /** SVG图标名称，格式: 'dir-name' 或 'name'（会自动添加dir前缀） */
  name: string;
  /** 所属目录（可选，如果name中不含'-'则需要指定） */
  dir?: string;
  /** 图标大小，支持数字(px转vw)、'24px'、'1.5rem'等。数字和px值会自动转换为vw做成响应式 */
  size?: string | number;
  /** 图标颜色 */
  color?: string;
  /** 自定义CSS类名 */
  customClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: 24,
  color: 'currentColor',
  customClass: '',
});

// 转换 px 为 vw（响应式单位，基于 postcss-px-to-viewport 配置的 375px 视口宽度）
function convertPxToVw(px: number): string {
  // 公式: vw = px * 100 / viewportWidth (375)
  const vw = ((px * 100) / 375).toFixed(5);
  return `${vw}vw`;
}

// 处理size转换为响应式单位
const normalizedSize = computed(() => {
  const size = props.size;

  if (typeof size === 'string') {
    // 如果已经包含响应式单位，直接返回
    if (/vw|vh|em|rem|%|ch|ex/.test(size)) {
      return size;
    }
    // 如果以px结尾，提取数值并转换
    const pxMatch = size.match(/^(\d+(?:\.\d+)?)px$/);
    if (pxMatch) {
      const pxValue = parseFloat(pxMatch[1]);
      return convertPxToVw(pxValue);
    }
    // 如果是纯数字字符串，当作px处理
    const numMatch = size.match(/^(\d+(?:\.\d+)?)$/);
    if (numMatch) {
      const pxValue = parseFloat(numMatch[1]);
      return convertPxToVw(pxValue);
    }
  } else if (typeof size === 'number') {
    return convertPxToVw(size);
  }

  // 默认值：24px -> vw
  return convertPxToVw(24);
});

// 生成icon的id
const iconId = computed(() => {
  if (props.dir) {
    return `icon-${props.dir}-${props.name}`;
  }
  // 如果name中已包含目录，直接使用
  if (props.name.includes('-')) {
    return `icon-${props.name}`;
  }
  // 否则假设是无目录的格式，需要指定dir
  return `icon-${props.name}`;
});

// SVG样式对象
const svgStyle = computed(() => ({
  width: normalizedSize.value,
  height: normalizedSize.value,
  fill: props.color,
  stroke: props.color,
  verticalAlign: '-0.125em',
}));
</script>

<style scoped>
.svg-icon {
  display: inline-block;
  overflow: hidden;
  vertical-align: -0.125em;
  transition:
    fill 0.3s ease,
    color 0.3s ease;
}
</style>
