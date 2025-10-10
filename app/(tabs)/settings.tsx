import { useTransactions } from "@entities/transaction/model/transactions-context";
import { View, Text, ScrollView, Pressable, Alert } from "react-native";

export default function SettingsScreen() {
  const { clearAll } = useTransactions();

  const onClearAll = () => {
    Alert.alert("Clear data", "Delete all transactions?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          clearAll();
          Alert.alert("Done", "All transactions removed");
        },
      },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "700" }}>Settings</Text>

      <View style={{ backgroundColor: "#fff", borderRadius: 12, padding: 14, gap: 10, borderWidth: 1, borderColor: "#e5e7eb" }}>
        <Text style={{ fontSize: 16, fontWeight: "600", color: "#ef4444" }}>Danger zone</Text>
        <Pressable
          onPress={onClearAll}
          style={{ paddingVertical: 12, borderRadius: 12, backgroundColor: "#ef4444", alignItems: "center" }}
        >
          <Text style={{ color: "#fff", fontWeight: "700" }}>Clear all transactions</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
