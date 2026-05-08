import { createI18n } from 'vue-i18n';

import { local } from '@/utils/storage';
import { LOCAL_KEY } from '@/config';

// 语言消息 - 支持动态导入来加载
import enUS from './locales/en-US.json';
import zhCN from './locales/zh-CN.json';
import ptBR from './locales/pt-BR.json';
import { languageType } from '@/types/locales';

export type MessageSchema = typeof zhCN;

const i18n = createI18n<{ message: MessageSchema }, languageType>({
  legacy: false,
  locale: local.get<string>(LOCAL_KEY.APP_LANGUAGE) || 'pt-BR', // 从本地存储读取
  fallbackLocale: 'en-US',
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS as typeof zhCN,
    // @ts-ignore
    'pt-BR': ptBR as typeof ptBR,
  },
  globalInjection: true,
  missingWarn: false,
  fallbackWarn: false,
});

export default i18n;

// 导出全局 t 函数供非组件中使用
// 支持参数: t(key, values, options)
export const t = (key: string, values?: Record<string, any> | any[], options?: any) =>
  (i18n.global as any).t(key, values, options);
