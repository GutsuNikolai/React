import React, { useMemo, useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView, Switch } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useForm, type Resolver } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransactions } from "@entities/transaction/model/transactions-context";
import type { Category } from "@entities/transaction/types";

const CATEGORIES: Category[] = ["food", "salary", "transport", "entertainment", "other"];

const schema = z.object({
  title: z.string().min(2, "Too short").max(64, "Too long"),
  amount: z.string().refine((v) => !Number.isNaN(Number(v)) && Number(v) !== 0, "Enter non-zero number"),
  category: z.enum(["food","salary","transport","entertainment","other"]),
  isExpense: z.boolean().default(true),
  currency: z.enum(["USD","EUR","MDL"]),
});
type FormData = z.infer<typeof schema>;

export default function EditTransactionModal() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { transactions, updateTransaction, removeTransaction } = useTransactions();
  const tx = transactions.find(t => t.id === id);

  const [submitting, setSubmitting] = useState(false);

  const { setValue, handleSubmit, formState, watch, reset } = useForm<FormData>({
    resolver: zodResolver(schema) as unknown as Resolver<FormData>,
    defaultValues: { title: "", amount: "", category: "food", isExpense: true },
    mode: "onChange",
  });

  // Префилл значениями
  useEffect(() => {
    if (!tx) return;
    setValue("title", tx.title, { shouldValidate: true });
    setValue("category", tx.category, { shouldValidate: true });
    setValue("isExpense", tx.amount < 0, { shouldValidate: true });
    setValue("amount", String(Math.abs(tx.amount)), { shouldValidate: true });
    setValue("currency", tx.currency, { shouldValidate: true });
  }, [tx, setValue]);

  const category = watch("category");
  const isExpense = watch("isExpense");
  const isValid = formState.isValid && !!tx && !submitting;

  const onSubmit = handleSubmit(async (data) => {
    if (!tx) return;
    setSubmitting(true);
    try {
      const raw = Number(data.amount);
      const amount = data.isExpense ? -Math.abs(raw) : Math.abs(raw);

      updateTransaction(tx.id, {
        title: data.title.trim(),
        amount,
        category: data.category,
        currency: data.currency, 
      });

      router.back();
    } finally {
      setSubmitting(false);
    }
  });

  const CategoryPills = useMemo(() => (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
      {CATEGORIES.map((c) => {
        const active = c === category;
        return (
          <Pressable
            key={c}
            onPress={() => setValue("category", c, { shouldValidate: true })}
            style={{
              paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, borderWidth: 1,
              borderColor: active ? "#6366f1" : "#e5e7eb",
              backgroundColor: active ? "#eef2ff" : "#fff",
            }}
          >
            <Text style={{ color: active ? "#3730a3" : "#374151", fontWeight: active ? "700" : "500" }}>{c}</Text>
          </Pressable>
        );
      })}
    </View>
  ), [category, setValue]);

  if (!tx) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 16 }}>
        <Text>Transaction not found</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.select({ ios: "padding", android: undefined })}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 14 }}>
        <Text style={{ fontSize: 22, fontWeight: "700" }}>Edit transaction</Text>

        {/* Title */}
        <View style={{ gap: 6 }}>
          <Text style={{ fontWeight: "600" }}>Title</Text>
          <TextInput
            onChangeText={(t) => setValue("title", t, { shouldValidate: true })}
            style={{
              backgroundColor: "#fff", borderRadius: 12, borderWidth: 1,
              borderColor: formState.errors.title ? "#ef4444" : "#e5e7eb",
              paddingHorizontal: 12, paddingVertical: 10,
            }}
          />
          {formState.errors.title && <Text style={{ color: "#ef4444" }}>{formState.errors.title.message}</Text>}
        </View>

        {/* Amount */}
        <View style={{ gap: 6 }}>
          <Text style={{ fontWeight: "600" }}>Amount</Text>
          <TextInput
            keyboardType="decimal-pad"
            onChangeText={(t) => setValue("amount", t, { shouldValidate: true })}
            style={{
              backgroundColor: "#fff", borderRadius: 12, borderWidth: 1,
              borderColor: formState.errors.amount ? "#ef4444" : "#e5e7eb",
              paddingHorizontal: 12, paddingVertical: 10,
            }}
          />
          {formState.errors.amount && <Text style={{ color: "#ef4444" }}>{formState.errors.amount.message}</Text>}
        </View>

        {/* Expense / Income */}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text style={{ fontWeight: "600" }}>Is expense?</Text>
          <Switch value={isExpense} onValueChange={(v) => setValue("isExpense", v, { shouldValidate: true })} />
        </View>

        {/* Category */}
        <View style={{ gap: 8 }}>
          <Text style={{ fontWeight: "600" }}>Category</Text>
          {CategoryPills}
          {formState.errors.category && <Text style={{ color: "#ef4444" }}>{formState.errors.category.message}</Text>}
        </View>

        {/* Actions */}
        <View style={{ flexDirection: "row", gap: 10, marginTop: 8 }}>
          <Pressable
            onPress={() => router.back()}
            style={{ flex: 1, alignItems: "center", paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: "#e5e7eb", backgroundColor: "#fff" }}>
            <Text>Cancel</Text>
          </Pressable>

          <Pressable
            onPress={onSubmit}
            disabled={!isValid}
            style={{ flex: 1, alignItems: "center", paddingVertical: 12, borderRadius: 12, backgroundColor: isValid ? "#6366f1" : "#c7d2fe" }}>
            <Text style={{ color: "#fff", fontWeight: "700" }}>{submitting ? "Saving..." : "Save"}</Text>
          </Pressable>
        </View>

        {/* Danger zone */}
        <View style={{ marginTop: 12 }}>
          <Pressable
            onPress={() => { removeTransaction(tx.id); router.back(); }}
            style={{ alignItems: "center", paddingVertical: 12, borderRadius: 12, backgroundColor: "#ef4444" }}>
            <Text style={{ color: "#fff", fontWeight: "700" }}>Delete</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
