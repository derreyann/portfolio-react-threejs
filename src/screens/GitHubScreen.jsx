import { useEffect, useState } from "react";
import * as THREE from "three";

export default function GithubScreen({ webUrl, ...props }) {
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
        map={new THREE.TextureLoader().load("./github.png", (texture) => {
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
