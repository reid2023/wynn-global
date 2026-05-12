import type { CapacitorConfig } from '@capacitor/cli';

/** 设为 `1` 时仅同步占位目录 `remote-shell`，不把完整 dist 打进 APK（运行时仍走 server.url 远程 H5） */
const remoteShellOnly = process.env.CAPACITOR_REMOTE_ONLY === '1';

const config: CapacitorConfig = {
  appId: 'com.wynnglobal.app',
  appName: 'wynn-global',
  webDir: remoteShellOnly ? 'remote-shell' : 'dist',
  server: {
    // 🔗 直接指向你的线上 Vue H5 网址
    url: 'https://test-sm.wynnglobal.vip/',
    // 允许明文传输（如果是 http 域名需要开启）
    cleartext: true,
  },
};

export default config;
