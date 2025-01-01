// export function LoadingScreen() {
//   return (
//     <div className="loading-screen-wrapper">
//       <div className="greyscale-animation">greyscale</div>
//       <div>
//         <img src="/images/logo-2.png" style={{ width: "90%" }} />
//       </div>
//     </div>
//   );
// }

export function LoadingScreen() {
  return (
    <div className="loading-screen-wrapper">
      <div style={{ position: "relative" }}>
        <img
          src="/images/logo-2.png"
          className="image"
          style={{
            borderRadius: "12px",
            width: "50%",
            position: "relative",
            zIndex: 1,
          }}
        />
        {/* <div
          className="overlay"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 2,
            pointerEvents: "none", // Ensures the overlay doesn't block interactions
          }}
        ></div> */}
      </div>
    </div>
  );
}
