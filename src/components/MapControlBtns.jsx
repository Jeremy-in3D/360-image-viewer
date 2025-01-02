import React, { useState, useEffect } from "react";

export const MapControlBtns = ({
  handleToggle,
  controlType,
  isMapVisible,
  setIsMapVisible,
}) => {
  const [isMapIconClicked, setIsMapIconClicked] = useState(false);
  const [isOrientationIconClicked, setIsOrientationIconClicked] =
    useState(false);
  const [rerenderTrigger, setRerenderTrigger] = useState(false);

  useEffect(() => {
    // Trigger a rerender after 3 seconds
    if (!rerenderTrigger) {
      const timeoutId = setTimeout(() => {
        setRerenderTrigger(true);
      }, 3000);

      return () => clearTimeout(timeoutId); // Cleanup on component unmount
    }
  }, []);

  const handleMapControlsViewClick = () => {
    // Toggle the clicked state to trigger the animation
    setIsMapIconClicked(true);

    // Toggle the map visibility
    setIsMapVisible(!isMapVisible);

    // Remove the clicked state after the animation duration (300ms)
    setTimeout(() => setIsMapIconClicked(false), 300);
  };

  const handleOrientationToggleClick = () => {
    setIsOrientationIconClicked(true);
    handleToggle();
    setTimeout(() => setIsOrientationIconClicked(false), 300);
  };

  return (
    <div
      className="controls-ani controls-ani-delay"
      style={{
        position: "absolute",
        zIndex: 40,
        bottom: "25%",
        width: "auto",
        right: "1%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-evenly",
        alignItems: "flex-end",
        height: "12em",
      }}
    >
      <button
        onClick={handleOrientationToggleClick}
        className={`map-control-btn ${
          isOrientationIconClicked ? "clicked" : ""
        }`}
      >
        {/* Toggle Control: {controlType} */}
        <img
          style={{
            width: "60px",
            height: "60px",
            // display: "block",
          }}
          src={
            controlType == "device"
              ? "/images/AR_mode.png"
              : "/images/phone_mode.png"
          }
        />
      </button>
      <button
        className={`map-control-btn ${isMapIconClicked ? "clicked" : ""}`}
        style={{ marginTop: "1.5em" }}
        // onClick={() => setIsMapVisible(!isMapVisible)}
        onClick={handleMapControlsViewClick}
      >
        <img
          style={{
            width: "60px",
            height: "60px",
            // display: "block",
          }}
          src={isMapVisible ? "/images/map_down.png" : "/images/map_up.png"}
        />
      </button>
    </div>
  );
};
