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
import AddCoursePage from "../pages/adminPages/AddCoursePage";
import DashboardPage from "../pages/adminPages/DashboardPage";
import OrganizationPage from "../pages/adminPages/OrganizationPage";

const Routes = () => {
  return useRoutes([
    {
      path: "*",
      element: <NotFound />,
    },
    // User routes
    { path: "/", element: <Home /> },
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

    // Admin routes
    { path: "/admin-home", element: <AdminHome /> },
    { path: "/add-course", element: <AddCoursePage /> },
    { path: "/dashboard", element: <DashboardPage /> },
    { path: "/organizations", element: <OrganizationPage /> },
  ]);
};

export default Routes;
