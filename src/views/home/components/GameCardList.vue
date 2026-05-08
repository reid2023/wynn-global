<template>
  <div class="game-card-list">
    <div v-for="game in GAME_CARDS" :key="game.id" class="game-card" @click="handleGameClick(game)">
      <!-- 卡片内容层 -->
      <div class="card-content">
        <!-- 左侧：标题和描述 -->
        <div class="card-left">
          <img :src="game.image" :alt="game.title" class="card-image" />
        </div>

        <!-- 右侧：玩家信息 -->
        <div class="card-right">
          <div class="players-info">
            <div v-for="(player, idx) in game.players" :key="idx" class="player-item">
              <div>
                <img
                  v-if="player.avatar"
                  :src="player.avatar"
                  :alt="`Player ${idx}`"
                  class="player-avatar"
                />
                <img
                  v-if="player.countryImg"
                  :src="player.countryImg"
                  :alt="`country ${idx}`"
                  class="player-country"
                />
                <span class="player-balance text-gradient-gold"
                  ><span class="balance-symbol">$</span> +{{ player.balance }}</span
                >
              </div>
            </div>
          </div>
          <button class="play-btn">Play</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { GAME_CARDS, type GameCard } from '../homeConfig';

const handleGameClick = (game: GameCard) => {
  console.log('Game clicked:', game.title);
  // router.push(`/game/${game.id}`);
};
</script>

<style scoped lang="less">
.game-card-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
}

.game-card {
  position: relative;
  height: 171px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.card-content {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  gap: 6px;
  box-sizing: border-box;
}

.card-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 0;

  .card-image {
    width: auto;
    height: 100%;
    object-fit: contain;
  }
}

.card-right {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 255px;
  gap: 8px;
  background: url('@/assets/imgs/home/di1.png') no-repeat center;
  background-size: 100% 100%;
  padding: 12px 18px;
}

.players-info {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.player-item {
  width: 100%;

  > div {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &:not(:last-child)::after {
    content: '';
    display: block;
    width: 220px;
    height: 4px;
    margin-top: 8px;
    margin-bottom: 8px;
    background: url('@/assets/imgs/home/xian.png') no-repeat center;
    background-size: 100% 100%;
  }
}

.player-country,
.player-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.player-balance {
  font-size: 16px;
  font-weight: 700;
  min-width: 0;
  text-align: right;
}

.balance-symbol {
  font-weight: 900;
  font-size: 16px;
}

.play-btn {
  background: url('@/assets/imgs/home/btn.png') no-repeat center;
  width: 100%;
  height: 37px;
  background-size: contain;
  color: var(--color-white);
  font-size: 20px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  margin-bottom: 4px;

  &:active {
    transform: scale(1.05);
  }
}
</style>
