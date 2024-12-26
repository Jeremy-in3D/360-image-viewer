import React, { useEffect, useRef, useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  useTexture,
  // Sphere,
  // useVideoTexture,
} from "@react-three/drei";
import * as THREE from "three";

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

function ImageViewer({ imageIndex }) {
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
    <div style={{ flex: 1, zIndex: 2 }}>
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
      <Canvas
        linear={true}
        style={{ height: "100%" }}
        toneMapping={THREE.NoToneMapping}
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
  const texture = usePreloadedTextures(imagePaths)[imageIndex]; // Ensure index is passed properly

  return (
    <mesh scale={[-1, 1, 1]}>
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

// const SphereVideo = ({ videoPath }) => {
//   const videoRef = useRef();

//   useEffect(() => {
//     if (!videoRef.current) {
//       const video = document.createElement("video");
//       video.src = videoPath;
//       video.crossOrigin = "anonymous"; // optional, based on where you're loading the video from
//       video.loop = true; // loop the video
//       video.muted = true; // muted for autoplay
//       video.play(); // start playing the video
//       videoRef.current = new VideoTexture(video);
//     }
//   }, [videoPath]);

//   return (
//     <mesh>
//       <sphereGeometry args={[500, 60, 40]} />
//       <meshBasicMaterial map={videoRef.current} side={THREE.BackSide} />
//     </mesh>
//   );
// };
