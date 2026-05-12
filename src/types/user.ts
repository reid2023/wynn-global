import { ApiResponse } from './api';

/**
 * 登录请求数据
 */
export interface LoginPayload {
  areaCode: string | number;
  mobile: string;
  password: string;
}

/**
 * 登录响应数据
 */
export type LoginResponse = ApiResponse<string>;

/**
 * 注册请求数据
 */
export interface RegisterPayload {
  areaCode: string | number;
  mobile: string;
  password: string;
  password2: string;
  inviteCode?: string;
}

/**
 * 注册响应数据
 */
export type RegisterResponse = ApiResponse<string>;

/**
 * 用户信息
 */
export interface UserProfile {
  playerId: string;
  currency: string;
  balance: string;
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
