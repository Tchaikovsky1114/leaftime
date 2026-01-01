import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [limitDailyReading, setLimitDailyReading] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>⚙️ 설정</Text>

      <View style={styles.settingItem}>
        <Text style={styles.label}>다크 모드</Text>
        <Switch value={darkMode} onValueChange={setDarkMode} />
      </View>

      <View style={styles.settingItem}>
        <Text style={styles.label}>하루 읽기 제한 (4,000자)</Text>
        <Switch value={limitDailyReading} onValueChange={setLimitDailyReading} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: { fontSize: 18 },
});
