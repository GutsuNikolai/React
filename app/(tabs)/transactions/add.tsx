import { View, Text, TextInput, Button, ScrollView, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Picker } from "@react-native-picker/picker";
import { useTransactions, type Category } from "@entities/transaction/model/transactions-context";
import type { SubmitHandler } from "react-hook-form";


type FormValues = {
  title: string;
  amount: string;        // вводим строкой → преобразуем в число
  category: Category;
};

const schema = yup.object({
  title: yup.string().trim().min(2, "Too short").required("Required"),
  amount: yup
    .string()
    .required("Required")
    .test("num", "Must be a number", (v) => v !== "" && !isNaN(Number(v))),
  category: yup
    .mixed<"food" | "salary" | "transport" | "entertainment" | "other">()
    .oneOf(["food", "salary", "transport", "entertainment", "other"])
    .required("Required"),            // ← обязательно!
});

export default function AddTransactionScreen() {
  const router = useRouter();
  const { addTransaction } = useTransactions();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: { title: "", amount: "", category: "other" },
    resolver: yupResolver(schema),   // теперь ок — category не undefined
    mode: "onChange",
  });

// Явный тип обработчика:
  const onSubmit: SubmitHandler<FormValues> = (v) => {
    addTransaction({
      title: v.title.trim(),
      amount: Number(v.amount),
      category: v.category,
    });
    router.back();
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      {/* Title */}
      <View>
        <Text style={{ fontWeight: "600", marginBottom: 6 }}>Title</Text>
        <Controller
          control={control}
          name="title"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="e.g. Groceries"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10 }}
            />
          )}
        />
        {errors.title && (
          <Text style={{ color: "red", marginTop: 4 }}>{errors.title.message}</Text>
        )}
      </View>

      {/* Amount */}
      <View>
        <Text style={{ fontWeight: "600", marginBottom: 6 }}>Amount</Text>
        <Controller
          control={control}
          name="amount"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="-23.50"
              keyboardType="numeric"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10 }}
            />
          )}
        />
        {errors.amount && (
          <Text style={{ color: "red", marginTop: 4 }}>{errors.amount.message}</Text>
        )}
      </View>

      {/* Category */}
      <View>
        <Text style={{ fontWeight: "600", marginBottom: 6 }}>Category</Text>
        <Controller
          control={control}
          name="category"
          render={({ field: { onChange, value } }) => (
            <View style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 8 }}>
              <Picker selectedValue={value} onValueChange={onChange}>
                <Picker.Item label="Food" value="food" />
                <Picker.Item label="Salary" value="salary" />
                <Picker.Item label="Transport" value="transport" />
                <Picker.Item label="Entertainment" value="entertainment" />
                <Picker.Item label="Other" value="other" />
              </Picker>
            </View>
          )}
        />
        {errors.category && (
          <Text style={{ color: "red", marginTop: 4 }}>{String(errors.category.message)}</Text>
        )}
      </View>

      <Button 
        title={isSubmitting ? "Saving..." : "Save"} 
        onPress={handleSubmit(onSubmit)} 
      />

    </ScrollView>
  );
}
