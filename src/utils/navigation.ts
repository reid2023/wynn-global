/**
 * 移动端和 Web 跨浏览器兼容的导航工具
 * 优先使用 @vueuse/core 的原生能力，降级使用自定义方案
 */

/**
 * 检测浏览器类型
 */
function detectBrowser() {
  const ua = navigator.userAgent.toLowerCase();
  return {
    isSafari: /safari/.test(ua) && !/chrome/.test(ua),
    isChrome: /chrome/.test(ua),
    isFirefox: /firefox/.test(ua),
    isWeChat: /micromessenger/.test(ua),
    isQQ: /qq/.test(ua),
    isAndroid: /android/.test(ua),
    isIOS: /iphone|ipad|ipod/.test(ua),
  };
}

/**
 * 安全打开链接 - 处理各浏览器的兼容性问题
 * @param url - 要打开的链接
 * @param target - 窗口目标（默认 '_blank'）
 * @param features - 窗口特性（可选）
 */
export function safeOpenUrl(url: string, target: string = '_blank', features?: string): void {
  if (!url) {
    console.warn('Navigation: URL is empty');
    return;
  }

  try {
    const browser = detectBrowser();

    // 微信内打开
    if (browser.isWeChat) {
      // 微信内 window.open 有限制，直接赋值
      if (target === '_blank') {
        window.location.href = url;
      } else {
        window.open(url, target);
      }
      return;
    }

    // Safari 特殊处理
    if (browser.isSafari) {
      // Safari 中 _blank 可能被阻止，使用 location.href 的替代方案
      const link = document.createElement('a');
      link.href = url;
      link.target = target;
      link.rel = 'noopener noreferrer';

      // 添加到 DOM（必要步骤）
      document.body.appendChild(link);

      // 触发点击
      link.click();

      // 清理
      setTimeout(() => {
        document.body.removeChild(link);
      }, 0);
      return;
    }

    // 标准浏览器
    const newWindow = window.open(url, target, features);

    // 防止 window.open 被阻止时的降级
    if (!newWindow) {
      console.warn('Navigation: window.open was blocked, falling back to location.href');
      if (target === '_blank') {
        // 使用 location.href 降级
        const link = document.createElement('a');
        link.href = url;
        link.target = target;
        link.click();
      } else {
        window.location.href = url;
      }
    }
  } catch (error) {
    console.error('Navigation error:', error);
    // 最终降级方案
    try {
      window.location.href = url;
    } catch (e) {
      console.error('Fatal navigation error:', e);
    }
  }
}

/**
 * 分享链接到指定平台
 * @param platform - 平台类型
 * @param url - 要分享的 URL
 * @param text - 分享文本（可选）
 * @param title - 分享标题（可选）
 */
export function shareToplatform(
  platform: 'mais' | 'facebook' | 'whatsapp' | 'telegram' | 'twitter' | 'instagram' | 'kwai',
  url: string,
  text: string = ''
): void {
  let shareUrl = '';

  switch (platform) {
    case 'mais':
      break;
    case 'facebook':
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
      break;

    case 'whatsapp':
      const whatsappText = text ? `${text} ${url}` : url;
      shareUrl = `https://wa.me/?text=${encodeURIComponent(whatsappText)}`;
      break;

    case 'telegram':
      shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
      break;

    case 'twitter':
      shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
      break;

    case 'instagram':
      // Instagram 不支持直接分享链接，只能打开应用
      console.warn('Instagram direct sharing is limited, opening Instagram app...');
      shareUrl = 'https://www.instagram.com/';
      break;

    case 'kwai':
      // Kwai 不支持直接分享链接
      console.warn('Kwai direct sharing is limited, opening Kwai app...');
      shareUrl = 'https://www.kwai.com/';
      break;

    default:
      console.warn(`Unknown platform: ${platform}`);
      return;
  }

  if (shareUrl) {
    safeOpenUrl(shareUrl, '_blank');
  }
}
