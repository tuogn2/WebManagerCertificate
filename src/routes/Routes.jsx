// src/routes/Routes.jsx
import React from "react";
import { useRoutes } from "react-router-dom";
import NotFound from "../pages/NotFound";
// import Home from "../pages/home";
import Home from "../pages/Home";
import Profile from "../pages/Profile";
import Setting from "../pages/Setting";
import Login from "../pages/Login";
import Signup from "../pages/Signup";

import CourseDetail from "../pages/CourseDetail";
import LearnCourse from "../pages/LearnCourse";
import BundleDetail from "../pages/BundleDetail";
import AdminHome from "../pages/adminPages/AdminHome";

const Routes = () => {
  return useRoutes([
    { path: "/", element: <Home /> },
    { path: "/admin-home", element: <AdminHome /> },
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

    { path: "/signup", element: <Signup /> },
    { path: "/course/:id", element: <CourseDetail /> },
    { path: "/course/:id/learn", element: <LearnCourse /> },
    { path: "/bundle/:id", element: <BundleDetail /> },
  ]);
};

export default Routes;
