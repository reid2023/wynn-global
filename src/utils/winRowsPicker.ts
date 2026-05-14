import type { PlayerInfo } from '@/views/home/homeConfig';

type Batch = { i: number; j: number; t: number };

function pairKey(i: number, j: number): string {
  return i < j ? `${i}-${j}` : `${j}-${i}`;
}

/**
 * 从固定池子中每次取 2 条（浅拷贝），满足：
 * - 近 1 分钟内出现过的索引不能再出现；
 * - 近 10 次取样的「两条组合」（无序）不能重复。
 */
export function createWinRowsPicker(pool: readonly PlayerInfo[]) {
  const history: Batch[] = [];
  const n = pool.length;

  function pickTwo(): PlayerInfo[] {
    if (n < 2) {
      return pool.slice(0, 2).map((row) => ({ ...row }));
    }

    const now = Date.now();
    while (history.length > 0 && now - history[0].t > 120_000) {
      history.shift();
    }

    const forbiddenMinute = new Set<number>();
    for (const b of history) {
      if (now - b.t < 60_000) {
        forbiddenMinute.add(b.i);
        forbiddenMinute.add(b.j);
      }
    }

    const recentPairKeys = new Set(history.slice(-10).map((b) => pairKey(b.i, b.j)));

    const tryPick = (): [number, number] | null => {
      for (let k = 0; k < 500; k++) {
        const i = Math.floor(Math.random() * n);
        const j = Math.floor(Math.random() * n);
        if (i === j) continue;
        if (forbiddenMinute.has(i) || forbiddenMinute.has(j)) continue;
        if (recentPairKeys.has(pairKey(i, j))) continue;
        return [i, j];
      }
      for (let k = 0; k < 400; k++) {
        const i = Math.floor(Math.random() * n);
        const j = Math.floor(Math.random() * n);
        if (i === j) continue;
        if (forbiddenMinute.has(i) || forbiddenMinute.has(j)) continue;
        return [i, j];
      }
      for (let a = 0; a < n; a++) {
        for (let b = a + 1; b < n; b++) {
          if (forbiddenMinute.has(a) || forbiddenMinute.has(b)) continue;
          if (recentPairKeys.has(pairKey(a, b))) continue;
          return [a, b];
        }
      }
      return null;
    };

    const sol = tryPick();
    const [i, j] = sol ?? [0, 1];
    history.push({ i, j, t: now });
    return [{ ...pool[i] }, { ...pool[j] }];
  }

  return { pickTwo };
}
