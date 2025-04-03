import React, { useState, Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { CameraController } from "./scene/CameraController";
// import { SphereImage } from "./scene/SphereImage";
import {
  Preload,
  useTexture,
  // Sphere,
  // useVideoTexture,
} from "@react-three/drei";

const imagePaths = [
  "/images/29_Final_cmpr.webp",
  "/images/48_Final_cmpr.png",
  "/images/55_Final_cmpr.png",
  "/images/95_Final_cmpr.png",
];

const usePreloadedTextures = (imagePaths) => {
  const textures = useTexture(imagePaths);
  return textures;
};

function ImageViewer({ imageIndex, controlType, permissionsGranted }) {
  return (
    <div style={{ height: "100%", zIndex: 2 }}>
      <Canvas
        // linear={true}
        style={{ height: "100%" }}
        // tonemapping={THREE.NoToneMapping}
      >
        <Preload all />
        {/* <ambientLight /> */}
        <CameraController
          controlType={controlType}
          permissionsGranted={permissionsGranted}
        />
        <Suspense fallback={null}>
          <SphereImage imageIndex={imageIndex} />
        </Suspense>
      </Canvas>
    </div>
  );
}

const MemoizedImageViewer = React.memo(ImageViewer);
export default MemoizedImageViewer;

const SphereImage = ({ imageIndex }) => {
  const texture = usePreloadedTextures(imagePaths)[imageIndex];

  return (
    <mesh scale={[-1, 1, 1]}>
      <sphereGeometry args={[500, 40, 30]} />
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
