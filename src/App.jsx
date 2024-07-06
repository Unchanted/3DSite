import * as THREE from 'three';
import React, { Suspense, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Reflector, Text, useTexture, useGLTF, Stars } from '@react-three/drei';

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
  const [zoomOut, setZoomOut] = useState(false);

  const handleButtonClick = () => setZoomOut(true);

  return (
    <div className='w-full h-screen z-0 relative'>
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
          <Intro zoomOut={zoomOut} />
        </Suspense>
      </Canvas>
      <button
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-blue-500 text-white rounded-lg"
        onClick={handleButtonClick}
      >
        Zoom Out
      </button>
      {zoomOut && <ASCIIDoughnut />}
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

function Intro({ zoomOut }) {
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

  useFrame((state) => {
    const beta = THREE.MathUtils.degToRad(orientation.beta);
    const gamma = THREE.MathUtils.degToRad(orientation.gamma);

    const x = Math.sin(gamma) * 5;
    const y = 3 + Math.sin(beta) * 2;
    const z = 14;

    const newPosition = zoomOut ? vec.set(0, 0, 50) : vec.set(x, y, z);
    state.camera.position.lerp(newPosition, 0.05);
    state.camera.lookAt(0, 0, 0);
  });

  return null;
}

function ASCIIDoughnut() {
  useEffect(() => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    document.body.appendChild(canvas);

    const R1 = 1;
    const R2 = 2;
    const K1 = 150;
    const K2 = 5;
    let A = 1, B = 1;

    function renderFrame() {
      context.clearRect(0, 0, width, height);

      for (let j = 0; j < Math.PI * 2; j += 0.07) {
        for (let i = 0; i < Math.PI * 2; i += 0.02) {
          const c = Math.sin(i),
            d = Math.cos(j),
            e = Math.sin(A),
            f = Math.sin(j),
            g = Math.cos(A),
            h = d + R2,
            D = 1 / (c * h * e + f * g + R1),
            l = Math.cos(i),
            m = Math.cos(B),
            n = Math.sin(B),
            t = c * h * g - f * e;

          const x = (width / 2 + K1 * D * (l * h * m - t * n));
          const y = (height / 2 - K2 * D * (l * h * n + t * m));
          const z = K1 * D;
          context.fillStyle = `rgba(${z * 255}, ${z * 255}, ${z * 255}, 1)`;
          context.fillRect(x, y, 2, 2);
        }
      }

      A += 0.07;
      B += 0.03;
      requestAnimationFrame(renderFrame);
    }

    renderFrame();

    return () => {
      document.body.removeChild(canvas);
    };
  }, []);

  return null;
}
