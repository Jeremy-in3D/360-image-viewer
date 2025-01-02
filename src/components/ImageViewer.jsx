import React, { useState, Suspense, useEffect } from "react";
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

const usePreloadedTextures = (imagePaths) => {
  const textures = useTexture(imagePaths);
  return textures;
};

function ImageViewer({ imageIndex, controlType, permissionsGranted }) {
  return (
    <div style={{ height: "100%", zIndex: 2 }}>
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
      <sphereGeometry args={[500, 30, 20]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
};

export const MapControlBtns = ({
  handleToggle,
  controlType,
  isMapVisible,
  setIsMapVisible,
}) => {
  const [isMapIconClicked, setIsMapIconClicked] = useState(false);
  const [isOrientationIconClicked, setIsOrientationIconClicked] =
    useState(false);
  const [rerenderTrigger, setRerenderTrigger] = useState(false);

  useEffect(() => {
    // Trigger a rerender after 3 seconds
    if (!rerenderTrigger) {
      const timeoutId = setTimeout(() => {
        setRerenderTrigger(true);
      }, 3000);

      return () => clearTimeout(timeoutId); // Cleanup on component unmount
    }
  }, []);

  const handleMapControlsViewClick = () => {
    // Toggle the clicked state to trigger the animation
    setIsMapIconClicked(true);

    // Toggle the map visibility
    setIsMapVisible(!isMapVisible);

    // Remove the clicked state after the animation duration (300ms)
    setTimeout(() => setIsMapIconClicked(false), 300);
  };

  const handleOrientationToggleClick = () => {
    setIsOrientationIconClicked(true);
    handleToggle();
    setTimeout(() => setIsOrientationIconClicked(false), 300);
  };

  return (
    <div
      style={{
        position: "absolute",
        zIndex: 40,
        bottom: "25%",
        width: "auto",
        right: "1%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-evenly",
        alignItems: "flex-end",
        height: "16em",
      }}
    >
      <button
        onClick={handleOrientationToggleClick}
        className={`map-control-btn ${
          isOrientationIconClicked ? "clicked" : ""
        }`}
      >
        {/* Toggle Control: {controlType} */}
        <img
          style={{
            width: "80px",
            height: "100%",
            display: "block",
          }}
          src={
            controlType == "device"
              ? "/images/AR_mode.png"
              : "/images/phone_mode.png"
          }
        />
      </button>
      <button
        className={`map-control-btn ${isMapIconClicked ? "clicked" : ""}`}
        style={{ marginTop: "1.5em" }}
        // onClick={() => setIsMapVisible(!isMapVisible)}
        onClick={handleMapControlsViewClick}
      >
        <img
          style={{
            width: "80px",
            height: "100%",
            display: "block",
          }}
          src={isMapVisible ? "/images/map_down.png" : "/images/map_up.png"}
        />
      </button>
    </div>
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
