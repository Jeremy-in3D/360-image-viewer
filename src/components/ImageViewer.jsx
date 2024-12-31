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

const usePreloadedTextures = (imagePaths) => {
  const textures = useTexture(imagePaths);
  return textures;
};

function ImageViewer({ imageIndex, isMapVisible, setIsMapVisible }) {
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
          } else {
            alert("Device orientation permission denied.");
          }
        })
        .catch(console.error);
    } else {
      // Directly set permissions granted if explicit request function is not available
      // This is a fallback for browsers that may handle permissions natively or don't require them
      if ("ondeviceorientation" in window) {
        setPermissionsGranted(true);
      } else {
        alert("Your browser does not support device orientation.");
      }
    }
  };

  const handleToggle = () => {
    if (controlType === "orbit" && !permissionsGranted) {
      handleOrientationPermission();
    }
    setControlType((prev) => (prev === "orbit" ? "device" : "orbit"));
  };

  return (
    <div style={{ height: "100%", zIndex: 2 }}>
      <MapControlBtns
        handleToggle={handleToggle}
        controlType={controlType}
        isMapVisible={isMapVisible}
        setIsMapVisible={setIsMapVisible}
      />
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

const MapControlBtns = ({
  handleToggle,
  controlType,
  isMapVisible,
  setIsMapVisible,
}) => {
  return (
    <div
      style={{
        position: "absolute",
        zIndex: 20,
        bottom: "28%",
        width: "auto",
        right: "1%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-evenly",
        alignItems: "flex-end",
      }}
    >
      <button onClick={handleToggle} className="map-control-btn">
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
        className="map-control-btn"
        style={{ marginTop: "1.5em" }}
        onClick={() => setIsMapVisible(!isMapVisible)}
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
