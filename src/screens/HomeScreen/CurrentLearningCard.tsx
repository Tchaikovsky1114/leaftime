import { ImageBackground, StyleSheet, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { startReading } from '../../apis/reading/fetcher';
import FallbackImage from '../../components/common/FallbackImage';
import { RootNavigation } from '../../navigation/types';
import { useNavigation } from '@react-navigation/native';
import Typography from '../../components/common/Typography';

interface Props {
  bookId: number;
  title: string;
  coverImage: string | null;
}

export default function CurrentLearningCard({ bookId, title, coverImage }: Props) {
  const navigation = useNavigation<RootNavigation>();

  return (
    <TouchableOpacity
    activeOpacity={0.78}
    onPress={async () => {
      if (bookId) {
        const success = await startReading(bookId);
        if (success) {
          navigation.navigate('Reader', { bookId, title });
        }
      }
    }}>
      <ImageBackground source={
        require('../../assets/images/background-texture-2.png')
      }
      resizeMode="center"
      style={{
        flex: 1,
        ...styles.card,
        borderRadius: 16,
        overflow: 'hidden',
      }}
      >
        <View style={{
          shadowColor: '#000',
          shadowOpacity: 0.34,
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 4,
          elevation: 2,
          borderRadius: 16,
        }}>
        <View style={styles.infoArea}>
          <FallbackImage uri={coverImage ?? ''} style={styles.cover} />
          <View style={styles.textBlock}>
            <Typography variant="body" color="#2e7d32" weight="700">{title}</Typography>
            <Typography variant="caption" color="#ffe" weight="700" mt={8}>조금씩 쌓이는 감각,{'\n'}오늘도 함께해요! 🍀</Typography>
          </View>
        </View>

        <View style={styles.actionRow}>
          <Ionicons name="play-circle-outline" size={24} color="#fff" />
          <Typography variant="button" color="#fff" weight="700" ml={4}>Continue Reading</Typography>

        </View>
        <Typography variant="caption" color="#88aa77" italic align="center">Let's Leaftime!</Typography>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },

  infoArea: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  cover: {
    width: 72,
    height: 108,
    borderRadius: 8,
    marginRight: 16,
  },

  textBlock: {
    flex: 1,
  },


  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,

  },

});
