import React from "react";
import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { useTransactions } from "@entities/transaction/model/transactions-context";
import type { Transaction } from "@entities/transaction/types";

export default function SettingsScreen() {
  const { transactions, clearAll } = useTransactions();

  // ---- маленький адаптер для кривых типов ----
  const FS = FileSystem as unknown as {
    cacheDirectory?: string;
    documentDirectory?: string;
    writeAsStringAsync: (uri: string, data: string, opts?: any) => Promise<void>;
  };
  const toCSV = (rows: Transaction[]) => {
    const header = ["id", "title", "amount", "createdAt", "category", "currency"].join(",");
    const body = rows
      .map((t) =>
        [
          t.id,
          t.title.replace(/"/g, '""'),
          t.amount,
          t.createdAt,
          t.category,
          t.currency,
        ]
          .map((v) => `"${String(v)}"`)
          .join(",")
      )
      .join("\n");
    return header + "\n" + body;
  };

  const onExportCSV = async () => {
    try {
      if (transactions.length === 0) {
        Alert.alert("Nothing to export", "No transactions found.");
        return;
      }

      const csv = toCSV(transactions);
      const baseDir = (FS.cacheDirectory ?? FS.documentDirectory ?? "") as string;
      const fileUri = `${baseDir}transactions_${Date.now()}.csv`;

       await FS.writeAsStringAsync(fileUri, csv);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: "text/csv",
          dialogTitle: "Export transactions",
        });
      } else {
        Alert.alert("Exported", `CSV saved to:\n${fileUri}`);
      }
    } catch (e) {
      console.warn(e);
      Alert.alert("Export failed", "Could not export CSV.");
    }
  };

  const onClearAll = () => {
    Alert.alert("Clear data", "Delete all transactions?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => (clearAll(), Alert.alert("Done", "All transactions removed")) },
    ]);
  };

  const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={{ backgroundColor: "#fff", borderRadius: 12, padding: 14, gap: 10, borderWidth: 1, borderColor: "#e5e7eb" }}>
      <Text style={{ fontSize: 16, fontWeight: "600" }}>{title}</Text>
      {children}
    </View>
  );

  const Btn = ({ label, danger, onPress }: { label: string; danger?: boolean; onPress: () => void }) => (
    <Pressable
      onPress={onPress}
      style={{ alignItems: "center", paddingVertical: 12, borderRadius: 12, backgroundColor: danger ? "#ef4444" : "#6366f1" }}
    >
      <Text style={{ color: "#fff", fontWeight: "700" }}>{label}</Text>
    </Pressable>
  );

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "700" }}>Settings</Text>

      <Card title="Export">
        <Btn label="Export transactions (CSV)" onPress={onExportCSV} />
        <Text style={{ color: "#6b7280" }}>Exports all transactions to a .csv file.</Text>
      </Card>

      <Card title="Danger zone">
        <Btn label="Clear all transactions" danger onPress={onClearAll} />
      </Card>
    </ScrollView>
  );
}
