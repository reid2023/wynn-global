<template>
  <div class="svg-preview">
    <!-- 页面头部 -->
    <header class="preview-header">
      <button class="back-btn" @click="goBack">
        <SvgIcon name="back" dir="action" size="20" />
      </button>
      <h1>SVG 图标库</h1>
      <div class="header-spacer"></div>
    </header>

    <!-- 搜索栏和筛选 -->
    <div class="search-section">
      <div class="search-input-wrapper">
        <SvgIcon name="search" dir="action" size="20" color="#999" />
        <input
          v-model="searchText"
          type="text"
          placeholder="搜索图标..."
          class="search-input"
          @input="handleSearch"
        />
        <button v-if="searchText" class="clear-btn" @click="searchText = ''">
          <SvgIcon name="close" dir="action" size="18" />
        </button>
      </div>
    </div>

    <!-- 目录筛选按钮 -->
    <div class="filter-tabs">
      <button
        v-for="dir in allDirs"
        :key="dir"
        :class="['tab-btn', { active: selectedDir === dir }]"
        @click="selectedDir = dir"
      >
        {{ dir }}
        <span class="count">{{ getIconCountByDir(dir) }}</span>
      </button>
    </div>

    <!-- 图标网格 -->
    <div class="icons-container">
      <div v-if="filteredIcons.length === 0" class="empty-state">
        <p>没有找到匹配的图标</p>
      </div>

      <div
        v-for="dir in selectedDir === 'all' ? allDirs : [selectedDir as string]"
        :key="dir"
        class="icon-group"
      >
        <h2 v-if="selectedDir === 'all'" class="group-title">
          {{ dir }} 目录
          <span class="icon-count">({{ getIconCountByDir(dir) }})</span>
        </h2>

        <div
          v-if="getIconsByDir(dir).length > 0"
          class="icons-grid"
          :class="{ 'single-col': isMobile }"
        >
          <div
            v-for="icon in getIconsByDir(dir)"
            :key="`${icon.dir}-${icon.name}`"
            class="icon-card"
            @click="selectIcon(icon)"
          >
            <div class="icon-preview">
              <SvgIcon :name="icon.name" :dir="icon.dir" size="32" />
            </div>
            <p class="icon-name">{{ icon.name }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 图标详情抽屉 -->
    <transition name="slide-up">
      <div v-if="selectedIcon" class="detail-drawer">
        <div class="drawer-header">
          <h3>复制代码</h3>
          <button class="close-btn" @click="selectedIcon = null">
            <SvgIcon name="close" dir="action" size="20" />
          </button>
        </div>

        <div class="drawer-content">
          <!-- 图标预览 -->
          <div class="preview-section">
            <div class="icon-display-large">
              <SvgIcon :name="selectedIcon.name" :dir="selectedIcon.dir" size="64" />
            </div>
            <p class="icon-info">
              <strong>图标名:</strong> {{ selectedIcon.name }}
              <br />
              <strong>所属目录:</strong> {{ selectedIcon.dir }}
            </p>
          </div>

          <!-- 大小演示 -->
          <div class="sizes-section">
            <h4>大小演示</h4>
            <div class="sizes-demo">
              <div v-for="size in [16, 24, 32, 48]" :key="size" class="size-item">
                <SvgIcon :name="selectedIcon.name" :dir="selectedIcon.dir" :size="size" />
                <span>{{ size }}px</span>
              </div>
            </div>
          </div>

          <!-- 颜色演示 -->
          <div class="colors-section">
            <h4>颜色演示</h4>
            <div class="colors-demo">
              <div
                v-for="color in colors"
                :key="color"
                class="color-item"
                :style="{ '--color': color }"
              >
                <SvgIcon
                  :name="selectedIcon.name"
                  :dir="selectedIcon.dir"
                  size="24"
                  :color="color"
                />
                <span>{{ color }}</span>
              </div>
            </div>
          </div>

          <!-- 代码示例 -->
          <div class="code-section">
            <h4>代码示例</h4>

            <div class="code-example">
              <div class="code-header">
                <span>基础用法</span>
                <button class="copy-btn" @click="copyToClipboard(basicCode)">复制</button>
              </div>
              <pre><code>{{ basicCode }}</code></pre>
            </div>

            <div class="code-example">
              <div class="code-header">
                <span>自定义大小和颜色</span>
                <button class="copy-btn" @click="copyToClipboard(advancedCode)">复制</button>
              </div>
              <pre><code>{{ advancedCode }}</code></pre>
            </div>
          </div>

          <!-- 使用提示 -->
          <div class="tips-section">
            <h4>💡 使用提示</h4>
            <ul>
              <li>支持数字大小（12-64px）或字符串（如 '1.5rem'）</li>
              <li>颜色支持十六进制、RGB、CSS变量等格式</li>
              <li>name 为图标名称，dir 为所属目录</li>
              <li>如果传入的 name 包含 '-'，会自动识别目录</li>
            </ul>
          </div>
        </div>

        <div class="drawer-footer">
          <button class="btn-primary" @click="selectedIcon = null">关闭</button>
        </div>
      </div>
    </transition>

    <!-- 抽屉遮罩 -->
    <transition name="fade">
      <div v-if="selectedIcon" class="drawer-overlay" @click="selectedIcon = null"></div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useClipboard } from '@vueuse/core';
