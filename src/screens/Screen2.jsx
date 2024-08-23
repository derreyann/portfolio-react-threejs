import { RenderTexture, useGLTF } from "@react-three/drei";

export default function Screen2({ named, frame, panel, children, ...props }) {
  const { nodes, materials } = useGLTF("/new new new scene.gltf");
  return (
    <group {...props}>
      <mesh
        name="named"
        castShadow
        receiveShadow
        geometry={nodes[frame].geometry}
        material={materials.Texture}
      />
      <mesh geometry={nodes[panel].geometry}>
        <meshBasicMaterial toneMapped={false}>
          <RenderTexture width={512} height={512} attach="map" anisotropy={16}>
            {children}
          </RenderTexture>
        </meshBasicMaterial>
      </mesh>
    </group>
  );
}
