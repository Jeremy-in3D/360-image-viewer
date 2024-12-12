import React, { useEffect, useRef, useState, Suspense, lazy } from "react";
import "./App.css";
import { Map } from "./components/MapSelection";

const LazyImageViewer = lazy(() => import("./components/ImageViewer"));

//query image-1 qr url: https://360-image-viewer-beige.vercel.app?image=item1

// QUERY PARAM EXAMPLE:  `https://yourapp.com?image=item1`
const imagePaths = [
  "/images/48.png",
  "/images/vecteezy_an-unforgettable-360-panorama-of-the-dolomites_20803210.jpg",
  "/images/49.png",
  "/images/vecteezy_an-unforgettable-360-panorama-of-the-dolomites_20803210.jpg",
];
function App() {
  const [selectedImage, setSelectedImage] = useState(0);

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
      console.log({ imageParam });
      setSelectedImage(getImageBasedOnParam(imageParam));
    }
  }, []);

  const getImageBasedOnParam = (param) => {
    // switch (param) {
    //   case "item1":
    //     return "/images/48.png";
    //   case "item2":
    //     return "/images/vecteezy_an-unforgettable-360-panorama-of-the-dolomites_20803210.jpg";
    //   case "item3":
    //     return "/images/49.png";
    //   case "item4":
    //     return "/images/vecteezy_an-unforgettable-360-panorama-of-the-dolomites_20803210.jpg";
    //   default:
    //     return "/images/48.png";
    // }
    switch (param) {
      case "item1":
        return 0;
      case "item2":
        return 1;
      case "item3":
        return 2;
      case "item4":
        return 3;
      default:
        return 0;
    }
  };

  return (
    <div className="app-wrapper">
      <h2 style={{ color: "yellow" }}>360 Image Viewer</h2>
      <Suspense fallback={<FallBackViewer />}>
        <LazyImageViewer imagePath={selectedImage} />
      </Suspense>
      <Map setSelectedImage={setSelectedImage} selectedImage={selectedImage} />
    </div>
  );
}

export default App;

const FallBackViewer = () => (
  <div style={{ position: "relative", border: "1px solid red", height: "50%" }}>
    {" "}
  </div>
);
