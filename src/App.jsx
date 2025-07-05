import {
  AdaptiveDpr,
  AdaptiveEvents,
  BakeShadows,
  Bounds,
  Bvh,
  Loader,
  PerspectiveCamera,
  Sparkles,
  SpotLight
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import {
  Autofocus,
  Bloom,
  ChromaticAberration,
  EffectComposer,
  Noise,
  Selection,
  Sepia,
} from "@react-three/postprocessing";
import React, { Suspense, useRef, useState, useEffect } from "react";

import { Model } from "./Model";
import ReturnButton from "./returnButton";
import CameraSelectZoom from "./CameraSelectZoom";


export default function App() {
  const ref = useRef();
  const [movableEnabled2, setMovableEnabled2] = useState(true);
  const [selectedMeshName, setSelectedMeshName] = useState("");

  const onMeshClick = (mesh) => setSelectedMeshName(mesh.name);
  const handleReturnClick = () => setMovableEnabled2(true);

  const [dpr, setDpr] = useState(() => Math.min(1, window.devicePixelRatio));

  return (
    <>
      <Canvas shadows dpr={dpr} performance={{ min: 0.2 }} onCreated={({ gl }) => {
        gl.domElement.style.imageRendering = "pixelated"; // Prevent pixelation
      }}
>
        <color attach="background" args={["black"]} />
        <Suspense fallback={null}>
          <Bvh firstHitOnly enabled={movableEnabled2}>
            <PerspectiveCamera
              makeDefault
              position={[-1.42, 0.21, 12.61]}
              rotation={[0.38, -0.05, -0.01]}
              fov={40}
              near={0.1}
              far={1000}
            />
            <hemisphereLight intensity={0.15} groundColor="black" />
            <SpotLight
              position={[-7.32, 134.56, -41.34]}
              angle={0.12}
              penumbra={1}
              intensity={0.8}
              castShadow
              shadow-mapSize={256}
              shadow-bias={-0.001}
            />
            <Bounds observe damping={3.5} margin={0.9}>
              <Selection>
                <CameraSelectZoom
                  setMovableEnabled={setMovableEnabled2}
                  movableEnabled={movableEnabled2}
                >
                  <Model
                    SelectToZoom={onMeshClick}
                    movableEnabled={movableEnabled2}
                    receiveShadow
                    castShadow
                    frustumCulled
                  />
                  <BakeShadows />
                </CameraSelectZoom>
              </Selection>
            </Bounds>
            <Sparkles
              position={[0, 4, 0]}
              count={100}
              scale={8}
              size={0.7}
              speed={0.2}
              color="#eeeeee"
            />
            <EffectComposer resolutionScale={0.5} enableNormalPass={0} multisampling={0}>
              <Bloom
                luminanceThreshold={0.1}
                mipmapBlur
                luminanceSmoothing={0.8}
                intensity={2.5}
              />
              <Autofocus mouse focalLength={2} bokehScale={0.4} height={500} />
            </EffectComposer>
            <AdaptiveDpr pixelated />
            <ChromaticAberration
                opacity={0.44}
                radialModulation
                offset={[0.002, 0.002]}
              />
              <Noise opacity={0.035} />
            <AdaptiveEvents />
          </Bvh>
        </Suspense>
      </Canvas>
      {!movableEnabled2 && <ReturnButton onClick={handleReturnClick} />}
      <Loader
        containerStyles={styles.container}
        dataInterpolation={(p) => `Loading ${p.toFixed(0)}%`}
        initialState={(active) => active}
      />
    </>
  );
}
/**
 * Custom Styles for the loader component
 */

const styles = {
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  inner: {
    width: 200,
    height: 3,
    background: "none",
    textAlign: "center",
    transition: "opacity 200ms ease-in-out",
  },
  bar: {
    height: 5,
    width: "100%",
    background: "white",
    position: "relative",
    transition: "transform 200ms ease-in-out",
    transformOrigin: "left center",
  },
  data: {
    display: "none",
  },
};
