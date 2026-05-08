/**
 * 主题系统 - 支持多皮肤切换
 * CSS 变量由 src/styles/theme.less 定义
 */

import { reactive } from 'vue';

import { local } from '@/utils/storage';
import { LOCAL_KEY } from '@/config';

export type ThemeType = 'light' | 'dark' | 'auto';

export interface Theme {
  name: ThemeType;
  label: string;
}

// 主题状态管理
export const themeState = reactive({
  current: (local.get<string>(LOCAL_KEY.APP_THEME) as ThemeType) || 'light',
  auto: local.get<string>(LOCAL_KEY.APP_THEME) === 'true',
});

// 可用的主题列表
export const AVAILABLE_THEMES: Theme[] = [
  { name: 'light', label: 'Light' },
  { name: 'dark', label: 'Dark' },
];

/**
 * 切换主题（选择特定主题）
 */
export function switchTheme(theme: ThemeType) {
  setTheme(theme);
}

/**
 * 获取可用的主题列表
 */
export function getAvailableThemes(): Theme[] {
  return AVAILABLE_THEMES;
}

/**
 * 初始化主题系统
 */
export function initTheme() {
  const theme = local.get<string>(LOCAL_KEY.APP_THEME) || 'light';
  setTheme(theme as ThemeType);
}

/**
 * 设置主题
 * @param theme - 主题名称 'light' | 'dark'
 */
export function setTheme(theme: ThemeType) {
  themeState.current = theme;
  local.set(LOCAL_KEY.APP_THEME, theme);

  const root = document.documentElement;

  if (theme === 'auto') {
    // 自动检测系统偏好
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.classList.toggle('dark', prefersDark);
  } else {
    root.classList.toggle('dark', theme === 'dark');
  }
}

/**
 * 获取当前主题
 */
export function getCurrentTheme(): ThemeType {
  return themeState.current;
}

/**
 * 切换主题（在 light 和 dark 之间切换）
 */
export function toggleTheme() {
  const current = themeState.current;
  const next = current === 'light' ? 'dark' : 'light';
  setTheme(next);
}
