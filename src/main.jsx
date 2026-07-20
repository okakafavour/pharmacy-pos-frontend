import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import "./App.css"; 
import "./styles/global.css";
import "./styles/login.css";
import "./styles/layout.css";
import "./styles/sidebar.css";
import "./styles/header.css";
import "./styles/dashboard.css";
import "./styles/tables.css";
import "./styles/modal.css";
import "./styles/forms.css";
import "./styles/buttons.css";
import "./styles/responsive.css";

import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);