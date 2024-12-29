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
        return { left: "16.5%", top: "20%" };
      case 2:
        return { left: "6%", bottom: "1.5%" };
      case 3:
        return { top: "5%" };
      default:
        return {};
    }
  };

  return (
    <div className="map-wrapper">
      <div
        style={{
          width: "110%",
          position: "absolute",
          marginRight: "7%",
        }}
      >
        <img src={`/images/MapsSVG.svg`} alt="Description of image" />
      </div>
      {images.map((image, idx) => (
        <div
          key={`key-${idx}`}
          onClick={() =>
            selectedImage == image ? null : setSelectedImage(image)
          }
          style={{
            position: "relative",
            border: selectedImage == image ? "1px solid black" : "",
            backgroundImage: `url(${imagePaths[idx]})`,
            ...getImagePlacementStyles(idx),
          }}
          className="image-preview"
        >{`${numbers[idx]}`}</div>
      ))}
    </div>
  );
};
