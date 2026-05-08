import { t } from '@/i18n';

/**
 * 表单校验规则配置
 */
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  validator?: (value: any) => boolean;
  message?: string;
}

export interface ValidationRules {
  [key: string]: ValidationRule | ValidationRule[];
}

/**
 * 预定义的校验规则
 */
export const predefinedRules = {
  // 巴西手机号（11位数字）
  brPhone: {
    pattern: /^\d{11}$/,
    message: t('validator.phone'),
  },

  // 密码（6-12位，包含数字和字母）
  password: {
    minLength: 6,
    maxLength: 12,
    pattern: /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,12}$/,
    message: t('validator.password'),
  },

  // 邮箱
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: t('validator.email'),
  },

  // 用户名（3-20位字母、数字、下划线）
  username: {
    minLength: 3,
    maxLength: 20,
    pattern: /^[a-zA-Z0-9_]+$/,
    message: t('validator.username'),
  },
};

/**
 * 表单校验器
 */
export class FormValidator {
  private rules: ValidationRules = {};

  constructor(rules: ValidationRules = {}) {
    this.rules = rules;
  }

  /**
   * 设置校验规则
   */
  setRules(rules: ValidationRules) {
    this.rules = rules;
  }

  /**
   * 验证单个字段
   */
  validateField(fieldName: string, value: any): { valid: boolean; message: string } {
    const rule = this.rules[fieldName];
    if (!rule) {
      return { valid: true, message: '' };
    }

    const rules = Array.isArray(rule) ? rule : [rule];

    for (const singleRule of rules) {
      const result = this._validateSingleRule(value, singleRule);
      if (!result.valid) {
        return result;
      }
    }

    return { valid: true, message: '' };
  }

  /**
   * 验证所有字段
   */
  validateAll(data: Record<string, any>): { valid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};

    for (const fieldName in this.rules) {
      const result = this.validateField(fieldName, data[fieldName]);
      if (!result.valid) {
        errors[fieldName] = result.message;
      }
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  }

  /**
   * 私有方法：验证单条规则
   */
  private _validateSingleRule(
    value: any,
    rule: ValidationRule
  ): { valid: boolean; message: string } {
    // 检查必填
    if (rule.required && !value) {
      return {
        valid: false,
        message: rule.message || t('validator.required'),
      };
    }

    // 如果不必填且值为空，则通过
    if (!value) {
      return { valid: true, message: '' };
    }

    // 检查最小长度
    if (rule.minLength !== undefined && String(value).length < rule.minLength) {
      return {
        valid: false,
        message: rule.message || t('validator.minLength', { minLength: rule.minLength }),
      };
    }

    // 检查最大长度
    if (rule.maxLength !== undefined && String(value).length > rule.maxLength) {
      return {
        valid: false,
        message: rule.message || t('validator.maxLength', { maxLength: rule.maxLength }),
      };
    }

    // 检查正则表达式
    if (rule.pattern && !rule.pattern.test(String(value))) {
      return {
        valid: false,
        message: rule.message || t('validator.pattern'),
      };
    }

    // 检查自定义验证函数
    if (rule.validator && !rule.validator(value)) {
      return {
        valid: false,
        message: rule.message || t('validator.failed'),
      };
    }

    return { valid: true, message: '' };
  }
}

/**
 * 创建表单校验实例
 */
export function createFormValidator(rules: ValidationRules = {}) {
  return new FormValidator(rules);
}
