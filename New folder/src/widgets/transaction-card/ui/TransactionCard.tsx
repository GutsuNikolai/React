import { View, Text, Pressable } from "react-native";
import { formatShort } from "@shared/lib/date";
import { useSettings } from "@/shared/settings-context";
import { formatAmountUSD } from "@/shared/currency";
import type { Category } from "@entities/transaction/types";
import { formatMoney } from "@/shared/currency";    

type Props = {
  id: string;
  title: string;
  amount: number;
  createdAt?: number;
  category?: Category;
  currency?: "USD" | "EUR" | "MDL";                    // ← добавили проп (передадим из списка)
  onPress?: () => void;
};

export function TransactionCard({ id, title, amount, createdAt, category, currency = "USD", onPress }: Props) {
  const isPositive = amount >= 0;

  return (
    <Pressable onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
      <View style={{ padding: 12, borderWidth: 1, borderColor: "#e5e5e5", borderRadius: 10, marginVertical: 6, backgroundColor: "#fff" }}>
        <Text style={{ fontSize: 16, fontWeight: "600" }}>{title}</Text>

        <View style={{ flexDirection: "row", gap: 8 }}>
          {createdAt != null && (
            <Text style={{ marginTop: 2, fontSize: 12, color: "#6b7280" }}>
              {formatShort(createdAt)}
            </Text>
          )}
          {category && (
            <Text style={{ marginTop: 2, fontSize: 12, color: "#9ca3af" }}>
              • {category}
            </Text>
          )}
           <Text
            style={{
              marginTop: 4,
              fontSize: 15,
              fontWeight: "700",
              color: amount >= 0 ? "#17a34a" : "#dc2626",
            }}
          >
            {amount >= 0 ? "+" : "-"}
            {formatMoney(Math.abs(amount), currency ?? "USD")} {/* <-- вместо ...toFixed(2) + " $" */}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
