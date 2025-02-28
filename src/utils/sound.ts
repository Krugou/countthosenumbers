interface Sound {
  correct: HTMLAudioElement;
  incorrect: HTMLAudioElement;
  gameOver: HTMLAudioElement;
  levelUp: HTMLAudioElement;
  click: HTMLAudioElement;
}

class SoundManager {
  private sounds: Partial<Sound> = {};
  private muted: boolean = false;

  constructor() {
    // Load sounds when the class is instantiated
    this.loadSounds();
  }

  private loadSounds() {
    const soundFiles = {
      correct: '/sounds/correct.mp3',
      incorrect: '/sounds/incorrect.mp3',
      gameOver: '/sounds/game-over.mp3',
      levelUp: '/sounds/level-up.mp3',
      click: '/sounds/click.mp3',
    };

    Object.entries(soundFiles).forEach(([key, path]) => {
      const audio = new Audio(path);
      audio.preload = 'auto';
      this.sounds[key as keyof Sound] = audio;
    });
  }

  play(soundName: keyof Sound) {
    if (this.muted || !this.sounds[soundName]) return;

    const sound = this.sounds[soundName];
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch((error) => {
        console.warn(`Failed to play sound ${soundName}:`, error);
      });
    }
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    localStorage.setItem('soundMuted', JSON.stringify(muted));
  }

  getMuted(): boolean {
    return this.muted;
  }

  toggleMute() {
    this.setMuted(!this.muted);
    return this.muted;
  }
}

// Create a singleton instance
export const soundManager = new SoundManager();

// Custom hook for using sound manager
import { useState, useEffect } from 'react';

export const useSound = () => {
  const [muted, setMuted] = useState(() => {
    const savedMuted = localStorage.getItem('soundMuted');
    return savedMuted ? JSON.parse(savedMuted) : false;
  });

  useEffect(() => {
    soundManager.setMuted(muted);
  }, [muted]);

  const toggleMute = () => {
    setMuted(!muted);
  };

  const playSound = (soundName: keyof Sound) => {
    soundManager.play(soundName);
  };

  return {
    muted,
    toggleMute,
    playSound,
  };
};