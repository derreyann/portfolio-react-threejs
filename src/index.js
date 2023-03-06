import React from "react";
import ReactDOM from "react-dom";
import "./style.css";
import App from "./App";
import studio from "@theatre/studio";
import extension from "@theatre/r3f/dist/extension";
import { createRoot } from "react-dom/client";

studio.initialize();
studio.extend(extension);

//ReactDOM.render(<App />, document.getElementById("root"));

// After
const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
