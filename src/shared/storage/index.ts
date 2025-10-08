import AsyncStorage from '@react-native-async-storage/async-storage';

const SCHEMA_VERSION_KEY = 'schema:version';
const APP_SCHEMA_VERSION = 1; // увеличивай при изменениях структуры

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
  if (v < 1 && to >= 1) {
    // здесь можно преобразовать старые транзакции
    // например, нормализовать названия категорий/добавить поле currency
    // const txns = await getItem<any[]>('transactions', []);
    // const fixed = txns.map(t => ({ currency: 'MDL', ...t, category: String(t.category).trim() }));
    // await setItem('transactions', fixed);
    v = 1;
  }

  // добавляй блоки 1->2, 2->3 и т.д.
}
