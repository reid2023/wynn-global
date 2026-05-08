/**
 * API 响应类型定义
 */

export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data?: T;
}

export interface PaginationData<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * 路由元数据类型
 */
export interface RouteMeta {
  title?: string;
  requiresAuth?: boolean;
  icon?: string;
  hidden?: boolean;
}

/**
 * 用户类型
 */
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt?: string;
}

/**
 * 通用错误类型
 */
export interface ErrorResponse {
  code: number;
  message: string;
  details?: Record<string, any>;
}
