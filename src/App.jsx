import React, { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame, extend } from "@react-three/fiber";
import { easing } from "maath";

import HeroPage from "./HeroPage";
import "pepjs";
import {
  OrbitControls,
  Stage,
  useGLTF,
  MeshReflectorMaterial,
  BakeShadows,
  Bounds,
  useBounds,
  AdaptiveDpr,
  useCursor,
  RenderTexture,
  Loader,
  Html,
  Sparkles,
} from "@react-three/drei";
import {
  TextureLoader,
  MeshBasicMaterial,
  CanvasTexture,
  RepeatWrapping,
  Color,
} from "three";
import {
  EffectComposer,
  Bloom,
  DepthOfField,
  Selection,
  Select,
  Outline,
  Noise,
} from "@react-three/postprocessing";
import { Model } from "./Model";
import { getProject } from "@theatre/core";
import { editable as e, SheetProvider, PerspectiveCamera } from "@theatre/r3f";
import * as THREE from "three";
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
      <Canvas
        shadows
        width="128"
        height="128"
        dpr={[0.3, 0.6]}
      >
        <color attach="background" args={["black"]} />
        <Suspense fallback={null}>
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
                </SelectToZoom>
              </Selection>
            </Bounds>
            <AdaptiveDpr pixelated />
            <Sparkles
              position={[0, 4, 0]}
              count={200}
              scale={10}
              size={0.85}
              speed={0.1}
              color={"#eeeeee"}
            />
            <EffectComposer resolutionScale={0.1} disableNormalPass>
              <Bloom
                luminanceThreshold={0}
                mipmapBlur
                luminanceSmoothing={1.0}
                intensity={3.5}
              />
              <DepthOfField
                target={[0.52, 4.04, -6.91]}
                focalLength={0.02}
                bokehScale={10}
                height={500}
              />
              <Noise opacity={0.035} />
            </EffectComposer>
          </SheetProvider>
          <BakeShadows />
        </Suspense>
      </Canvas>
      <Loader />
    </>
  );
}

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
      const direction = navigator.maxTouchPoints ? 1 : -1;
      easing.damp3(
        state.camera.rotation,
        [
          0,
          (direction * state.pointer.x * state.viewport.width * Math.PI) /
            rotatedampingFactor,
          0,
        ],
        0.98,
        delta
      );
      easing.damp3(
        state.camera.position,
        [0, 5 + (state.pointer.y * state.viewport.height) / 10, 5],
        0.5,
        delta
      );
    }
  });
  return null;
}

function SelectToZoom({ children, setMovableEnabled, movableEnabled }) {
  const api = useBounds();
  var i = 0;
  const [selectedObjectName, setSelectedObjectName] = useState("");
  const [selectedMeshName, setSelectedMeshName] = useState("");
  const [movableEnabled2, setMovableEnabled2] = useState(true);
  const [ObjectTexture, setObjectTexture] = useState("");
  const onMeshClick = (mesh) => {
    setSelectedMeshName(mesh.name);
  };
  return (
    <group
      onClick={(e) => {
        e.stopPropagation();
        setObjectTexture(e.object.material);
        setSelectedMeshName(e.object);
        i++;
        if (
          (e.object.type === "Mesh" && e.object.name.includes("Plane")) ||
          e.object.name.includes("named")
        ) {
          api.refresh(e.object).fit();

          setMovableEnabled2(false);
          if (e.object.name === "Plane1") {
          }
        } else {
          setMovableEnabled2(true);
          e.button === 0;
          i = 0;
        }
      }}
    >
      {children}
      {movableEnabled2 && <Movable />}
    </group>
  );
}