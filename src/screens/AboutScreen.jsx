import { PerspectiveCamera, useTexture } from "@react-three/drei";
import { useEffect, useState } from "react";
import * as THREE from "three";

import GithubScreen from "./GitHubScreen";
import Screen from "./Screen";

export default function AboutScreen({
  imageUrls,
  movable,
  inside,
  webUrl,
  webUrl2,
  webUrl3,
  webUrl4,
  ...props
}) {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  const [imageIndex, setImageIndex] = useState(!hovered ? 0 : 1);
  const textures = imageUrls.map((imageUrl) => {
    const texture = useTexture(imageUrl);
    texture.flipY = false; // Flip texture along the Y-axis
    return texture;
  });

  useEffect(() => {
    if (clicked) {
      if (!hovered && imageIndex === textures.length - 1) {
        setImageIndex(1);
      } else if (hovered && imageIndex === textures.length - 1) {
        setImageIndex(1);
      } else {
        setImageIndex((imageIndex + 1) % textures.length);
      }
      setClicked(false);
    }
  }, [clicked, imageIndex, hovered, textures.length]);

  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "auto";
    if (!movable) {
      // if movable is disabled
      setImageIndex(imageIndex === 0 ? 1 : imageIndex); // check current index and set it to 1 if it's 0, otherwise keep the same index
    } else {
      // if movable is enabled
      setImageIndex(0);
    }
  }, [movable]);
  return (
    <Screen {...props}>
      <PerspectiveCamera
        makeDefault
        manual
        aspect={1 / 1}
        position={[0, 0, 2]}
        rotation={[0, 0, 0]}
      />
      <color attach="background" args={["#b9ee8b"]} />
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.75} />
      <pointLight position={[-10, -10, -10]} />

      <mesh
        rotation={[0, 0, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onPointerDown={(e) => {
          setClicked(!clicked);
          //console.log("clicked");
        }}
      >
        <planeGeometry args={[2, 2]} />
        <meshBasicMaterial
          attach="material"
          map={textures[imageIndex]}
          color={hovered ? "gray" : "lightgray"}
          opacity={clicked ? 0.5 : 1}
          reflectivity={0.5}
          transparent={true}
          needsUpdate={true}
        />
      </mesh>
      <GithubScreen webUrl={webUrl} position={[0.68, 0.62, 0]} />
      <IconMesh webUrl={webUrl2} position={[0.35, 0.62, 0]} />
      <LIMesh webUrl={webUrl3} position={[-0.0, 0.62, 0]} />
      <MailMesh webUrl={webUrl4} position={[-0.36, 0.62, 0]} />
    </Screen>
  );
}

export function IconMesh({ webUrl, ...props }) {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "auto";
  }, [clicked, hovered]);

  return (
    <mesh
      {...props}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        window.open(webUrl, "_blank");
      }}
      scale={[0.1, 0.1, 0.5]}
    >
      <planeGeometry args={[2, 2]} />
      <meshBasicMaterial
        attach="material"
        map={new THREE.TextureLoader().load("./spotify.png", (texture) => {
          texture.flipY = false; // set flipY to false to flip the texture vertically
          texture.needsUpdate = true; // update the texture after changing the flipY property
        })}
        color={hovered ? "orange" : "white"}
        opacity={hovered ? 0.5 : 1}
        transparent={true}
      />
    </mesh>
  );
}

export function LIMesh({ webUrl, ...props }) {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "auto";
  }, [clicked, hovered]);

  return (
    <mesh
      {...props}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        window.open(webUrl, "_blank");
      }}
      scale={[0.1, 0.1, 0.5]}
    >
      <planeGeometry args={[2, 2]} />
      <meshBasicMaterial
        attach="material"
        map={new THREE.TextureLoader().load("./linkedin.png", (texture) => {
          texture.flipY = false; // set flipY to false to flip the texture vertically
          texture.needsUpdate = true; // update the texture after changing the flipY property
        })}
        color={hovered ? "orange" : "white"}
        opacity={hovered ? 0.5 : 1}
        transparent={true}
      />
    </mesh>
  );
}

export function MailMesh({ webUrl, ...props }) {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "auto";
  }, [clicked, hovered]);

  return (
    <mesh
      {...props}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        window.open(webUrl, "_blank");
      }}
      scale={[0.1, 0.1, 0.5]}
    >
      <planeGeometry args={[2, 2]} />
      <meshBasicMaterial
        attach="material"
        map={new THREE.TextureLoader().load("./email.png", (texture) => {
          texture.flipY = false; // set flipY to false to flip the texture vertically
          texture.needsUpdate = true; // update the texture after changing the flipY property
        })}
        color={hovered ? "orange" : "white"}
        opacity={hovered ? 0.5 : 1}
        transparent={true}
      />
    </mesh>
  );
}
