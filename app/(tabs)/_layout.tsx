// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      initialRouteName="dashboard/index"
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen
        name="transactions"
        options={{ title: "Transactions" }}
      />
      <Tabs.Screen
        name="dashboard/index"
        options={{ title: "Dashboard" }}
      />
      
      <Tabs.Screen
        name="settings"
        options={{ title: "Settings" }}
      />

      {/* чтобы не появлялись «лишние» табы для папок-родителей */}
      <Tabs.Screen name="dashboard" options={{ href: null }} />
    </Tabs>
  );
}
