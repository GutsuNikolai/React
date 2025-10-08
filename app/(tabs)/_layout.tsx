import { Tabs } from "expo-router";
// ...

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      {/* существующие вкладки */}
      <Tabs.Screen name="index" options={{ title: "Dashboard" }} />
      {/* ...твои другие экраны... */}

      {/* новая вкладка Settings */}
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          // tabBarIcon: ({ color, size }) => <SomeIcon color={color} size={size} />
        }}
      />
    </Tabs>
  );
}
