import React, { useEffect, useState, Suspense, lazy } from "react";
import "./App.css";
import { Map } from "./components/MapSelection";
import { LoadingScreen } from "./components/LoadingScreen";
import { MapControlBtns } from "./components/MapControlBtns";
// import VidViewer from "./components/ImageViewer";

const LazyImageViewer = lazy(() => import("./components/ImageViewer"));

//query image-1 qr url: https://360-image-viewer-beige.vercel.app?image=item1

// QUERY PARAM EXAMPLE:  `https://yourapp.com?image=item1`

function App() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLoadingScreen, setIsLoadingScreen] = useState(true);
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [controlType, setControlType] = useState("orbit");
  const [permissionsGranted, setPermissionsGranted] = useState(false);

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

  useEffect(() => {
    const loadingTimeout = setTimeout(() => {
      setIsLoadingScreen(false);
    }, 4000);

    return () => clearTimeout(loadingTimeout);
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

  // This effect is used to preload the map image.
  useEffect(() => {
    const preloadMapImage = () => {
      const img = new Image();
      img.src = "/images/map_new.png"; // your map image path
    };

    preloadMapImage();
  }, []);

  return (
    <div className="app-wrapper">
      {isLoadingScreen ? <LoadingScreen /> : null}
      <Suspense fallback={<FallBackViewer />}>
        {/* <VidViewer
          videoSrc={
            "/test.mp4"
            // "https://in3dwebsite.blob.core.windows.net/video/360Video_New_Compressed.mp4"
          }
        /> */}

        <LazyImageViewer
          imageIndex={selectedImage}
          controlType={controlType}
          permissionsGranted={permissionsGranted}
        />
        {/* <div className={`map-container ${isMapVisible ? "visible" : "hidden"}`}> */}

        {/* </div> */}
      </Suspense>
      <MapControlBtns
        handleToggle={handleToggle}
        controlType={controlType}
        isMapVisible={isMapVisible}
        setIsMapVisible={setIsMapVisible}
      />
      {isMapVisible ? (
        <Map
          setSelectedImage={setSelectedImage}
          selectedImage={selectedImage}
        />
      ) : null}
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
