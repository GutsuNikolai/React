import { Stack } from "expo-router";

export default function ModalLayout() {
  return (
    <Stack screenOptions={{ presentation: "modal", headerTitle: "Add Transaction" }}>
      <Stack.Screen name="add-transaction" />
    </Stack>
  );
}
