const imagePaths = [
  "/images/29_Final_cmpr.png",
  "/images/48_Final_cmpr.png",
  "/images/55_Final_cmpr.png",
  "/images/95_Final_cmpr.png",
];

export const Map = ({ selectedImage, setSelectedImage }) => {
  const images = [0, 1, 2, 3];
  const numbers = [29, 48, 55, 95];

  const getImagePlacementStyles = (image) => {
    switch (image) {
      case 0:
        return {};
      case 1:
        return { left: "16.5%" };
      case 2:
        return { left: "6%", top: "20%" };
      case 3:
        return { top: "2%" };
      default:
        return {};
    }
  };

  return (
    <div className="contact-us-text-wrapper contact-us-line-0 map-wrapper">
      <div className="map-and-btns-container">
        <img
          src={`/images/map_new.png`}
          alt="map"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "25px",
          }}
        />
        <div
          style={{
            position: "absolute",
            display: "flex",
            justifyContent: "space-evenly",
            height: "100%",
            top: "30%",
            width: "100%",
          }}
        >
          {images.map((image, idx) => (
            <div
              key={`key-${idx}`}
              onClick={() =>
                selectedImage == image ? null : setSelectedImage(image)
              }
              style={{
                position: "relative",
                border: "1px solid black",
                // border: selectedImage == image ? "1px solid black" : "",
                backgroundImage: `url(${imagePaths[idx]})`,
                ...getImagePlacementStyles(idx),
              }}
              className="image-preview"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};
