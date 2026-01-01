import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity,ScrollView} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { SafeAreaView } from 'react-native-safe-area-context';
import StudySummaryCard from './HomeScreen/StudySummaryCard';
import StudyTabSection from './HomeScreen/StudyTabSection';
import StudyHistoryCard from './HomeScreen/StudyHistoryCard';
import TimerCard from './HomeScreen/TimerCard';
import { useCurrentReading } from '../apis/queries/queries';
import CurrentLearningCard from './HomeScreen/CurrentLearningCard';
import TodayReview from './HomeScreen/TodayReview';
import Typography from '../components/common/Typography';

type DrawerParamList = {
  HomeScreen: undefined;
  BookList: undefined;
  Bookmarks: undefined;
};

export default function HomeScreen() {
  const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();
  const {data} = useCurrentReading();

  useEffect(() => {
    // setTimeout(() => {
    //   navigation.navigate('LearningReportScreen', {
    //     date: '2025-05-09',
    //   });
    // },3000);
  },[navigation]);

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 영역 */}
      <View style={styles.header}>
        <Typography variant="h2" weight="600">Hello, Anchor 🍃</Typography>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu-outline" size={28} color="#333" />
        </TouchableOpacity>
      </View>

      {/* 본문 내용 */}
      <ScrollView contentContainerStyle={styles.content}>
        <TimerCard />
      {/* 1. 상단 수평 카드 2개 (8:2) */}
      <View>
  <Typography variant="subtitle" color="#2e7d32" weight="600" mb={8}>
    오늘의 영어 한 잎 🍃
  </Typography>
</View>
      <View style={styles.horizontalCards}>
        <View style={styles.profileWrapper}>
          <CurrentLearningCard bookId={data?.bookId ?? 0} title={data?.title ?? 'Unknown Title'} coverImage={data?.coverImage ?? ''} />
        </View>
        <View style={styles.summaryWrapper}>
          <StudySummaryCard />
        </View>
      </View>

      {/* 2. 오늘의 공부할 내역 */}
      <TodayReview />

      {/* 3. 발음 / 유사어 / 예문 탭 */}

        <StudyTabSection />


      {/* 4. 과거 공부 이력 카드들 */}
      <View style={styles.historyList}>
        <StudyHistoryCard />
        <StudyHistoryCard />
        <StudyHistoryCard />
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fffaf3', paddingHorizontal: 20, paddingTop: 16 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: { fontSize: 22, fontWeight: '600', color: '#222' },
  body: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  bodyText: { fontSize: 16, color: '#555' },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  horizontalCards: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 8,

  },
  profileWrapper: {
    flex: 7,

  },
  summaryWrapper: {
    flex: 3,

  },
  historyList: {
    marginTop: 20,
    gap: 12,
  },
});
