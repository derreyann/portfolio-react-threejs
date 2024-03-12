import { Canvas, useFrame } from "@react-three/fiber";
import { easing } from "maath";
import React, { Suspense, useRef, useState } from "react";

import {
  AdaptiveDpr,
  AdaptiveEvents,
  BakeShadows,
  Bounds,
  Bvh,
  Loader,
  OrbitControls,
  PerformanceMonitor,
  Sparkles,
  useBounds,
} from "@react-three/drei";
import {
  Autofocus,
  Bloom,
  ChromaticAberration,
  EffectComposer,
  Noise,
  Selection,
  Sepia,
} from "@react-three/postprocessing";
import { getProject } from "@theatre/core";
import { PerspectiveCamera, SheetProvider, editable as e } from "@theatre/r3f";
import "pepjs";
import * as THREE from "three";
import { Model } from "./Model";
import { clamp } from "three/src/math/MathUtils";
const demoSheet = getProject("Demo Project").sheet("Demo Sheet");
export default function App() {
  const ref = useRef();
  const [movableEnabled, setMovableEnabled] = useState(true);

  const [selectedMeshName, setSelectedMeshName] = useState("");
  const onMeshClick = (mesh) => {
    setSelectedMeshName(mesh.name);
  };

  return (
    <>
      <Canvas shadows width="128" height="128" dpr={[0.3,0.6]}>
        <color attach="background" args={["black"]} />
        <Suspense fallback={null}>
        <Bvh firstHitOnly>
          <SheetProvider sheet={demoSheet}>
            <PerspectiveCamera
              theatreKey="Camera"
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
            <e.spotLight
              theatreKey="Light"
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
                <SelectToZoom
                  setMovableEnabled={setMovableEnabled}
                  movableEnabled={movableEnabled}
                >
                  <Model
                    SelectToZoom={onMeshClick}
                    movableEnabled={movableEnabled}
                  />
                  <BakeShadows />
                </SelectToZoom>
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
          </SheetProvider>
          <BakeShadows />
          <AdaptiveDpr pixelated />
          <AdaptiveEvents/>
        </Bvh>
        </Suspense>
      </Canvas>
      <Loader
        containerStyles={styles.container}
        dataStyles={styles.data}
        barStyles={styles.bar}
        innerStyles={styles.inner}
      />
    </>
  );
}

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

function Movable() {
  const [enabled, setEnabled] = useState(true);
  const target = new THREE.Vector3(0, 2, 0);
  const [landscapeMode, setLandscapeMode] = useState(getLandscapeMode());

  useFrame(() => {
    function handleOrientationChange() {
      setLandscapeMode(getLandscapeMode());
    }
    function handleResize() {
      setLandscapeMode(getLandscapeMode());
    }
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleOrientationChange);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleOrientationChange);
    };
  }, []);

  function getLandscapeMode() {
    const mql = window.matchMedia("(orientation: landscape)");
    return mql.matches;
  }
  const dampingFactor = landscapeMode ? 6 : 0.8;
  const rotatedampingFactor = landscapeMode ? 100 : 15;

  useFrame((state, delta) => {
    if (!enabled) return;

    if (landscapeMode) {
      easing.damp3(
        state.camera.position,
        [
          -1 + (state.pointer.x * state.viewport.width) / dampingFactor,
          (2 + state.pointer.y) / 4,
          7,
        ],
        0.5,
        delta
      );
      easing.damp3(
        state.camera.rotation,
        [0.3788855445285419, -0.05488506456904811, -0.008547619429015501],
        0.5,
        delta
      );
    } else {
      const direction = navigator.maxTouchPoints ? -1 : -1;
      easing.damp3(
        state.camera.rotation,
        [
          0,
          clamp((1.1*direction * state.pointer.x * state.viewport.width * Math.PI) /
            rotatedampingFactor, -0.8,0.8),
          0,
        ],
        0.98,
        delta
      );
      easing.damp3(
        state.camera.position,
        [ 0, 5 + (state.pointer.y * state.viewport.height) / 10, 5],
        0.5,
        delta
      );
    }
  });
  return null;
}

function SelectToZoom({ children }) {
  const api = useBounds();
  const [movableEnabled2, setMovableEnabled2] = useState(true);
  const [selectedMesh, setSelectedMesh] = useState();
  return (
    <group
      onPointerDown={(e) => {
        e.stopPropagation();
        if (
          e.object.name.includes("Plane") ||
          e.object.name.includes("named")
        ) {
          api.refresh(e.object).fit();
          setTimeout(() => {
          setSelectedMesh(e.object.position);
          setMovableEnabled2(false);
        }, 100);
        }
      }}
      onPointerUp={(e) => {
        e.stopPropagation();
          if (!movableEnabled2) {
            if (
              !(e.object.name.includes("Plane") || e.object.name.includes("named") || !e.object.type == "Mesh")
              )
              setMovableEnabled2(true);
            }
      }}
    >
      {children}
      {movableEnabled2 && <Movable/>}
      <OrbitControls
        enabled={!movableEnabled2}
        makeDefault
        target={selectedMesh}
        target0={selectedMesh}
        enableZoom={false}
        dampingFactor={0.003}

        autoRotate={false}
        enableDamping
      />
    </group>
  );
}

