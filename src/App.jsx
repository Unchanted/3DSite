import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Torus } from '@react-three/drei';
import { Vector3 } from 'three';

function Donut() {
  const donutRef = useRef();
  
  useFrame(() => {
    donutRef.current.rotation.x += 0.01;
    donutRef.current.rotation.y += 0.01;
  });

  return (
    <Torus ref={donutRef} args={[1, 0.4, 16, 100]} position={[0, 0, 0]}>
      <meshStandardMaterial attach="material" color="orange" />
    </Torus>
  );
}

function CameraControls() {
  const { camera } = useThree();
  const velocity = useRef(new Vector3());
  const direction = useRef(new Vector3());
  const keys = useRef({});

  const moveSpeed = 0.1;

  useEffect(() => {
    const handleKeyDown = (event) => {
      keys.current[event.key] = true;
    };

    const handleKeyUp = (event) => {
      keys.current[event.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame(() => {
    direction.current.set(0, 0, 0);
    
    if (keys.current['w']) direction.current.z -= moveSpeed;
    if (keys.current['s']) direction.current.z += moveSpeed;
    if (keys.current['a']) direction.current.x -= moveSpeed;
    if (keys.current['d']) direction.current.x += moveSpeed;

    camera.position.add(direction.current);
  });

  return null;
}

function App() {
  return (
    <Canvas style={{ background: 'black', height: '100vh' }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Donut />
      <OrbitControls />
      <CameraControls />
    </Canvas>
  );
}

export default App;
