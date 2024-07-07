import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Doughnut({ position = [0, 0, -5], size = 1 }) {
  const doughnutRef = useRef();
  const particlesRef = useRef();

  // Rotate the doughnut
  useFrame((state, delta) => {
    doughnutRef.current.rotation.x += delta * 0.1;
    doughnutRef.current.rotation.y += delta * 0.1;
    particlesRef.current.rotation.y += delta * 0.05;
  });

  // Create particles
  const particles = useMemo(() => {
    const count = 1000;
    const temp = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }

    temp.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return temp;
  }, []);

  return (
    <group>
      <mesh ref={doughnutRef} position={position} scale={[size, size, size]}>
        <torusGeometry args={[2, 0.5, 16, 100]} />
        <meshStandardMaterial color="orange" />
      </mesh>
      <points ref={particlesRef} geometry={particles}>
        <pointsMaterial color="#ffffff" size={0.05} sizeAttenuation />
      </points>
    </group>
  );
}

export default Doughnut;
