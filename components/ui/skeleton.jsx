import React from "react";

const Skeleton = ({ width = "100%", height = "100%", children }) => {
  const skeletonStyle = {
    width,
    height,
    background:
      "linear-gradient(-90deg, #f0f0f0 0%, #e0e0e0 50%, #f0f0f0 100%)",
    backgroundSize: "200% 100%",
    animation: "pulse 1.5s ease-in-out infinite",
    borderRadius: "4px", // Optional: add rounded corners
    display: "flex", // Allows children to be centered if needed
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <div style={skeletonStyle}>
      {children}
      <style>
        {`
          @keyframes pulse {
            0% {
              background-position: 200% 0;
            }
            100% {
              background-position: -200% 0;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Skeleton;
