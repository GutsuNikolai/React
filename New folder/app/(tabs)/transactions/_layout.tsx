import { Stack } from "expo-router";

export default function TransactionsStackLayout() {
  return (
    <Stack screenOptions={{ headerTitleAlign: "center" }}>
      <Stack.Screen name="index" options={{ title: "Transactions" }} />
      {/* <Stack.Screen name="add" options={{ title: "Add transaction" }} /> */}
    </Stack>
  );
}
