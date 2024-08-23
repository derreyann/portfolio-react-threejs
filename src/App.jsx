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
import React, { Suspense, useRef, useState } from "react";

import { Model } from "./Model";
import ReturnButton from "./returnButton";
import CameraSelectZoom from "./CameraSelectZoom";


export default function App() {
  const ref = useRef();
  const [movableEnabled, setMovableEnabled] = useState(true);
  const [movableEnabled2, setMovableEnabled2] = useState(true);

  const [selectedMeshName, setSelectedMeshName] = useState("");
  const onMeshClick = (mesh) => {
    setSelectedMeshName(mesh.name);
  };
  const handleReturnClick = () => {
    setMovableEnabled2(true);
  };

  return (
    <>
      <Canvas shadows width="128" height="128" dpr={[0.45, 0.8]}>
        <color attach="background" args={["black"]} />
        <Suspense fallback={null}>
          <Bvh firstHitOnly>
            <PerspectiveCamera
              makeDefault
              position={[
                -1.4235082949646687, 0.20562504834542494, 12.610933351075456,
              ]}
              rotation={[
                0.3788855445285419, -0.05488506456904811, -0.008547619429015501,
              ]}
              fov={40}
              resolution={128}
              lookAt={(0, 0, 0)}
            />
            <hemisphereLight intensity={0.15} groundColor="black" />
            <SpotLight
              position={[
                -7.321508953834595, 134.55811607486405, -41.339696743147556,
              ]}
              angle={0.12}
              penumbra={1}
              intensity={1}
              castShadow
              shadow-mapSize={512}
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
                  />
                  <BakeShadows />
                </CameraSelectZoom>
              </Selection>
            </Bounds>
            <Sparkles
              position={[0, 4, 0]}
              count={200}
              scale={10}
              size={0.85}
              speed={0.1}
              color={"#eeeeee"}
            />
            <EffectComposer resolutionScale={1} enableNormalPass={0}>
              <Sepia intensity={0.3} />
              <Bloom
                luminanceThreshold={0}
                mipmapBlur
                luminanceSmoothing={1.0}
                intensity={3.5}
              />
              <Autofocus mouse focalLength={2} bokehScale={0.4} height={500} />
              <ChromaticAberration
                opacity={0.44}
                radialModulation
                offset={[0.002, 0.002]}
              />
              <Noise opacity={0.035} />
            </EffectComposer>
            <BakeShadows />
            <AdaptiveDpr pixelated />
            <AdaptiveEvents />
          </Bvh>
        </Suspense>
      </Canvas>
      {!movableEnabled2 && <ReturnButton onClick={handleReturnClick} />}
      <Loader
        containerStyles={styles.container}
        dataStyles={styles.data}
        barStyles={styles.bar}
        innerStyles={styles.inner}
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