import type { IconInfo } from '@/types/svg-icon';

interface IconWithDir extends IconInfo {
  fullName: string;
}

const router = useRouter();
const { copy } = useClipboard();

// 状态
const searchText = ref('');
const selectedDir = ref<'all' | string>('all');
const selectedIcon = ref<IconWithDir | null>(null);
const isMobile = ref(window.innerWidth < 768);

// 响应式
window.addEventListener('resize', () => {
  isMobile.value = window.innerWidth < 768;
});

// 颜色演示
const colors = [
  '#0066cc',
  '#52c41a',
  '#faad14',
  '#f5222d',
  '#1890ff',
  '#FF3B30',
  '#FF69B4',
  '#8B5CF6',
];

// 动态扫描SVG文件
const svgModules = import.meta.glob('/src/assets/icons/**/*.svg');
const svgPaths = Object.keys(svgModules);

// 从路径中解析目录和文件名
const parseIconPath = (path: string): { dir: string; name: string; fullName: string } => {
  // 路径格式: /src/assets/icons/home/home.svg
  const match = path.match(/\/icons\/([^/]+)\/([^.]+)\.svg$/);
  if (match) {
    const dir = match[1];
    const name = match[2];
    return {
      dir,
      name,
      fullName: `${dir}-${name}`,
    };
  }
  return { dir: '', name: '', fullName: '' };
};

// 构建所有图标列表
const allIcons = computed<IconWithDir[]>(() => {
  const icons: IconWithDir[] = [];
  svgPaths.forEach((path) => {
    const parsed = parseIconPath(path);
    if (parsed.dir && parsed.name) {
      icons.push({
        name: parsed.name,
        dir: parsed.dir,
        fullName: parsed.fullName,
      });
    }
  });
  return icons.sort((a, b) => {
    // 按目录排序，再按名称排序
    if (a.dir !== b.dir) {
      return a.dir.localeCompare(b.dir);
    }
    return a.name.localeCompare(b.name);
  });
});

// 获取所有目录
const allDirs = computed<string[]>(() => {
  const dirs = new Set<string>();
  allIcons.value.forEach((icon) => {
    dirs.add(icon.dir);
  });
  return Array.from(dirs).sort();
});

// 按搜索文本过滤
const searchResults = computed<IconWithDir[]>(() => {
  if (!searchText.value) return allIcons.value;

  const query = searchText.value.toLowerCase();
  return allIcons.value.filter(
    (icon) =>
      icon.name.toLowerCase().includes(query) ||
      icon.dir.toLowerCase().includes(query) ||
      icon.fullName.toLowerCase().includes(query)
  );
});

// 最终过滤结果
const filteredIcons = computed<IconWithDir[]>(() => {
  if (selectedDir.value === 'all') {
    return searchResults.value;
  }
  return searchResults.value.filter((icon) => icon.dir === selectedDir.value);
});

// 按目录获取图标
const getIconsByDir = (dir: string): IconWithDir[] => {
  return searchResults.value.filter((icon) => icon.dir === dir);
};

// 获取目录中的图标数量
const getIconCountByDir = (dir: string): number => {
  return allIcons.value.filter((icon) => icon.dir === dir).length;
};

// 选择图标
const selectIcon = (icon: IconWithDir) => {
  selectedIcon.value = icon;
};

// 代码生成
const basicCode = computed(() => {
  if (!selectedIcon.value) return '';
  return `<SvgIcon name="${selectedIcon.value.name}" dir="${selectedIcon.value.dir}" />`;
});

const advancedCode = computed(() => {
  if (!selectedIcon.value) return '';
  return `<SvgIcon 
  name="${selectedIcon.value.name}" 
  dir="${selectedIcon.value.dir}" 
  size="24" 
  color="#0066cc" 
/>`;
});

// 复制到剪贴板
const copyToClipboard = async (text: string) => {
  try {
    await copy(text);
    alert('已复制到剪贴板');
  } catch (error) {
    console.error('Failed to copy:', error);
  }
};

// 返回
const goBack = () => {
  router.back();
};

// 搜索处理
const handleSearch = () => {
  // 搜索时重置目录筛选
  if (searchText.value && selectedDir.value !== 'all') {
    selectedDir.value = 'all';
  }
};
</script>

