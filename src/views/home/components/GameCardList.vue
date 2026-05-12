<template>
  <div class="game-board">
    <!-- 左侧：游戏厂商 -->
    <aside class="provider-sidebar">
      <button
        v-for="p in GAME_PROVIDER_CARDS"
        :key="p.id"
        type="button"
        class="provider-card"
        :class="{ active: selectedProviderId === p.id }"
        @click="selectProvider(p.id)"
      >
        <div class="provider-badge">
          <img :src="p.icon" alt="icon" />
        </div>
        <div class="provider-rows">
          <div v-for="(row, idx) in p.rows" :key="idx" class="provider-row">
            <img :src="row.avatar" alt="" class="row-avatar" />
            <img :src="row.countryImg" alt="" class="row-flag" />
            <span class="row-balance text-gradient-gold">
              <span class="currency">$</span> +{{ row.balance }}
            </span>
          </div>
        </div>
      </button>
    </aside>

    <!-- 右侧：当前厂商游戏网格 -->
    <div class="games-panel">
      <div v-if="loading" class="games-loading">
        <van-loading type="spinner" size="28px" vertical>carregando...</van-loading>
      </div>
      <div v-else class="games-grid">
        <button
          v-for="g in displayedGames"
          :key="g.id"
          type="button"
          class="grid-game-card"
          @click="handleGameClick(g)"
        >
          <img :src="g.cover" :alt="g.title" class="grid-cover" />
          <div class="grid-gradient" />
          <div class="grid-text">
            <div class="grid-title">{{ g.title }}</div>
            <div class="grid-sub">{{ g.subtitle }}</div>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { GAME_PROVIDER_CARDS, fetchGamesByProvider, type ProviderGridGame } from '../homeConfig';

const selectedProviderId = ref<any>(GAME_PROVIDER_CARDS?.[0]?.id ?? '');
const displayedGames = ref<ProviderGridGame[]>([]);
const loading = ref(false);

const loadGames = async (providerId: string): Promise<any> => {
  loading.value = true;
  displayedGames.value = [];
  try {
    displayedGames.value = await fetchGamesByProvider(providerId);
  } finally {
    loading.value = false;
  }
  return;
};

function selectProvider(id: string) {
  if (id === selectedProviderId.value) return;
  selectedProviderId.value = id;
  loadGames(id);
}

const handleGameClick = (game: ProviderGridGame) => {
  console.log('Game clicked:', game.title, game.id);
};

onMounted(() => {
  if (selectedProviderId.value) {
    loadGames(selectedProviderId.value);
  }
});
</script>

<style scoped lang="less">
@neon: #62c151;
@neon-soft: rgba(57, 255, 20, 0.35);
@panel: rgba(5, 10, 5, 0.92);
@border-card: rgba(57, 255, 20, 0.45);

.game-board {
  display: flex;
  gap: 16px;
  width: 100%;
  align-items: flex-start;
  box-sizing: border-box;
}

.provider-sidebar {
  flex: 0 0 256px;
  display: flex;
  flex-direction: column;
  gap: 28px;
  max-width: 42vw;
}

.provider-card {
  margin: 0;
  padding: 0;
  width: 100%;
  border: 1px solid @border-card;
  border-radius: 12px;
  background: @panel;
  cursor: pointer;
  text-align: left;
  transition:
    box-shadow 0.25s ease,
    border-color 0.25s ease,
    transform 0.2s ease;
  box-shadow: 0 0 0 rgba(57, 255, 20, 0);
  position: relative;

  &:active {
    transform: scale(0.98);
  }

  &.active {
    border-color: @neon;
    box-shadow:
      0 0 8px @neon-soft,
      0 0 10px rgba(57, 255, 20, 0.25),
      inset 0 0 0 1px rgba(57, 255, 20, 0.6);

    .provider-badge {
      box-shadow: 0 0 8px rgba(57, 255, 20, 0.45);
    }
  }
}

.provider-badge {
  position: absolute;
  width: 202px;
  height: 50px;
  left: 50%;
  top: -14px;
  transform: translateX(-50%);
  border-radius: 20px;

  img {
    width: 100%;
    height: 100%;
  }
}

.provider-rows {
  padding: 40px 10px 12px;
  background-color: #062214;
  border-radius: 12px;
}

.provider-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 0;
  position: relative;

  &:not(:first-child)::before {
    content: '';
    display: block;
    width: 100%;
    height: 2px;
    position: absolute;
    top: 0;
    background-image: url('@/assets/imgs/home/xian.png');
    background-repeat: no-repeat;
    background-position: left 0 top 0;
    background-size: 100%;
  }
}

.row-avatar,
.row-flag {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.row-balance {
  margin-left: auto;
  font-size: 14px;
  font-weight: 700;
  white-space: nowrap;
}

.currency {
  font-weight: 800;
  margin-right: 2px;
}

.games-panel {
  flex: 1;
  min-width: 0;
  min-height: 200px;
}

.games-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 220px;
  color: rgba(255, 255, 255, 0.65);
}

.games-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

.grid-game-card {
  position: relative;
  margin: 0;
  padding: 0;
  border: none;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  aspect-ratio: 3 / 4;
  background: #0a120a;
  transition: transform 0.2s ease;

  &:active {
    transform: scale(0.97);
  }
}

.grid-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.grid-gradient {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 52%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, transparent 100%);
  pointer-events: none;
}

.grid-text {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 10px 8px 8px;
  text-align: left;
  pointer-events: none;
}

.grid-title {
  font-size: 13px;
  font-weight: 900;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  line-height: 1.2;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
}

.grid-sub {
  margin-top: 4px;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.55);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.grid-badge {
  position: absolute;
  right: 6px;
  bottom: 42px;
  min-width: 28px;
  padding: 2px 6px;
  border-radius: 4px;
  background: linear-gradient(180deg, #f59e0b 0%, #d97706 100%);
  color: #1a0a00;
  font-size: 11px;
  font-weight: 800;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35);
}

@media (max-width: 380px) {
  .game-board {
    flex-direction: column;
  }

  .provider-sidebar {
    flex: none;
    max-width: none;
    width: 100%;
    flex-direction: row;
    flex-wrap: nowrap;
    overflow-x: auto;
    gap: 10px;
    padding-bottom: 4px;
    -webkit-overflow-scrolling: touch;

    .provider-card {
      flex: 0 0 168px;
    }
  }

  .games-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
