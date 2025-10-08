import React, { useMemo, useState } from "react";
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView, Switch } from "react-native";
import { useForm, type Resolver } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useTransactions } from "@entities/transaction/model/transactions-context";
import type { Category } from "@entities/transaction/types";

const CATEGORIES: Category[] = ["food", "salary", "transport", "entertainment", "other"];

// схема: без optional у isExpense
const schema = z.object({
  title: z.string().min(2, "Too short").max(64, "Too long"),
  amount: z.string().refine((v) => !Number.isNaN(Number(v)) && Number(v) !== 0, "Enter non-zero number"),
  category: z.enum(["food","salary","transport","entertainment","other"]),
  isExpense: z.boolean().default(true),
});
type FormData = z.infer<typeof schema>;

export default function AddTransactionModal() {
  const router = useRouter();
  const { addTransaction } = useTransactions();
  const [submitting, setSubmitting] = useState(false);

  const { setValue, handleSubmit, formState, watch } = useForm<FormData>({
    resolver: zodResolver(schema) as unknown as Resolver<FormData>, // ← ключевая строка
    defaultValues: {
        title: "",
        amount: "",
        category: "food",
        isExpense: true,
    },
    mode: "onChange",
    });

  const category = watch("category");
  const isExpense = watch("isExpense");
  const isValid = formState.isValid && !submitting;

  const onSubmit = handleSubmit(async (data) => {
    setSubmitting(true);
    try {
      const raw = Number(data.amount);
      const amount = data.isExpense ? -Math.abs(raw) : Math.abs(raw);

      // addTransaction ожидает: Omit<Transaction, "id" | "createdAt">
      addTransaction({
        title: data.title.trim(),
        amount,
        category: data.category,
      });

      router.back();
    } finally {
      setSubmitting(false);
    }
  });

  // простая плашка выбора категорий
  const CategoryPills = useMemo(
    () => (
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {CATEGORIES.map((c) => {
          const active = c === category;
          return (
            <Pressable
              key={c}
              onPress={() => setValue("category", c, { shouldValidate: true })}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 999,
                borderWidth: 1,
                borderColor: active ? "#6366f1" : "#e5e7eb",
                backgroundColor: active ? "#eef2ff" : "#fff",
              }}
            >
              <Text style={{ color: active ? "#3730a3" : "#374151", fontWeight: active ? "700" : "500" }}>
                {c}
              </Text>
            </Pressable>
          );
        })}
      </View>
    ),
    [category, setValue]
  );

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.select({ ios: "padding", android: undefined })}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 14 }}>
        <Text style={{ fontSize: 22, fontWeight: "700" }}>Add transaction</Text>

        {/* Title */}
        <View style={{ gap: 6 }}>
          <Text style={{ fontWeight: "600" }}>Title</Text>
          <TextInput
            placeholder="e.g. Groceries"
            onChangeText={(t) => setValue("title", t, { shouldValidate: true })}
            style={{
              backgroundColor: "#fff",
              borderRadius: 12,
              borderWidth: 1,
              borderColor: formState.errors.title ? "#ef4444" : "#e5e7eb",
              paddingHorizontal: 12,
              paddingVertical: 10,
            }}
          />
          {formState.errors.title && (
            <Text style={{ color: "#ef4444" }}>{formState.errors.title.message}</Text>
          )}
        </View>

        {/* Amount */}
        <View style={{ gap: 6 }}>
          <Text style={{ fontWeight: "600" }}>Amount</Text>
          <TextInput
            placeholder="e.g. 12.50"
            keyboardType="decimal-pad"
            onChangeText={(t) => setValue("amount", t, { shouldValidate: true })}
            style={{
              backgroundColor: "#fff",
              borderRadius: 12,
              borderWidth: 1,
              borderColor: formState.errors.amount ? "#ef4444" : "#e5e7eb",
              paddingHorizontal: 12,
              paddingVertical: 10,
            }}
          />
          {formState.errors.amount && (
            <Text style={{ color: "#ef4444" }}>{formState.errors.amount.message}</Text>
          )}
        </View>

        {/* Expense / Income switch */}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text style={{ fontWeight: "600" }}>Is expense?</Text>
          <Switch
            value={isExpense}
            onValueChange={(v) => setValue("isExpense", v, { shouldValidate: true })}
          />
        </View>
        <Text style={{ color: "#6b7280" }}>
          {isExpense ? "Will be saved as negative amount" : "Will be saved as positive amount"}
        </Text>

        {/* Category pills */}
        <View style={{ gap: 8 }}>
          <Text style={{ fontWeight: "600" }}>Category</Text>
          {CategoryPills}
          {formState.errors.category && (
            <Text style={{ color: "#ef4444" }}>{formState.errors.category.message}</Text>
          )}
        </View>

        {/* Actions */}
        <View style={{ flexDirection: "row", gap: 10, marginTop: 8 }}>
          <Pressable
            onPress={() => router.back()}
            style={{
              flex: 1,
              alignItems: "center",
              paddingVertical: 12,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: "#e5e7eb",
              backgroundColor: "#fff",
            }}
          >
            <Text>Cancel</Text>
          </Pressable>

          <Pressable
            onPress={onSubmit}
            disabled={!isValid}
            style={{
              flex: 1,
              alignItems: "center",
              paddingVertical: 12,
              borderRadius: 12,
              backgroundColor: isValid ? "#6366f1" : "#c7d2fe",
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "700" }}>{submitting ? "Saving..." : "Save"}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
