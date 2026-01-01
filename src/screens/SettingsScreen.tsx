import React from 'react';
import { View, Switch, StyleSheet } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Typography from '../components/common/Typography';

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [limitDailyReading, setLimitDailyReading] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <Typography variant="h2" weight="700" mb={20}>⚙️ 설정</Typography>

      <View style={styles.settingItem}>
        <Typography variant="subtitle">다크 모드</Typography>
        <Switch value={darkMode} onValueChange={setDarkMode} />
      </View>

      <View style={styles.settingItem}>
        <Typography variant="subtitle">하루 읽기 제한 (4,000자)</Typography>
        <Switch value={limitDailyReading} onValueChange={setLimitDailyReading} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
});
