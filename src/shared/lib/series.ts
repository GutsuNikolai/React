import type { Transaction } from "@entities/transaction/model/transactions-context";

export type Point = { x: number; y: number; label: string }; // ← добавили

function ymd(ts: number) {
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

export function makeDailyNetSeries(tx: Transaction[], days = 14): Point[] { // ← тип возвращаемого
  const end = new Date(); end.setHours(0,0,0,0);
  const labels: string[] = [];
  const map = new Map<string, number>();

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(end); d.setDate(end.getDate() - i);
    const key = ymd(+d);
    labels.push(key);
    map.set(key, 0);
  }

  for (const t of tx) {
    const key = ymd(t.createdAt);
    if (map.has(key)) map.set(key, (map.get(key) || 0) + t.amount);
  }

  return labels.map((key, idx) => ({ x: idx + 1, label: key.slice(5), y: map.get(key) || 0 }));
}

export function makeExpenseByCategory(tx: Transaction[]) {
  const map = new Map<string, number>();
  for (const t of tx) {
    if (t.amount < 0) {
      const key = t.category ?? "other";
      map.set(key, (map.get(key) || 0) + Math.abs(t.amount));
    }
  }
  // VictoryPie ждёт [{x, y, label}]
  return Array.from(map.entries()).map(([cat, sum]) => ({
    x: cat,
    y: sum,
    label: `${cat}: $${sum.toFixed(0)}`,
  }));
}