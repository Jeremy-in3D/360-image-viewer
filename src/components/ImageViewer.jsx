import React, { useEffect, useRef, useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import * as THREE from "three";

const imagePaths = [
  "/images/48.png",
  "/images/vecteezy_an-unforgettable-360-panorama-of-the-dolomites_20803210.jpg",
  "/images/49.png",
  "/images/vecteezy_an-unforgettable-360-panorama-of-the-dolomites_20803210.jpg",
];

function imageViewer({ imagePath }) {
  const [controlType, setControlType] = useState("orbit");
  const [permissionsGranted, setPermissionsGranted] = useState(false);

  const handleOrientationPermission = () => {
    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof DeviceOrientationEvent.requestPermission === "function"
    ) {
      DeviceOrientationEvent.requestPermission()
        .then((permissionState) => {
          if (permissionState === "granted") {
            setPermissionsGranted(true);
          }
        })
        .catch(console.error);
    } else {
      // Assume permissions are granted for browsers without the request system
      setPermissionsGranted(true);
    }
  };

  const handleToggle = () => {
    if (controlType === "orbit" && !permissionsGranted) {
      // Request permission before switching
      handleOrientationPermission();
    }
    setControlType((prev) => (prev === "orbit" ? "device" : "orbit"));
  };
  console.log("eh");
  return (
    <div
      style={{ position: "relative", border: "1px solid red", height: "50%" }}
    >
      <button
        onClick={handleToggle}
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          zIndex: 1,
          padding: "10px 20px",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Toggle Control: {controlType}
      </button>
      <Canvas style={{ height: "100%" }}>
        <ambientLight />
        <CameraController
          controlType={controlType}
          permissionsGranted={permissionsGranted}
        />
        <Suspense fallback={null}>
          <SphereImage imagePath={imagePath} />
        </Suspense>
      </Canvas>
    </div>
  );
}

const MemoizedImageViewer = React.memo(imageViewer);

export default MemoizedImageViewer;

const SphereImage = ({ imagePath }) => {
  console.log({ imagePath });
  const texture = useTexture(imagePath);

  return (
    <mesh>
      <sphereGeometry args={[500, 60, 40]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
};

const CameraController = ({ controlType, permissionsGranted }) => {
  const { camera } = useThree();
  const controlsRef = useRef();
  const animData = useRef({ alpha: 0, beta: 0, gamma: 0 });

  const handleOrientation = (event) => {
    animData.current.alpha = event.alpha || 0;
    animData.current.beta = event.beta || 0;
    animData.current.gamma = event.gamma || 0;

    // Debugging orientation data
    console.log(
      `Alpha: ${animData.current.alpha}, Beta: ${animData.current.beta}, Gamma: ${animData.current.gamma}`
    );
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
        THREE.MathUtils.degToRad(90 - beta), // THREE.MathUtils.degToRad(beta), // Adjust based on actual use case
        THREE.MathUtils.degToRad(-alpha),
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
