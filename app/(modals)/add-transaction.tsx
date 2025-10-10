import React, { useMemo, useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView, Switch } from "react-native";
import { useForm, type Resolver } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useTransactions } from "@entities/transaction/model/transactions-context";
import type { Category } from "@entities/transaction/types";

// --- Константы ---
const CATEGORIES: Category[] = ["food", "salary", "transport", "entertainment", "other"];
const CURRENCIES = ["USD", "EUR", "MDL"] as const;

// --- Схема формы ---
const schema = z.object({
  title: z.string().min(2, "Too short").max(64, "Too long"),
  amount: z
    .string()
    .refine((v) => !Number.isNaN(Number(v)) && Number(v) !== 0, "Enter non-zero number"),
  category: z.enum(["food", "salary", "transport", "entertainment", "other"]),
  isExpense: z.boolean().default(true),
  currency: z.enum(["USD", "EUR", "MDL"]),
});

type FormData = z.infer<typeof schema>;

export default function AddTransactionModal() {
  const router = useRouter();
  const { addTransaction } = useTransactions();
  const [submitting, setSubmitting] = useState(false);

  const { register, setValue, handleSubmit, formState, watch } = useForm<FormData>({
    resolver: zodResolver(schema) as unknown as Resolver<FormData>,
    defaultValues: {
      title: "",
      amount: "",
      category: "food",
      isExpense: true,
      currency: "USD",
    },
    mode: "onChange",
  });

  // иногда RHF требует явной регистрации поля, если работаем только через setValue/watch
  useEffect(() => {
    register("currency");
    register("category");
    register("isExpense");
  }, [register]);

  const category = watch("category");
  const curr = watch("currency");
  const isExpense = watch("isExpense");
  const isValid = formState.isValid && !submitting;

  const onSubmit = handleSubmit(async (data) => {
    setSubmitting(true);
    try {
      const raw = Number(data.amount);
      const amount = data.isExpense ? -Math.abs(raw) : Math.abs(raw);

      addTransaction({
        title: data.title.trim(),
        amount,
        category: data.category,
        currency: data.currency, // ← сохраняем в транзакцию
      });

      router.back();
    } finally {
      setSubmitting(false);
    }
  });

  // --- Pills категорий ---
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

  // --- Pills валют ---
  const CurrencyPills = useMemo(
    () => (
      <View style={{ flexDirection: "row", gap: 8 }}>
        {CURRENCIES.map((c) => {
          const active = curr === c;
          return (
            <Pressable
              key={c}
              onPress={() => setValue("currency", c, { shouldValidate: true })}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 999,
                borderWidth: 1,
                borderColor: active ? "#6366f1" : "#e5e7eb",
                backgroundColor: active ? "#eef2ff" : "#fff",
              }}
            >
              <Text style={{ fontWeight: active ? "700" : "500", color: active ? "#3730a3" : "#374151" }}>
                {c}
              </Text>
            </Pressable>
          );
        })}
      </View>
    ),
    [curr, setValue]
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
          {formState.errors.title && <Text style={{ color: "#ef4444" }}>{formState.errors.title.message}</Text>}
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
          {formState.errors.amount && <Text style={{ color: "#ef4444" }}>{formState.errors.amount.message}</Text>}
        </View>

        {/* Expense / Income switch */}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text style={{ fontWeight: "600" }}>Is expense?</Text>
          <Switch value={isExpense} onValueChange={(v) => setValue("isExpense", v, { shouldValidate: true })} />
        </View>
        <Text style={{ color: "#6b7280" }}>
          {isExpense ? "Will be saved as negative amount" : "Will be saved as positive amount"}
        </Text>

        {/* Category */}
        <View style={{ gap: 8 }}>
          <Text style={{ fontWeight: "600" }}>Category</Text>
          {CategoryPills}
          {formState.errors.category && <Text style={{ color: "#ef4444" }}>{formState.errors.category.message}</Text>}
        </View>

        {/* Currency */}
        <View style={{ gap: 8 }}>
          <Text style={{ fontWeight: "600" }}>Currency</Text>
          {CurrencyPills}
          {formState.errors.currency && <Text style={{ color: "#ef4444" }}>{formState.errors.currency.message}</Text>}
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
