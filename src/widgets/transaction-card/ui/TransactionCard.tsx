import { View, Text, Pressable } from "react-native";
import { formatShort } from "@shared/lib/date";

type Props = {
  title: string;
  amount: number;
  createdAt?: number;
  category?: string;   // ←
  onPress?: () => void;
};

export function TransactionCard({ title, amount, createdAt, category, onPress }: Props) {
  const isPositive = amount >= 0;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
      <View style={{ padding: 12, borderWidth: 1, borderColor: "#e5e5e5", borderRadius: 10, marginVertical: 6, backgroundColor: "#fff" }}>
        <Text style={{ fontSize: 16, fontWeight: "600" }}>{title}</Text>
        <View style={{ flexDirection: "row", gap: 8 }}>
          {createdAt != null && <Text style={{ marginTop: 2, fontSize: 12, color: "#6b7280" }}>{formatShort(createdAt)}</Text>}
          {category && <Text style={{ marginTop: 2, fontSize: 12, color: "#9ca3af" }}>• {category}</Text>}
        </View>
        <Text style={{ marginTop: 4, fontSize: 15, fontWeight: "600", color: isPositive ? "#17a34a" : "#dc2626" }}>
          {isPositive ? "+" : ""}{amount.toFixed(2)} $
        </Text>
      </View>
    </Pressable>
  );
}
