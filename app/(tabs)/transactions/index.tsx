import React from "react";
import { View, Text, SectionList } from "react-native";
import { Stack, useRouter } from "expo-router";
import { TransactionCard } from "@widgets/transaction-card/ui/TransactionCard";
import { useTransactions } from "@entities/transaction/model/transactions-context";

const ymd = (ts: number) => {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
};
const humanDate = (ts: number) =>
  new Intl.DateTimeFormat(undefined, { day: "2-digit", month: "short", year: "numeric" }).format(
    new Date(ts)
  );

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
    const entries = Array.from(groups.entries()).sort((a, b) => (a[0] > b[0] ? -1 : 1));
    return entries.map(([_, items]) => ({
      title: humanDate(items[0].createdAt),
      data: items.sort((a, b) => b.createdAt - a.createdAt),
    }));
  }, [transactions]);

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false
        }}
      />

      <View style={{ flex: 1, padding: 16, paddingTop: 8 }}>
        {transactions.length === 0 ? (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 16 }}>
            <Text style={{ color: "#6b7280" }}>No transactions yet</Text>
          </View>
        ) : (
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
                id={item.id}
                title={item.title}
                amount={item.amount}
                createdAt={item.createdAt}
                category={item.category}
                currency={item.currency} 
                onPress={() =>
                  router.push({ pathname: "/transactions/details/[id]", params: { id: item.id } })
                }
              />
            )}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{ height: 2 }} />}
          />
        )}
      </View>
    </>
  );
}
