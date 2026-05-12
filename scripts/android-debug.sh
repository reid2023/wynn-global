#!/usr/bin/env bash
# Capacitor 8 与 package.json engines 要求 Node >= 22；全程用同一 Node 版本，
# 避免 Node 20 跑 Vite 时出现 Rollup 原生包（darwin-arm64 / darwin-x64）与安装时不一致。
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

# 避免本机曾 export 过 CAPACITOR_REMOTE_ONLY=1 导致误打「仅远程壳」包
unset CAPACITOR_REMOTE_ONLY || true

if [[ -s "${NVM_DIR:-$HOME/.nvm}/nvm.sh" ]]; then
  # shellcheck source=/dev/null
  . "${NVM_DIR:-$HOME/.nvm}/nvm.sh"
  nvm use 22
fi

pnpm run build
pnpm exec cap sync android
(cd android && ./gradlew assembleDebug)

echo ""
echo "APK: $ROOT/android/app/build/outputs/apk/debug/app-debug.apk"
