// Imports and renders the main App component into the root element of the HTML document.
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./hooks/useAuth";
import { PhotosProvider } from "./hooks/usePhotos";
import { CollectionsProvider } from "./hooks/useCollections";
import { ThemeProvider } from "./hooks/useTheme";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <CollectionsProvider>
            <PhotosProvider>
              <App />
            </PhotosProvider>
          </CollectionsProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
);
