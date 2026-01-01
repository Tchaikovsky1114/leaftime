import React, { useEffect } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { FeedbackType } from '..';
import Markdown from 'react-native-markdown-display';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Typography from '../../../components/common/Typography';

type Props = {
  sentence: string | null;
  type: FeedbackType | null;
  result: string | null;
  onTypeChange?: React.Dispatch<React.SetStateAction<FeedbackType | null>>
};

const FeedbackTabs: FeedbackType[] = [
  'analysis',
  'conversations',
  'wordsAndPhrase',
  'examples',
];

export default function FeedbackBottomSheetContent({
  sentence,
  type,
  result,
  onTypeChange,
}: Props) {

  const [selectedTab, setSelectedTab] = React.useState<FeedbackType>('analysis');
  const insets = useSafeAreaInsets();
  useEffect(() => {
    if (type) {
      setSelectedTab(type);
    }

  }, [type]);




  const renderContent = () => (
    <Animated.View entering={FadeIn} exiting={FadeOut} key={type}>

      {result?.length === 0 ? (
        <Typography variant="caption" color="#888">⏳ GPT로부터 피드백을 받아오는 중입니다...</Typography>
      ) : (
        // <ScrollView
        //     contentContainerStyle={{flexGrow: 1}}
        //     showsVerticalScrollIndicator={false}
        //     keyboardShouldPersistTaps="handled"
        //     nestedScrollEnabled={true}
        // >
          <Markdown style={{ ...markdownStyles, body: styles.bodyText }}>{result?.trim()}</Markdown>
      //  </ScrollView>
      )}
    </Animated.View>
  );

  return (
    <BottomSheetScrollView
      contentContainerStyle={{flexGrow: 1, paddingHorizontal: 8}}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      nestedScrollEnabled={true}

      >

      <View style={styles.tabRow}>
        {FeedbackTabs.map((tab) => (
          <Pressable
            key={tab}
            onPress={() => {
              setSelectedTab(tab);
              onTypeChange?.(tab);
            }}
            style={[
              styles.tabButton,
              selectedTab === tab && styles.tabButtonActive,
            ]}
          >
            <Typography
              variant="caption"
              color={selectedTab === tab ? '#fff' : '#4CAF50'}
              weight={selectedTab === tab ? '700' : '400'}
            >
              {renderTitle(tab)}
            </Typography>
          </Pressable>
        ))}
      </View>
      <Markdown style={{ ...markdownStyles  }}>{`\`\`\`\n${sentence}\n\`\`\``}</Markdown>
      {/* <Text style={styles.sectionTitle}>{renderTitle(selectedTab)}</Text> */}

      <View style={{ height: 16 }} />
      {renderContent()}
      <View style={{ height: insets.bottom }} />
    </BottomSheetScrollView>
  );
}

const renderTitle = (type: FeedbackType) => {
  switch (type) {
    case 'analysis':
      return '문장 분석';
    case 'conversations':
      return '대화 연습';
    case 'wordsAndPhrase':
      return '단어와 구문 분석';
    case 'examples':
      return '예문 작성';
  }
};

const styles = StyleSheet.create({
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  marginVertical: {
    marginVertical: 12,
  },
  tabButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#e0f2f1',
  },
  tabButtonActive: {
    backgroundColor: '#4CAF50',
  },

  bodyText: {
    fontSize: 15,
    fontFamily: 'Georgia',
    color: '#444',
    lineHeight: 26,
  },

});

const markdownStyles = {
  code_block: {
    backgroundColor: '#E8F5E9', // LeafTime 느낌의 연한 그린
    borderRadius: 8,
    padding: 12,
    fontFamily: 'Courier',
    color: '#2E7D32', // 짙은 초록색 텍스트
    lineHeight: 22,
    marginVertical: 8,
    borderWidth: 2,
    borderColor: '#05a40d',
  },
  fence: {
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    padding: 12,
    fontFamily: 'Courier',
    color: '#2E7D32',
    lineHeight: 22,
    marginVertical: 8,
    borderWidth: 2,
    borderColor: '#05a40d',
  },
  inline_code: {
    backgroundColor: '#E8F5E9',
    borderRadius: 4,
    padding: 4,
    fontFamily: 'Courier',
    color: '#2E7D32',
  },

  list: {

    marginVertical: 8,
    paddingLeft: 16,
    paddingTop: 4,
    paddingBottom: 4,

  },
  list_item: {
    fontSize: 16,
    lineHeight: 26,
    color: '#222',

  },
  strong: {
    color: '#1B5E20', // 강조되는 짙은 진녹색
    fontSize: 18,
    fontFamily: 'Avenir',
  },
  heading1: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginTop: 24,
    marginBottom: 12,
  },
  heading2: {
    fontSize: 20,
    fontWeight: '600',
    color: '#388E3C',
    marginTop: 20,
    marginBottom: 10,
  },
  heading3: {
    fontSize: 18,
    fontWeight: '500',
    color: '#4CAF50',
    marginTop: 16,
    marginBottom: 8,
  },
};
