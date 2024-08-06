// src/routes/Routes.jsx
import React from "react";
import { useRoutes } from "react-router-dom";
import NotFound from "../pages/NotFound";
// import Home from "../pages/home";
import Home from "../pages/Home";


const Routes = () => {
  return useRoutes([
    { path: "/", element: <Home /> },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);
};

export default Routes;
