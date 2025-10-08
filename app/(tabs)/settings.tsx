import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Link } from "expo-router";
export default function SettingsScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style="auto" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingVertical: 20,
          gap: 12,
        }}
      >
        <Text style={{ fontSize: 24, fontWeight: "700" }}>Settings</Text>

        <View style={{ backgroundColor: "#fff", borderRadius: 12, padding: 14, gap: 8 }}>
          <Text style={{ fontSize: 16, fontWeight: "600" }}>About</Text>
          <Text style={{ color: "#6b7280" }}>
            Finance Tracker (MVP). Expo + expo-router. AsyncStorage for data.
          </Text>
        </View>
        <View style={{ backgroundColor: "#fff", borderRadius: 12, padding: 14, gap: 8 }}>
            <Text style={{ fontSize: 16, fontWeight: "600" }}>Actions</Text>
            
        </View>
        {/* сюда позже добавим тумблеры/кнопки (например, валюта, очистка демо-данных и т.д.) */}
      </ScrollView>
    </SafeAreaView>
    
  );
}

// опционально, чтобы красиво назывался таб
export const unstable_settings = {
  headerShown: true,
};
