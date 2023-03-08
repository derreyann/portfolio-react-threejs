import React, { Suspense, useRef, useState } from "react";
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
        -1 + (-state.pointer.x * state.viewport.width) / 4,
        (2 - state.pointer.y) / 1,
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
  console.log(children.type);
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
        console.log(e.object.name);
        e.stopPropagation();
        setObjectTexture(e.object.material);
        setSelectedMeshName(e.object);
        if (
          (e.object.type === "Mesh" && e.object.name.includes("Plane")) ||
          e.object.name.includes("named")
        ) {
          console.log("Yes!");
          api.refresh(e.object).fit();
          setMovableEnabled(false);
          if (e.object.name === "named") {
            if (i) {
              window.open(
                "https://lh3.googleusercontent.com/qGuzCBLELUWfUdSrptNl3-uIGaI012q4SON8eqzqHz2CWj45KJsK5U_MZqoJgGTcCWFgmO_Srt33_3g4QZQUaqOuAfJyCpFIznUoJWThQAekmaPRM9RaD8z5pMJLVV1IyCrMao8wPHQfErQyjndJsoPh3bjIxFkwMAovExOVBhXuftvnGooBnO101PSG7gQs8F8QJH__36QCGyQHcHHFAiK6acozvpKhIyoQ6nbI1kcIDcgOhwkdVd3pb4UyIoIBUt_KkIZBOPDjaFUjWtwtrM5mVCw-MWoyyua-T0KXWkBfONj6GyNeuIFkxViDGTwvNIVNLHLlRIe0XqS1nw0Qp4RxyKwKgdmQFigTPxrDXGe_l_Q-XoA2bKG7blZ9zwqgAIqkPwpRHllBV5nhvWnbdLkKgMztKpkUrxPPw4u_lQIJJnMacsNPfn-nV1C6c1jaZ906H3x5fEeudq3KYg1KfzKx6UlgGe7w3SKFgmp0lmkQ-xGeez_uiUa_GTNczvYXwO5YESvRyAj5pK6rzqn9izFjlaUGU-CqCHGyv8CrKT9icIcPlgsmZv_jW2HQQ9E7IPWilsZK-5pRgCoRlho1QCNVa-kQor2esxZeQTiDkR8FcJNdEodXnWKFE_jcZUEbcdrkS2JD2Zv37wydBULl7JTAQUdXn5x4VGpirVAQIZmz9-hhMBYCgpo4T1EgF7vwwu8v7l3LFQRd_kuUrM0z0uOCIh5rZomRbtcBUXnEaJJ_2FjWjNTYX7sBVGQrAoVgnWmdtggez7n5yD1h7yKCkorJGE3fKbp_1YAuj9TGPTL7l3ClIlPY5vLVxOkRe7v9P3BpBqwquXMTCoHpJWOzaEkDff0rIbgaaahsWsVqf1hqr832X8IwLbsv3Xk8SKD4bRFuG79H8L2wo8BKOto2u4clexxH0PLD6NiyMZ4u4M3gmq14zQ=w733-h693-no?authuser=0",
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
