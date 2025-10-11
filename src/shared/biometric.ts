import AsyncStorage from "@react-native-async-storage/async-storage";
const KEY = "@ft:requireBiometric";

export async function setBiometricRequired(on: boolean) {
  await AsyncStorage.setItem(KEY, on ? "1" : "0");
}
export async function isBiometricRequired(): Promise<boolean> {
  const v = await AsyncStorage.getItem(KEY);
  return v === "1";
}
