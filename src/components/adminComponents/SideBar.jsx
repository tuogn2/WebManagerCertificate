import React, { useState } from "react";
import {
  Box,
  List,
  ListItemIcon,
  ListItemText,
  Divider,
  Drawer,
  Typography,
  ListItemButton,
  Button,
} from "@mui/material";
import { Dashboard, Book, Add, Settings, Person } from "@mui/icons-material";
import { PRIMARY_COLOR } from "../../styles/styles";
import LogoutIcon from "@mui/icons-material/Logout";
import { useDispatch } from 'react-redux';
import { logoutUser} from '../../store/slices/authSlice'  
import {clearWallet } from '../../store/slices/walletSlice'  
import { useNavigate } from 'react-router-dom';

// Kích thước của drawer
const drawerWidth = 240;

export default function SideBar({ onItemSelected, title, menuItems = [] }) {
  // State to keep track of the selected item
  const [activeItem, setActiveItem] = useState("Dashboard");
  const dispatch = useDispatch();
  const navigate = useNavigate();


  // Các mục trong thanh điều hướng

  // Chuyển tap và Hover listitembutton
  const handleItemClick = (text) => {
    setActiveItem(text); // Set active item
    onItemSelected(text); // Call parent handler for navigation
  };
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
        <Typography variant="h6">{title}</Typography>
      </Box>

      <Divider />

      {/* Danh sách các mục điều hướng */}
      <List>
        {menuItems.map((item) => (
          <ListItemButton
            button
            key={item.text}
            onClick={() => {
              handleItemClick(item.text);
            }}
            sx={{
              backgroundColor: activeItem === item.text ? "#ccc" : "inherit", // Highlight if selected
              "&:hover": {
                backgroundColor: "#ccc",
              },
            }}
          >
            <ListItemIcon
              sx={{ color: activeItem === item.text ? "#000" : "#fff" }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              sx={{ color: activeItem === item.text ? "#000" : "#fff" }}
            />
          </ListItemButton>
        ))}
      </List>
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          padding: 2,
          boxSizing: "border-box",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          startIcon={<LogoutIcon />}
          fullWidth
          onClick={() => {
            // Handle logout logic here
            dispatch(logoutUser());
            dispatch(clearWallet());
            navigate('/login');
          }}
        >
          Logout
        </Button>
      </Box>
    </Drawer>
  );
}
