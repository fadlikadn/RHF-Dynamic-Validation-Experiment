import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Dynamic from "./Dynamic";

const rootElement = document.getElementById("root")!;
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
    <hr />
    <Dynamic />
  </React.StrictMode>,
);
