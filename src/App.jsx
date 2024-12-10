import React, { useEffect, useRef, useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Sky,
  PerspectiveCamera,
  useTexture,
} from "@react-three/drei";
import * as THREE from "three";
import "./App.css";

// QUERY PARAM EXAMPLE:  `https://yourapp.com?image=item1`
const imagePath =
  "/images/vecteezy_an-unforgettable-360-panorama-of-the-dolomites_20803210.jpg";
function App() {
  const [selectedImage, setSelectedImage] = useState(2);

  useEffect(() => {
    const updateHeight = () => {
      const doc = document.documentElement;
      doc.style.setProperty("--doc-height", `${window.innerHeight}px`);
    };

    window.addEventListener("resize", updateHeight);
    updateHeight();

    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const imageParam = queryParams.get("image");

    if (imageParam) {
      setSelectedImage(getImageBasedOnParam(imageParam));
    }
  }, []);

  const getImageBasedOnParam = (param) => {
    switch (param) {
      case "item1":
        return "path/to/image1.png";
      case "item2":
        return "path/to/image2.png";
      case "item3":
        return "path/to/image3.png";
      case "item4":
        return "path/to/image4.png";
      default:
        return null;
    }
  };

  return (
    <div className="app-wrapper">
      <h1 style={{ color: "yellow" }}>360 Image Viewer</h1>
      {/* <Image360Viewer imageSrc={imagePath} /> */}
      <MemoizedImage360ViewerTest imageSrc={imagePath} />
      <Map setSelectedImage={setSelectedImage} selectedImage={selectedImage} />
    </div>
  );
}

export default App;

const Map = ({ selectedImage, setSelectedImage }) => {
  const images = [0, 1, 2, 3];
  return (
    <div className="map-wrapper">
      {images.map((image, idx) => (
        <div
          key={`key-${idx}`}
          onClick={() =>
            selectedImage == image ? null : setSelectedImage(image)
          }
          style={{ border: selectedImage == image ? "3px solid yellow" : "" }}
          className="image-preview"
        ></div>
      ))}
      <div
        style={{
          border: "1px solid white",
          width: "100%",
          position: "absolute",
        }}
      ></div>
    </div>
  );
};

const SphereImageTest = () => {
  const texture = useTexture(imagePath);

  return (
    <mesh>
      <sphereGeometry args={[500, 60, 40]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
};

const SphereImage = ({}) => {
  const texture = new THREE.TextureLoader().load(imagePath);

  return (
    <mesh>
      <sphereGeometry args={[500, 60, 40]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
};

const Image360Viewer = ({ imageSrc }) => {
  console.log("big test");
  return (
    <Canvas style={{ height: "500px", width: "100%", borderRadius: "20px" }}>
      <Sky sunPosition={[100, 20, 100]} />
      <OrbitControls enableZoom={false} />
      <SphereImage imageSrc={imageSrc} />
    </Canvas>
  );
};

const CameraController = ({ controlType }) => {
  const { camera } = useThree();
  const controlsRef = useRef();
  const animData = useRef({ alpha: 0, beta: 0, gamma: 0 });

  const handleOrientationPermission = () => {
    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof DeviceOrientationEvent.requestPermission === "function"
    ) {
      DeviceOrientationEvent.requestPermission()
        .then((permissionState) => {
          if (permissionState === "granted") {
            window.addEventListener(
              "deviceorientation",
              handleOrientation,
              true
            );
          }
        })
        .catch(console.error);
    } else {
      // No permissions needed, proceed directly
      window.addEventListener("deviceorientation", handleOrientation, true);
    }
  };

  useEffect(() => {
    if (controlType === "device") {
      handleOrientationPermission();
    }

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation, true);
    };
  }, [controlType]);

  useFrame(() => {
    if (controlType === "device" && animData.current) {
      const { alpha, beta } = animData.current;
      camera.rotation.set(
        THREE.MathUtils.degToRad(0),
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
const Image360ViewerTest = () => {
  const [controlType, setControlType] = useState("orbit");

  const handleToggle = () => {
    if (controlType === "orbit") {
      // Request permission before switching
      handleOrientationPermission();
    }
    setControlType((prev) => (prev === "orbit" ? "device" : "orbit"));
  };

  return (
    <div style={{ position: "relative" }}>
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
      <Canvas style={{ height: "400px" }}>
        <ambientLight />
        <CameraController controlType={controlType} />
        <Suspense fallback={null}>
          <SphereImageTest />
        </Suspense>
      </Canvas>
    </div>
  );
};

const MemoizedImage360ViewerTest = React.memo(Image360ViewerTest);
