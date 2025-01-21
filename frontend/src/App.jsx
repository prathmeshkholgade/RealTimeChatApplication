import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import UserWrapper from "./pages/UserWrapper";
import ProjectDetails from "./pages/ProjectDetails";
export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <UserWrapper>
                <Home />
              </UserWrapper>
            }
          />

          <Route path="/register" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/project/:id"
            element={
              <UserWrapper>
                <ProjectDetails />
              </UserWrapper>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
