import api from './api';
import {
  GetProxyInfoResponse,
  GetProxyInviteConfigResponse,
  GetProxyInviteRewardsResponse,
  GetProxyInviteSummaryResponse,
} from '@/types/proxy';

/**
 * 获取代理信息 API
 * GET /proxy/info
 * @returns 代理信息，成功时 code=0，失败时会 throw error
 */
export async function getProxyInfo(): Promise<GetProxyInfoResponse> {
  return await api.get<GetProxyInfoResponse>('/proxy/info');
}

/**
 * 获取邀请配置 API
 * GET /proxy/invite/config
 * @returns 邀请配置列表，成功时 code=0，失败时会 throw error
 */
export async function getProxyInviteConfig(): Promise<GetProxyInviteConfigResponse> {
  return await api.get<GetProxyInviteConfigResponse>('/proxy/invite/config');
}

/**
 * 获取邀请奖励列表 API
 * GET /proxy/invite/rewards
 * @param page - 页码（默认 1）
 * @param pageSize - 每页数量（默认 20）
 * @returns 邀请用户列表及其奖励，成功时 code=0，失败时会 throw error
 */
export async function getProxyInviteRewards(
  page: number = 1,
  pageSize: number = 20
): Promise<GetProxyInviteRewardsResponse> {
  return await api.get<GetProxyInviteRewardsResponse>(
    `/proxy/invite/rewards?page=${page}&page_size=${pageSize}`
  );
}

/**
 * 获取邀请统计概览 API
 * GET /proxy/invite/summary
 * @returns 邀请统计数据，成功时 code=0，失败时会 throw error
 */
export async function getProxyInviteSummary(): Promise<GetProxyInviteSummaryResponse> {
  return await api.get<GetProxyInviteSummaryResponse>('/proxy/invite/summary');
}
