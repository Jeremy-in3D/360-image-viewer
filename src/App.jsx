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

const CameraController = () => {
  const camera = useThree((state) => state.camera);
  const controlsRef = useRef();
  const animData = useRef({ alpha: 0, beta: 0, gamma: 0 });

  // useEffect(() => {
  //   const requestPermission = () => {
  //     if (typeof DeviceOrientationEvent.requestPermission === "function") {
  //       DeviceOrientationEvent.requestPermission()
  //         .then((permissionState) => {
  //           if (permissionState === "granted") {
  //             window.addEventListener(
  //               "deviceorientation",
  //               handleOrientation,
  //               true
  //             );
  //           }
  //         })
  //         .catch(console.error);
  //     } else {
  //       window.addEventListener("deviceorientation", handleOrientation, true);
  //     }
  //   };

  //   // Ensure requests happen on a user gesture if needed
  //   requestPermission();

  //   return () => {
  //     window.removeEventListener("deviceorientation", handleOrientation, true);
  //   };
  // }, []);

  // const requestPermission = () => {
  //   if (typeof DeviceOrientationEvent.requestPermission === "function") {
  //     DeviceOrientationEvent.requestPermission()
  //       .then((permissionState) => {
  //         if (permissionState === "granted") {
  //           window.addEventListener(
  //             "deviceorientation",
  //             handleOrientation,
  //             true
  //           );
  //         }
  //       })
  //       .catch(console.error);
  //   } else {
  //     window.addEventListener("deviceorientation", handleOrientation, true);
  //   }
  // };

  const handleOrientation = (event) => {
    animData.current.alpha = event.alpha || 0;
    animData.current.beta = event.beta || 0;
    animData.current.gamma = event.gamma || 0;
  };

  useFrame(() => {
    if (controlsRef.current) {
      controlsRef.current.update();
    }

    const { alpha, beta, gamma } = animData.current;

    // Convert degrees to radians
    const xRotation = 0; // THREE.MathUtils.degToRad(-90); // THREE.MathUtils.degToRad(beta - 90);
    const yRotation = THREE.MathUtils.degToRad(alpha);
    const zRotation = 0; // THREE.MathUtils.degToRad(gamma);

    // Mix camera's interaction path with device orientation
    camera.rotation.set(xRotation, yRotation, zRotation, "YXZ");
  });

  return <OrbitControls ref={controlsRef} enableZoom={false} />;
};

const Image360ViewerTest = () => {
  const requestPermission = () => {
    if (typeof DeviceOrientationEvent.requestPermission === "function") {
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
      window.addEventListener("deviceorientation", handleOrientation, true);
    }
  };
  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={requestPermission}
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
        Enable Motion Control
      </button>
      <Canvas style={{ height: "400px" }} camera={{ x: 225, y: 0, z: 0 }}>
        <OrbitControls />
        <ambientLight />
        <CameraController />
        <Suspense fallback={null}>
          <SphereImageTest />
        </Suspense>
      </Canvas>
    </div>
  );
};

const MemoizedImage360ViewerTest = React.memo(Image360ViewerTest);
