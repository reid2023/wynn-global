/**
 * 独立的 Loading 进度管理
 * 完全不依赖 Vue，在 main.ts 加载前可用
 */
const LoadingProgress = (() => {
  let loadingContainer = null;
  let progressBar = null;
  let currentProgress = 0;
  const MAX_PROGRESS = 95;
  let isFinished = false;

  const init = () => {
    loadingContainer = document.getElementById('loading-overlay');
    progressBar = document.getElementById('loading-progress');
    if (!loadingContainer) return false;
    loadingContainer.style.opacity = '1';
    loadingContainer.style.pointerEvents = 'auto';
    return true;
  };

  const start = () => {
    if (!init()) return;
    simulateProgress();
  };

  const simulateProgress = () => {
    let progress = 0;
    const interval = setInterval(
      () => {
        if (isFinished) {
          clearInterval(interval);
          return;
        }
        progress = Math.min(currentProgress + Math.random() * 15, MAX_PROGRESS);
        update(progress);
      },
      300 + Math.random() * 700
    );
  };

  const update = (percentage) => {
    if (isFinished) return;
    currentProgress = Math.max(currentProgress, Math.min(percentage, MAX_PROGRESS));
    if (progressBar) {
      progressBar.style.left = currentProgress + '%';
    }
  };

  const finish = () => {
    if (isFinished) return;
    isFinished = true;
    if (progressBar) {
      progressBar.style.transition = 'left 0.3s ease-out';
      progressBar.style.left = '100%';
    }
    setTimeout(() => {
      if (loadingContainer) {
        loadingContainer.style.transition = 'opacity 0.6s ease-out';
        loadingContainer.style.opacity = '0';
        loadingContainer.style.pointerEvents = 'none';
      }
    }, 300);
  };

  const step = (stepSize = 5) => {
    if (!isFinished) {
      update(currentProgress + stepSize);
    }
  };

  const reset = () => {
    currentProgress = 0;
    isFinished = false;
    if (progressBar) {
      progressBar.style.transition = 'none';
      progressBar.style.left = '0%';
    }
    if (loadingContainer) {
      loadingContainer.style.transition = 'none';
      loadingContainer.style.opacity = '1';
      loadingContainer.style.pointerEvents = 'auto';
    }
  };

  return {
    start,
    update,
    step,
    finish,
    reset,
    getProgress: () => currentProgress,
    isFinished: () => isFinished,
  };
})();

window.LoadingProgress = LoadingProgress;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    LoadingProgress.start();
  });
} else {
  LoadingProgress.start();
}
