import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { GameProvider } from '@shared/contexts/GameContext';
import { MobileGameDisplay } from './components/MobileGameDisplay';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <GameProvider>
        <View style={styles.content}>
          <MobileGameDisplay />
        </View>
      </GameProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  content: {
    flex: 1,
    padding: 16,
  },
});