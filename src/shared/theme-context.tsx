// import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
// import { Appearance, ColorSchemeName } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// type Mode = "light" | "dark" | "system";
// type Theme = {
//   mode: Mode;
//   setMode: (m: Mode) => void;
//   isDark: boolean;
//   colors: {
//     bg: string;
//     card: string;
//     border: string;
//     text: string;
//     muted: string;
//     accent: string;
//     danger: string;
//     success: string;
//   };
// };

// const KEY = "@ft:themeMode";
// const Ctx = createContext<Theme | null>(null);

// export function ThemeProvider({ children }: { children: React.ReactNode }) {
//   const [mode, setModeState] = useState<Mode>("system");
//   const sys = Appearance.getColorScheme();
//   const isDark = (mode === "system" ? sys : mode) === "dark";

//   useEffect(() => {
//     AsyncStorage.getItem(KEY).then((m) => { if (m === "light" || m === "dark" || m === "system") setModeState(m); });
//     const sub = Appearance.addChangeListener(({ colorScheme }) => {
//       if (mode === "system") {
//         // просто перерисуемся
//       }
//     });
//     return () => sub.remove();
//   }, []);

//   const setMode = (m: Mode) => {
//     setModeState(m);
//     AsyncStorage.setItem(KEY, m).catch(() => {});
//   };

//   const colors = isDark
//     ? { bg:"#0b1220", card:"#101827", border:"#1f2937", text:"#e5e7eb", muted:"#9ca3af", accent:"#6366f1", danger:"#ef4444", success:"#22c55e" }
//     : { bg:"#f3f4f6", card:"#ffffff", border:"#e5e7eb", text:"#111827", muted:"#6b7280", accent:"#6366f1", danger:"#ef4444", success:"#16a34a" };

//   const value = useMemo<Theme>(() => ({ mode, setMode, isDark, colors }), [mode, isDark]);
//   return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
// }

// export function useTheme() {
//   const ctx = useContext(Ctx);
//   if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
//   return ctx;
// }
