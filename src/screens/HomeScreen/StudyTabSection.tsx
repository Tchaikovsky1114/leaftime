import React, { useState } from 'react';
import { View, useWindowDimensions, StyleSheet } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import Typography from '../../components/common/Typography';

const PronunciationTab = () => (
  <View style={styles.scene}>
    <Typography variant="body" color="#333">🔊 발음 연습 탭</Typography>
  </View>
);

const SynonymTab = () => (
  <View style={styles.scene}>
    <Typography variant="body" color="#333">💡 유사어 보기 탭</Typography>
  </View>
);

const ExampleTab = () => (
  <View style={styles.scene}>
    <Typography variant="body" color="#333">✍️ 예문 보기 탭</Typography>
  </View>
);

const renderScene = SceneMap({
  pronunciation: PronunciationTab,
  synonym: SynonymTab,
  example: ExampleTab,
});

export default function StudyTabSection() {
  const layout = useWindowDimensions();

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'pronunciation', title: '발음' },
    { key: 'synonym', title: '유사어' },
    { key: 'example', title: '예문' },
  ]);

  return (
    <View style={styles.wrapper}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={(props) => (
          <TabBar
            {...props}

            indicatorStyle={{ backgroundColor: '#4CAF50' }}
            style={{ backgroundColor: '#fff' }}
            activeColor="#4CAF50"
            inactiveColor="#888"
            // labelStyle={{ fontWeight: '600' }}
            pressColor="#e0f2f1"
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    height: 280, // 반드시 높이 필요!!
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginTop: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#eef',
  },
  scene: {
    flex: 1,
    backgroundColor: '#f8fdf9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: {
    fontSize: 16,
    color: '#333',
  },
});
