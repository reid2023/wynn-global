import { ApiResponse } from './api';

/**
 * VIP 等级信息
 */
export interface VipLevel {
  bet_threshold: string;
  daily_salary: string;
  level: number;
  upgrade_reward: string;
}

/**
 * VIP 等级列表响应
 */
export type GetVipLevelsResponse = ApiResponse<{
  levels: VipLevel[];
}>;

/**
 * VIP 用户信息
 */
export interface VipInfo {
  claimable_levels: number[];
  level: number;
  next_level_threshold: string;
  total_bet: string;
  unclaimed_upgrade_amount: string;
}

/**
 * 获取 VIP 信息响应
 */
export type GetVipInfoResponse = ApiResponse<VipInfo>;

/**
 * 每日 VIP 奖励信息
 */
export interface VipDaily {
  expire_at: string;
  level: number;
  salary_amount: string;
  status: number;
}

/**
 * 获取每日 VIP 奖励响应
 */
export type GetVipDailyResponse = ApiResponse<VipDaily>;

/**
 * 领取每日奖励响应
 */
export type ClaimVipDailyResponse = ApiResponse<{
  amount: number;
}>;

/**
 * VIP 升级领取请求
 */
export type ClaimVipUpgradePayload = {
  level: number;
  user_id: string;
};

/**
 * VIP 升级领取响应
 */
export type ClaimVipUpgradeResponse = ApiResponse<{
  amount: number; // 升级奖励
}>;
