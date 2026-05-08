import { defineStore } from 'pinia';
import { ref } from 'vue';
import { languageType } from '@/types/locales';
import { local } from '@/utils/storage';
import { LOCAL_KEY } from '@/config';

/**
 * 系统APP相关store状态设置
 */

export const useAppStore = defineStore('app', () => {
  // 当前语言
  const locale = ref<languageType>(
    (local.get<string>(LOCAL_KEY.APP_LANGUAGE) as languageType) || 'zh-CN'
  );

  // 设置语言
  const setLocale = (newLocale: languageType) => {
    locale.value = newLocale;
    local.set(LOCAL_KEY.APP_LANGUAGE, newLocale);
  };

  return {
    locale,
    setLocale,
  };
});
