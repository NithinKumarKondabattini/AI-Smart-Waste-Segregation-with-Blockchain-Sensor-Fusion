import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { WasteDataProvider } from "./context/WasteDataContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <WasteDataProvider>
        <HashRouter>
          <App />
        </HashRouter>
      </WasteDataProvider>
    </AuthProvider>
  </React.StrictMode>
);
