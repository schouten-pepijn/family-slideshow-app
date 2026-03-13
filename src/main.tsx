// Imports and renders the main App component into the root element of the HTML document.
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// React bootstrap: Renders the App component inside the root element of the HTML document, wrapped in React.StrictMode for highlighting potential issues in the application.
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
