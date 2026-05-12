/// <reference lib="ES2020" />
/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare interface Window {
  LoadingProgress: {
    start: () => void;
    update: (percentage: number) => void;
    step: (stepSize?: number) => void;
    finish: () => void;
    reset: () => void;
    getProgress: () => number;
    isFinished: () => boolean;
  };
}
