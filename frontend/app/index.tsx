import '../src/global.css';
import { useRouter } from 'expo-router';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <HomeScreen onCreateNewGame={handleCreateNewGame} onViewHistory={handleViewHistory} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#111827',
  },
  container: {
    flex: 1,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
});
