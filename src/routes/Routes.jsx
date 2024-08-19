// src/routes/Routes.jsx
import React from "react";
import { useRoutes } from "react-router-dom";
import NotFound from "../pages/NotFound";
// import Home from "../pages/home";
import Home from "../pages/Home";
import Profile from "../pages/Profile";
import Setting from "../pages/Setting";

const Routes = () => {
  return useRoutes([
    { path: "/", element: <Home /> },
    {
      path: "*",
      element: <NotFound />,
    },
    {
      path: "/my-profile",
      element: <Profile />,
    },
    {
      path: "/account-settings",
      element: <Setting />,
    },
  ]);
};

export default Routes;
