import { useMemo } from "react";
import { useTransactions } from "@entities/transaction/model/transactions-context";
import type { Transaction } from "@entities/transaction/types";
import { toUSD } from "@/shared/rates";

const ymd = (ts: number) => {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
};

const human = (ts: number) =>
  new Intl.DateTimeFormat(undefined, { day: "2-digit", month: "short" }).format(new Date(ts));

export function useSummary() {
  const { transactions } = useTransactions();

  return useMemo(() => {
    const list = transactions as Transaction[];

    // 1) totals in USD
    let incomeUSD = 0;
    let expenseUSD = 0;
    for (const t of list) {
      const usd = toUSD(t.amount, t.currency);
      if (usd >= 0) incomeUSD += usd;
      else expenseUSD += -usd;
    }
    const balanceUSD = incomeUSD - expenseUSD;

    // 2) net by last 14 days (in USD)
    const days = 14;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const byDay = new Map<string, number>();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      byDay.set(ymd(d.getTime()), 0);
    }
    for (const t of list) {
      const k = ymd(t.createdAt);
      if (byDay.has(k)) {
        byDay.set(k, (byDay.get(k) || 0) + toUSD(t.amount, t.currency));
      }
    }
    const linePoints = Array.from(byDay.entries()).map(([key, sum]) => ({
      label: human(new Date(key).getTime()),
      y: Number(sum.toFixed(2)),
    }));

    // 3) expenses by category (USD, absolute)
    const catMap = new Map<string, number>();
    for (const t of list) {
      if (t.amount < 0) {
        const v = Math.abs(toUSD(t.amount, t.currency));
        catMap.set(t.category, (catMap.get(t.category) || 0) + v);
      }
    }
    const catEntries = Array.from(catMap.entries()).sort((a, b) => b[1] - a[1]);
    const catLabels = catEntries.map(([c]) => c);
    const catValues = catEntries.map(([, v]) => Number(v.toFixed(0)));

    return { incomeUSD, expenseUSD, balanceUSD, linePoints, catLabels, catValues };
  }, [transactions]);
}
