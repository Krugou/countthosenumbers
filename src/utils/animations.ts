import { useSpring, config } from '@react-spring/three';
import { Vector3 } from 'three';

export const useNumberAnimation = (
  isVisible: boolean,
  position: Vector3,
  delay: number = 0
) => {
  const { scale, opacity } = useSpring({
    scale: isVisible ? 1 : 0,
    opacity: isVisible ? 1 : 0,
    position: position,
    delay,
    config: config.gentle,
  });

  return { scale, opacity };
};

export const useRotationAnimation = (isActive: boolean) => {
  const { rotation } = useSpring({
    rotation: isActive ? [0, Math.PI * 2, 0] : [0, 0, 0],
    config: {
      mass: 1,
      tension: 120,
      friction: 14,
    },
  });

  return rotation;
};

export const useFloatingAnimation = (amplitude: number = 0.1, frequency: number = 1) => {
  const { position } = useSpring({
    from: { position: [0, -amplitude, 0] },
    to: async (next: (props: { position: number[] }) => Promise<void>) => {
      while (true) {
        await next({ position: [0, amplitude, 0] });
        await next({ position: [0, -amplitude, 0] });
      }
    },
    config: {
      duration: 1000 / frequency,
    },
  });

  return position;
};

export const usePulseAnimation = (isActive: boolean) => {
  const { scale } = useSpring({
    scale: isActive ? 1.2 : 1,
    config: {
      mass: 1,
      tension: 280,
      friction: 60,
    },
  });

  return scale;
};

export const useParticleEffect = (count: number = 20) => {
  const particles = Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2;
    const velocity = new Vector3(
      Math.cos(angle),
      Math.sin(angle),
      Math.random() - 0.5
    ).multiplyScalar(0.05);

    return {
      position: new Vector3(),
      velocity,
      lifetime: 1 + Math.random(),
    };
  });

  const updateParticles = (deltaTime: number) => {
    particles.forEach((particle) => {
      particle.position.add(particle.velocity.clone().multiplyScalar(deltaTime));
      particle.lifetime -= deltaTime;

      if (particle.lifetime <= 0) {
        particle.position.set(0, 0, 0);
        particle.lifetime = 1 + Math.random();
      }
    });

    return particles;
  };

  return { particles, updateParticles };
};

export const useShakeAnimation = (intensity: number = 0.1) => {
  const { position } = useSpring({
    from: { position: [0, 0, 0] },
    to: async (next: (props: { position: number[] }) => Promise<void>) => {
      for (let i = 0; i < 5; i++) {
        await next({
          position: [
            (Math.random() - 0.5) * intensity,
            (Math.random() - 0.5) * intensity,
            0,
          ],
        });
      }
      await next({ position: [0, 0, 0] });
    },
    config: {
      duration: 50,
    },
  });

  return position;
};