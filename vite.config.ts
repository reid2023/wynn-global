import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';
import compression from 'vite-plugin-compression';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import { fileURLToPath, URL } from 'node:url';

// 获取 icons 主目录路径
function getIconDir(): string {
  return fileURLToPath(new URL('./src/assets/icons', import.meta.url));
}

// https://vitejs.dev/config/
export default defineConfig({
  publicDir: 'public', // 明确指定public目录
  plugins: [
    vue(),
    // SVG Icon 精灵图插件
    createSvgIconsPlugin({
      iconDirs: [getIconDir()],
      symbolId: 'icon-[dir]-[name]',
    }),
    // PWA配置
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Wynn Global',
        short_name: 'Wynn Global',
        description: 'Global Mobile Application',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait-primary',
        icons: [
          {
            src: '/img/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/img/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp}'],
        // 缓存策略
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\./,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 5 * 60, // 5分钟
              },
            },
          },
        ],
      },
    } as any),
    // Gzip压缩
    compression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 10240,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    host: true,
    strictPort: false,
    proxy: {
      '/api': {
        target: 'http://ec2-18-142-46-250.ap-southeast-1.compute.amazonaws.com:30088',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    assetsInlineLimit: 12 * 1024, // 小于 8KB 的图片自动转换为 base64
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vue: ['vue', 'vue-router', 'pinia'],
          i18n: ['vue-i18n'],
          ui: ['vant'],
        },
      },
    },
  },
});
