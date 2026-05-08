/**
 * SVG Icon 注册和初始化
 * 支持按目录分类的图标结构
 */

import type { App } from 'vue';
import SvgIcon from '@/components/SvgIcon.vue';

/**
 * 注册SvgIcon为全局组件
 * 在 main.ts 中调用此函数
 */
export const setupSvgIcon = (app: App) => {
  app.component('SvgIcon', SvgIcon);
};

// 导出类型和预设
export type { IconInfo } from '@/types/svg-icon';
export { ICON_SIZE, ICON_COLOR } from '@/types/svg-icon';
