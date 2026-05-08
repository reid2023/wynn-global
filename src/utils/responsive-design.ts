/**
 * 响应式初始化 - 设置根字体大小
 * 基准设计稿宽度：750px
 * 移动端：(<= 750px) 线性缩放
 * PC 端：(> 750px) 固定宽度 750px，使用 max-width 容器限制
 */
function initResponsiveDesign() {
  const updateRootFontSize = () => {
    const screenWidth = window.innerWidth;
    let rootFontSize: number;

    if (screenWidth <= 750) {
      // 移动端：线性缩放（基准 750px = 16px）
      rootFontSize = (screenWidth / 750) * 16;
    } else {
      // PC 端：保持基准字体大小 16px（不缩放，使用容器 max-width 限制）
      rootFontSize = 16;
    }

    document.documentElement.style.fontSize = `${rootFontSize}px`;
  };

  // 初始化
  updateRootFontSize();

  // 监听窗口大小变化
  window.addEventListener('resize', updateRootFontSize);
  window.addEventListener('orientationchange', updateRootFontSize);
}

export { initResponsiveDesign };
