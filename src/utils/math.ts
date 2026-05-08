/**
 * 数学计算工具函数
 * 使用 Decimal.js 解决 JavaScript 浮点数精度问题
 *
 * npm install decimal.js
 */

import Decimal from 'decimal.js';

/**
 * 加法
 * @param a 第一个数
 * @param b 第二个数
 * @returns 结果
 */
export const add = (a: number | string, b: number | string): number => {
  return new Decimal(a).plus(b).toNumber();
};

/**
 * 减法
 * @param a 被减数
 * @param b 减数
 * @returns 结果
 */
export const subtract = (a: number | string, b: number | string): number => {
  return new Decimal(a).minus(b).toNumber();
};

/**
 * 乘法
 * @param a 第一个数
 * @param b 第二个数
 * @returns 结果
 */
export const multiply = (a: number | string, b: number | string): number => {
  return new Decimal(a).times(b).toNumber();
};

/**
 * 除法
 * @param a 被除数
 * @param b 除数
 * @returns 结果
 */
export const divide = (a: number | string, b: number | string): number => {
  if (new Decimal(b).equals(0)) {
    console.warn('除数不能为0');
    return 0;
  }
  return new Decimal(a).dividedBy(b).toNumber();
};

/**
 * 格式化货币 (支持精度计算 + 多国家/语言格式)
 * @param amount 金额
 * @param decimals 小数位数 (default: 2) - 仅在未指定 locale 时使用
 * @param suffix 后缀 (default: '') - 仅在未指定 locale 时使用
 * @param locale 语言/国家代码 (如 'pt-BR', 'en-US')，使用 toLocaleString 格式化
 * @param options Intl.NumberFormatOptions 配置 (与 locale 配合使用)
 * @returns 格式化后的字符串
 *
 * 示例 (基础格式):
 * - formatCurrency(123.10) => "123.1"
 * - formatCurrency(200) => "200"
 * - formatCurrency(145.456, 2) => "145.46"
 * - formatCurrency(145.453, 2) => "145.45"
 *
 * 示例 (按国家格式):
 * - formatCurrency(1234.5, undefined, '', 'pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
 *   => "1.234,50" (巴西格式)
 * - formatCurrency(1234.5, undefined, '', 'en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
 *   => "1,234.50" (美国格式)
 */
export const formatCurrency = (
  amount: number | string,
  decimals: number = 2,
  suffix: string = '',
  locale?: string,
  options?: Intl.NumberFormatOptions
): string => {
  const num = new Decimal(amount);
  const numValue = num.toNumber();

  // 如果指定了 locale，使用 toLocaleString 按国家/语言格式化
  if (locale) {
    const defaultOptions: Intl.NumberFormatOptions = {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
      ...options,
    };
    const result = numValue.toLocaleString(locale, defaultOptions);

    if (!['R$'].includes(suffix)) {
      return result + suffix;
    } else {
      return suffix + result;
    }
  }

  // 否则使用基础格式化方式
  // 四舍五入到指定小数位数
  const rounded = num.toDecimalPlaces(decimals);
  // toNumber() 会自动去掉末尾的 0，然后转成字符串
  const result = rounded.toNumber().toString();

  if (!['R$'].includes(suffix)) {
    return result + suffix;
  } else {
    return suffix + result;
  }
};

/**
 * 百分比计算
 * @param amount 金额
 * @param percent 百分比 (0-100)
 * @returns 结果
 */
export const calculatePercent = (amount: number | string, percent: number | string): number => {
  return new Decimal(amount).times(percent).dividedBy(100).toNumber();
};

/**
 * 比例计算
 * @param current 当前值
 * @param total 总值
 * @returns 百分比 (0-100)
 */
export const calculateRatio = (current: number | string, total: number | string): number => {
  if (new Decimal(total).equals(0)) {
    return 0;
  }
  return new Decimal(current).dividedBy(total).times(100).toNumber();
};

/**
 * 四舍五入
 * @param value 数值
 * @param decimalPlaces 小数位数
 * @returns 四舍五入后的结果
 */
export const round = (value: number | string, decimalPlaces: number = 0): number => {
  return new Decimal(value).toDecimalPlaces(decimalPlaces).toNumber();
};

/**
 * 求和 (数组)
 * @param numbers 数字数组
 * @returns 求和结果
 */
export const sum = (numbers: (number | string)[]): number => {
  if (numbers.length === 0) return 0;
  // 保持 Decimal 对象直到最后，避免中间精度丢失
  return numbers
    .map((n) => new Decimal(n))
    .reduce((acc, curr) => acc.plus(curr))
    .toNumber();
};

/**
 * 求平均值 (数组)
 * @param numbers 数字数组
 * @returns 平均值
 */
export const average = (numbers: (number | string)[]): number => {
  if (numbers.length === 0) return 0;
  // 保持 Decimal 对象计算，避免精度丢失
  const total = numbers.reduce((acc, curr) => acc.plus(new Decimal(curr)), new Decimal(0));
  return total.dividedBy(numbers.length).toNumber();
};

/**
 * 比较大小
 * @param a 第一个数
 * @param b 第二个数
 * @returns 1 if a > b, -1 if a < b, 0 if a == b
 */
export const compare = (a: number | string, b: number | string): number => {
  const decA = new Decimal(a);
  const decB = new Decimal(b);
  if (decA.greaterThan(decB)) return 1;
  if (decA.lessThan(decB)) return -1;
  return 0;
};

/**
 * 最大值
 * @param numbers 数字数组
 * @returns 最大值
 */
export const max = (numbers: (number | string)[]): number => {
  if (numbers.length === 0) {
    console.warn('max: 数组为空，返回 0');
    return 0;
  }
  return Decimal.max(...numbers.map((n) => new Decimal(n))).toNumber();
};

/**
 * 最小值
 * @param numbers 数字数组
 * @returns 最小值
 */
export const min = (numbers: (number | string)[]): number => {
  if (numbers.length === 0) {
    console.warn('min: 数组为空，返回 0');
    return 0;
  }
  return Decimal.min(...numbers.map((n) => new Decimal(n))).toNumber();
};

/**
 * 区间限制
 * @param value 值
 * @param min 最小值
 * @param max 最大值
 * @returns 限制后的值
 */
export const clamp = (
  value: number | string,
  min: number | string,
  max: number | string
): number => {
  const val = new Decimal(value);
  const minDec = new Decimal(min);
  const maxDec = new Decimal(max);

  if (val.lessThan(minDec)) return minDec.toNumber();
  if (val.greaterThan(maxDec)) return maxDec.toNumber();
  return val.toNumber();
};
