import { Tabs, Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; // ← иконки

export default function TabsLayout() {
  return (
    <Tabs
      initialRouteName="dashboard/index"
      screenOptions={{
        headerShown: true,
        headerTitleAlign: "center",
        headerTitleStyle: { fontWeight: "700", fontSize: 22 },
        tabBarActiveTintColor: "#2563eb",   // цвет активной
        tabBarInactiveTintColor: "#6b7280", // цвет неактивной
      }}
    >
      <Tabs.Screen
        name="transactions"
        options={{
          title: "Transactions",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "receipt" : "receipt-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="dashboard/index"
        options={{
          title: "Summary",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "stats-chart" : "stats-chart-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "settings" : "settings-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* глушим лишние авто-маршруты, если нужно */}
      <Tabs.Screen name="dashboard" options={{ href: null }} />
      <Tabs.Screen name="index" options={{ href: null }} />
    </Tabs>
  );
}
