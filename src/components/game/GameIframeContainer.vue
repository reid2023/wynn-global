<template>
  <Teleport to="body">
    <div class="game-iframe-root" role="dialog" aria-modal="true" :aria-label="iframeTitle">
      <iframe
        v-if="safeSrc"
        ref="iframeRef"
        :key="iframeKey"
        class="game-iframe"
        :src="safeSrc"
        :title="iframeTitle"
        allow="
          accelerometer;
          autoplay;
          clipboard-write;
          encrypted-media;
          gyroscope;
          magnetometer;
          midi;
          payment;
          picture-in-picture;
          web-share;
          fullscreen;
        "
        loading="eager"
        @load="onIframeLoad"
      />
      <div class="game-iframe-chrome">
        <button type="button" class="game-iframe-back" :aria-label="backLabel" @click="onBackClick">
          {{ backLabel }}
        </button>
      </div>
      <p v-if="loadTimedOut" class="game-iframe-slow-tip">{{ loadSlowLabel }}</p>
      <div v-show="showLoadingOverlay" class="game-iframe-loading" aria-busy="true">
        <van-loading type="spinner" size="28px" vertical>{{ loadingLabel }}</van-loading>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const HISTORY_MARK = '__gameIframeEmbed';

interface Props {
  /** 第三方游戏启动地址（https 推荐） */
  src: string;
  /** iframe 无障碍标题 */
  iframeTitle?: string;
  /**
   * 是否与 history 同步，便于系统返回键 / Android 物理返回关闭容器。
   * 关闭后仅能通过界面按钮返回。
   */
  syncHistory?: boolean;
  /** 加载超时（毫秒），超时后收起遮罩并显示提示条；≤0 表示不检测 */
  loadTimeoutMs?: number;
}

const props = withDefaults(defineProps<Props>(), {
  iframeTitle: 'Game',
  syncHistory: true,
  loadTimeoutMs: 45000,
});

const emit = defineEmits<{
  close: [];
}>();

const { t } = useI18n();

const iframeRef = ref<HTMLIFrameElement | null>(null);
const iframeKey = ref(0);
const isFrameLoading = ref(true);
const loadTimedOut = ref(false);
let loadTimer: ReturnType<typeof setTimeout> | undefined;
let historyPushed = false;
const scrollLockClass = 'game-iframe-scroll-lock';

const backLabel = computed(() => t('common.back'));
const loadingLabel = computed(() => t('common.gameLoading'));
const loadSlowLabel = computed(() => t('common.gameLoadSlow'));

const showLoadingOverlay = computed(() => isFrameLoading.value && !loadTimedOut.value);

function normalizeGameUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  try {
    const u = new URL(trimmed, window.location.href);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return null;
    return u.toString();
  } catch {
    return null;
  }
}

const safeSrc = computed(() => normalizeGameUrl(props.src));

function clearLoadTimer() {
  if (loadTimer !== undefined) {
    clearTimeout(loadTimer);
    loadTimer = undefined;
  }
}

function scheduleLoadTimer() {
  clearLoadTimer();
  const ms = props.loadTimeoutMs;
  if (ms === undefined || ms <= 0) return;
  loadTimer = setTimeout(() => {
    if (isFrameLoading.value) {
      loadTimedOut.value = true;
      isFrameLoading.value = false;
    }
  }, ms);
}

function resetLoadingForNewSrc() {
  clearLoadTimer();
  isFrameLoading.value = true;
  loadTimedOut.value = false;
  iframeKey.value += 1;
  scheduleLoadTimer();
}

function lockBodyScroll() {
  document.documentElement.classList.add(scrollLockClass);
  document.body.classList.add(scrollLockClass);
}

function unlockBodyScroll() {
  document.documentElement.classList.remove(scrollLockClass);
  document.body.classList.remove(scrollLockClass);
}

function stripIframe() {
  const el = iframeRef.value;
  if (!el) return;
  try {
    el.src = 'about:blank';
  } catch {
    /* cross-origin may throw in some environments */
  }
}

function removeHistoryListener() {
  window.removeEventListener('popstate', onPopState);
}

function consumeHistoryEntry() {
  if (!historyPushed) return;
  historyPushed = false;
  removeHistoryListener();
  window.history.back();
}

function onPopState() {
  if (!historyPushed) return;
  historyPushed = false;
  removeHistoryListener();
  emit('close');
}

function tryPushHistory() {
  if (!props.syncHistory) return;
  removeHistoryListener();
  window.history.pushState({ [HISTORY_MARK]: true }, '');
  historyPushed = true;
  window.addEventListener('popstate', onPopState);
}

function onIframeLoad() {
  clearLoadTimer();
  isFrameLoading.value = false;
}

function onBackClick() {
  consumeHistoryEntry();
  emit('close');
}

watch(
  () => props.src,
  () => {
    const next = normalizeGameUrl(props.src);
    if (!next) {
      clearLoadTimer();
      emit('close');
      return;
    }
    resetLoadingForNewSrc();
  }
);

onMounted(() => {
  if (!safeSrc.value) {
    emit('close');
    return;
  }
  lockBodyScroll();
  tryPushHistory();
  scheduleLoadTimer();
});

onBeforeUnmount(() => {
  clearLoadTimer();
  removeHistoryListener();
  if (historyPushed) {
    historyPushed = false;
    window.history.back();
  }
  stripIframe();
  unlockBodyScroll();
});
</script>

<style scoped lang="less">
@chrome-z: 20;
@loading-z: 10;

.game-iframe-root {
  position: fixed;
  inset: 0;
  z-index: 10050;
  background: #000;
  box-sizing: border-box;
}

.game-iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
  /* flex/grid 子项中的 iframe 在部分 WebKit 下需明确最小高度 */
  min-height: 0;
  display: block;
}

.game-iframe-chrome {
  position: absolute;
  z-index: @chrome-z;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  padding-top: calc(10px + env(safe-area-inset-top, 0px));
  padding-left: calc(12px + env(safe-area-inset-left, 0px));
  padding-right: calc(12px + env(safe-area-inset-right, 0px));
  padding-bottom: 20px;
  pointer-events: none;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.55) 0%,
    rgba(0, 0, 0, 0.2) 55%,
    transparent 100%
  );
}

.game-iframe-back {
  pointer-events: auto;
  margin: 0;
  min-width: 44px;
  min-height: 44px;
  padding: 0 16px;
  border: 1px solid rgba(98, 193, 81, 0.55);
  border-radius: 999px;
  background: rgba(5, 10, 5, 0.88);
  color: #b8f5a8;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;

  &:active {
    transform: scale(0.97);
  }
}

.game-iframe-slow-tip {
  position: absolute;
  z-index: 19;
  left: 12px;
  right: 12px;
  top: calc(56px + env(safe-area-inset-top, 0px));
  margin: 0;
  padding: 8px 12px;
  border-radius: 8px;
  background: rgba(30, 25, 10, 0.92);
  border: 1px solid rgba(245, 158, 11, 0.35);
  color: rgba(255, 248, 220, 0.95);
  font-size: 12px;
  line-height: 1.45;
  text-align: center;
  pointer-events: none;
}

.game-iframe-loading {
  position: absolute;
  inset: 0;
  z-index: @loading-z;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.45);
  color: rgba(255, 255, 255, 0.85);
}
</style>

<style lang="less">
/* 非 scoped：锁定背景滚动，避免穿透到底层页面 */
html.game-iframe-scroll-lock,
body.game-iframe-scroll-lock {
  overflow: hidden !important;
  height: 100% !important;
}
</style>
