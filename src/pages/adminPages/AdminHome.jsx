import React, { useState } from "react";
import SideBar from "../../components/adminComponents/SideBar";
import { Box, CssBaseline, Typography } from "@mui/material";
import AddCoursePage from "./AddCoursePage";
import DashboardPage from "./DashboardPage";
import OrganizationPage from "./OrganizationPage";

const MainContent = ({ selectedItem }) => {
  // Render content based on the selected item
  switch (selectedItem) {
    case "Add course":
      return <AddCoursePage />;
    case "Dashboard":
      return <DashboardPage />;
    case "Settings":
      return <Typography variant="h4">Adjust your settings here.</Typography>;
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
