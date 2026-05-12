/**
 * 首页配置 - 集中管理首页所有数据配置
 * 设计尺寸：750px，内容区：25px边距 + 700px宽度
 */

// ==================== 类型定义 ====================

export interface BannerItem {
  id: number;
  image: string;
  title: string;
  link?: string;
}

export interface MarqueeItem {
  id: number;
  playerName: string;
  amount: string;
  timestamp: string;
}

export interface GameCard {
  id: number;
  title: string;
  image: string;
  players?: PlayerInfo[];
  link?: string;
}

export interface PlayerInfo {
  avatar: string;
  countryImg: string;
  balance: string;
}

export interface NavMenuItem {
  icon: string;
  label: string;
  value: string;
}

/** 首页左侧游戏厂商卡片 */
export interface GameProviderCard {
  id: string;
  name: string;
  icon: string;
  rows: PlayerInfo[];
}

/** 右侧厂商下的游戏格子项 */
export interface ProviderGridGame {
  id: number;
  title: string;
  subtitle: string;
  cover: string;
}

// ==================== 配置常量 ====================

/**
 * 页面布局配置
 */
export const LAYOUT_CONFIG = {
  designWidth: 750, // 设计稿宽度
  contentPadding: 25, // 内容区边距
  contentWidth: 700, // 内容区宽度
};

/**
 * 顶部轮播图配置
 */
export const BANNER_ITEMS: BannerItem[] = [
  {
    id: 1,
    image: new URL('@/assets/imgs/home/banner1.png', import.meta.url).href,
    title: 'Banner 1',
  },
  {
    id: 2,
    image: new URL('@/assets/imgs/home/banner2.png', import.meta.url).href,
    title: 'Banner 2',
  },
  {
    id: 3,
    image: new URL('@/assets/imgs/home/banner3.png', import.meta.url).href,
    title: 'Banner 3',
  },
  {
    id: 4,
    image: new URL('@/assets/imgs/home/banner4.png', import.meta.url).href,
    title: 'Banner 4',
  },
];

/**
 * 跑马灯数据 - 实时玩家中奖数据
 */
export const MARQUEE_ITEMS: MarqueeItem[] = [
  { id: 1, playerName: 'Player_001', amount: '+R$12,323.23', timestamp: '刚刚' },
  { id: 2, playerName: 'Player_002', amount: '+R$8,765.50', timestamp: '1分钟前' },
  { id: 3, playerName: 'Player_003', amount: '+R$15,432.00', timestamp: '5分钟前' },
  { id: 4, playerName: 'Player_004', amount: '+R$6,543.75', timestamp: '10分钟前' },
  { id: 5, playerName: 'Player_005', amount: '+R$9,876.25', timestamp: '15分钟前' },
];

/**
 * 快速导航菜单 - 主界面4个按钮
 */
export const NAV_ITEMS: NavMenuItem[] = [
  {
    icon: new URL('@/assets/imgs/home/vip.png', import.meta.url).href,
    label: 'VIP',
    value: 'vip',
  },
  {
    icon: new URL('@/assets/imgs/home/mrlj.png', import.meta.url).href,
    label: 'Diário',
    value: 'daily',
  },
  {
    icon: new URL('@/assets/imgs/home/yqhy.png', import.meta.url).href,
    label: 'Convidar',
    value: 'invite',
  },
  {
    icon: new URL('@/assets/imgs/home/hg.png', import.meta.url).href,
    label: 'Licenciado',
    value: 'licensed',
  },
];

/**
 * 热门游戏卡片列表
 */
export const GAME_CARDS: GameCard[] = [
  {
    id: 1,
    title: 'ÇARKIFELEK',
    image: new URL('@/assets/imgs/home/k1.png', import.meta.url).href,
    players: [
      {
        avatar: new URL('@/assets/imgs/public/tx_big.png', import.meta.url).href,
        countryImg: new URL('@/assets/imgs/country/br.png', import.meta.url).href,
        balance: '11123.11',
      },
      {
        avatar: new URL('@/assets/imgs/public/tx_big.png', import.meta.url).href,
        countryImg: new URL('@/assets/imgs/country/de.png', import.meta.url).href,
        balance: '12323.23',
      },
    ],
  },
  {
    id: 2,
    title: '100',
    image: new URL('@/assets/imgs/home/k2.png', import.meta.url).href,
    players: [
      {
        avatar: new URL('@/assets/imgs/public/tx_big.png', import.meta.url).href,
        countryImg: new URL('@/assets/imgs/country/br.png', import.meta.url).href,
        balance: '1323.23',
      },
      {
        avatar: new URL('@/assets/imgs/public/tx_big.png', import.meta.url).href,
        countryImg: new URL('@/assets/imgs/country/de.png', import.meta.url).href,
        balance: '123.89',
      },
    ],
  },
  {
    id: 3,
    title: 'VIP',
    image: new URL('@/assets/imgs/home/k3.png', import.meta.url).href,
    players: [
      {
        avatar: new URL('@/assets/imgs/public/tx_big.png', import.meta.url).href,
        countryImg: new URL('@/assets/imgs/country/br.png', import.meta.url).href,
        balance: '884.23',
      },
      {
        avatar: new URL('@/assets/imgs/public/tx_big.png', import.meta.url).href,
        countryImg: new URL('@/assets/imgs/country/de.png', import.meta.url).href,
        balance: '6623.11',
      },
    ],
  },
];

