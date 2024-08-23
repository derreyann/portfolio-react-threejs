import { useFrame } from "@react-three/fiber";
import { easing } from "maath";
import { useState } from "react";
import * as THREE from "three";
import { clamp } from "three/src/math/MathUtils";


/*
 Handles the camera movement based on the device orientation and pointer position.
*/

export default function Camera({ camera }) {
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
