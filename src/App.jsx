import * as THREE from 'three'
import React, { Suspense, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Reflector, Text, useTexture, useGLTF, Stars } from '@react-three/drei'

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return { width, height };
}

function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}

export default function App() {
  const { width } = useWindowDimensions();

  return (
    <div className='w-full h-dvh z-0 relative'>
      <Canvas id="canvas" concurrent gl={{ alpha: false }} pixelRatio={[1, 1.5]} camera={{ position: [0, 6, 100], fov: 15 }} dpr={[1, 2]}>
        <color attach="background" args={['black']} />
        <fog attach="fog" args={['black', 15, 20]} />
        <Suspense fallback={null}>
          <group position={[0, -1, 0]}>
            <Astro rotation={[0, Math.PI + Math.PI, 0]} position={[width / 1000, 0, -1]} scale={[width < 640 ? width / 2200 : 0.30, width < 640 ? width / 2200 : 0.30, width < 640 ? width / 2200 : 0.30]} />
            <VideoText primaryText="Arcade" secondaryText="Build Ideas...." position={[0, width < 640 ? 1.5 : 0.5, -2]} />
            <Ground />
          </group>
          <spotLight position={[0, 10, 0]} intensity={0.5} />
          <directionalLight position={[+10, 0, 1]} intensity={2} />
          <Stars radius={100} depth={5} count={5000} factor={30} saturation={5} fade speed={1} />
          <Intro />
        </Suspense>
      </Canvas>
    </div>
  );
}

function Astro(props) {
  const { scene } = useGLTF('/astronotSmallGrayFinal.glb');
  return <primitive object={scene} {...props} />;
}

function VideoText({ primaryText, secondaryText, position, ...props }) {
  const { width } = useWindowDimensions();

  const [video] = useState(() =>
    Object.assign(document.createElement('video'), {
      src: '/spaceEdit2.mp4',
      crossOrigin: 'Anonymous',
      loop: true,
      muted: true,
    })
  );

  video.setAttribute('playsinline', true);
  useEffect(() => void video.play(), [video]);

  return (
    <>
      <Text
        font="/Inter-Bold.woff"
        fontSize={width < 640 ? width / 900 : width / 1200}
        letterSpacing={0}
        textAlign="center"
        position={[position[0], position[1] + 1, position[2]]}
        {...props}
      >
        {primaryText}
        <meshBasicMaterial toneMapped={false}>
          <videoTexture attach="map" args={[video]} />
        </meshBasicMaterial>
      </Text>
      <Text
        font="/Inter-Bold.woff"
        fontSize={width < 640 ? width / 1600 : width / 2900}
        letterSpacing={-0.06}
        textAlign="center"
        position={[position[0], position[1] - 0.01, position[2]]}
        {...props}
      >
        {secondaryText}
        <meshBasicMaterial toneMapped={false}>
          <videoTexture attach="map" args={[video]} />
        </meshBasicMaterial>
      </Text>
    </>
  );
}

function Ground() {
  const [floor, normal] = useTexture(['/SurfaceImperfections003_1K_var1.jpg', '/SurfaceImperfections003_1K_Normal.jpg']);
  return (
    <Reflector blur={[400, 100]} resolution={512} args={[10, 10]} mirror={0.5} mixBlur={6} mixStrength={1.5} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
      {(Material, props) => <Material color="#a0a0a0" metalness={0.4} roughnessMap={floor} normalMap={normal} normalScale={[5, 5]} {...props} />}
    </Reflector>
  );
}

function Intro() {
  const [vec] = useState(() => new THREE.Vector3());
  const [orientation, setOrientation] = useState({ beta: 0, gamma: 0 });

  useEffect(() => {
    function handleOrientation(event) {
      setOrientation({
        beta: event.beta,
        gamma: event.gamma,
      });
    }

    window.addEventListener('deviceorientation', handleOrientation, true);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, []);

  return useFrame((state) => {
    // Convert orientation angles to camera position
    const beta = THREE.Math.degToRad(orientation.beta); // X-axis
    const gamma = THREE.Math.degToRad(orientation.gamma); // Y-axis

    const x = Math.sin(gamma) * 5;
    const y = 3 + Math.sin(beta) * 2;
    const z = 14;

    state.camera.position.lerp(vec.set(x, y, z), 0.05);
    state.camera.lookAt(0, 0, 0);
  });
}
