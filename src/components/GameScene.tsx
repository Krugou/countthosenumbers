import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Number3D } from './Number3D';
import { Vector3, Scene } from 'three';
import { useGame } from '../contexts/GameContext';
import { useGameSettings } from '../hooks/useGameSettings';

export const GameScene: React.FC = () => {
  const { state, startGame } = useGame();
  const { settings } = useGameSettings();
  const sceneRef = useRef<Scene>(null);

  const getStyleConfig = () => {
    switch (settings.visualStyle) {
      case '3d':
        return {
          fontSize: 2.5,
          color: '#ffffff',
          backgroundColor: '#1a1a1a',
          enableRotation: true,
          cameraPosition: [5, 5, 10] as [number, number, number],
        };
      case 'enhanced':
        return {
          fontSize: 3.5,
          color: '#00ff00',
          backgroundColor: '#0a0a0a',
          enableRotation: false,
          cameraPosition: [0, 0, 10] as [number, number, number],
        };
      case 'minimal':
      default:
        return {
          fontSize: 3,
          color: '#ffffff',
          backgroundColor: '#1a1a1a',
          enableRotation: false,
          cameraPosition: [0, 0, 10] as [number, number, number],
        };
    }
  };

  const styleConfig = getStyleConfig();

  const calculateNumberPosition = (): Vector3 => {
    if (settings.visualStyle === '3d') {
      return new Vector3(0, 2, 0);
    }
    return new Vector3(0, 0, 0);
  };

  const handleReset = () => {
    startGame(settings);
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas key={settings.visualStyle}>
        <PerspectiveCamera makeDefault position={styleConfig.cameraPosition} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={styleConfig.enableRotation}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />

        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />

        <group ref={sceneRef}>
          {state.showingSequence && state.currentIndex >= 0 && (
            <Number3D
              key={`${state.currentIndex}-${state.sequence[state.currentIndex]}-${settings.visualStyle}`}
              number={state.sequence[state.currentIndex]}
              position={calculateNumberPosition()}
              isVisible={true}
              isActive={settings.visualStyle === '3d'}
              fontSize={styleConfig.fontSize}
              color={styleConfig.color}
            />
          )}
        </group>

        {/* Background plane */}
        <mesh position={[0, 0, -2]} rotation={[0, 0, 0]}>
          <planeGeometry args={[50, 50]} />
          <meshStandardMaterial
            color={styleConfig.backgroundColor}
            metalness={settings.visualStyle === '3d' ? 0.8 : 0.5}
            roughness={settings.visualStyle === '3d' ? 0.2 : 0.5}
          />
        </mesh>
      </Canvas>

      {/* Game overlay */}
      {!state.isPlaying && !state.gameOver && !state.waitingForGuess && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#ffffff',
            fontSize: '2em',
            textAlign: 'center',
          }}
        >
          Press Start to Begin
        </div>
      )}

      {state.waitingForGuess && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#ffffff',
            fontSize: '2em',
            textAlign: 'center',
          }}
        >
          What is the sum of all numbers?
        </div>
      )}

      {state.gameOver && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#ff0000',
            fontSize: '2em',
            textAlign: 'center',
          }}
        >
          Game Over!
          <br />
          Score: {state.score}
          <br />
          The sum was: {state.sequenceSum}
          <br />
          <button
            onClick={handleReset}
            className="px-6 py-2 mt-4 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};