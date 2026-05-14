import type { ApiResponse } from './api';
import type { PlayerInfo } from '@/views/home/homeConfig';

/**
 * 游戏分类Item
 */
export interface GameCategoryItem {
  id: number;
  title: string;
  icon: string;
  wins?: PlayerInfo[];
}

/**
 * 游戏分类
 */
export type GameCategoryResponse = ApiResponse<GameCategoryItem[]>;

/**
 * 游戏列表 请求数据
 */
export interface GameListPayload {
  categoryIds?: any[];
  current?: number;
  size?: number;
}

export interface GameListItem {
  categoryId: number;
  gameId: string;
  id: number;
  image: string;
  name: string;
}

/**
 * 游戏列表
 */
export type GameListResponse = ApiResponse<Record<string, GameListItem[]>>;

/**
 * 打开游戏
 */
export type OpenGameResponse = ApiResponse<{
  url: string;
}>;
