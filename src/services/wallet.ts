/**
 * 钱包相关的 API 接口
 */
import api from './api';
import {
  GetBalanceResponse,
  CreateRechargePayload,
  CreateRechargeResponse,
  GetRechargeOrdersResponse,
  CreateWithdrawalAccountPayload,
  CreateWithdrawalAccountResponse,
  GetWithdrawalAccountsResponse,
  CreateWithdrawalPayload,
  CreateWithdrawalResponse,
  GetWithdrawalOrdersResponse,
  GetRechargeLevelConfigResponse,
} from '@/types/wallet';

/**
 * ==================== 钱包余额 (Balance) ====================
 */

/**
 * 获取钱包余额 API
 * GET /wallet/balance
 * @returns 余额信息，成功时 code=0，失败时会 throw error
 */
export async function getBalance(): Promise<GetBalanceResponse> {
  return await api.get<GetBalanceResponse>('/wallet/balance');
}

/**
 * 获取充值档位配置
 * @returns 充值档位配置，成功时 code=0，失败时会 throw error
 */
export async function getRechargeLevelConfig(): Promise<GetRechargeLevelConfigResponse> {
  return await api.get<GetRechargeLevelConfigResponse>('/activity/recharge/config');
}

/**
 * ==================== 充值 (Recharge) ====================
 */

/**
 * 创建充值订单 API
 * POST /wallet/recharge/create
 * @param payload 充值数据
 * @returns 充值订单，成功时 code=0，失败时会 throw error
 */
export async function createRecharge(
  payload: CreateRechargePayload
): Promise<CreateRechargeResponse> {
  return await api.post<CreateRechargeResponse>('/wallet/recharge/create', payload);
}

/**
 * 获取充值订单列表 API
 * GET /wallet/recharge/orders
 * @returns 充值订单列表，成功时 code=0，失败时会 throw error
 */
export async function getRechargeOrders(): Promise<GetRechargeOrdersResponse> {
  return await api.get<GetRechargeOrdersResponse>('/wallet/recharge/orders');
}

/**
 * ==================== 提现账户 (Withdrawal Account) ====================
 */

/**
 * 创建提现账户 API
 * POST /wallet/withdrawal/account/create
 * @param payload 提现账户数据
 * @returns 提现账户，成功时 code=0，失败时会 throw error
 */
export async function createWithdrawalAccount(
  payload: CreateWithdrawalAccountPayload
): Promise<CreateWithdrawalAccountResponse> {
  return await api.post<CreateWithdrawalAccountResponse>(
    '/wallet/withdrawal/account/create',
    payload
  );
}

/**
 * 获取提现账户列表 API
 * GET /wallet/withdrawal/accounts
 * @returns 提现账户列表，成功时 code=0，失败时会 throw error
 */
export async function getWithdrawalAccounts(): Promise<GetWithdrawalAccountsResponse> {
  return await api.get<GetWithdrawalAccountsResponse>('/wallet/withdrawal/accounts');
}

/**
 * ==================== 提现 (Withdrawal) ====================
 */

/**
 * 创建提现订单 API
 * POST /wallet/withdrawal/create
 * @param payload 提现数据
 * @returns 提现订单，成功时 code=0，失败时会 throw error
 */
export async function createWithdrawal(
  payload: CreateWithdrawalPayload
): Promise<CreateWithdrawalResponse> {
  return await api.post<CreateWithdrawalResponse>('/wallet/withdrawal/create', payload);
}

/**
 * 获取提现订单列表 API
 * GET /wallet/withdrawal/orders
 * @returns 提现订单列表，成功时 code=0，失败时会 throw error
 */
export async function getWithdrawalOrders(): Promise<GetWithdrawalOrdersResponse> {
  return await api.get<GetWithdrawalOrdersResponse>('/wallet/withdrawal/orders');
}
