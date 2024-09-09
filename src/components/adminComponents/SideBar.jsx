import React from "react";
import {
  Box,
  List,
  ListItemIcon,
  ListItemText,
  Divider,
  Drawer,
  Typography,
  ListItemButton,
} from "@mui/material";
import { Dashboard, Book, Add, Settings } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { PRIMARY_COLOR } from "../../styles/styles";

// Kích thước của drawer
const drawerWidth = 240;

export default function SideBar() {
  const navigate = useNavigate();

  // Các mục trong thanh điều hướng
  const menuItems = [
    { text: "Dashboard", icon: <Dashboard />, path: "/" },
    { text: "Quản lý khóa học", icon: <Book />, path: "/manage-courses" },
    { text: "Thêm khóa học", icon: <Add />, path: "/add-course" },
    { text: "Cấu hình", icon: <Settings />, path: "/settings" },
  ];

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: PRIMARY_COLOR, // Set drawer background color
          color: "#fff", // Set text color
        },
        backgroundColor: "#000",
      }}
      variant="permanent"
      anchor="left"
    >
      {/* Header của thanh điều hướng */}
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Typography variant="h6">Admin Dashboard</Typography>
      </Box>

      <Divider />

      {/* Danh sách các mục điều hướng */}
      <List>
        {menuItems.map((item, index) => (
          <ListItemButton
            button
            key={index}
            onClick={() => navigate(item.path)}
            sx={{
              "&:hover": {
                backgroundColor: "#f0f0f0",
              },
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
}
