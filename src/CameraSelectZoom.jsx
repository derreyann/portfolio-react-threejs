import { useFrame, useThree } from "@react-three/fiber";
import React, { useState } from "react";
import * as THREE from "three";

import Camera from "./Camera";

/*
  This component allows the user to select an object to zoom in on.
*/


export default function CameraSelectZoom({ children, movableEnabled, setMovableEnabled }) {
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
      {movableEnabled && <Camera camera={camera} />}
    </group>
  );
}

