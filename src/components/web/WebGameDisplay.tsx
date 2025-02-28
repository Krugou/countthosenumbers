import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Number3D } from '../Number3D';
import { Vector3 } from 'three';
import { useGameSettings } from '../../hooks/useGameSettings';
import { GameCore } from '../game/GameCore';

export const WebGameDisplay: React.FC = () => {
  const { settings } = useGameSettings();
  const [inputValue, setInputValue] = useState('');

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

  const renderNumber = (number: number, isVisible: boolean) => (
    <div className="w-full h-full">
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
        <Number3D
          number={number}
          position={new Vector3(0, settings.visualStyle === '3d' ? 2 : 0, 0)}
          isVisible={isVisible}
          isActive={settings.visualStyle === '3d'}
          fontSize={styleConfig.fontSize}
          color={styleConfig.color}
        />
        <mesh position={[0, 0, -2]} rotation={[0, 0, 0]}>
          <planeGeometry args={[50, 50]} />
          <meshStandardMaterial
            color={styleConfig.backgroundColor}
            metalness={settings.visualStyle === '3d' ? 0.8 : 0.5}
            roughness={settings.visualStyle === '3d' ? 0.2 : 0.5}
          />
        </mesh>
      </Canvas>
    </div>
  );

  const renderInput = (onSubmit: (value: number) => void) => (
    <div className="absolute inset-0 flex items-center justify-center">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const value = parseInt(inputValue, 10);
          if (!isNaN(value)) {
            onSubmit(value);
            setInputValue('');
          }
        }}
        className="bg-gray-800 p-6 rounded-lg shadow-lg"
      >
        <div className="text-2xl text-white mb-4">What is the sum of all numbers?</div>
        <div className="flex gap-2">
          <input
            type="number"
            className="flex-1 bg-gray-700 text-white rounded p-2"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter the sum..."
            autoFocus
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );

  const renderControls = (onStart: () => void, onEnd: () => void) => (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <button
          onClick={onStart}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
        >
          Start Game
        </button>
      </div>
    </div>
  );

  const renderGameOver = (score: number, sum: number, onRestart: () => void) => (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
        <div className="text-2xl text-red-500 mb-4">Game Over!</div>
        <div className="text-xl text-white mb-2">Score: {score}</div>
        <div className="text-xl text-white mb-4">The sum was: {sum}</div>
        <button
          onClick={onRestart}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
        >
          Play Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="relative w-full aspect-square">
      <GameCore
        renderNumber={renderNumber}
        renderInput={renderInput}
        renderControls={renderControls}
        renderGameOver={renderGameOver}
      />
    </div>
  );
};