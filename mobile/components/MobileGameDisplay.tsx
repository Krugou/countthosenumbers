import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { GameCore } from '@shared/contexts/GameContext';

export const MobileGameDisplay: React.FC = () => {
  const [inputValue, setInputValue] = useState('');

  const renderNumber = (number: number, isVisible: boolean) => (
    <View style={styles.numberContainer}>
      <Text style={styles.number}>{isVisible ? number : ''}</Text>
    </View>
  );

  const renderInput = (onSubmit: (value: number) => void) => (
    <View style={styles.container}>
      <Text style={styles.question}>What is the sum of all numbers?</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputValue}
          onChangeText={setInputValue}
          keyboardType="numeric"
          placeholder="Enter the sum..."
          placeholderTextColor="#666"
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            const value = parseInt(inputValue, 10);
            if (!isNaN(value)) {
              onSubmit(value);
              setInputValue('');
            }
          }}
        >
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderControls = (onStart: () => void, onEnd: () => void) => (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={onStart}>
        <Text style={styles.buttonText}>Start Game</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, { marginTop: 10 }]} onPress={onEnd}>
        <Text style={styles.buttonText}>End Game</Text>
      </TouchableOpacity>
    </View>
  );

  const renderGameOver = (score: number, sum: number, onRestart: () => void) => (
    <View style={styles.container}>
      <Text style={styles.gameOver}>Game Over!</Text>
      <Text style={styles.score}>Score: {score}</Text>
      <Text style={styles.sum}>The sum was: {sum}</Text>
      <TouchableOpacity style={styles.button} onPress={onRestart}>
        <Text style={styles.buttonText}>Play Again</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.wrapper}>
      <GameCore
        renderNumber={renderNumber}
        renderInput={renderInput}
        renderControls={renderControls}
        renderGameOver={renderGameOver}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  numberContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  number: {
    fontSize: 72,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  question: {
    fontSize: 24,
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#333',
    color: '#ffffff',
    padding: 15,
    borderRadius: 8,
    fontSize: 18,
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 15,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  gameOver: {
    fontSize: 32,
    color: '#ef4444',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  score: {
    fontSize: 24,
    color: '#ffffff',
    marginBottom: 10,
  },
  sum: {
    fontSize: 24,
    color: '#ffffff',
    marginBottom: 30,
  },
});