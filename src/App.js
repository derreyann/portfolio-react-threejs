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
  Outline
} from "@react-three/postprocessing";
import { Model } from "./Model";
import { getProject } from "@theatre/core";
import { editable as e, SheetProvider, PerspectiveCamera } from "@theatre/r3f";

// our Theatre.js project sheet, we'll use this later
const demoSheet = getProject("Demo Project").sheet("Demo Sheet");

export default function Viewer() {
  const ref = useRef();
  return (
    <Canvas shadows dpr={[1, 2]} camera={{ fov: 50 }}>
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
            shadow-mapSize={1024}
          />
          <Bounds>
            <Selection>
              <SelectToZoom>
                <Model />
              </SelectToZoom>
            </Selection>
          </Bounds>
          <EffectComposer disableNormalPass>
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
          </EffectComposer>
        </SheetProvider>
        <BakeShadows />
        <AdaptiveDpr />
        <Movable />
      </Suspense>
    </Canvas>
  );
}

function Movable() {
  useFrame((state, delta) => {
    easing.damp3(
      state.camera.position,
      [
        -1 + (state.pointer.x * state.viewport.width) / 4,
        (2 + state.pointer.y) / 1,
        7
      ],
      0.5,
      0.08
    );
  });
}

// This component wraps children in a group with a click handler
// Clicking any object will refresh and fit bounds
function SelectToZoom({ children }) {
  const api = useBounds();
  const [selectedObjectName, setSelectedObjectName] = useState("");

  return (
    <>
      <group
        onClick={(e) => (
          e.stopPropagation(),
          setSelectedObjectName(e.object.name),
          console.log(selectedObjectName),
          api.refresh(e.object).fit()
        )}
        onPointerMissed={(e) => e.button === 0}
      >
        {children}
      </group>
    </>
  );
}
