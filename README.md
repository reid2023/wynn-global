# Wynn Global

一个高性能的 Vue3 移动端 应用模板。

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- pnpm >= 8.0.0（推荐使用 pnpm）

### 安装和运行

```bash
# 1. 克隆项目
git clone <your-repo-url>
cd wynn-global-h5

# 2. 安装依赖
pnpm install

# 3. 启动开发服务器
pnpm dev

# 4. 生产构建
pnpm build

# 5. 预览构建结果
pnpm preview

# 6. 类型检查
pnpm type-check
```

## 📁 项目结构

```
wynn-global-h5/
├── public/                 # 静态资源目录
├── src/
│   ├── components/         # 公共组件
│   ├── views/              # 页面组件（路由级）
│   ├── router/             # 路由配置
│   ├── i18n/               # 国际化配置
│   ├── stores/             # Pinia 状态管理
│   ├── services/           # API 服务
│   ├── utils/              # 工具函数
│   ├── composables/        # Vue 3 组合式函数
│   ├── styles/             # 全局样式
│   ├── assets/             # 资源文件（字体、图标、图片等）
│   ├── config/             # 配置文件
│   ├── theme/              # 主题配置
│   ├── types/              # TypeScript 类型定义
│   ├── App.vue             # 根组件
│   └── main.ts             # 应用入口
├── wildnorthradiantskies/  # 游戏相关模块
├── env.d.ts                # 环境类型定义
├── index.html              # HTML 入口文件
├── vite.config.ts          # Vite 配置
├── tsconfig.json           # TypeScript 配置
├── postcss.config.js       # PostCSS 配置
├── package.json            # 项目依赖配置
├── pnpm-lock.yaml          # 依赖锁文件
└── README.md               # 项目说明
```

## 📱 PWA 支持

项目已集成 PWA 支持，支持以下功能：

- Service Worker 离线缓存
- 安装到主屏幕
- 离线访问
- 推送通知

网络缓存策略：

- 静态资源：缓存优先
- API 请求：网络优先 (5分钟缓存)

## ⚙️ 构建优化

### 代码分割

路由级别的代码分割已自动配置，每个页面会单独打包成一个 chunk。

### 包体积优化

- Tree shaking：删除未使用的代码
- Gzip 压缩：自动启用
- Terser 代码混淆：删除 console 和 debugger

### 性能指标

- 首屏加载时间：< 2s
- 包体积（Gzip）：< 150KB
- HMR 热更新：< 500ms
- 构建时间：< 3s
