import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AuthContextProvider } from "./context/AuthContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthContextProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <App />
      </Suspense>
    </AuthContextProvider>
  </React.StrictMode>
);