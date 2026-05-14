/**
 * 登录相关的 API 接口
 */
import api from './api';
import {
  GameCategoryResponse,
  GameListPayload,
  GameListResponse,
  OpenGameResponse,
} from '@/types/game';

/**
 * 游戏分类
 */
export async function getGameCategory(): Promise<GameCategoryResponse> {
  return await api.post<GameCategoryResponse>('/game/category');
}

/**
 * 游戏列表
 */
export async function getGameList(payload?: GameListPayload): Promise<GameListResponse> {
  return await api.post<GameListResponse>('/game/list', payload);
}

/**
 * 打开游戏
 */
export async function openGame(gameId: string | number): Promise<OpenGameResponse> {
  return await api.post<OpenGameResponse>('/game/openGame', { gameId });
}
