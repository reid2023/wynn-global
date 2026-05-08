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
