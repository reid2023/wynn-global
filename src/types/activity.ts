import { ApiResponse } from './api';

/**
 * ==================== 返现活动 (Cashback) ====================
 */

/**
 * 返现活动信息
 */
export interface CashbackInfo {
  bet_amount: string;
  cashback_amount: string;
  expire_at: string;
  status: number;
}

/**
 * 获取返现活动响应
 */
export type GetCashbackResponse = ApiResponse<CashbackInfo>;

/**
 * 领取返现响应
 */
export type ClaimCashbackResponse = ApiResponse<{
  amount: number;
}>;

/**
 * ==================== 救援活动 (Rescue) ====================
 */

/**
 * 创建救援请求数据
 */
export interface CreateRescuePayload {
  tier: number;
}

/**
 * 创建救援响应
 */
export type CreateRescueResponse = ApiResponse<{
  order_no: number;
  pix_code: string;
  pix_qr: string;
}>;

/**
 * 救援优惠信息
 */
export interface RescueOffer {
  available: boolean;
  bonus: string;
  deposit: string;
  expire_at: string;
  tier: number;
}

/**
 * 获取救援优惠响应
 */
export type GetRescueOfferResponse = ApiResponse<{ offers: RescueOffer[] }>;

/**
 * ==================== 签到活动 (SignIn) ====================
 */

/**
 * 签到日期信息
 */
export interface SignInDay {
  day: number; // 第几天
  reward: number; // 奖励金额
  is_signed: boolean; // 是否已签到
  sign_date?: string;
}

/**
 * 签到信息
 */

export interface SignInListItem {
  amount: string | number;
  day: number;
  status: number;
}
export interface SignInInfo {
  current_day: number;
  list: SignInListItem[];
}

/**
 * 获取签到信息响应
 */
export type GetSignInResponse = ApiResponse<SignInInfo>;

/**
 * 领取签到奖励响应
 */
export type ClaimSignInResponse = ApiResponse<{
  amount: number;
}>;

/**
 * 首充活动
 */
export interface FirstRechargeListItem {
  recharge_amount: string | number;
  reward_max_amount: string | number;
  fixed_bonus: string | number;
  reward_rate: string | number;
  tags?: string[] | null;
}

/**
 * 首充活动响应
 */
export type GetFirstRechargeResponse = ApiResponse<{
  list: FirstRechargeListItem[];
  is_active: boolean;
  expire_at: number | null;
}>;

/**
 * 获取用户当前可领取的活动列表
 */
export type GetAvailableActivitiesResponse = ApiResponse<{
  activities: number[];
}>;
