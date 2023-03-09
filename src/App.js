import React, { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame, extend } from "@react-three/fiber";
import { easing } from "maath";
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
  RenderTexture
} from "@react-three/drei";
import {
  TextureLoader,
  MeshBasicMaterial,
  CanvasTexture,
  RepeatWrapping,
  Color
} from "three";
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
import * as THREE from "three"
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
      dpr={[0.3, 1]}
      camera={{ fov: 50 }}
    >
      <color attach="background" args={["black"]} />
      <Suspense fallback={null}>
        <SheetProvider sheet={demoSheet}>
          <PerspectiveCamera
            theatreKey="Camera"
            makeDefault
            position={[
              -1.4235082949646687,
              0.20562504834542494,
              12.610933351075456
            ]}
            rotation={[
              0.3788855445285419,
              -0.05488506456904811,
              -0.008547619429015501
            ]}
            fov={44.39999999999997}
            resolution={128}
            lookAt={(0, 0, 0)}
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
          <EffectComposer resolutionScale={0.10} disableNormalPass>
            <Bloom
              luminanceThreshold={0}
              mipmapBlur
              luminanceSmoothing={2.0}
              intensity={3.5}
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
  const target = new THREE.Vector3(0, 2, 0); //
  const [landscapeMode, setLandscapeMode] = useState(getLandscapeMode());

   useFrame(() => {
    function handleOrientationChange() {
      setLandscapeMode(getLandscapeMode());
    }
    function handleResize() {
      setLandscapeMode(getLandscapeMode());
    }
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  function getLandscapeMode() {
    const mql = window.matchMedia('(orientation: landscape)');
    return mql.matches;
  }
  const dampingFactor = landscapeMode ? 6 : 0.76;

//console.log(landscapeMode);
  useFrame((state, delta) => {
    if (!enabled) return; // if not enabled, skip the parallax


    easing.damp3(
      state.camera.position,
      [
        -1 + (state.pointer.x * state.viewport.width)/dampingFactor,
        (2 + state.pointer.y) / 4,
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
  var i = 0;
  const [selectedObjectName, setSelectedObjectName] = useState("");
  //console.log(children.type);
  const [selectedMeshName, setSelectedMeshName] = useState("");
  const [ObjectTexture, setObjectTexture] = useState("");
  const [movableEnabled, setMovableEnabled] = useState(true);
  const onMeshClick = (mesh) => {
    setSelectedMeshName(mesh.name);
    console.log(mesh.name);
  };
  return (
    <group
      onClick={(e) => {
        //console.log(e.object.name);
        e.stopPropagation();
        setObjectTexture(e.object.material);
        setSelectedMeshName(e.object);
        i++
        if (
          (e.object.type === "Mesh" && e.object.name.includes("Plane")) ||
          e.object.name.includes("named")
        ) {
          console.log("Yes!");
          api.refresh(e.object).fit();
          setMovableEnabled(false);
          if (e.object.name === "named") {
            if (i===1) {
              window.open(
                "https://www.linkedin.com/in/yannderre/",
                "_blank"
              );
            }
            i++;
            console.log(i);
          }
          if (e.object.name === "Plane1") {
            console.log("yepee");
            /* 
            const canvas = document.createElement("canvas");
            canvas.width = 256;
            canvas.height = 256;

            // Render the HTML onto the canvas
            const ctx = canvas.getContext("2d");
            ctx.font = "50px serif";
            ctx.fillStyle = "white";
            ctx.font = "20px Arial";
            ctx.fillText("Hello world", 40, 20);
            console.log(ctx);
            // Create a texture from the canvas
            const texture = new CanvasTexture(canvas);
            texture.wrapS = RepeatWrapping;
            texture.repeat.x = -1;
            texture.offset.x = -0.4;
            console.log(texture);
            
            setObjectTexture(e.object.material);
            setSelectedMeshName(e.object); 
            // Render the HTML as a texture on the plane
            //const texture = new TextureLoader().load(`data:text/html;charset=utf-8,${escape(html)}`);

            e.object.material = new MeshBasicMaterial({
              map: texture
            });
            console.log(e.object.material);

            e.object.material.needsUpdate = true;
            */
          }
        } else {
          console.log("Quit!");
          /*selectedMeshName.material = ObjectTexture;
          selectedMeshName.material.needsUpdate = true;
          */
          setMovableEnabled(true);
          e.button === 0;
          i = 0;
          console.log(i);
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
