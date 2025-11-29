import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text,Pressable, Button, Alert } from "react-native";
import { useTransactions } from "@entities/transaction/model/transactions-context";
import { formatShort } from "@shared/lib/date";
import { formatMoney } from "@/shared/currency";

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

   const onEdit = () => {
    router.push({ pathname: "/(modals)/edit-transaction/[id]", params: { id: tx.id } });
  };

  return (
    <View style={{ flex: 1, padding: 16, gap: 8 }}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>{tx.title}</Text>
      <Text style={{ color: "#6b7280" }}>{formatShort(tx.createdAt)}</Text>
  
      
      <View style={{ height: 16 }} />
        <Text
          style={{
            fontSize: 18,
            fontWeight: "700",
            marginTop: 8,
            color: tx.amount >= 0 ? "#17a34a" : "#dc2626",
          }}
        >
          {tx.amount >= 0 ? "+" : "-"}
          {formatMoney(Math.abs(tx.amount), tx.currency)}  {/* <-- вместо ...toFixed(2) + " $" */}
        </Text>

      <View style={{ height: 8 }} />

      {/* Back
      <Pressable
        onPress={() => router.back()}
        style={{
          alignItems: "center",
          paddingVertical: 12,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: "#e5e7eb",
          backgroundColor: "#fff",
          marginBottom: 8,
        }}
      >
        <Text>Back</Text>
      </Pressable> */}

      {/* Edit */}
      <Pressable
        onPress={onEdit}
        style={{
          alignItems: "center",
          paddingVertical: 12,
          borderRadius: 12,
          backgroundColor: "#6366f1",
          marginBottom: 8,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "700" }}>Edit</Text>
      </Pressable>

      {/* Delete (всегда красная) */}
      <Pressable
        onPress={onDelete}
        style={{
          alignItems: "center",
          paddingVertical: 12,
          borderRadius: 12,
          backgroundColor: "#dc2626",
        }}
      >
      <Text style={{ color: "#fff", fontWeight: "700" }}>Delete</Text>
      </Pressable>
    </View>
  );
}
