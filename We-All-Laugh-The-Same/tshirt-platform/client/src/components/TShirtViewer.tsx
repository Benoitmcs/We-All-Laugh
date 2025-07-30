import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture, OrbitControls, Environment, Lightformer,  Decal, useGLTF, ContactShadows } from '@react-three/drei';

import * as THREE from 'three';
import { GLTF } from 'three-stdlib';

interface ModelProps {
  modelUrl: string;
  textureUrl: string;
  color: string;
  position?: [number, number, number];
}

type GLTFResult = GLTF & {
  nodes: {
    Male_Tshirt: THREE.Mesh;
  };
  materials: {
    initialShadingGroup: THREE.MeshStandardMaterial;
  };
};

function TShirt(props: ModelProps) {
  const { nodes, materials } = useGLTF(props.modelUrl) as unknown as GLTFResult;
  const frontTexture = useTexture(props.textureUrl);
  const backTexture = useTexture('/images/Respect Others line of type WHITE.png');
  const fabricTexture = useTexture('/images/textures.png');
  fabricTexture.wrapS = fabricTexture.wrapT = THREE.RepeatWrapping;
  fabricTexture.repeat.set(10, 10);
  const ref = useRef<THREE.Mesh>(null!);
  return (
    <mesh
      ref={ref}
      geometry={nodes.Male_Tshirt.geometry}
      material={materials.initialShadingGroup}
      material-color={props.color}
      material-normalMap={fabricTexture}
      material-roughness={0.8}
      material-metalness={0.1}
      {...props}
      dispose={null}
    >
      <Decal position={[0, 46, 5]} rotation={[0, 0, 0]} scale={[25.2, 9.5, 30]} map={frontTexture} />
      <Decal position={[0, 46, -15]} rotation={[0, Math.PI, 0]} scale={[25.2, 7, 30]} map={backTexture} />
    </mesh>
  );
}


function TShirtViewer({ modelUrl, textureUrl, color }: ModelProps) {
  return (
    <Canvas camera={{ position: [0, 0, 100], fov: 30, far: 1000 }}>
      <ambientLight intensity={0.8} />
      <color attach="background" args={['#9e9e9e']} />
    
      <ContactShadows resolution={1024} frames={1} position={[0, -45, 0]} scale={15} blur={0.5} opacity={1} far={20} />
      <Environment resolution={512}>
        {/* Ceiling */}
        <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 4, -9]} scale={[10, 1, 1]} />
        <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 4, -6]} scale={[10, 1, 1]} />
        <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 4, -3]} scale={[10, 1, 1]} />
        <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 4, 0]} scale={[10, 1, 1]} />
        <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 4, 3]} scale={[10, 1, 1]} />
        <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 4, 6]} scale={[10, 1, 1]} />
        <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 4, 9]} scale={[10, 1, 1]} />
        {/* Sides */}
        <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-50, 2, 0]} scale={[100, 2, 1]} />
        <Lightformer intensity={2} rotation-y={-Math.PI / 2} position={[50, 2, 0]} scale={[100, 2, 1]} />
        {/* Key */}
        <Lightformer form="ring" color="red" intensity={10} scale={2} position={[10, 5, 10]} onUpdate={(self) => self.lookAt(0, 0, 0)} />
      </Environment>
      <Suspense fallback={null}>
        <TShirt position={[0, -40, -70]} modelUrl="/models/scene.gltf" textureUrl={textureUrl} color={color} />
      </Suspense>
      <OrbitControls target={[0, -10, -70]} enablePan={false} enableZoom={false} minPolarAngle={Math.PI / 2.2} maxPolarAngle={Math.PI / 2.2} />
    </Canvas>
  );
}

export default TShirtViewer;
