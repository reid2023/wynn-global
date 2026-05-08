// 首先导入 SVG sprite 虚拟模块 - 必须在应用创建之前
import 'virtual:svg-icons-register';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import i18n from './i18n';
import router from './router';
import App from './App.vue';
import { initResponsiveDesign } from './utils/responsive-design';

initResponsiveDesign();

// 初始化主题系统
import { initTheme } from './theme';
initTheme();

// CSS重置、主题和全局样式
import './styles/reset.less';
import './styles/theme.less';
import './styles/tailwind.less';
import './styles/globals.less';
import './styles/dialog.less';

// 注册Vant UI
import { registerVantUI } from './utils/vant-register';

// 注册SVG Icon
import { setupSvgIcon } from './utils/svg-icon';

const app = createApp(App);

// 注册Pinia状态管理
app.use(createPinia());

// 注册国际化
app.use(i18n);

// 注册路由
app.use(router);

// 注册SVG Icon
setupSvgIcon(app);

// 注册Vant UI组件
registerVantUI(app);

app.mount('#app');

// 注册PWA service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch((err) => {
    console.log('SW registration failed: ', err);
  });
}
