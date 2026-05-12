#!/usr/bin/env bash
# 仅远程壳：不打完整 dist，APK 内只含 remote-shell 占位 + capacitor 配置；WebView 加载 server.url。
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

export CAPACITOR_REMOTE_ONLY=1

if [[ -s "${NVM_DIR:-$HOME/.nvm}/nvm.sh" ]]; then
  # shellcheck source=/dev/null
  . "${NVM_DIR:-$HOME/.nvm}/nvm.sh"
  nvm use 22
fi

pnpm exec cap sync android
(cd android && ./gradlew assembleDebug)

echo ""
echo "（远程壳）APK: $ROOT/android/app/build/outputs/apk/debug/app-debug.apk"
echo "运行时页面来源: capacitor.config.ts 中的 server.url"
