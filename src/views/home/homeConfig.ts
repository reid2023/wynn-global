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

// ---------- 游戏厂商 + 各厂商游戏列表（可后续替换为接口） ----------
/** public/flag 的 URL 前缀（含 BASE_URL，与 Vite 部署子路径一致） */
const _appBase = import.meta.env.BASE_URL || '/';
const FLAG_PUBLIC_PREFIX = `${_appBase.endsWith('/') ? _appBase : `${_appBase}/`}flag/`;

/**
 * 国家/地区码 → 国旗图 URL（文件在 public/flag，文件名可与 ISO 不一致）
 */
export const GAME_COUNTRIES_FLAG_MAP: Record<string, string> = {
  br: `${FLAG_PUBLIC_PREFIX}bra.png`,
  de: `${FLAG_PUBLIC_PREFIX}Germany.png`,
  jp: `${FLAG_PUBLIC_PREFIX}jb.png`,
  us: `${FLAG_PUBLIC_PREFIX}USA.png`,
  ar: `${FLAG_PUBLIC_PREFIX}urg.png`,
  hu: `${FLAG_PUBLIC_PREFIX}hungary.png`,
};

const FLAG_CODES = Object.keys(GAME_COUNTRIES_FLAG_MAP);

const avatarUrl = new URL('@/assets/imgs/public/tx_big.png', import.meta.url).href;
const brFlag = GAME_COUNTRIES_FLAG_MAP.br;
const deFlag = GAME_COUNTRIES_FLAG_MAP.de;

/**
 * 厂商图标：必须用相对「本文件」的路径，new URL 不会解析 @ 别名（动态时必挂）。
 * 本文件在 src/views/home/，资源在 src/assets/imgs/company/
 */
const companyPngUrl = (n: number) =>
  new URL(`../../assets/imgs/company/${n}.png`, import.meta.url).href;

/** 厂商图标 company/1.png ~ company/33.png */
const buildGameCompanyMap = (): Record<number, string> => {
  const map: Record<number, string> = {};
  for (let n = 1; n <= 33; n++) {
    map[n] = companyPngUrl(n);
  }
  return map;
};

export const GAME_COMPANY_MAP = buildGameCompanyMap();

/**
 * 玩家头像图
 */
const avatarDir = [
  // '/avatar/asia',
  '/avatar/europe',
  // '/avatar/landscape',
  '/avatar/other',
];

const buildGameAvatarMap = (): string[] => {
  const list: string[] = [];

  for (const dir of avatarDir) {
    if (dir === '/avatar/europe') {
      for (let n = 1; n <= 100; n++) {
        list.push(`${dir}/fj${n}.png`);
      }
    } else if (dir === '/avatar/asia' || dir === '/avatar/landscape' || dir === '/avatar/other') {
      for (let n = 1; n <= 50; n++) {
        list.push(`${dir}/fj${n}.png`);
      }
    }
  }

  return list;
};

export const GAME_AVATAR_MAP = buildGameAvatarMap();

/** 随机金额：整数部分为 3～5 位（100.00～99999.99），带两位小数 */
export function randomPlayerBalance(): string {
  const digitCount = 3 + Math.floor(Math.random() * 3);
  const min = 10 ** (digitCount - 1);
  const max = 10 ** digitCount - 1;
  const intPart = Math.floor(Math.random() * (max - min + 1)) + min;
  const cents = Math.floor(Math.random() * 100);
  return `${intPart}.${String(cents).padStart(2, '0')}`;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

/**
 * 生成若干条随机玩家行（头像 / 国旗 / 金额均随机）
 * @param count 条数，默认 100
 */
export function generateRandomPlayerRows(count = 100): PlayerInfo[] {
  const avatars = GAME_AVATAR_MAP.length > 0 ? GAME_AVATAR_MAP : [avatarUrl];
  const rows: PlayerInfo[] = [];
  for (let i = 0; i < count; i++) {
    const code = pickRandom(FLAG_CODES);
    rows.push({
      avatar: pickRandom(avatars),
      countryImg: GAME_COUNTRIES_FLAG_MAP[code]!,
      balance: randomPlayerBalance(),
    });
  }
  return rows;
}

/** 预生成的 100 条随机玩家数据（可直接用于调试/列表） */
export const RANDOM_PLAYER_ROWS_100 = generateRandomPlayerRows(100);
