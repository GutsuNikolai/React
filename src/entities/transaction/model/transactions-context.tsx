import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ensureSchema } from '@/shared/storage'; // путь тот, где ты создал ensureSchema
 
export type Category = "food" | "salary" | "transport" | "entertainment" | "other";

export type Transaction = {
  id: string;
  title: string;
  amount: number;
  createdAt: number;
  category: Category; // ← новое
};

// addTransaction сигнатура:
type Ctx = {
  transactions: Transaction[];
  addTransaction: (t: Omit<Transaction, "id" | "createdAt">) => void;
  removeTransaction: (id: string) => void;
  isHydrated: boolean;
};

const TransactionsContext = createContext<Ctx | null>(null);
const STORAGE_KEY = "@ft:transactions";

const initial: Transaction[] = [
  { id: "t1", title: "Groceries", amount: -23.5, createdAt: Date.now() - 86400000, category: "food" },
  { id: "t2", title: "Salary",    amount: 1200,   createdAt: Date.now() - 2 * 86400000, category: "salary" },
  { id: "t3", title: "Coffee",    amount: -2.8,   createdAt: Date.now(),                 category: "food" },
];



function genId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function TransactionsProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(initial);
  const [isHydrated, setHydrated] = useState(false);
  const firstLoad = useRef(true);

  // 1) загрузка из AsyncStorage
  useEffect(() => {
  let alive = true;
  (async () => {
    // 1) гарантируем актуальную схему хранения
    await ensureSchema();

    // 2) дальше твоя прежняя логика:
    const raw = await AsyncStorage.getItem(STORAGE_KEY); // ← твой ключ
    const items = raw ? JSON.parse(raw) : [];

    if (!alive) return;
    setTransactions(items);
    setHydrated(true);
  })();

  return () => { alive = false; };
}, []);


  // 2) сохранение при изменениях (после гидратации)
  useEffect(() => {
    if (!isHydrated) return;
    // небольшая защита от первой записи поверх только что загруженных данных
    if (firstLoad.current) {
      firstLoad.current = false;
      return;
    }
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(transactions)).catch((e) =>
      console.warn("Failed to save transactions:", e)
    );
  }, [transactions, isHydrated]);

  const addTransaction: Ctx["addTransaction"] = (t) => {
    setTransactions((prev) => [{ id: genId(), createdAt: Date.now(), ...t }, ...prev]);
  };

  const removeTransaction: Ctx["removeTransaction"] = (id) => {
    setTransactions((prev) => prev.filter((x) => x.id !== id));
  };

  const value = useMemo(
    () => ({ transactions, addTransaction, removeTransaction, isHydrated }),
    [transactions, isHydrated]
  );

  return <TransactionsContext.Provider value={value}>{children}</TransactionsContext.Provider>;
}

export function useTransactions() {
  const ctx = useContext(TransactionsContext);
  if (!ctx) throw new Error("useTransactions must be used within TransactionsProvider");
  return ctx;
}
