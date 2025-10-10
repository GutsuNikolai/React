import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { TransactionsProvider, useTransactions } from "@entities/transaction/model/transactions-context";
import { View, ActivityIndicator } from "react-native";
import { SettingsProvider } from "@/shared/settings-context";


function AppStack() {
  const { isHydrated } = useTransactions();
  if (!isHydrated) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SettingsProvider>
      <TransactionsProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </TransactionsProvider>
    </SettingsProvider>
  );
}
