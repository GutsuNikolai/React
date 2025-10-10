import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { loadSettings, saveSettings, type AppSettings } from "@/shared/settings";

type Ctx = {
  settings: AppSettings;
  updateSettings: (patch: Partial<AppSettings>) => Promise<void>;
};

const SettingsContext = createContext<Ctx | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>({
    currency: "USD",
    redForExpenses: true,
  });

  useEffect(() => {
    (async () => setSettings(await loadSettings()))();
  }, []);

  const updateSettings = async (patch: Partial<AppSettings>) => {
    const next = { ...settings, ...patch };
    setSettings(next);
    await saveSettings(next);
  };

  const value = useMemo(() => ({ settings, updateSettings }), [settings]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
