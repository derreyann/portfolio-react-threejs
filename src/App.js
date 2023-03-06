import React, { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { easing } from "maath";
import {
  OrbitControls,
  Stage,
  useGLTF,
  MeshReflectorMaterial,
  BakeShadows,
  Bounds,
  useBounds,
  AdaptiveDpr
} from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  DepthOfField,
  Selection,
  Select,
  Outline,
  Noise
} from "@react-three/postprocessing";
import { Model } from "./Model";
import { getProject } from "@theatre/core";
import { editable as e, SheetProvider, PerspectiveCamera } from "@theatre/r3f";

// our Theatre.js project sheet, we'll use this later
const demoSheet = getProject("Demo Project").sheet("Demo Sheet");

export default function App() {
  const ref = useRef();

  const [selectedMeshName, setSelectedMeshName] = useState("");
  const onMeshClick = (mesh) => {
    setSelectedMeshName(mesh.name);
    console.log(mesh.name);
    // other logic to zoom in or perform other actions on the selected mesh
  };
  return (
    <Canvas
      shadows
      width="128"
      height="128"
      dpr={[0.5, 1]}
      camera={{ fov: 50 }}
    >
      <color attach="background" args={["black"]} />
      <Suspense fallback={null}>
        <SheetProvider sheet={demoSheet}>
          <PerspectiveCamera
            theatreKey="Camera"
            makeDefault
            position={[
              -1.4282351749863542,
              1.9280055012114659,
              5.387221232059973
            ]}
            rotation={[
              0.3854694407877629,
              -0.18858033039394448,
              0.045536966019567054
            ]}
            fov={44.39999999999997}
            resolution={256}
          />
          <hemisphereLight intensity={0.15} groundColor="black" />
          <e.spotLight
            theatreKey="Light"
            position={[
              -7.321508953834595,
              134.55811607486405,
              -41.339696743147556
            ]}
            angle={0.12}
            penumbra={1}
            intensity={1}
            castShadow
            shadow-mapSize={512}
          />
          <Bounds observe margin={1.2}>
            <Selection>
              <SelectToZoom>
                <Model SelectToZoom={onMeshClick} />
              </SelectToZoom>
            </Selection>
          </Bounds>
          <AdaptiveDpr pixelated />
          <EffectComposer resolutionScale={0.24} disableNormalPass>
            <Bloom
              luminanceThreshold={0}
              mipmapBlur
              luminanceSmoothing={0.0}
              intensity={4}
            />
            <DepthOfField
              target={[7.7609, 8.6284, -5.1878]}
              focalLength={0.01}
              bokehScale={15}
              height={300}
            />
            <Outline
              blur
              visible
              EdgeColor="green"
              edgeStrength={100}
              width={500}
            />
            <Noise opacity={0.05} />
          </EffectComposer>
        </SheetProvider>
        <BakeShadows />
      </Suspense>
    </Canvas>
  );
}

function Movable() {
  const [enabled, setEnabled] = useState(true);

  useFrame((state, delta) => {
    if (!enabled) return; // if not enabled, skip the parallax

    easing.damp3(
      state.camera.position,
      [
        -1 + (state.pointer.x * state.viewport.width) / 4,
        (2 + state.pointer.y) / 1,
        7
      ],
      0.5,
      delta
    );
  });

  return null; // Movable doesn't need to return any elements
}
// This component wraps children in a group with a click handler
// Clicking any object will refresh and fit bounds
function SelectToZoom({ children }) {
  const api = useBounds();
  const [selectedObjectName, setSelectedObjectName] = useState("");
  console.log(children.type);
  const [selectedMeshName, setSelectedMeshName] = useState("");
  const [movableEnabled, setMovableEnabled] = useState(true);
  const onMeshClick = (mesh) => {
    setSelectedMeshName(mesh.name);
    console.log(mesh.name);
  };
  return (
    <group
      onClick={(e) => {
        e.stopPropagation();
        if (e.object.type === "Mesh" && e.object.name.includes("Plane")) {
          console.log("Yes!");
          api.refresh(e.object).fit();
          setMovableEnabled(false);
        } else {
          console.log("Quit!");
          e.button === 0;
          setMovableEnabled(true);
        }
      }}
    >
      {children}
      {movableEnabled && <Movable />} // conditionally render the Movable
      component
    </group>
  );
}
/*
    <>
          <group
      onClick={(e) => {
        e.stopPropagation();
        if (e.object.type === "Mesh" && e.object.name.includes("Plane")) {
          console.log("Yes!")
          api.refresh(e.object).fit();
        }
      }}
      onPointerMissed={(e) => e.button === 0}
    >

        {children}
      </group>
    </>
  );
}
*/
