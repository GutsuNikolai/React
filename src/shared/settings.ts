import AsyncStorage from "@react-native-async-storage/async-storage";

const SETTINGS_KEY = "@ft:settings";

export type AppSettings = {
  currency: "USD" | "EUR" | "MDL";
  redForExpenses: boolean;
};

const DEFAULT_SETTINGS: AppSettings = {
  currency: "USD",
  redForExpenses: true,
};

export async function loadSettings(): Promise<AppSettings> {
  const raw = await AsyncStorage.getItem(SETTINGS_KEY);
  if (!raw) return DEFAULT_SETTINGS;
  try {
    const parsed = JSON.parse(raw) as Partial<AppSettings>;
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(next: AppSettings) {
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
}
