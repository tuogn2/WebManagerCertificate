// src/routes/Routes.jsx
import React from "react";
import { useRoutes } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/Home";
import Profile from "../pages/Profile";
import Setting from "../pages/Setting";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import CourseDetail from "../pages/CourseDetail";
import LearnCourse from "../pages/LearnCourse";
import BundleDetail from "../pages/BundleDetail";
import AdminHome from "../pages/adminPages/AdminHome";
import AddCoursePage from "../pages/organizationPages/AddCoursePage";
import DashboardPage from "../pages/adminPages/DashboardPage";
import OrganizationPage from "../pages/adminPages/OrganizationPage";
import OrganizationHome from "../pages/organizationPages/OrganizationHome";
import MyLearning from "../pages/MyLearning";
import Accomplishments from "../pages/Accomplisments";
import ForgotPassword from "../pages/ForgotPassword";
import ChangePassword from "../pages/ChangePassword";

import ProtectedRoute from "../components/ProtectedRoute"; // Import ProtectedRoute
import SearchPage from "../pages/SearchPage";
import ShowCourseCertificate from "../pages/ShowCourseCertificate";
const Routes = () => {
  return useRoutes([
    {
      path: "*",
      element: <NotFound />,
    },

    // Thêm vào danh sách routes

    // Public routes (accessible to all)
    { path: "/", element: <Home /> },
    { path: "/search", element: <SearchPage /> },
    { path: "/login", element: <Login /> },
    { path: "/signup", element: <Signup /> },
    { path: "/course/:id", element: <CourseDetail /> },
    { path: "/bundle/:id", element: <BundleDetail /> },
    { path: "/change-password", element: <ChangePassword /> },
    {
      path: "/show-certificate/:id",
      children: [{ path: "", element: <ShowCourseCertificate /> }],
    },
    {
      path: "/course/:id/learn",
      element: <ProtectedRoute allowedRoles={["customer"]} />,
      children: [{ path: "", element: <LearnCourse /> }],
    },
    // User routes (accessible to authenticated users)
    {
      path: "/my-profile",
      element: (
        <ProtectedRoute allowedRoles={["customer", "organization", "admin"]} />
      ), // All users
      children: [{ path: "", element: <Profile /> }],
    },
    {
      path: "/my-learning",
      element: <ProtectedRoute allowedRoles={["customer"]} />, // Only customers
      children: [{ path: "", element: <MyLearning /> }],
    },
    {
      path: "/forgot-password",

      children: [{ path: "", element: <ForgotPassword /> }],
    },
    {
      path: "/accomplishments",
      element: <ProtectedRoute allowedRoles={["customer"]} />, // Only customers
      children: [{ path: "", element: <Accomplishments /> }],
    },
   
    {
      path: "/account-settings",
      element: (
        <ProtectedRoute allowedRoles={["customer", "organization", "admin"]} />
      ), // All users
      children: [{ path: "", element: <Setting /> }],
    },

    // Admin routes (only for admins)
    {
      path: "/admin-home",
      element: <ProtectedRoute allowedRoles={["admin"]} />,
      children: [{ path: "", element: <AdminHome /> }],
    },
    {
      path: "/dashboard",
      element: <ProtectedRoute allowedRoles={["admin"]} />,
      children: [{ path: "", element: <DashboardPage /> }],
    },
    {
      path: "/organizations",
      element: <ProtectedRoute allowedRoles={["admin"]} />,
      children: [{ path: "", element: <OrganizationPage /> }],
    },

    // Organization routes (only for organizations)
    {
      path: "/organization-home",
      element: <ProtectedRoute allowedRoles={["organization"]} />,
      children: [{ path: "", element: <OrganizationHome /> }],
    },
    {
      path: "/add-course",
      element: <ProtectedRoute allowedRoles={["organization"]} />,
      children: [{ path: "", element: <AddCoursePage /> }],
    },
  ]);
};

export default Routes;
