import * as THREE from 'three'
import React, { Suspense, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Reflector, Text, useTexture, useGLTF, Stars} from '@react-three/drei'

export default function App() {

  return (
    <div className='w-full h-dvh z-0 relative'>
      <Canvas id="canvas" concurrent gl={{ alpha: false }} pixelRatio={[1, 1.5]} camera={{ position: [0, 6, 100], fov: 15}} dpr={[1,2]}>
        <color attach="background" args={['black']} />
        <fog attach="fog" args={['black', 15, 20]} />
        <Suspense fallback={null}>

          <group position={[0, -1, 0]}>
            <StaticText position={[0,0.5, -2]} />
            <Ground />
          </group>
          <spotLight position={[0, 10, 0]} intensity={0.5} />
          <directionalLight position={[+10, 0, 1]} intensity={2} />
          <Stars radius={100} depth={5} count={5000} factor={30} saturation={5} fade speed={1} />
          <Intro />
        </Suspense>
      </Canvas>
    </div>
  )
}

function StaticText(props) {
  return (
    <>
    <Text font="/Inter-Bold.woff" fontSize={2} letterSpacing={0} textAlign='center' {...props}>
      Big Text{"\n"}
      <meshBasicMaterial toneMapped={false}>
      </meshBasicMaterial>
    </Text>
    <Text font="/Inter-Bold.woff" fontSize={1} letterSpacing={-0.06} textAlign='center' {...props}>
        Small Text
    <meshBasicMaterial toneMapped={false}>
    </meshBasicMaterial>
  </Text>
  </>
  )
}

function Ground() {
  const [floor, normal] = useTexture(['/SurfaceImperfections003_1K_var1.jpg', '/SurfaceImperfections003_1K_Normal.jpg'])
  return (
    <Reflector blur={[400, 100]} resolution={512} args={[10, 10]} mirror={0.5} mixBlur={6} mixStrength={1.5} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
      {(Material, props) => <Material color="#a0a0a0" metalness={0.4} roughnessMap={floor} normalMap={normal} normalScale={[5, 5]} {...props} />}
    </Reflector>
  )
}


function Intro() {
  const [vec] = useState(() => new THREE.Vector3())
  return useFrame((state) => {
    state.camera.position.lerp(vec.set(state.mouse.x * 5, 3 + state.mouse.y * 2, 14), 0.05)
    state.camera.lookAt(0, 0, 0)
  })
}
