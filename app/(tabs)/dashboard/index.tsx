import { ScrollView, View, Text, Dimensions } from "react-native";
import { useSummary } from "@features/summary/useSummary";
import { LineChart, BarChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

export default function DashboardScreen() {
  const { incomeUSD, expenseUSD, balanceUSD, linePoints, catLabels, catValues } = useSummary();

  const lineData = {
    labels: linePoints.map((p, i) => (i % 2 === 0 ? p.label : "")),
    datasets: [{ data: linePoints.map((p) => p.y) }],
  };

  const short = (s: string) => (s.length > 9 ? s.slice(0, 9) + "…" : s);
  const labelsShort = catLabels.map(short);

  const Card = ({ title, value }: { title: string; value: string }) => (
    <View style={{ flex: 1, padding: 14, borderWidth: 1, borderColor: "#e5e5e5", borderRadius: 12, backgroundColor: "#fff" }}>
      <Text style={{ fontSize: 12, color: "#6b7280" }}>{title}</Text>
      <Text style={{ marginTop: 6, fontSize: 18, fontWeight: "700" }}>{value}</Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 32 }}>
      

      <View style={{ flexDirection: "row", gap: 12 }}>
        <Card title="Income"  value={`$ ${incomeUSD.toFixed(2)}`} />
        <Card title="Expense" value={`$ ${expenseUSD.toFixed(2)}`} />
      </View>

      <View style={{ flexDirection: "row", gap: 12 }}>
        <Card title="Balance" value={`$ ${balanceUSD.toFixed(2)}`} />
      </View>

      <Text style={{ marginTop: 12, fontSize: 16, fontWeight: "700" }}>Net by day (14d)</Text>
      <View style={{ backgroundColor: "#fff", borderWidth: 1, borderColor: "#e5e5e5", borderRadius: 12, padding: 6 }}>
        <LineChart
          data={lineData}
          width={screenWidth - 16 * 2}
          height={220}
          verticalLabelRotation={45}
          xLabelsOffset={-8}
          chartConfig={{
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 2,
            color: (o = 1) => `rgba(37,99,235,${o})`,
            labelColor: () => "#6b7280",
            propsForDots: { r: "3" },
          }}
          bezier
          style={{ borderRadius: 8 }}
        />
      </View>

      <Text style={{ marginTop: 12, fontSize: 16, fontWeight: "700" }}>Expenses by category</Text>
      <View style={{ backgroundColor: "#fff", borderWidth: 1, borderColor: "#e5e5e5", borderRadius: 12, paddingVertical: 12, alignItems: "center" }}>
        {catValues.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <BarChart
              data={{ labels: labelsShort, datasets: [{ data: catValues }] }}
              width={screenWidth - 24}
              height={240}
              fromZero
              showValuesOnTopOfBars
              yAxisLabel="$ "
              yAxisSuffix=""
              chartConfig={{
                backgroundGradientFrom: "#fff",
                backgroundGradientTo: "#fff",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(99,102,241,${opacity})`,
                labelColor: () => "#6b7280",
              }}
              style={{ borderRadius: 8, paddingRight: 18 }}
              verticalLabelRotation={0}
            />
          </ScrollView>
        ) : (
          <Text style={{ color: "#6b7280" }}>Нет данных по расходам</Text>
        )}
      </View>
    </ScrollView>
  );
}
