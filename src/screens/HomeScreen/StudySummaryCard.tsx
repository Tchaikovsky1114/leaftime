import React from 'react';
import { StyleSheet, ImageBackground } from 'react-native';
import { useStudySummary } from '../../apis/queries/queries';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);
import Typography from '../../components/common/Typography';

export default function StudySummaryCard() {
  const { data } = useStudySummary();

  const totalSeconds = (data?.totalMinutes ?? 0) * 60;
  const totalDays = data?.totalDays ?? 0;

  const formattedTime = dayjs.duration(totalSeconds, 'seconds').format('H시간 m분');
  return (
    <ImageBackground
    source={require('../../assets/images/background-texture-3.png')}
    resizeMode="cover"
    imageStyle={{ borderRadius: 16}}
    blurRadius={2}
    style={styles.card}
    >

      <Typography variant="caption" color="#2f4f4f" align="center">
        지난 <Typography variant="subtitle" color="#388e3c" weight="700">{totalDays}</Typography>일 동안
      </Typography>

      <Typography variant="caption" color="#2f4f4f" align="center">
        <Typography variant="subtitle" color="#388e3c" weight="700">{formattedTime}</Typography>
        {'\n'}공부했어요!
      </Typography>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#f5fbef',
    borderRadius: 16,
    marginVertical: 8,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    // height: 128,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2e7d32',
    marginBottom: 6,
  },
  infoLine: {
    fontSize: 13,
    color: '#2f4f4f',
    textAlign: 'center',
  },
  highlight: {
    fontSize: 16,
    color: '#388e3c',
    fontWeight: 'bold',
  },
});
