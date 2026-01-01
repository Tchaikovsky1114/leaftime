import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { startReading } from '../../apis/reading/fetcher';
import FallbackImage from '../../components/common/FallbackImage';
import { RootNavigation } from '../../navigation/types';
import { useNavigation } from '@react-navigation/native';

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
            <Text style={styles.titleText}>{title}</Text>
            <Text style={styles.subtitleText}>조금씩 쌓이는 감각,{'\n'}오늘도 함께해요! 🍀</Text>


          </View>
        </View>

        <View style={styles.actionRow}>
          <Ionicons name="play-circle-outline" size={24} color="#fff" />
          <Text style={styles.actionText}>Continue Reading</Text>

        </View>
        <Text style={styles.leafText}>Let's Leaftime!</Text>
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

  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2e7d32',
  },

  subtitleText: {
    fontSize: 13,
    lineHeight: 18,
    color: '#ffe',
    marginTop: 8,
    fontWeight: '700',

  },

  leafText: {
    fontSize: 12,
    color: '#88aa77',

    fontStyle: 'italic',
    textAlign: 'center',
  },

  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,

  },

  actionText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#fff',
    fontWeight: '700',
  },
});
