import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store/store.js";
import "./index.css";
import App from "./App.jsx";
import UserWrapper from "./pages/UserWrapper.jsx";
import "remixicon/fonts/remixicon.css";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <Provider store={store}>
    {" "}
    <App />{" "}
  </Provider>
  // </StrictMode>
);
