import React, { useEffect, useState } from "react";
import "./ReturnButton.css";

const ReturnButton = ({ onClick }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Trigger the fade-in effect when the component is mounted
  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true);
    }, 500); // Delay to ensure the element has been mounted
  }, []);

  return (
    <button
      onClick={onClick}
      className={`blur-button ${isVisible ? "visible" : ""}`}
    >
      Back
    </button>
  );
};

export default ReturnButton;
