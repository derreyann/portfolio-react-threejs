import { Canvas, useFrame, useThree } from "@react-three/fiber";
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
  PerspectiveCamera,
  SpotLight,
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
import * as THREE from "three";
import { Model } from "./Model";
import { clamp } from "three/src/math/MathUtils";
import ReturnButton from "./returnButton";
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
      <Canvas shadows width="128" height="128" dpr={[0.3, 0.6]}>
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
                <SelectToZoom
                  setMovableEnabled={setMovableEnabled2}
                  movableEnabled={movableEnabled2}
                >
                  <Model
                    SelectToZoom={onMeshClick}
                    movableEnabled={movableEnabled2}
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

function Movable({ camera }) {
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
        camera.position,
        [
          -1 + (state.pointer.x * state.viewport.width) / dampingFactor,
          (2 + state.pointer.y) / 4,
          7,
        ],
        0.5,
        delta
      );
      easing.damp3(
        camera.rotation,
        [0.3788855445285419, -0.05488506456904811, -0.008547619429015501],
        0.5,
        delta
      );
    } else {
      const direction = navigator.maxTouchPoints ? -1 : -1;
      easing.damp3(
        camera.rotation,
        [
          0,
          clamp(
            (1.1 *
              direction *
              state.pointer.x *
              state.viewport.width *
              Math.PI) /
              rotatedampingFactor,
            -0.8,
            0.8
          ),
          0,
        ],
        0.98,
        delta
      );
      easing.damp3(
        camera.position,
        [0, 5 + (state.pointer.y * state.viewport.height) / 10, 5],
        0.5,
        delta
      );
    }
  });
  return null;
}

function SelectToZoom({ children, movableEnabled, setMovableEnabled }) {
  const [targetPosition, setTargetPosition] = useState(null);
  const [targetQuaternion, setTargetQuaternion] = useState(null);
  const [readyQuit, setreadyQuit] = useState(false);
  const [selectedMesh, setSelectedMesh] = useState();

  const { camera } = useThree(); // Access the camera

  // Move camera to the front of the TV with easing
  const moveCameraToFrontOfTV = (mesh) => {
    const frontDirection = new THREE.Vector3(0, -1, 0); // Default front direction
    const worldQuaternion = new THREE.Quaternion();

    // Get the mesh's world position and world quaternion (important for correct orientation)
    const worldPosition = new THREE.Vector3();
    mesh.getWorldPosition(worldPosition); // Get the position in world space
    mesh.getWorldQuaternion(worldQuaternion); // Get the world rotation (not just local)

    // Apply the world quaternion to the front direction
    frontDirection.applyQuaternion(worldQuaternion);

    const distanceFromTV = 5.5; // Set a fixed distance in front of the TV
    const cameraTargetPosition = worldPosition
      .clone()
      .add(frontDirection.multiplyScalar(-distanceFromTV)); // Position the camera in front of the TV

    // Set the target position and quaternion
    setTargetPosition(cameraTargetPosition);
    setTargetQuaternion(
      camera.quaternion
        .clone()
        .setFromRotationMatrix(
          new THREE.Matrix4().lookAt(
            cameraTargetPosition,
            worldPosition,
            camera.up
          )
        )
    );
  };

  // Interpolate camera position and rotation using damping
  useFrame(() => {
    if (!movableEnabled && targetPosition && targetQuaternion) {
      // Use damping for position
      camera.position.lerp(targetPosition, 0.05); // Adjust damping factor (0.05) to control the speed
      camera.quaternion.slerp(targetQuaternion, 0.05); // Damping for rotation

      camera.updateProjectionMatrix(); // Update the camera's projection matrix
    }
  });

  return (
    <group
      onPointerDown={(e) => {
        e.stopPropagation();

        // Only trigger if the object is a Plane or named
        const clickedObject = e.object;
        if (
          e.object.name.includes("Plane") ||
          e.object.name.includes("named")
        ) {
          setMovableEnabled(false);
          moveCameraToFrontOfTV(clickedObject);
          setSelectedMesh(clickedObject);
          let quitTimer = setTimeout(() => {
            setreadyQuit(true); // Now it's ready to quit after delay
          }, 250);

          // Clear the timer if any new pointer events fire
          return () => clearTimeout(quitTimer);
        }
      }}
      onPointerUp={(e) => {
        e.stopPropagation();

        // If the camera is ready to quit and movement was disabled
        if (readyQuit && !movableEnabled) {
          // Only re-enable movable if not a Plane, named, or Mesh
          if (
            !(
              e.object.name.includes("Plane") ||
              e.object.name.includes("named") ||
              !e.object.type == "Mesh"
            )
          ) {
            setMovableEnabled(true);
          }
        }
        setreadyQuit(false); // Reset readyQuit flag on pointer up
      }}
    >
      {children}
      {movableEnabled && <Movable camera={camera} />}
    </group>
  );
}
