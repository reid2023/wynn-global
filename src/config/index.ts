/**
 * API 响应状态码
 * 后端返回的业务状态码
 */
export const RESPONSE_CODE = {
  // 成功
  SUCCESS: 0,

  // 请求参数错误
  INVALID_PARAM: 400,
  INVALID_PHONE: 4001,
  INVALID_PASSWORD: 4002,
  INVALID_COUNTRY_CODE: 4003,

  // 认证/授权相关
  UNAUTHORIZED: 401,
  TOKEN_EXPIRED: 4011,
  TOKEN_INVALID: 4012,

  // 业务相关
  PHONE_ALREADY_EXISTS: 4101, // 手机号已注册
  PHONE_NOT_FOUND: 4102, // 手机号未注册
  PASSWORD_ERROR: 4103, // 密码错误
  USER_NOT_FOUND: 4104, // 用户不存在
  USER_DISABLED: 4105, // 用户被禁用

  // 服务器错误
  SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,

  // 404 Not Found
  NOT_FOUND: 404,
};

/**
 * 用于localstorage的键名
 */
export const LOCAL_KEY = {
  APP_LANGUAGE: 'app_language',
  APP_THEME: 'app_theme',
  USER_INFO: 'user_info',
  USER_AGE: 'user_age',
  USER_TOKEN: 'user_token',
  USER_ID: 'user_id',
};

/**
 * 默认头像
 */
export const DEFAULT_AVATAR = `/avatar/tx_big.png`;
/**
 * 头像列表
 */
export const AVATAR_LIST = [
  '/avatar/tx1.png',
  '/avatar/tx2.png',
  '/avatar/tx3.png',
  '/avatar/tx4.png',
  '/avatar/tx5.png',
  '/avatar/tx6.png',
  '/avatar/tx7.png',
  '/avatar/tx8.png',
  '/avatar/tx9.png',
  '/avatar/tx10.png',
];

/**
 * VIP图标
 */
export const VIP_ICON_LIST = [
  new URL('@/assets/imgs/vip/VIP0_big.png', import.meta.url).href,
  new URL('@/assets/imgs/vip/VIP1_big.png', import.meta.url).href,
  new URL('@/assets/imgs/vip/VIP2_big.png', import.meta.url).href,
  new URL('@/assets/imgs/vip/VIP3_big.png', import.meta.url).href,
  new URL('@/assets/imgs/vip/VIP4_big.png', import.meta.url).href,
  new URL('@/assets/imgs/vip/VIP5_big.png', import.meta.url).href,
];

// 开发环境使用 Vite 代理，生产环境使用真实 URL
export const API_BASE_URL = import.meta.env.DEV
  ? '/api'
  : import.meta.env.VITE_API_BASE_URL || 'http://100.24.122.217:8080';

/**
 * 充值渠道类型
 */
export enum RECHARGE_CHANNEL_TYPE_ENUM {
  Try = 'try',
  Popular = 'popular',
  Best = 'base',
  Vip = 'vip',
  Hot = 'hot',
}
