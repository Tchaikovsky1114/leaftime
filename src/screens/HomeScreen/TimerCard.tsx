import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, AppState, AppStateStatus } from 'react-native';
import Icons from '../../assets/Icons';
import FlipDigit from './FlipDigit';
import { useTimerStore } from '../../store/useTimerStore';
import dayjs from 'dayjs';
import { sendStudyLog } from '../../apis/study-log/fetcher';

function formatDigits(value: number): string[] {
  const h = String(Math.floor(value / 3600)).padStart(2, '0');
  const m = String(Math.floor((value % 3600) / 60)).padStart(2, '0');
  const s = String(value % 60).padStart(2, '0');
  return [...h, ':', ...m, ':', ...s];
}

export default function TimerCard() {
  const {date,running,seconds,setDate,setSeconds,setStartTimestamp,startTimestamp} = useTimerStore();
  const appState = useRef(AppState.currentState);
// const handleToggle = () => {
//   if (!running) {
//     setStartTimestamp(Date.now()); // 시작 시점 저장
//   }
//   setRunning(!running);
// };

useEffect(() => {
  const subscription = AppState.addEventListener('change', async (nextAppState: AppStateStatus) => {
    console.log('📱 앱 상태 변경 감지:', nextAppState);
    if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
      console.log('📱 앱이 포그라운드로 돌아옴');
      const today = dayjs().format('YYYY-MM-DD');
      await sendStudyLog(date, seconds);
      console.log(`📝 ${date} 공부 시간 ${seconds}초 전송`);
      if (date !== today) {
        // 날짜가 바뀌었다면 초기화
        console.log('📆 날짜 변경 감지 → 타이머 초기화');
        setSeconds(0);
        setDate(today);
        setStartTimestamp(Date.now());
      }
    }
    appState.current = nextAppState;
  });

  return () => {
    subscription.remove();
  };
}, [date, seconds, setDate, setSeconds, setStartTimestamp]);

useEffect(() => {
  let timer: NodeJS.Timeout | null = null;
  if (running) {
    timer = setInterval(() => {
      const today = dayjs().format('YYYY-MM-DD');
      if (date !== today) {
        // 1. 서버에 어제 학습시간 전송
        // 2. 타이머 및 seconds 초기화
        setDate(today);
        setSeconds(0);
        setStartTimestamp(Date.now());
      } else {
        setSeconds(seconds + 1);
      }
    }, 1000);
  }
  return () => {
    timer && clearInterval(timer);
  };
  // running, date 의존성 추가 필요
}, [running, date, seconds, setDate, setSeconds, setStartTimestamp]);

  useEffect(() => {
    if (running && startTimestamp) {
      const elapsed = Math.floor((Date.now() - startTimestamp) / 1000);
      setSeconds(elapsed);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 최초 한 번만 실행
  const digits = formatDigits(seconds);

  return (
    <View style={styles.card}>
      <Icons name="time-outline" size={36} color="#4CAF50" />
      <View style={styles.timeRow}>
        {digits.map((char, index) =>
          char === ':' ? (
            <View key={index} style={styles.colon}>
              <FlipDigit digit=":" />
            </View>
          ) : (
            <FlipDigit key={index} digit={char} />
          )
        )}
      </View>
      {/* <Pressable style={styles.button} onPress={handleToggle}>
        <Icons name={running ? 'pause-outline' : 'play-outline'} size={18} color="#fff" />
      </Pressable> */}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  timeRow: {
    flexDirection: 'row',
    marginVertical: 12,
  },
  colon: {
    width: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    marginTop: 6,
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
  },
});
