import type { Currency } from "@entities/transaction/types";

// "стабильные" константы для отображения (можешь подправить)
export const USD_PER: Record<Currency, number> = {
  USD: 1,       // 1 USD = 1 USD
  EUR: 1.08,    // 1 EUR ≈ 1.08 USD
  MDL: 0.056,   // 1 MDL ≈ 0.056 USD
};

export function toUSD(amount: number, currency: Currency) {
  // amount уже со знаком: <0 расход, >0 доход
  return amount * USD_PER[currency];
}
