import React from "react";
import { View, Text, Pressable, Platform } from "react-native";
import * as LocalAuth from "expo-local-authentication";
import { isBiometricRequired } from "./biometric";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = React.useState(false);
  const [ok, setOk] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);

  const run = React.useCallback(async () => {
    setErr(null);
    try {
      const required = await isBiometricRequired();
      if (!required || Platform.OS === "web") { setOk(true); setReady(true); return; }

      const has = await LocalAuth.hasHardwareAsync();
      const enrolled = await LocalAuth.isEnrolledAsync();
      if (!has || !enrolled) { setOk(true); setReady(true); return; }

      const res = await LocalAuth.authenticateAsync({ promptMessage: "Unlock" });
      setOk(!!res.success);
    } catch {
      setErr("Authentication failed");
      setOk(false);
    } finally {
      setReady(true);
    }
  }, []);

  React.useEffect(() => { run(); }, [run]);

  if (!ready) return null;
  if (ok) return <>{children}</>;

  return (
    <View style={{ flex:1, alignItems:"center", justifyContent:"center", padding:16 }}>
      <Text style={{ marginBottom:12, fontWeight:"700" }}>Locked</Text>
      {err && <Text style={{ color:"#ef4444", marginBottom:8 }}>{err}</Text>}
      <Pressable onPress={run} style={{ paddingVertical:12, paddingHorizontal:18, borderRadius:12, backgroundColor:"#6366f1" }}>
        <Text style={{ color:"#fff", fontWeight:"700" }}>Try again</Text>
      </Pressable>
    </View>
  );
}
