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

  const handleSaveChanges = () => {
    // Logic to save changes (API call or local updates)
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Settings
      </Typography>

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
              label="Password"
              name="password"
              type="password"
              fullWidth
              value={adminDetails.password}
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

        {/* Platform Settings */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              <PaymentIcon /> Platform Settings
            </Typography>
            <FormControlLabel
              control={<Switch color="primary" />}
              label="Enable Maintenance Mode"
            />
            <FormControlLabel
              control={<Switch color="primary" />}
              label="Email Notifications"
            />
            <FormControlLabel
              control={<Switch color="primary" />}
              label="Push Notifications"
            />
          </Paper>
        </Grid>

        {/* Security Settings */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              <SecurityIcon /> Security Settings
            </Typography>
            <Button variant="outlined" color="secondary">
              Enable 2-Factor Authentication
            </Button>
            <Button variant="outlined" color="secondary" sx={{ mt: 2 }}>
              View Activity Logs
            </Button>
          </Paper>
        </Grid>

        {/* Backup & Restore */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              <BackupIcon /> Backup & Restore
            </Typography>
            <Button variant="contained" color="primary">
              Backup Data
            </Button>
            <Button variant="outlined" color="secondary" sx={{ mt: 2 }}>
              Restore Data
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
