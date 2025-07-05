import {
  PerspectiveCamera,
  Text
} from "@react-three/drei";

import { useEffect, useRef, useState } from "react";

import Screen2 from "./Screen2.jsx";

export default function TextScreen(props, x = 0, y = 1) {
  const [hovered2, hover2] = useState(false);
  const [clicked, click] = useState(false);
  const [textClicked, setTextClicked] = useState(false);
  const [bgColor, setBgColor] = useState("black");
  const [textColor, setTextColor] = useState("#b9ee8b");
  const [displayText, setDisplayText] = useState("hello :)");

  const ref = useRef();

  useEffect(() => {
    const intervalId = setInterval(() => {
      setBgColor((prevColor) => (prevColor === "black" ? "black" : "black"));
      setTextColor((prevColor) =>
        prevColor === "#b9ee8b" ? "orange" : "#b9ee8b"
      );

      setDisplayText(
        displayText === "hello :)"
          ? "click around... 👆"
          : "hello :)"
      );
    }, 3000);
    return () => clearInterval(intervalId);
  }, [displayText]);

  useEffect(() => {
    document.body.style.cursor = hovered2 ? "pointer" : "auto";
  }, [hovered2]);

  return (
    <Screen2 {...props}>
      <PerspectiveCamera
        makeDefault
        manual
        aspect={1 / 1}
        position={[0, 0, 10]}
      />
      <color attach="background" args={[bgColor]} />
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.75} />
      <pointLight position={[-10, -10, -10]} />

      <Text
        pointerEvents="none"
        ref={ref}
        onPointerOver={(event) => hover2(true)}
        onPointerOut={(event) => hover2(false)}
        onMouseUp={(event) => click(false)}
        font="./FragmentMono-Regular.ttf"
        position={[0, -0.8, 0]}
        rotation={[-Math.PI, 0, 0]}
        fontSize={1.25}
        letterSpacing={-0.0}
        color={textColor}
        maxWidth={1.75}
        whiteSpace="break-word"
      >
        {displayText}
      </Text>
    </Screen2>
  );
}
