import React, { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { CameraController } from "./scene/CameraController";
// import { SphereImage } from "./scene/SphereImage";
import {
  useTexture,
  // Sphere,
  // useVideoTexture,
} from "@react-three/drei";

const imagePaths = [
  "/images/29_Final_cmpr.png",
  "/images/48_Final_cmpr.png",
  "/images/55_Final_cmpr.png",
  "/images/95_Final_cmpr.png",
];

// Preload all textures at once
const usePreloadedTextures = (imagePaths) => {
  const textures = useTexture(imagePaths);
  return textures;
};

// const loadFirstImage = (
//   imageIdx,
//   hasFirstImageLoaded,
//   setHasFirstImageLoaded
// ) => {
//   if (!hasFirstImageLoaded) {
//     const texture = useTexture(imagePaths[imageIdx]);
//     setHasFirstImageLoaded(true);
//     return texture;
//   }
// };

function ImageViewer({ imageIndex }) {
  const [controlType, setControlType] = useState("orbit");
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  // const [hasFirstImageLoaded, setHasFirstImageLoaded] = useState(false);

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
      setPermissionsGranted(true);
    }
  };

  const handleToggle = () => {
    if (controlType === "orbit" && !permissionsGranted) {
      handleOrientationPermission();
    }
    setControlType((prev) => (prev === "orbit" ? "device" : "orbit"));
  };

  return (
    <div style={{ flex: 3, zIndex: 2 }}>
      <button
        onClick={handleToggle}
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          zIndex: 1,
          padding: 0,
          // padding: "10px 20px",
          // backgroundColor: "rgba(0, 0, 0, 0.5)",
          width: "15%",
          color: "white",
          border: "none",
          borderRadius: "5px",
          background: "none",
          cursor: "pointer",
        }}
      >
        {/* Toggle Control: {controlType} */}
        <img
          style={{ width: "100%", height: "100%", display: "block" }}
          src={
            controlType == "device"
              ? "/images/AR_mode.png"
              : "/images/phone_mode.png"
          }
        />
      </button>
      <Canvas
        linear={true}
        style={{ height: "100%" }}
        // toneMapping={THREE.NoToneMapping}
      >
        <ambientLight />
        <CameraController
          controlType={controlType}
          permissionsGranted={permissionsGranted}
        />
        <Suspense fallback={null}>
          <SphereImage
            imageIndex={imageIndex}
            // setHasFirstImageLoaded={setHasFirstImageLoaded}
            // hasFirstImageLoaded={hasFirstImageLoaded}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

const MemoizedImageViewer = React.memo(ImageViewer);
export default MemoizedImageViewer;

const SphereImage = ({
  imageIndex,
  // setHasFirstImageLoaded,
  // hasFirstImageLoaded,
}) => {
  const texture =
    // hasFirstImageLoaded;
    // ?
    usePreloadedTextures(imagePaths)[imageIndex];
  // : loadFirstImage(imageIndex, hasFirstImageLoaded, setHasFirstImageLoaded); // Ensure index is passed properly

  return (
    <mesh scale={[-1, 1, 1]}>
      <sphereGeometry args={[500, 60, 40]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
};

// GOOD VIDEO:

// const VideoSphere = ({ videoSrc }) => {
//   console.log({ videoSrc });
//   const videoTexture = useVideoTexture(videoSrc);
//   const sphereRef = useRef();

//   return (
//     <mesh ref={sphereRef} scale={[-1, 1, 1]}>
//       <sphereGeometry args={[500, 60, 40]} />
//       <meshBasicMaterial map={videoTexture} side={THREE.BackSide} />
//     </mesh>
//   );
// };

// const VidViewer = ({ videoSrc }) => {
//   return (
//     <Canvas style={{ border: "1px solid black", width: "100%", height: "80%" }}>
//       <ambientLight intensity={0.5} />
//       <VideoSphere videoSrc={videoSrc} />
//       <OrbitControls enableZoom={false} />
//     </Canvas>
//   );
// };

// export default VidViewer;
