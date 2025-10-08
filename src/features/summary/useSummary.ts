import { useMemo } from "react";
import type { Transaction } from "@entities/transaction/model/transactions-context";
import { makeDailyNetSeries, makeExpenseByCategory } from "@shared/lib/series";

export function useSummary(transactions: Transaction[]) {
  return useMemo(() => {
    const income = transactions.reduce((s, t) => s + (t.amount > 0 ? t.amount : 0), 0);
    const expense = transactions.reduce((s, t) => s + (t.amount < 0 ? Math.abs(t.amount) : 0), 0);
    const balance = income - expense;

    const linePoints = makeDailyNetSeries(transactions, 14);
    const catRaw = makeExpenseByCategory(transactions).map(d => ({
      ...d,
      x: String(d.x).toLowerCase(),
    }))

    // Top-6 категорий + "other"
    const sorted = [...catRaw].sort((a, b) => Number(b.y) - Number(a.y));
    const top = sorted.slice(0, 6);
    const rest = sorted.slice(6).reduce((s, d) => s + Number(d.y), 0);
    if (rest > 0 && !top.find(t => String(t.x) === "other")) {
      top.push({ x: "other", y: rest, label: "" });
    }

    return {
      income,
      expense,
      balance,
      linePoints,
      catLabels: top.map(d => String(d.x)),
      catValues: top.map(d => Number(d.y)),
    };
  }, [transactions]);
}
