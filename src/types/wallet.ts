import { ApiResponse } from './api';

/**
 * ==================== 钱包余额 (Balance) ====================
 */

/**
 * 钱包余额信息
 */
export interface WalletBalance {
  balance: string | number;
  min_withdrawal: string | number;
  wager_required: string | number;
}

/**
 * 获取钱包余额响应
 */
export type GetBalanceResponse = ApiResponse<WalletBalance>;

/**
 * 充值档位
 */
export interface RechargeLevelListItem {
  recharge_amount: number | string;
  reward_rate: number | string;
  fixed_bonus: number | string;
  reward_max_amount: number | string;
  tags?: string[] | null;
}

/**
 * 充值档位响应
 */
export type GetRechargeLevelConfigResponse = ApiResponse<{
  list: RechargeLevelListItem[];
}>;

/**
 * ==================== 充值 (Recharge) ====================
 */

/**
 * 充值请求数据
 */
export interface CreateRechargePayload {
  amount: number | string;
}

/**
 * 充值响应数据
 */
export interface RechargeDetail {
  order_no: number;
  pix_qr: string;
}

/**
 * 创建充值响应
 */
export type CreateRechargeResponse = ApiResponse<RechargeDetail>;

/**
 * 充值订单信息
 */
export interface RechargeOrder {
  order_id: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  payment_method: string;
  created_at: string;
  completed_at?: string;
}

/**
 * 获取充值订单列表响应
 */
export type GetRechargeOrdersResponse = ApiResponse<RechargeOrder[]>;

/**
 * ==================== 提现账户 (Withdrawal Account) ====================
 */

/**
 * 创建提现账户请求数据
 */
export interface CreateWithdrawalAccountPayload {
  account_type: string; // 账户类型 (bank, digital_wallet, etc.)
  account_number: string; // 账户号码
  account_name?: string; // 账户名称
  bank_code?: string; // 银行代码
}

/**
 * 提现账户信息
 */
export interface WithdrawalAccount {
  account_id: string;
  account_type: string;
  account_number: string;
  account_name?: string;
  bank_code?: string;
  is_default: boolean; // 是否为默认账户
  verified: boolean; // 是否已验证
  created_at: string;
}

/**
 * 创建提现账户响应
 */
export type CreateWithdrawalAccountResponse = ApiResponse<WithdrawalAccount>;

/**
 * 获取提现账户列表响应
 */
export type GetWithdrawalAccountsResponse = ApiResponse<WithdrawalAccount[]>;

/**
 * ==================== 提现 (Withdrawal) ====================
 */

/**
 * 创建提现请求数据
 */
export interface CreateWithdrawalPayload {
  amount: number; // 提现金额
  account_id: string; // 提现账户 ID
  remark?: string; // 备注
}

/**
 * 提现详情
 */
export interface WithdrawalDetail {
  order_id: string;
  amount: number;
  account_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed'; // 状态
  created_at: string;
  completed_at?: string;
  failure_reason?: string; // 失败原因
}

/**
 * 创建提现响应
 */
export type CreateWithdrawalResponse = ApiResponse<WithdrawalDetail>;

/**
 * 提现订单信息
 */
export interface WithdrawalOrder {
  order_id: string;
  amount: number;
  account_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  completed_at?: string;
  failure_reason?: string;
}

/**
 * 获取提现订单列表响应
 */
export type GetWithdrawalOrdersResponse = ApiResponse<WithdrawalOrder[]>;
