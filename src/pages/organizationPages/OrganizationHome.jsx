import React, { useState } from "react";
import SideBar from "../../components/adminComponents/SideBar";
import { Box, CssBaseline, Typography } from "@mui/material";
import DashboardPage from "./DashboardPage";
import { Book, Dashboard, Settings } from "@mui/icons-material";
import CoursePage from "./CoursePage";

const MainContent = ({ selectedItem }) => {
  // Render content based on the selected item
  switch (selectedItem) {
    case "Users":
      return <UserPage />;
    case "Dashboard":
      return <DashboardPage />;
    case "Setting":
      return <SettingPage />;
    case "Course":
      return <CoursePage />;
    default:
      return (
        <Typography variant="h4">
          Select a menu item to view content.
        </Typography>
      );
  }
};

const menuItems = [
  { text: "Dashboard", icon: <Dashboard /> },
  { text: "Course", icon: <Book /> },
  { text: "Setting", icon: <Settings /> },
];

export default function OrganizationHome() {
  const [selectedItem, setSelectedItem] = useState("Dashboard");

  return (
    <>
      <CssBaseline />
      <Box sx={{ display: "flex" }}>
        {/* Sidebar on the left */}
        <SideBar
          onItemSelected={setSelectedItem}
          title={"ORGANIZATION SITE"}
          menuItems={menuItems}
        />

        {/* Main content area */}
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <MainContent selectedItem={selectedItem} />
        </Box>
      </Box>
    </>
  );
}