// ---------- 游戏厂商 + 各厂商游戏列表（可后续替换为接口） ----------

const avatarUrl = new URL('@/assets/imgs/public/tx_big.png', import.meta.url).href;
const brFlag = new URL('@/assets/imgs/country/br.png', import.meta.url).href;
const deFlag = new URL('@/assets/imgs/country/de.png', import.meta.url).href;

export const GAME_PROVIDER_CARDS: GameProviderCard[] = [
  {
    id: 'ct',
    name: 'CT INTERACTIVE',
    icon: new URL('@/assets/imgs/company/1.png', import.meta.url).href,
    rows: [
      { avatar: avatarUrl, countryImg: brFlag, balance: '1234.56' },
      { avatar: avatarUrl, countryImg: deFlag, balance: '8765.43' },
    ],
  },
  {
    id: 'agt',
    name: 'AGT SOFTWARE',
    icon: new URL('@/assets/imgs/company/2.png', import.meta.url).href,
    rows: [
      { avatar: avatarUrl, countryImg: deFlag, balance: '2341.09' },
      { avatar: avatarUrl, countryImg: brFlag, balance: '5520.88' },
    ],
  },
  {
    id: 'pg',
    name: 'PG SOFT',
    icon: new URL('@/assets/imgs/company/3.png', import.meta.url).href,
    rows: [
      { avatar: avatarUrl, countryImg: brFlag, balance: '998.12' },
      { avatar: avatarUrl, countryImg: deFlag, balance: '3400.00' },
    ],
  },
  {
    id: 'pp',
    name: 'PRAGMATIC PLAY',
    icon: new URL('@/assets/imgs/company/4.png', import.meta.url).href,
    rows: [
      { avatar: avatarUrl, countryImg: brFlag, balance: '7654.32' },
      { avatar: avatarUrl, countryImg: deFlag, balance: '1122.45' },
    ],
  },
];

const gameUrl =
  'https://content001.bet365.com/Games/SGP/GamePodImages/ChineseTigers_1000x400_With-Character.jpg';

const GAMES_BY_PROVIDER: Record<string, ProviderGridGame[]> = {
  ct: [
    {
      id: 101,
      title: 'RIP CITY',
      subtitle: 'CT INTERACTIVE',
      cover: gameUrl,
    },
    { id: 102, title: 'FORTUNE BINGO', subtitle: 'CT INTERACTIVE', cover: gameUrl },
    { id: 103, title: 'ULTRA WHEEL', subtitle: 'CT INTERACTIVE', cover: gameUrl },
    { id: 104, title: 'ÇARKIFELEK', subtitle: 'CT INTERACTIVE', cover: gameUrl },
    { id: 105, title: '100', subtitle: 'CT INTERACTIVE', cover: gameUrl },
    { id: 106, title: 'VIP', subtitle: 'CT INTERACTIVE', cover: gameUrl },
  ],
  agt: [
    { id: 201, title: 'NIGHT OWL', subtitle: 'AGT SOFTWARE', cover: gameUrl },
    { id: 202, title: 'LUCKY SPIN', subtitle: 'AGT SOFTWARE', cover: gameUrl },
    { id: 203, title: 'GOLD RUSH', subtitle: 'AGT SOFTWARE', cover: gameUrl },
    { id: 204, title: 'MEGA LINE', subtitle: 'AGT SOFTWARE', cover: gameUrl },
    { id: 205, title: 'RIO BLAST', subtitle: 'AGT SOFTWARE', cover: gameUrl },
    { id: 206, title: 'SAMBA WIN', subtitle: 'AGT SOFTWARE', cover: gameUrl },
  ],
  pg: [
    { id: 301, title: 'DRAGON HATCH', subtitle: 'PG SOFT', cover: gameUrl },
    { id: 302, title: 'SWEET BONANZA', subtitle: 'PG SOFT', cover: gameUrl },
    { id: 303, title: 'TREE GOLD', subtitle: 'PG SOFT', cover: gameUrl },
    { id: 304, title: 'JUNGLE RUN', subtitle: 'PG SOFT', cover: gameUrl },
    { id: 305, title: 'COIN PARTY', subtitle: 'PG SOFT', cover: gameUrl },
    { id: 306, title: 'STAR FALL', subtitle: 'PG SOFT', cover: gameUrl },
  ],
  pp: [
    { id: 401, title: 'BIG BASS', subtitle: 'PRAGMATIC PLAY', cover: gameUrl },
    { id: 402, title: 'GATES OF OLYMPUS', subtitle: 'PRAGMATIC PLAY', cover: gameUrl },
    { id: 403, title: 'SUGAR RUSH', subtitle: 'PRAGMATIC PLAY', cover: gameUrl },
    { id: 404, title: 'FRUIT PARTY', subtitle: 'PRAGMATIC PLAY', cover: gameUrl },
    { id: 405, title: 'WILD WEST', subtitle: 'PRAGMATIC PLAY', cover: gameUrl },
    {
      id: 406,
      title: 'MAGIC BOOK',
      subtitle: 'PRAGMATIC PLAY',
      cover: gameUrl,
    },
  ],
};

/**
 * 模拟按厂商拉取游戏列表（后续换成真实 API）
 */
export async function fetchGamesByProvider(providerId: string): Promise<ProviderGridGame[]> {
  await new Promise((r) => setTimeout(r, 320));
  return GAMES_BY_PROVIDER[providerId] ?? [];
}
