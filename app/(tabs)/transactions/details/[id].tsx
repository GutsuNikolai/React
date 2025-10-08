import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, Button, Alert } from "react-native";
import { useTransactions } from "@entities/transaction/model/transactions-context";
import { formatShort } from "@shared/lib/date";

export default function TransactionDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { transactions, removeTransaction } = useTransactions();

  const tx = transactions.find((t) => t.id === id);

  if (!tx) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 16 }}>
        <Text style={{ fontWeight: "700", marginBottom: 8 }}>Not found</Text>
        <Button title="Back" onPress={() => router.back()} />
      </View>
    );
  }

  const onDelete = () => {
    Alert.alert("Delete", "Are you sure you want to delete this transaction?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          removeTransaction(tx.id);
          router.back();
        },
      },
    ]);
  };

  return (
    <View style={{ flex: 1, padding: 16, gap: 8 }}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>{tx.title}</Text>
      <Text style={{ color: "#6b7280" }}>{formatShort(tx.createdAt)}</Text>
      <Text style={{ fontSize: 18, fontWeight: "700", marginTop: 8, color: tx.amount >= 0 ? "#17a34a" : "#dc2626" }}>
        {tx.amount >= 0 ? "+" : ""}
        {tx.amount.toFixed(2)} $
      </Text>

      <View style={{ height: 16 }} />
      <Button title="Back" onPress={() => router.back()} />
      <View style={{ height: 8 }} />
      <Button title="Delete" color="#dc2626" onPress={onDelete} />
    </View>
  );
}
