/**
 * localStorage 存储工具函数
 */

/**
 * 设置存储
 * @param key 键
 * @param value 值
 */
function set(key: string, value: any): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to set storage for key "${key}":`, error);
  }
}

/**
 * 获取存储
 * @param key 键
 * @param defaultValue 默认值
 * @returns 存储的值
 */
function get<T = any>(key: string, defaultValue?: T): T | null {
  try {
    const value = localStorage.getItem(key);
    if (value === null) return defaultValue || null;
    return JSON.parse(value);
  } catch (error) {
    console.error(`Failed to get storage for key "${key}":`, error);
    return defaultValue || null;
  }
}

/**
 * 删除存储
 * @param key 键
 */
function remove(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Failed to remove storage for key "${key}":`, error);
  }
}

/**
 * 清空存储
 */
function clear(): void {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Failed to clear storage:', error);
  }
}

/**
 * 检查是否存在
 * @param key 键
 * @returns 是否存在
 */
function has(key: string): boolean {
  return localStorage.getItem(key) !== null;
}

/**
 * 获取所有键
 * @returns key 数组
 */
function keys(): string[] {
  const result: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) result.push(key);
  }
  return result;
}

/**
 * 批量设置
 * @param items key-value 对象
 */
function setBatch(items: Record<string, any>): void {
  try {
    Object.entries(items).forEach(([key, value]) => {
      localStorage.setItem(key, JSON.stringify(value));
    });
  } catch (error) {
    console.error('Failed to batch set storage:', error);
  }
}

/**
 * 批量获取
 * @param keys key 数组
 * @returns key-value 对象
 */
function getBatch<T = any>(keyList: string[]): Record<string, T | null> {
  const result: Record<string, T | null> = {};
  keyList.forEach((key) => {
    result[key] = get<T>(key);
  });
  return result;
}

/**
 * 批量删除
 * @param keys key 数组
 */
function removeBatch(keyList: string[]): void {
  try {
    keyList.forEach((key) => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Failed to batch remove storage:', error);
  }
}

/**
 * localStorage 工具对象
 *
 * 使用示例：
 * local.set('key', value)
 * local.get('key')
 * local.remove('key')
 * local.clear()
 */
export const local = {
  set,
  get,
  remove,
  clear,
  has,
  keys,
  setBatch,
  getBatch,
  removeBatch,
};
