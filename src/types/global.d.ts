/**
 * 全局类型定义
 * 包括 window 对象的扩展等
 */

declare interface Window {
  /**
   * 独立的 Loading 进度管理
   * 在 index.html 中定义，无需导入即可使用
   */
  LoadingProgress: {
    /**
     * 启动进度跟踪
     */
    start: () => void;

    /**
     * 手动更新进度到指定百分比
     */
    update: (percentage: number) => void;

    /**
     * 增加指定步长的进度
     */
    step: (stepSize?: number) => void;

    /**
     * 完成加载并隐藏 Loading 页面
     */
    finish: () => void;

    /**
     * 重置进度（页面重载时）
     */
    reset: () => void;

    /**
     * 获取当前进度百分比
     */
    getProgress: () => number;

    /**
     * 检查是否已完成
     */
    isFinished: () => boolean;
  };
}
