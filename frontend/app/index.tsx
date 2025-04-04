import '../src/global.css';
import { useRouter } from 'expo-router';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { HomeScreen } from '../src/components/menus/HomeScreen';

export default function Index() {
  const router = useRouter();

  const handleCreateNewGame = () => {
    router.push('/game-mode');
  };

  const handleViewHistory = () => {
    router.push('/history');
  };

  return (
    <View style={styles.container}>
      <HomeScreen onCreateNewGame={handleCreateNewGame} onViewHistory={handleViewHistory} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827', // This is the equivalent of bg-gray-900
  },
});
