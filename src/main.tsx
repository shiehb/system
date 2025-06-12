import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { ReactQueryProvider } from "./providers/ReactQueryProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ReactQueryProvider>
      <App />
    </ReactQueryProvider>
  </StrictMode>
);
