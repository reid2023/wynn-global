/**
 * 活动相关的 API 接口
 */
import api from './api';
import {
  GetCashbackResponse,
  ClaimCashbackResponse,
  CreateRescuePayload,
  CreateRescueResponse,
  GetRescueOfferResponse,
  GetSignInResponse,
  ClaimSignInResponse,
  GetFirstRechargeResponse,
  GetAvailableActivitiesResponse,
} from '@/types/activity';

/**
 * ==================== 返现活动 (Cashback) ====================
 */

/**
 * 获取返现活动信息 API
 * GET /activity/cashback
 * @returns 返现信息，成功时 code=0，失败时会 throw error
 */
export async function getCashback(): Promise<GetCashbackResponse> {
  return await api.get<GetCashbackResponse>('/activity/cashback');
}

/**
 * 领取返现 API
 * POST /activity/cashback/claim
 * @returns 领取结果，成功时 code=0，失败时会 throw error
 */
export async function claimCashback(): Promise<ClaimCashbackResponse> {
  return await api.post<ClaimCashbackResponse>('/activity/cashback/claim', {});
}

/**
 * ==================== 救援活动 (Rescue) ====================
 */

/**
 * 创建救援活动 API
 * POST /activity/rescue/create
 * @param payload 救援数据
 * @returns 创建结果，成功时 code=0，失败时会 throw error
 */
export async function createRescue(payload: CreateRescuePayload): Promise<CreateRescueResponse> {
  return await api.post<CreateRescueResponse>('/activity/rescue/create', payload);
}

/**
 * 获取救援优惠 API
 * GET /activity/rescue/offer
 * @returns 救援优惠列表，成功时 code=0，失败时会 throw error
 */
export async function getRescueOffer(): Promise<GetRescueOfferResponse> {
  return await api.get<GetRescueOfferResponse>('/activity/rescue/offer');
}

/**
 * ==================== 签到活动 (SignIn) ====================
 */

/**
 * 获取签到信息 API
 * GET /activity/signin
 * @returns 签到信息，成功时 code=0，失败时会 throw error
 */
export async function getSignIn(): Promise<GetSignInResponse> {
  return await api.get<GetSignInResponse>('/activity/signin');
}

/**
 * 领取签到奖励 API
 * POST /activity/signin/claim
 * @returns 领取结果，成功时 code=0，失败时会 throw error
 */
export async function claimSignIn(): Promise<ClaimSignInResponse> {
  return await api.post<ClaimSignInResponse>('/activity/signin/claim', {});
}

/**
 * ==================== 首充活动 (First Recharge) ====================
 */
export async function getFirstRechargeConfig(): Promise<GetFirstRechargeResponse> {
  return await api.get<GetFirstRechargeResponse>('/activity/recharge/config/first');
}

/**
 * 获取用户当前可领取的活动列表
 */
export async function getAvailableActivities(): Promise<GetAvailableActivitiesResponse> {
  return await api.get<GetAvailableActivitiesResponse>('/activity/available');
}
