import React, { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  // Sphere,
  // useVideoTexture,
} from "@react-three/drei";
import * as THREE from "three";

export const CameraController = ({ controlType, permissionsGranted }) => {
  const { camera } = useThree();
  const controlsRef = useRef();
  const animData = useRef({ alpha: 0, beta: 0, gamma: 0 });

  const handleOrientation = (event) => {
    animData.current.alpha = event.alpha || 0;
    animData.current.beta = event.beta || 0;
    animData.current.gamma = event.gamma || 0;
  };

  useEffect(() => {
    if (controlType === "device" && permissionsGranted) {
      window.addEventListener("deviceorientation", handleOrientation, true);
    }
    return () => {
      window.removeEventListener("deviceorientation", handleOrientation, true);
    };
  }, [controlType, permissionsGranted]);

  useFrame(() => {
    if (controlType === "device" && animData.current) {
      const { alpha, beta } = animData.current;
      camera.rotation.set(
        THREE.MathUtils.degToRad(-(90 - beta)),
        THREE.MathUtils.degToRad(alpha),
        0,
        "YXZ"
      );
    }
    if (controlType === "orbit" && controlsRef.current) {
      controlsRef.current.update();
    }
  });

  return controlType === "orbit" ? (
    <OrbitControls ref={controlsRef} enableZoom={false} />
  ) : null;
};
