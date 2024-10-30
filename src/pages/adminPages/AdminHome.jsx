import React, { useState } from "react";
import SideBar from "../../components/adminComponents/SideBar";
import { Box, CssBaseline, Typography } from "@mui/material";
import AddCoursePage from "../organizationPages/AddCoursePage";
import DashboardPage from "./DashboardPage";
import OrganizationPage from "./OrganizationPage";
import UserPage from "./UserPage";
import SettingPage from "./SettingPage";
import {
  Add,
  Book,
  CheckCircleOutline,
  Dashboard,
  Person,
  Settings,
} from "@mui/icons-material";
import QueryStatsIcon from '@mui/icons-material/QueryStats';

import ComfirmCourse from "./ComfirmCourse";
import Stats from "./Stats";

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
    case "Comfirm Course":
      return <ComfirmCourse />;
    case "Stats":
      return <Stats />;
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
  { text: "Organizations", icon: <Book /> },
  { text: "Users", icon: <Person /> },
  { text: "Comfirm Course", icon: <CheckCircleOutline /> },
  { text: "Setting", icon: <Settings /> },
  { text: "Stats", icon: < QueryStatsIcon/> },
];

export default function AdminHome() {
  const [selectedItem, setSelectedItem] = useState("Dashboard");

  return (
    <>
      <CssBaseline />
      <Box sx={{ display: "flex" }}>
        {/* Sidebar on the left */}
        <SideBar
          onItemSelected={setSelectedItem}
          title={"ADMIN SITE"}
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