<style scoped>
.svg-preview {
  width: 100%;
  min-height: 100vh;
  background: var(--color-bg, #fff);
  display: flex;
  flex-direction: column;
  padding-bottom: 20px;
}

/* 页面头部 */
.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid var(--color-border, #eee);
  background: var(--color-bg, #fff);
  position: sticky;
  top: 0;
  z-index: 10;
}

.preview-header h1 {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  flex: 1;
  text-align: center;
  color: var(--color-text, #000);
}

.back-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
}

.header-spacer {
  width: 24px;
}

/* 搜索栏 */
.search-section {
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-border, #eee);
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--color-bg-secondary, #f5f5f5);
  border-radius: 6px;
}

.search-input {
  flex: 1;
  border: none;
  background: none;
  outline: none;
  font-size: 14px;
  color: var(--color-text, #000);
}

.search-input::placeholder {
  color: #999;
}

.clear-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  color: #999;
}

/* 筛选标签 */
.filter-tabs {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-border, #eee);
  overflow-x: auto;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: var(--color-bg-secondary, #f5f5f5);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  white-space: nowrap;
  transition: all 0.3s;
}

.tab-btn:hover {
  background: var(--color-bg-hover, #e8e8e8);
}

.tab-btn.active {
  background: var(--color-primary, #0066cc);
  color: white;
}

.count {
  font-size: 12px;
  opacity: 0.7;
}

/* 图标容器 */
.icons-container {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #999;
  font-size: 14px;
}

.icon-group {
  margin-bottom: 32px;
}

.group-title {
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: var(--color-text-secondary, #666);
  text-transform: capitalize;
}

.icon-count {
  font-size: 12px;
  color: #999;
  font-weight: normal;
}

.icons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 12px;
}

.icons-grid.single-col {
  grid-template-columns: repeat(auto-fill, minmax(72px, 1fr));
}

.icon-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  background: var(--color-bg-secondary, #f5f5f5);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.icon-card:active {
  transform: scale(0.95);
}

.icon-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background: var(--color-bg, #fff);
  border-color: var(--color-primary, #0066cc);
}

.icon-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
}

.icon-name {
  font-size: 12px;
  color: var(--color-text, #000);
  margin: 0;
  word-break: break-word;
  text-align: center;
  max-width: 100%;
  white-space: normal;
}

/* 抽屉 */
.detail-drawer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  max-height: 80vh;
  background: var(--color-bg, #fff);
  border-radius: 12px 12px 0 0;
  box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.1);
  z-index: 100;
  display: flex;
  flex-direction: column;
  animation: slide-up 0.3s ease-out;
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-border, #eee);
}

.drawer-header h3 {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
}

.drawer-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.preview-section {
  text-align: center;
  padding: 24px 16px;
  background: var(--color-bg-secondary, #f5f5f5);
  border-radius: 8px;
  margin-bottom: 24px;
}

.icon-display-large {
  font-size: 64px;
  margin-bottom: 12px;
}

.icon-info {
  font-size: 13px;
  color: var(--color-text-secondary, #666);
  line-height: 1.6;
  margin: 0;
}

.sizes-section,
.colors-section,
.code-section,
.tips-section {
  margin-bottom: 24px;
}

.sizes-section h4,
.colors-section h4,
.code-section h4,
.tips-section h4 {
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: var(--color-text, #000);
}

.sizes-demo {
  display: flex;
  gap: 16px;
  justify-content: center;
  padding: 12px;
  background: var(--color-bg-secondary, #f5f5f5);
  border-radius: 6px;
}

.size-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.size-item span {
  font-size: 12px;
  color: #999;
}

.colors-demo {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
  gap: 12px;
}

.color-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: var(--color-bg-secondary, #f5f5f5);
  border-radius: 6px;
  color: var(--color, #000);
}

.color-item span {
  font-size: 11px;
  color: #666;
}

.code-example {
  background: var(--color-bg-secondary, #f5f5f5);
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 12px;
}

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: var(--color-bg-hover, #e8e8e8);
  border-bottom: 1px solid var(--color-border, #ddd);
  font-size: 12px;
}

.copy-btn {
  padding: 4px 8px;
  background: var(--color-primary, #0066cc);
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 11px;
}

.code-example pre {
  margin: 0;
  padding: 12px;
  background: #f5f5f5;
  overflow-x: auto;
  font-size: 12px;
  line-height: 1.4;
}

.code-example code {
  color: #333;
  font-family: 'Monaco', 'Courier New', monospace;
}

.tips-section ul {
  margin: 0;
  padding: 0 0 0 20px;
  background: var(--color-bg-secondary, #f5f5f5);
  border-radius: 6px;
  padding: 12px 12px 12px 28px;
}

.tips-section li {
  font-size: 13px;
  color: var(--color-text-secondary, #666);
  line-height: 1.6;
  margin-bottom: 6px;
}

.tips-section li:last-child {
  margin-bottom: 0;
}

.drawer-footer {
  padding: 12px 16px;
  border-top: 1px solid var(--color-border, #eee);
}

.btn-primary {
  width: 100%;
  padding: 12px;
  background: var(--color-primary, #0066cc);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s;
}

.btn-primary:active {
  opacity: 0.9;
}

.drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 99;
}

/* 动画 */
@keyframes slide-up {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes fade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease;
}

.slide-up-leave-to {
  transform: translateY(100%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-leave-to {
  opacity: 0;
}

/* 响应式 */
@media (min-width: 768px) {
  .detail-drawer {
    max-height: 90vh;
  }
}
</style>
