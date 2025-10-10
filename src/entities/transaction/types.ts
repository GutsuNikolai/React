export type Category = "food" | "salary" | "transport" | "entertainment" | "other";
export type Currency = "USD" | "EUR" | "MDL";

export type Transaction = {
  id: string;
  title: string;
  amount: number;      // <0 расход, >0 доход
  createdAt: number;
  category: Category;
  currency: Currency;  // ← добавили
};
