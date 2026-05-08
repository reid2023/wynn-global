/**
 * 登录相关的 API 接口
 */
import api from './api';
import {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
  GetProfileResponse,
  UpdateAvatarPayload,
  UpdateAvatarResponse,
  UpdatePasswordPayload,
} from '@/types/user';

/**
 * 登录 API
 * POST /user/login
 * @param payload 登录数据
 * @returns 登录结果，成功时 code=0，失败时会 throw error
 */
export async function login(payload: LoginPayload): Promise<LoginResponse> {
  return await api.post<LoginResponse>('/user/login', payload);
}

/**
 * 注册 API
 * POST /user/register
 * @param payload 注册数据
 * @returns 注册结果，成功时 code=0，失败时会 throw error
 */
export async function register(payload: RegisterPayload): Promise<RegisterResponse> {
  return await api.post<RegisterResponse>('/user/register', payload);
}

/**
 * 登出 API
 * POST /user/logout
 * @returns 登出结果，成功时 code=0，失败时会 throw error
 */
export async function logout(): Promise<void> {
  return await api.post<void>('/user/logout');
}

/**
 * 验证手机号是否已注册
 * @param phone 手机号
 * @param countryCode 国家代码
 * @returns 是否已注册
 */
export async function checkPhoneExists(phone: string, countryCode: string): Promise<boolean> {
  const response = await api.post<{ exists: boolean }>('/user/check-phone', {
    phone,
    countryCode,
  });
  return response.exists || false;
}

/**
 * 获取用户信息 API
 * GET /user/profile
 * @returns 用户信息，成功时 code=0，失败时会 throw error
 */
export async function getUserProfile(): Promise<GetProfileResponse> {
  return await api.get<GetProfileResponse>('/user/profile');
}

/**
 * 更新用户头像 API
 * POST /user/avatar/update
 * @param payload 头像数据
 * @returns 更新结果，成功时 code=0，失败时会 throw error
 */
export async function updateAvatar(payload: UpdateAvatarPayload): Promise<UpdateAvatarResponse> {
  return await api.post<UpdateAvatarResponse>('/user/avatar/update', payload);
}

/**
 * 更新用户密码 API
 * POST /user/password/update
 * @param payload 密码数据
 * @returns 更新结果，成功时 code=0，失败时会 throw error
 */
export async function updatePassword(payload: UpdatePasswordPayload): Promise<void> {
  return await api.post<void>('/user/password/update', payload);
}
