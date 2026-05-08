import api from './api';
import {
  GetVipLevelsResponse,
  GetVipInfoResponse,
  GetVipDailyResponse,
  ClaimVipDailyResponse,
  ClaimVipUpgradePayload,
  ClaimVipUpgradeResponse,
} from '@/types/vip';

/**
 * 获取 VIP 等级列表API
 * GET /vip/levels
 * @returns VIP 等级列表，成功时 code=0，失败时会 throw error
 */
export async function getVipLevels(): Promise<GetVipLevelsResponse> {
  return await api.get<GetVipLevelsResponse>('/vip/levels');
}

/**
 * 获取用户 VIP 信息 API
 * GET /vip/info
 * @returns 用户 VIP 信息，成功时 code=0，失败时会 throw error
 */
export async function getVipInfo(): Promise<GetVipInfoResponse> {
  return await api.get<GetVipInfoResponse>('/vip/info');
}

/**
 * 获取每日 VIP 奖励信息 API
 * GET /vip/daily
 * @returns 每日奖励信息，成功时 code=0，失败时会 throw error
 */
export async function getVipDaily(): Promise<GetVipDailyResponse> {
  return await api.get<GetVipDailyResponse>('/vip/daily');
}

/**
 * 领取每日 VIP 奖励 API
 * POST /vip/daily/claim
 * @returns 领取结果，成功时 code=0，失败时会 throw error
 */
export async function claimVipDaily(): Promise<ClaimVipDailyResponse> {
  return await api.post<ClaimVipDailyResponse>('/vip/daily/claim', {});
}

/**
 * 领取 VIP 升级奖励 API
 * POST /vip/upgrade/claim
 * @returns 升级领取结果，成功时 code=0，失败时会 throw error
 */
export async function claimVipUpgrade(
  data: ClaimVipUpgradePayload
): Promise<ClaimVipUpgradeResponse> {
  return await api.post<ClaimVipUpgradeResponse>('/vip/upgrade/claim', data);
}
