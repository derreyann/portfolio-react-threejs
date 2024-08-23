import RedirectMesh from "./RedirectMesh";
import Screen from "./Screen";

import { PerspectiveCamera, useTexture } from "@react-three/drei";
import "pepjs";
import { useEffect, useState } from "react";

export default function ImageScreen({
  imageUrls,
  movable,
  inside,
  webUrl,
  ...props
}) {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [imageIndex, setImageIndex] = useState(!hovered ? 0 : 1);
  const [webIndex, setWebIndex] = useState(0);
  const textures = imageUrls.map((imageUrl) => {
    const texture = useTexture(imageUrl);
    texture.flipY = false; // Flip texture along the Y-axis
    return texture;
  });
  const url = webUrl.map((webUrls) => {
    return webUrls;
  });

  useEffect(() => {
    if (clicked) {
      {
        console.log(imageIndex);
        setImageIndex((imageIndex + 1) % textures.length);
        setWebIndex((webIndex + 1) % url.length);
      }
      setClicked(false);
    }
    document.body.style.cursor = hovered ? "pointer" : "auto";
  }, [clicked, imageIndex, hovered, textures.length, webIndex]);

  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "auto";
    if (movable) {
      setImageIndex(0);
      setWebIndex(0);
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
        //make the cusor change to a pointer when hovering over the image
        onPointerOver={(e) => {
          setHovered(true);
        }}
        onPointerOut={(e) => {
          setHovered(false);
        }}
        onClick={(e) => {
          setClicked(!clicked);
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
      <RedirectMesh webUrl={url[webIndex]} position={[0.58, 0.62, 0]} />
    </Screen>
  );
}
