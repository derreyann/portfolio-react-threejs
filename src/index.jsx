import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import "./style.css";
import App from "./App";
import { useProgress, Html } from "@react-three/drei";
import { createRoot } from "react-dom/client";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
