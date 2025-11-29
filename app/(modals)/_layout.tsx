// import { Stack } from "expo-router";

// export default function ModalLayout() {
//   return (
//     <Stack screenOptions={{ presentation: "modal", headerTitle: "Add Transaction" }}>
//       <Stack.Screen name="add-transaction" />
//     </Stack>
//   );
// }
import { Stack } from "expo-router";

export default function ModalLayout() {
  return (
    <Stack
      screenOptions={{
        presentation: "modal",
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="add-transaction"
        options={{ title: "Add transaction" }}
      />

      <Stack.Screen
        name="edit-transaction/[id]"
        options={{ title: "Edit transaction" }}
      />
    </Stack>
  );
} 