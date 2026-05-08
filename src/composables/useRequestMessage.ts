import { showNotify } from 'vant';
import { t } from '@/i18n';

// 在 service/api 中使用的版本（不用 composable）
export const getRequestMessage = (code: number | string, message: string = 'request.failed') => {
  const messageCodeMap = {
    1001: t('request.1001'),
    1000004: t('request.1000004'),
    1000001: t('request.1000001'),
    1000002: t('request.1000002'),
    1000003: t('request.1000003'),
    3000001: t('request.3000001'),
    3000002: t('request.3000002'),
    3000003: t('request.3000003'),
    3000004: t('request.3000004'),
    3000005: t('request.3000005'),
    4000001: t('request.4000001'),
    4000002: t('request.4000002'),
    4000003: t('request.4000003'),
  };
  const hasErrorCode = Object.keys(messageCodeMap).includes(code.toString());
  if (hasErrorCode) {
    return messageCodeMap[code as keyof typeof messageCodeMap];
  }

  return message == 'request.failed' ? t('request.failed') : message;
};

export const showRequestError = (code: number | string, message?: string) => {
  const errorMessage = getRequestMessage(code, message);
  showNotify({
    type: 'danger',
    message: errorMessage,
    duration: 3000,
  });
};
