import React, { useEffect, useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { CameraController } from "./scene/CameraController";
import { SphereImage } from "./scene/SphereImage";

const imagePaths = [
  "/images/29_Final_cmpr.png",
  "/images/48_Final_cmpr.png",
  "/images/55_Final_cmpr.png",
  "/images/95_Final_cmpr.png",
];

const usePreloadTextures = (initialIndex) => {
  // State to hold the loaded textures
  const [textures, setTextures] = useState([]);

  // Load only the initial image on first render
  useEffect(() => {
    const initialTextureLoader = new THREE.TextureLoader();
    initialTextureLoader.load(imagePaths[initialIndex], (texture) => {
      setTextures((prevTextures) => {
        const newTextures = [...prevTextures];
        newTextures[initialIndex] = texture;
        return newTextures;
      });

      // Preload the rest of the images
      imagePaths.forEach((path, index) => {
        if (index !== initialIndex) {
          initialTextureLoader.load(path, (loadedTexture) => {
            setTextures((prevTextures) => {
              const newTextures = [...prevTextures];
              newTextures[index] = loadedTexture;
              return newTextures;
            });
          });
        }
      });
    });
  }, [initialIndex]);

  return textures;
};

function ImageViewer({ imageIndex }) {
  const [controlType, setControlType] = useState("orbit");
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const textures = usePreloadTextures(0); // Preload textures with the first as initial

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
    <div style={{ flex: 4, zIndex: 2 }}>
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
          <SphereImage texture={textures[imageIndex] || textures[0]} />
        </Suspense>
      </Canvas>
    </div>
  );
}

const MemoizedImageViewer = React.memo(ImageViewer);
export default MemoizedImageViewer;

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
