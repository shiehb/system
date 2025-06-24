import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "@/assets/styles/global.css";
import AppRoutes from "@/routes";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppRoutes />
  </StrictMode>
);
