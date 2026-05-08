import { ApiResponse } from './api';

/**
 * 代理信息
 */
export interface ProxyInfo {
  inviter_code: string;
  inviter_url: string;
  parent_id: number;
}

/**
 * 获取代理信息响应
 */
export type GetProxyInfoResponse = ApiResponse<ProxyInfo>;

/**
 * 邀请配置项
 */
export interface InviteConfigItem {
  daily_limit: number;
  recharge_threshold: string;
  reward_amount: string;
}

/**
 * 邀请配置响应
 */
export type GetProxyInviteConfigResponse = ApiResponse<InviteConfigItem>;

/**
 * 邀请奖励信息
 */
export interface InvitedUser {
  user_id: string;
  username: string;
  invited_at: string;
  total_bet: string;
  commission_earned: string;
  status: number; // 0: 活跃 1: 停止
}

/**
 * 邀请奖励响应
 */
export type GetProxyInviteRewardsResponse = ApiResponse<{
  rewards: InvitedUser[];
  total_count: number;
  page: number;
  page_size: number;
}>;

/**
 * 邀请统计概览
 */
export interface InviteSummary {
  total_invited_count: number;
  total_bet_amount: string;
  total_commission: string;
  pending_commission: string;
  available_commission: string;
  active_users_count: number;
  inactive_users_count: number;
  today_commission: string;
  this_month_commission: string;
  top_contributor: {
    user_id: string;
    username: string;
    total_bet: string;
    commission: string;
  } | null;
}

/**
 * 邀请统计响应
 */
export type GetProxyInviteSummaryResponse = ApiResponse<InviteSummary>;
