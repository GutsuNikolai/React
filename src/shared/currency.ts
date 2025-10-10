// "стабильные" курсы для показа (относительно USD)
export const RATES = {
  USD: 1,
  EUR: 0.92,  // 1 USD ≈ 0.92 EUR
  MDL: 17.7,  // 1 USD ≈ 17.7 MDL
} as const;

export type Currency = keyof typeof RATES;

export const SYMBOL: Record<"USD"|"EUR"|"MDL", string> = {
  USD: "$",
  EUR: "€",
  MDL: "L",    // можешь заменить на "MDL"
};

export function convertFromUSD(amountUSD: number, to: Currency) {
  // amount хранится как “базовый” (условно USD) — конвертируем для отображения
  return amountUSD * RATES[to];
}

export function formatMoney(amountAbs: number, currency: "USD"|"EUR"|"MDL") {
  return `${SYMBOL[currency]}${amountAbs.toFixed(2)}`;
}

export function formatAmountUSD(amountUSD: number, to: Currency) {
  const v = convertFromUSD(amountUSD, to);
  // округляем до 2 знаков
  return `${SYMBOL[to]}${v.toFixed(2)}`;
}
