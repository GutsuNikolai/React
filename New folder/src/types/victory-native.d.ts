
// import { ScrollView, View, Text, Dimensions } from "react-native";
// import { useTransactions } from "@entities/transaction/model/transactions-context";
// import { makeDailyNetSeries, makeExpenseByCategory } from "@shared/lib/series";
// // import { LineChart, PieChart } from "react-native-chart-kit";
// // import { BarChart, LineChart } from "react-native-chart-kit";
// import { LineChart, BarChart } from "react-native-chart-kit";

// const screenWidth = Dimensions.get("window").width;

// export default function DashboardScreen() {
//   const { transactions } = useTransactions();

//   const income = transactions.reduce((s, t) => s + (t.amount > 0 ? t.amount : 0), 0);
//   const expense = transactions.reduce((s, t) => s + (t.amount < 0 ? Math.abs(t.amount) : 0), 0);
//   const balance = income - expense;

//   // данные для line
//   const pts = makeDailyNetSeries(transactions, 14); // [{x,y,label}]
//   const lineData = {
//   labels: pts.map((p, i) => (i % 2 === 0 ? p.label : "")), // показываем каждую 2-ю
//   datasets: [{ data: pts.map((p) => p.y) }],
// };
// const raw = makeExpenseByCategory(transactions);
// const sorted = [...raw].sort((a, b) => Number(b.y) - Number(a.y));
// const top = sorted.slice(0, 6);
// const rest = sorted.slice(6).reduce((s, d) => s + Number(d.y), 0);
// if (rest > 0 && !top.find(t => String(t.x) === "other")) top.push({ x: "other", y: rest, label: "" });

// const labels = top.map(d => String(d.x));
// const values = top.map(d => Number(d.y));

// const short = (s: string) => (s.length > 7 ? s.slice(0, 7) + "…" : s);
// const labelsShort = labels.map(short);

// // ширину делаем динамической: по ~70px на столбик
// const chartWidth = Math.max(screenWidth - 16 * 2, labels.length * 55);

  
// //   const COLORS = ["#60a5fa","#f472b6","#34d399","#fbbf24","#a78bfa","#f87171","#22d3ee","#c084fc"];
// //   const pieData = pieRaw.map((d, i) => ({
// //   name: String(d.x),
// //   population: Number(d.y),
// //   color: COLORS[i % COLORS.length],
// //   legendFontColor: "#374151",
// //   legendFontSize: 12,
// // }));


//   const Card = ({ title, value }: { title: string; value: string }) => (
//     <View style={{ flex: 1, padding: 14, borderWidth: 1, borderColor: "#e5e5e5", borderRadius: 12, backgroundColor: "#fff" }}>
//       <Text style={{ fontSize: 12, color: "#6b7280" }}>{title}</Text>
//       <Text style={{ marginTop: 6, fontSize: 18, fontWeight: "700" }}>{value}</Text>
//     </View>
//   );

//   return (
//     <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 32 }}>
//       <Text style={{ fontSize: 20, fontWeight: "700" }}>Summary</Text>

//       <View style={{ flexDirection: "row", gap: 12 }}>
//         <Card title="Income" value={`$ ${income.toFixed(2)}`} />
//         <Card title="Expense" value={`$ ${expense.toFixed(2)}`} />
//       </View>

//       <View style={{ flexDirection: "row", gap: 12 }}>
//         <Card title="Balance" value={`$ ${balance.toFixed(2)}`} />
//       </View>

//       <Text style={{ marginTop: 12, fontSize: 16, fontWeight: "700" }}>Net by day (14d)</Text>
//       <View style={{ backgroundColor: "#fff", borderWidth: 1, borderColor: "#e5e5e5", borderRadius: 12, padding: 6 }}>
//         <LineChart
//           data={lineData}
//           width={screenWidth - 16 * 2}
//           height={220}
//           verticalLabelRotation={45}
//           xLabelsOffset={-8}
//           chartConfig={{
//             backgroundGradientFrom: "#fff",
//             backgroundGradientTo: "#fff",
//             decimalPlaces: 2,
//             color: (o = 1) => `rgba(37,99,235,${o})`,
//             labelColor: () => "#6b7280",
//             propsForDots: { r: "3" },
//           }}
//           bezier
//           style={{ borderRadius: 8 }}
//         />
//       </View>

//       <Text style={{ marginTop: 12, fontSize: 16, fontWeight: "700" }}>
//         Expenses by category
//       </Text>
//       <View
//         style={{
//           backgroundColor: "#fff",
//           borderWidth: 1,
//           borderColor: "#e5e5e5",
//           borderRadius: 12,
//           paddingVertical: 12,
//           alignItems: "center",
//         }}
//       >
//         {values.length > 0 ? (
//           <BarChart
//             data={{ labels: labelsShort, datasets: [{ data: values }] }}
//             width={chartWidth}
//             height={260}
//             fromZero
//             showValuesOnTopOfBars
//             yAxisLabel="$ "
//             yAxisSuffix=""
//             chartConfig={{
//               backgroundGradientFrom: "#fff",
//               backgroundGradientTo: "#fff",
//               decimalPlaces: 0,
//               color: (opacity = 1) => `rgba(99,102,241,${opacity})`,
//               labelColor: () => "#6b7280",
//             }}
//             style={{ borderRadius: 8 }}
//             verticalLabelRotation={0}
//           />

//         ) : (
//           <Text style={{ color: "#6b7280" }}>Нет данных по расходам</Text>
//         )}
//       </View>
//     </ScrollView>
//   );
// }
