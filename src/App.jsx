import React, { useEffect, useRef, useState, Suspense, lazy } from "react";
import "./App.css";
// import { Map } from "./components/MapSelection";
import VidViewer from "./components/ImageViewer";

// const LazyImageViewer = lazy(() => import("./components/ImageViewer"));

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
      <h2 style={{ color: "rgb(255,255,255,0.6)" }}>360 Viewer</h2>
      <Suspense fallback={<FallBackViewer />}>
        <VidViewer
          videoSrc={
            "/test.mp4"
            // "https://in3dwebsite.blob.core.windows.net/video/360Video_New_Compressed.mp4"
          }
        />

        {/* <LazyImageViewer
          imagePath={selectedImage}
          videoPath={"/images/360Video_part01_int.mp4"}
        /> */}
      </Suspense>
      {/* <Map setSelectedImage={setSelectedImage} selectedImage={selectedImage} /> */}
    </div>
  );
}

export default App;

const FallBackViewer = () => (
  <div style={{ position: "relative", height: "50%" }}>Loading...</div>
);
