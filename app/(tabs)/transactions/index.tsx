// import { View, Text, FlatList, Button } from "react-native";
import { useRouter } from "expo-router";
import { TransactionCard } from "@widgets/transaction-card/ui/TransactionCard";
import { useTransactions } from "@entities/transaction/model/transactions-context";
import { View, Text,Pressable, SectionList, Button } from "react-native";
import React, { useMemo } from "react"; // ← добавь
import { Link } from "expo-router";
// import type { Transaction } from "@entities/transaction/model/transactions-context"; // ← тип для Map

const ymd = (ts: number) => {
  const d = new Date(ts); d.setHours(0,0,0,0);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
};
const humanDate = (ts: number) =>
  new Intl.DateTimeFormat(undefined, { day: "2-digit", month: "short", year: "numeric" }).format(new Date(ts));


export default function TransactionsScreen() {
  const router = useRouter();
  const { transactions } = useTransactions();

  // группируем по дню
  const sections = React.useMemo(() => {
    const groups = new Map<string, typeof transactions>();
    for (const t of transactions) {
      const key = ymd(t.createdAt);
      if (!groups.get(key)) groups.set(key, []);
      groups.get(key)!.push(t);
    }
    // сортировка по дате (свежие выше)
    const entries = Array.from(groups.entries()).sort((a, b) => (a[0] > b[0] ? -1 : 1));
    return entries.map(([key, items]) => ({
      title: humanDate(items[0].createdAt),
      data: items.sort((a, b) => b.createdAt - a.createdAt),
    }));
  }, [transactions]);

  return (
    <View style={{ flex: 1, padding: 16, paddingTop: 8 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <Text style={{ fontSize: 18, fontWeight: "700" }}>Transactions</Text>
        <Button title="Add" onPress={() => router.push("/transactions/add")} />
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderSectionHeader={({ section: { title } }) => (
          <View style={{ paddingVertical: 6 }}>
            <Text style={{ fontSize: 13, color: "#6b7280", fontWeight: "600" }}>{title}</Text>
          </View>
        )}
        stickySectionHeadersEnabled
        renderItem={({ item }) => (
          <TransactionCard
            title={item.title}
            amount={item.amount}
            createdAt={item.createdAt}
            category={item.category}
            onPress={() => router.push({ pathname: "/transactions/details/[id]", params: { id: item.id } })}
          />
        )}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 2 }} />}
      />
    </View>
  );
}
