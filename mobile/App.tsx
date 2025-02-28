import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { GameProvider } from '@shared/contexts/GameContext';
import { MobileGameDisplay } from './components/MobileGameDisplay';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <GameProvider>
        <MobileGameDisplay />
      </GameProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
});