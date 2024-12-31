import React, { useEffect, useState, Suspense, lazy } from "react";
import "./App.css";
import { Map } from "./components/MapSelection";
import { LoadingScreen } from "./components/LoadingScreen";
// import VidViewer from "./components/ImageViewer";

const LazyImageViewer = lazy(() => import("./components/ImageViewer"));

//query image-1 qr url: https://360-image-viewer-beige.vercel.app?image=item1

// QUERY PARAM EXAMPLE:  `https://yourapp.com?image=item1`

function App() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLoadingScreen, setIsLoadingScreen] = useState(false);
  const [isMapVisible, setIsMapVisible] = useState(true);
  console.log({ isMapVisible });
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
      {false ? <LoadingScreen /> : null}
      <Suspense fallback={<FallBackViewer />}>
        {/* <VidViewer
          videoSrc={
            "/test.mp4"
            // "https://in3dwebsite.blob.core.windows.net/video/360Video_New_Compressed.mp4"
          }
        /> */}

        <LazyImageViewer
          imageIndex={selectedImage}
          isMapVisible={isMapVisible}
          setIsMapVisible={setIsMapVisible}
        />
        {/* <div className={`map-container ${isMapVisible ? "visible" : "hidden"}`}> */}
        {isMapVisible ? (
          <Map
            setSelectedImage={setSelectedImage}
            selectedImage={selectedImage}
          />
        ) : null}
        {/* </div> */}
      </Suspense>
    </div>
  );
}

export default App;

const FallBackViewer = () => (
  <div
    style={{
      position: "relative",
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Spinner />
  </div>
);

const Spinner = () => <div className="loader"></div>;
