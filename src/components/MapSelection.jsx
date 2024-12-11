const imagePaths = [
  "/images/48.png",
  "/images/vecteezy_an-unforgettable-360-panorama-of-the-dolomites_20803210.jpg",
  "/images/49.png",
  "/images/vecteezy_an-unforgettable-360-panorama-of-the-dolomites_20803210.jpg",
];

export const Map = ({ selectedImage, setSelectedImage }) => {
  const images = [0, 1, 2, 3];
  return (
    <div className="map-wrapper">
      {imagePaths.map((image, idx) => (
        <div
          key={`key-${idx}`}
          onClick={() =>
            selectedImage == image ? null : setSelectedImage(image)
          }
          style={{
            border: selectedImage == image ? "3px solid yellow" : "",
            backgroundImage: `url(${image})`,
          }}
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
