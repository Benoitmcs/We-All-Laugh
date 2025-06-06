// client/src/components/TShirtViewer.tsx
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment } from '@react-three/drei';

export default function TShirtViewer({ modelUrl, color }) {
  const {scene} = useGLTF(modelUrl);
  return (
    <Canvas camera={{ position: [0, 1.2, 2.2], fov: 45 }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 3, 3]} intensity={0.8} />
      <primitive
        object={scene}
        material-color={color}
        dispose={null}
      />
      <OrbitControls enablePan={false} />
      <Environment preset="studio" />
    </Canvas>
  );
}
