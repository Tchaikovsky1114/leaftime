import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Icons from '../../assets/Icons';
import Typography from '../../components/common/Typography';

export default function TodayReview() {
  const [tasks, setTasks] = useState([
    { id: '1', title: '📖 영어 리딩 15분', done: true },
    { id: '2', title: '🔊 발음 연습 5개', done: false },
    { id: '3', title: '💡 유사어 복습', done: false },
  ]);

  const toggleDone = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  };

  const progress = tasks.filter((t) => t.done).length / tasks.length;

  return (
    <View style={styles.card}>
      <Typography variant="subtitle" weight="600" color="#2f4f4f" mb={12}>오늘 복습할 내용</Typography>

      {/* ProgressBar (간단한 View로 대체) */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>

      {/* Task 목록 */}
      {tasks.map((task) => (
        <Pressable key={task.id} onPress={() => toggleDone(task.id)} style={styles.taskRow}>
          <Icons
            name={task.done ? 'checkmark-circle' : 'ellipse-outline'}
            size={20}
            color={task.done ? '#4CAF50' : '#ccc'}
          />
          <Typography
            variant="body"
            color={task.done ? '#aaa' : '#333'}
            strike={task.done}
          >
            {task.title}
          </Typography>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 12,
    color: '#2f4f4f',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#eee',
    marginBottom: 16,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  taskText: {
    fontSize: 15,
    color: '#333',
  },
});
