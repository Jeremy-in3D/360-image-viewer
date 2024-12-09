import React, { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sky } from "@react-three/drei";
import * as THREE from "three";
import "./App.css";

function App() {
  const imagePath =
    "/images/vecteezy_an-unforgettable-360-panorama-of-the-dolomites_20803210.jpg"; // replace with your 360 image path

  useEffect(() => {
    const updateHeight = () => {
      const doc = document.documentElement;
      doc.style.setProperty("--doc-height", `${window.innerHeight}px`);
    };

    // Update height on resize
    window.addEventListener("resize", updateHeight);
    // Initial setting of height
    updateHeight();

    // Clean up event listener on component unmount
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return (
    <div className="app-wrapper">
      <h1 style={{ color: "yellow" }}>360 Image Viewer</h1>
      <Image360Viewer imageSrc={imagePath} />
      <Map />
    </div>
  );
}

export default App;

const Map = ({}) => {
  const [selectedImage, setSelectedImage] = useState(2);

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
    </div>
  );
};

const SphereImage = ({ imageSrc }) => {
  const texture = new THREE.TextureLoader().load(imageSrc);

  return (
    <mesh>
      <sphereGeometry args={[500, 60, 40]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
};

const Image360Viewer = ({ imageSrc }) => {
  return (
    <Canvas style={{ height: "500px", width: "100%", borderRadius: "20px" }}>
      <Sky sunPosition={[100, 20, 100]} />
      <OrbitControls enableZoom={false} />
      <SphereImage imageSrc={imageSrc} />
    </Canvas>
  );
};
