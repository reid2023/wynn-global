import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.wynnglobal.app',
  appName: 'wynn-global',
  webDir: 'dist',
  server: {
    // 🔗 直接指向你的线上 Vue H5 网址
    url: 'https://test-sm.wynnglobal.vip/',
    // 允许明文传输（如果是 http 域名需要开启）
    cleartext: true 
  }
};

export default config;
