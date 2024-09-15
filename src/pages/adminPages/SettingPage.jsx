import React, { useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Avatar,
} from "@mui/material";
import SecurityIcon from "@mui/icons-material/Security";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PaymentIcon from "@mui/icons-material/Payment";
import BackupIcon from "@mui/icons-material/Backup";
import { PRIMARY_COLOR } from "../../styles/styles";
import { useSelector } from "react-redux";

export default function SettingPage() {
  const [adminDetails, setAdminDetails] = useState({
    name: "Admin Name",
    email: "admin@domain.com",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdminDetails((prev) => ({ ...prev, [name]: value }));
  };

  const user = useSelector((state) => state.auth.user);

  const handleSaveChanges = () => {
    // Logic to save changes (API call or local updates)
  };

  return (
    <Box sx={{ p: 4 }}>
      <Grid container spacing={3}>
        {/* Account Settings */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              <AccountCircleIcon /> Account Settings
            </Typography>
            <Avatar
              src="path/to/avatar.jpg"
              sx={{ width: 80, height: 80, mb: 2 }}
            />
            <TextField
              label="Admin Name"
              name="name"
              fullWidth
              value={adminDetails.name}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Email"
              name="email"
              fullWidth
              value={adminDetails.email}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Birthday"
              name="birthday"
              type="date"
              fullWidth
              value={adminDetails.birthday}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Phone Number"
              name="phone"
              type="tel"
              fullWidth
              value={adminDetails.numberphone}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Address"
              name="address"
              type="text"
              fullWidth
              value={adminDetails.address}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveChanges}
            >
              Save Changes
            </Button>
          </Paper>
        </Grid>
        {/* Change Password */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Change Password
            </Typography>
            <TextField
              label="Old Password"
              name="oldPassword"
              type="password"
              fullWidth
              // value={passwordDetails.oldPassword}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              label="New Password"
              name="newPassword"
              type="password"
              fullWidth
              // value={passwordDetails.newPassword}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Confirm New Password"
              name="confirmNewPassword"
              type="password"
              fullWidth
              // value={passwordDetails.confirmNewPassword}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              // onClick={handleChangePassword}
            >
              Change Password
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
