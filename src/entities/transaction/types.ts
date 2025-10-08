export type Category = "food" | "salary" | "transport" | "entertainment" | "other";

export type Transaction = {
  id: string;
  title: string;
  amount: number;
  createdAt: number;   // epoch ms
  category: Category;
};
