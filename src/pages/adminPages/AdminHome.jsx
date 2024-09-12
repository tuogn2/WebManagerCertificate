import React, { useState } from "react";
import SideBar from "../../components/adminComponents/SideBar";
import { Box, CssBaseline, Typography } from "@mui/material";
import AddCoursePage from "./AddCoursePage";
import DashboardPage from "./DashboardPage";
import OrganizationPage from "./OrganizationPage";
import UserPage from "./UserPage";
import SettingPage from "./SettingPage";

const MainContent = ({ selectedItem }) => {
  // Render content based on the selected item
  switch (selectedItem) {
    case "Users":
      return <UserPage />;
    case "Dashboard":
      return <DashboardPage />;
    case "Setting":
      return <SettingPage />;
    case "Organizations":
      return <OrganizationPage />;
    default:
      return (
        <Typography variant="h4">
          Select a menu item to view content.
        </Typography>
      );
  }
};

export default function AdminHome() {
  const [selectedItem, setSelectedItem] = useState("Dashboard");

  return (
    <>
      <CssBaseline />
      <Box sx={{ display: "flex" }}>
        {/* Sidebar on the left */}
        <SideBar onItemSelected={setSelectedItem} />

        {/* Main content area */}
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <MainContent selectedItem={selectedItem} />
        </Box>
      </Box>
    </>
  );
}
