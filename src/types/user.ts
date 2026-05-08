import { ApiResponse } from './api';

/**
 * 登录请求数据
 */
export interface LoginPayload {
  phone: string;
  password: string;
  country_code?: string;
}

/**
 * 登录响应数据
 */
export type LoginResponse = ApiResponse<{
  token: string;
  user_id: string;
}>;

/**
 * 注册请求数据
 */
export interface RegisterPayload {
  phone: string;
  password: string;
  country_code?: string;
  inviter_code?: string;
}

/**
 * 注册响应数据
 */
export type RegisterResponse = ApiResponse<{
  token: string;
  user_id: string;
}>;

/**
 * 用户信息
 */
export interface UserProfile {
  user_id: string;
  avatar: string;
  nickname: string;
  inviter_code: string;
  created_at?: string;
  phone: string;
}

/**
 * 获取用户信息响应
 */
export type GetProfileResponse = ApiResponse<UserProfile>;

/**
 * 更新头像请求数据
 */
export interface UpdateAvatarPayload {
  avatar: string; // 头像 URL 或 base64 数据
}

/**
 * 更新头像响应数据
 */
export type UpdateAvatarResponse = ApiResponse<{
  avatar: string;
}>;

/**
 * 更新密码请求数据
 */
export interface UpdatePasswordPayload {
  new_password: string;
  old_password: string;
}
