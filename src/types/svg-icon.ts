/**
 * SVG Icon 类型定义 - 支持动态添加目录和图标
 */

/**
 * 图标信息接口
 */
export interface IconInfo {
  name: string;
  dir: string;
  fullName: string; // dir-name format
}

/**
 * 图标大小预设
 */
export const ICON_SIZE = {
  XS: 12,
  SM: 16,
  MD: 24,
  LG: 32,
  XL: 48,
} as const;

/**
 * 常见颜色预设
 */
export const ICON_COLOR = {
  PRIMARY: 'var(--color-primary, #0066cc)',
  SUCCESS: '#52c41a',
  WARNING: '#faad14',
  ERROR: '#f5222d',
  INFO: '#1890ff',
  TEXT: 'var(--color-text, #000)',
  TEXT_SECONDARY: 'var(--color-text-secondary, #666)',
  DISABLED: 'var(--color-text-disabled, #ccc)',
} as const;
