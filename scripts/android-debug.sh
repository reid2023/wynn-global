#!/usr/bin/env bash
# Capacitor 8 CLI 需要 Node >= 22；若全套命令都用 Node 22，部分环境下 Rollup 原生可选依赖可能缺失。
# 因此先用 Node 20 跑 Vite（若本机已安装），再用 Node 22 跑 cap sync，最后用 Gradle 打 debug APK。
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ -s "${NVM_DIR:-$HOME/.nvm}/nvm.sh" ]]; then
  # shellcheck source=/dev/null
  . "${NVM_DIR:-$HOME/.nvm}/nvm.sh"
  nvm use 20 2>/dev/null || true
fi

pnpm run build

if [[ -s "${NVM_DIR:-$HOME/.nvm}/nvm.sh" ]]; then
  # shellcheck source=/dev/null
  . "${NVM_DIR:-$HOME/.nvm}/nvm.sh"
  nvm use 22
fi

pnpm exec cap sync android
(cd android && ./gradlew assembleDebug)

echo ""
echo "APK: $ROOT/android/app/build/outputs/apk/debug/app-debug.apk"
