import React from "react";

const ReturnButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{
        position: "fixed", // Use fixed positioning to keep it in the same place on the screen
        bottom: "20px", // Distance from the bottom of the screen
        left: "50%", // Center horizontally
        transform: "translateX(-50%)", // Adjust for button width
        padding: "10px 20px",
        width: "100px",
        height: "50px",
        cursor: "pointer",
        fontFamily: "monospace",
        backgroundColor: "white",
        userSelect: "none",
        color: "black",
        border: "none",
        borderRadius: "100px",
        WebkitTouchCallout: "none",
        WebkitUserSelect: "none",
        transition: "opacity 0.5s ease", // Fade transition
        zIndex: 1000, // Ensure it's above other elements
      }}
    >
      Back
    </button>
  );
};

export default ReturnButton;
