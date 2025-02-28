import React, { useEffect } from 'react';
import { Text } from '@react-three/drei';
import { useNumberAnimation, useRotationAnimation } from '../utils/animations';
import { Vector3 } from 'three';
import { animated } from '@react-spring/three';

interface Number3DProps {
  number: number;
  position: Vector3;
  isVisible: boolean;
  isActive?: boolean;
  fontSize?: number;
  color?: string;
  delay?: number;
}

export const Number3D: React.FC<Number3DProps> = ({
  number,
  position,
  isVisible,
  isActive = false,
  fontSize = 1,
  color = '#ffffff',
  delay = 0,
}) => {
  const { scale, opacity } = useNumberAnimation(isVisible, position, delay);
  const rotation = useRotationAnimation(isActive);

  useEffect(() => {
    console.log('Number3D props updated:', {
      number,
      position,
      isVisible,
      isActive,
      fontSize,
      color,
    });
  }, [number, position, isVisible, isActive, fontSize, color]);

  return (
    <animated.group
      position={position}
      rotation={rotation}
      scale={scale}
      opacity={opacity}
    >
      <Text
        fontSize={fontSize}
        color={color}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="#000000"
      >
        {number}
      </Text>
      <mesh position={[0, 0, -0.1]} scale={[fontSize * 1.2, fontSize * 1.2, 0.1]}>
        <planeGeometry />
        <meshStandardMaterial
          color="#000000"
          transparent
          opacity={0.2}
          roughness={0.5}
          metalness={0.5}
        />
      </mesh>
    </animated.group>
  );
};