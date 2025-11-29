import AsyncStorage from '@react-native-async-storage/async-storage';

const SCHEMA_VERSION_KEY = 'schema:version';
const APP_SCHEMA_VERSION = 2; // увеличивай при изменениях структуры

export async function getItem<T>(key: string, fallback: T): Promise<T> {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return fallback;
  try { return JSON.parse(raw) as T; }
  catch { return fallback; }
}

export async function setItem<T>(key: string, value: T) {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function ensureSchema() {
  const raw = await AsyncStorage.getItem(SCHEMA_VERSION_KEY);
  const current = raw ? Number(raw) : 0;

  if (current < APP_SCHEMA_VERSION) {
    await migrate(current, APP_SCHEMA_VERSION);
    await AsyncStorage.setItem(SCHEMA_VERSION_KEY, String(APP_SCHEMA_VERSION));
  }
}

// точка расширения для будущих миграций
async function migrate(from: number, to: number) {
  let v = from;

  // пример: 0 -> 1
  if (v < 2 && to >= 2) {
    // проставим currency: "USD" там, где его нет
    const raw = await AsyncStorage.getItem("@ft:transactions");
    const items = raw ? JSON.parse(raw) : [];
    const fixed = Array.isArray(items)
      ? items.map((t: any) => (t && !t.currency ? { ...t, currency: "USD" } : t))
      : [];
    await AsyncStorage.setItem("@ft:transactions", JSON.stringify(fixed));
    v = 2;
  }

  // добавляй блоки 1->2, 2->3 и т.д.
}
