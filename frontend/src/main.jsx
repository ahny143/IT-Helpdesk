import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ConfigProvider } from "antd";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import "./index.css";
import "./App.css";
createRoot(document.getElementById("root")).render(<React.StrictMode><ConfigProvider theme={{ token: { colorPrimary: "#1677ff", borderRadius: 8 } }}><BrowserRouter><AuthProvider><App /></AuthProvider></BrowserRouter></ConfigProvider></React.StrictMode>);
