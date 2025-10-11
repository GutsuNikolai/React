// app/(tabs)/settings.tsx
import React from "react";
import { View, Text, ScrollView, Pressable, Alert } from "react-native";
// ВАЖНО: легаси-API (SDK 54+)
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { useTransactions } from "@entities/transaction/model/transactions-context";
import type { Transaction } from "@entities/transaction/types";
import * as LocalAuth from "expo-local-authentication";
import { setBiometricRequired, isBiometricRequired } from "@/shared/biometric";

export default function SettingsScreen() {
  const { transactions, clearAll } = useTransactions();

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

  const [bioOn, setBioOn] = React.useState(false);
  React.useEffect(() => { isBiometricRequired().then(setBioOn).catch(() => {}); }, []);

  const toggleBiometric = async () => {
    try {
      if (!bioOn) {
        const hw = await LocalAuth.hasHardwareAsync();
        const enrolled = await LocalAuth.isEnrolledAsync();
        if (!hw || !enrolled) { 
          Alert.alert("Not available", "Biometric authentication is not available on this device."); 
          return; 
        }
        const res = await LocalAuth.authenticateAsync({ promptMessage: "Enable biometric unlock" });
        if (!res.success) return;
        await setBiometricRequired(true);
        setBioOn(true);
      } else {
        await setBiometricRequired(false);
        setBioOn(false);
      }
    } catch (e) {
      console.warn(e);
      Alert.alert("Error", "Could not change biometric setting.");
    }
  };

  const onExportCSV = async () => {
    try {
      if (transactions.length === 0) {
        Alert.alert("Nothing to export", "No transactions found.");
        return;
      }

      const baseDir = FileSystem.cacheDirectory ?? FileSystem.documentDirectory ?? null;
      if (!baseDir) {
        // Обычно так бывает в web-режиме
        Alert.alert(
          "Not supported here",
          "Saving files is not supported on this platform. Try running on iOS/Android (device/emulator)."
        );
        return;
      }

      const csv = toCSV(transactions);
      const fileUri = `${baseDir}transactions_${Date.now()}.csv`;

      await FileSystem.writeAsStringAsync(fileUri, csv); // UTF-8 по умолчанию
      // (необязательно) проверим, что файл существует
      const info = await FileSystem.getInfoAsync(fileUri);
      if (!info.exists) {
        throw new Error("File was not created");
      }

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
        <Text style={{ color: "#6b7280" }}>
          Exports all transactions as a .csv file you can share or save.
        </Text>
      </Card>

      <Card title="Danger zone">
        <Btn label="Clear all transactions" danger onPress={onClearAll} />
      </Card>
      <Card title="Security">
      <Pressable
        onPress={toggleBiometric}
        style={{ alignItems:"center", paddingVertical:12, borderRadius:12, backgroundColor: bioOn ? "#10b981" : "#6b7280" }}
      >
        <Text style={{ color:"#fff", fontWeight:"700" }}>
          {bioOn ? "Disable biometric lock" : "Enable biometric lock"}
        </Text>
      </Pressable>
      <Text style={{ color:"#6b7280" }}>
        When enabled, the app will ask FaceID/TouchID at launch.
      </Text>
    </Card>
    </ScrollView>
  );
}
