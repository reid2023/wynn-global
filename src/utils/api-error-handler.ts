import { RESPONSE_CODE } from '@/config';
import type { ApiResponse } from '@/types/api';

/**
 * 统一的 API 错误处理函数
 * 生成标准的错误响应
 * @param errorMessage 错误信息
 * @param code 错误码 (默认为 -1)
 * @returns 标准错误响应对象
 */
export function handleApiError<T = any>(
  errorMessage: string = '请求失败',
  code: number = -1
): ApiResponse<T> {
  return {
    code,
    message: errorMessage,
  };
}

/**
 * 处理异常错误
 * 从 Error 对象中提取错误信息
 * @param error 捕获的错误对象
 * @param defaultMessage 默认错误信息
 * @returns 标准错误响应对象
 */
export function handleCatchError<T = any>(
  error: any,
  defaultMessage: string = 'Request failed'
): ApiResponse<T> {
  const errorMessage = error instanceof Error ? error.message : String(error) || defaultMessage;
  return handleApiError<T>(errorMessage);
}

/**
 * 处理 Token 相关错误
 * @param errorCode Token 错误码
 * @returns 标准错误响应对象
 */
export function handleTokenError<T = any>(
  errorCode: number = RESPONSE_CODE.TOKEN_EXPIRED
): ApiResponse<T> {
  const messageMap: Record<number, string> = {
    [RESPONSE_CODE.TOKEN_EXPIRED]: 'Token 已过期，请重新登录',
    [RESPONSE_CODE.TOKEN_INVALID]: 'Token 无效，请重新登录',
    [RESPONSE_CODE.UNAUTHORIZED]: '未授权，请重新登录',
  };

  return {
    code: errorCode,
    message: messageMap[errorCode] || '认证失败，请重新登录',
  };
}

/**
 * 检查响应是否为错误状态
 * @param response API 响应
 * @returns 是否为错误
 */
export function isApiError(response: any): boolean {
  return response?.code !== undefined && response.code !== RESPONSE_CODE.SUCCESS;
}

/**
 * 获取统一的成功响应
 * @param data 响应数据
 * @param message 成功消息
 * @returns 标准成功响应
 */
export function handleApiSuccess<T = any>(data?: T, message: string = '请求成功'): ApiResponse<T> {
  return {
    code: RESPONSE_CODE.SUCCESS,
    message,
    data,
  };
}
