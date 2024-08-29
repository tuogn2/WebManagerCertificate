// src/routes/Routes.jsx
import React from "react";
import { useRoutes } from "react-router-dom";
import NotFound from "../pages/NotFound";
// import Home from "../pages/home";
import Home from "../pages/Home";
import Profile from "../pages/Profile";
import Setting from "../pages/Setting";
import Login from "../pages/Login";
import DetailTest from "../pages/DetailTest";
import TakeExam from "../pages/TakeExam";
import Signup from "../pages/Signup";

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
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/tests/:id",
      element: <DetailTest />,
    },
    {
      path: "/take-test/:id",
      element: <TakeExam />,
    },
    { path: "/signup", 
      element: <Signup /> },
  ]);
};

export default Routes;
