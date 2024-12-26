const imagePaths = [
  "/images/48.png",
  "/images/vecteezy_an-unforgettable-360-panorama-of-the-dolomites_20803210.jpg",
  "/images/49.png",
  "/images/vecteezy_an-unforgettable-360-panorama-of-the-dolomites_20803210.jpg",
];

export const Map = ({ selectedImage, setSelectedImage }) => {
  const images = [0, 1, 2, 3];
  const numbers = [29, 48, 55, 95];
  return (
    <div className="map-wrapper">
      {images.map((image, idx) => (
        <div
          key={`key-${idx}`}
          onClick={() =>
            selectedImage == image ? null : setSelectedImage(image)
          }
          style={{
            border: selectedImage == image ? "3px solid yellow" : "",
            backgroundImage: `url(${imagePaths[idx]})`,
          }}
          className="image-preview"
        >{`${numbers[idx]}`}</div>
      ))}
      <div
        style={{
          width: "110%",
          position: "absolute",
          marginRight: "7%",
        }}
      >
        <img
          style={{ border: "1px solid red", height: "50%" }}
          src={`/images/MapsSVG.svg`}
          alt="Description of image"
        />
      </div>
    </div>
  );
};
