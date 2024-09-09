import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SideBar from "../../components/adminComponents/SideBar";
import { AppBar, Box, CssBaseline, Toolbar, Typography } from "@mui/material";
import AddCoursePage from "./AddCoursePage";

const MainContent = ({ selectedItem }) => {
  // Render content based on the selected item
  switch (selectedItem) {
    case "Add course":
      return <AddCoursePage />;
    case "Courses":
      return <Typography variant="h4">Here are your courses.</Typography>;
    case "Settings":
      return <Typography variant="h4">Adjust your settings here.</Typography>;
    case "Profile":
      return <Typography variant="h4">This is your profile page.</Typography>;
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
