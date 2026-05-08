import { RESPONSE_CODE } from '@/config';
import { local } from '@/utils/storage';
import { LOCAL_KEY, API_BASE_URL } from '@/config';
import { useDialogStore } from '@/stores/dialog';
import { closeToast } from 'vant';
import { t } from '@/i18n';
import { showRequestError } from '@/composables/useRequestMessage';

type RequestOptions = RequestInit & { requireTips?: boolean };

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private async fetchWrapper<T>(url: string, options: RequestInit = {}): Promise<T> {
    const fullUrl = `${this.baseURL}${url}`;

    const mergedOptions: RequestOptions = {
      requireTips: true,
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    // 添加 token
    const token = local.get<string>(LOCAL_KEY.USER_TOKEN);
    if (token) {
      mergedOptions.headers = {
        ...mergedOptions.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      // 添加超时控制（15 秒）
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(fullUrl, {
        ...mergedOptions,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // HTTP 状态异常处理
      if (!response.ok) {
        let errorData: any = {};
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = await response.text();
        }

        // 处理认证相关错误
        if (response.status === 401 || errorData?.code === RESPONSE_CODE.UNAUTHORIZED) {
          local.remove(LOCAL_KEY.USER_TOKEN);
          const dialogStore = useDialogStore();
          dialogStore.openDialog('login');
          throw new Error(t('request.unauthorized'));
        }

        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      } else {
        closeToast();
      }

      const data = (await response.json()) as any;

      // 业务状态码检查：只有 code === 0 时才算成功，其他情况都走错误逻辑
      if (data?.code !== undefined && data.code !== RESPONSE_CODE.SUCCESS) {
        // 检查是否为 Token 相关错误
        if (
          data.code === RESPONSE_CODE.TOKEN_EXPIRED ||
          data.code === RESPONSE_CODE.TOKEN_INVALID ||
          data.code === RESPONSE_CODE.UNAUTHORIZED
        ) {
          local.remove(LOCAL_KEY.USER_TOKEN);
          const dialogStore = useDialogStore();
          dialogStore.openDialog('login');
        }

        if (mergedOptions.requireTips) {
          showRequestError(data.code, data.message);
        }

        // 返回一个包含业务信息的错误对象，方便捕获后处理
        const error = new Error(data.message || t('request.failed'));
        (error as any).code = data.code;
        (error as any).data = data;
        throw error;
      }

      return data;
    } catch (error: any) {
      // 捕获所有异常：网络错误、超时、JSON 解析错误等
      closeToast();

      // 超时错误
      if (error.name === 'AbortError') {
        if (mergedOptions.requireTips) {
          showRequestError(0, t('request.networkTimeOut'));
        }
        throw new Error(t('request.networkTimeOut'));
      }

      // 网络错误（如 DNS 失败、无网络连接等）
      if (error instanceof TypeError && error.message.includes('fetch')) {
        if (mergedOptions.requireTips) {
          showRequestError(0, t('request.networkConnectFail'));
        }
        throw new Error(t('request.networkConnectFail'));
      }

      // 其他错误（已经处理过的业务错误会直接 re-throw）
      if (mergedOptions.requireTips && !error.code) {
        showRequestError(0, t('request.failed'));
      }

      throw error;
    }
  }

  get<T>(url: string): Promise<T> {
    return this.fetchWrapper<T>(url, { method: 'GET' });
  }

  post<T>(url: string, data?: any): Promise<T> {
    return this.fetchWrapper<T>(url, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  put<T>(url: string, data?: any): Promise<T> {
    return this.fetchWrapper<T>(url, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  delete<T>(url: string): Promise<T> {
    return this.fetchWrapper<T>(url, { method: 'DELETE' });
  }
}

export default new ApiService();
